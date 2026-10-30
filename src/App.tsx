import React, { useState, useEffect, useRef } from 'react';
import { AppTopBar } from './components/AppTopBar';
import { BottomTabBar } from './components/BottomTabBar';
import { ChatInput } from './components/ChatInput';
import { ChatMessageItem } from './components/ChatMessageItem';
import { STARRecordsView } from './components/STARRecordsView';
import { SavedVaultView } from './components/SavedVaultView';
import { GuideView } from './components/GuideView';
import { SingleHtmlModal } from './components/SingleHtmlModal';
import { ChatMessage, STARRecord, TranslationData, AppTab } from './types';
import { Sparkles, MessageSquareHeart, AlertCircle, BookMarked, ArrowRight } from 'lucide-react';

const INITIAL_WELCOME_MESSAGE: ChatMessage = {
  id: 'welcome-msg',
  role: 'assistant',
  content: `안녕하세요, 취업 준비생 여러분! 🎓\n저는 여러분의 소소한 하루 일상이나 아르바이트 경험을 합격 자기소개서로 번역해 드리는 **STAR 자소서 번역 챗봇**입니다.\n\n카페, 편의점, 음식점, 물류, 사무보조 알바부터 조별과제, 동아리까지 오늘 겪은 일이나 기억에 남는 경험을 일기 쓰듯 편하게 말씀해 주세요!\n\n기업 채용 담당자가 가장 선호하는 **STAR 기법(상황-과제-행동-결과)**의 전문적인 자기소개서 문단과, 서류에 바로 엮어 쓸 수 있는 **핵심 직무 키워드 1~2가지**를 추천해 드릴게요. ✨`,
  timestamp: Date.now(),
};

const STORAGE_KEY_MESSAGES = 'star_chat_messages_v2';
const STORAGE_KEY_RECORDS = 'star_cover_letter_records_v2';

export default function App() {
  const [activeTab, setActiveTab] = useState<AppTab>('chat');

  // Chat message stream
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_MESSAGES);
      return stored ? JSON.parse(stored) : [INITIAL_WELCOME_MESSAGE];
    } catch {
      return [INITIAL_WELCOME_MESSAGE];
    }
  });

  // Complete archive of STAR formatted records
  const [starRecords, setStarRecords] = useState<STARRecord[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_RECORDS);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isSingleHtmlModalOpen, setIsSingleHtmlModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_MESSAGES, JSON.stringify(messages));
    } catch (e) {
      console.error('Failed to sync messages:', e);
    }
  }, [messages]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_RECORDS, JSON.stringify(starRecords));
    } catch (e) {
      console.error('Failed to sync records:', e);
    }
  }, [starRecords]);

  // Scroll to bottom on message update when in chat tab
  useEffect(() => {
    if (activeTab === 'chat') {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isLoading, activeTab]);

  const handleSendMessage = async (
    text: string,
    targetJob: string = '전체 / 일반',
    tone: string = '신입 공채 표준체'
  ) => {
    if (!text.trim() || isLoading) return;

    setErrorMessage(null);

    const userMessageId = `user-${Date.now()}`;
    const newUserMsg: ChatMessage = {
      id: userMessageId,
      role: 'user',
      content: text,
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, newUserMsg]);
    setIsLoading(true);

    try {
      const historyContext = messages
        .filter((m) => m.id !== 'welcome-msg')
        .slice(-6)
        .map((m) => ({
          role: m.role,
          content: m.translation ? m.translation.replyText : m.content,
        }));

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: text,
          history: historyContext,
          targetJob,
          tone,
        }),
      });

      const json = await res.json();

      if (!res.ok || !json.success) {
        throw new Error(json.error || '번역 중 오류가 발생했습니다.');
      }

      const translationData: TranslationData = json.data;

      const botMessageId = `bot-${Date.now()}`;
      const newBotMsg: ChatMessage = {
        id: botMessageId,
        role: 'assistant',
        content: translationData.replyText,
        translation: translationData,
        timestamp: Date.now(),
      };

      setMessages((prev) => [...prev, newBotMsg]);

      // Automatically archive this translated STAR response into STAR records!
      const newRecord: STARRecord = {
        id: `rec-${Date.now()}`,
        originalStory: text,
        headline: translationData.headline,
        star: translationData.star,
        fullParagraph: translationData.fullParagraph,
        keywords: translationData.keywords,
        targetJob,
        tone,
        timestamp: Date.now(),
        isBookmarked: false,
      };

      setStarRecords((prev) => [newRecord, ...prev]);
    } catch (err: any) {
      console.error('Error translating story:', err);
      setErrorMessage(
        err.message || '서버와 통신하는 중 문제가 발생했습니다. 잠시 후 다시 시도해 주세요.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleBookmark = (idOrMessageId: string) => {
    // Check if it's a starRecord id
    const foundRecord = starRecords.find((r) => r.id === idOrMessageId);
    if (foundRecord) {
      setStarRecords((prev) =>
        prev.map((r) => (r.id === idOrMessageId ? { ...r, isBookmarked: !r.isBookmarked } : r))
      );
      return;
    }

    // Check if it's from chat message id
    const msg = messages.find((m) => m.id === idOrMessageId);
    if (!msg || !msg.translation) return;

    // Find if already exists in starRecords by headline
    const existing = starRecords.find((r) => r.headline === msg.translation?.headline);
    if (existing) {
      setStarRecords((prev) =>
        prev.map((r) => (r.id === existing.id ? { ...r, isBookmarked: !r.isBookmarked } : r))
      );
    } else {
      // Add as bookmarked record
      const newRecord: STARRecord = {
        id: `rec-${Date.now()}`,
        originalStory: '',
        headline: msg.translation.headline,
        star: msg.translation.star,
        fullParagraph: msg.translation.fullParagraph,
        keywords: msg.translation.keywords,
        timestamp: Date.now(),
        isBookmarked: true,
      };
      setStarRecords((prev) => [newRecord, ...prev]);
    }
  };

  const handleDeleteRecord = (id: string) => {
    setStarRecords((prev) => prev.filter((r) => r.id !== id));
  };

  const handleSelectRecordForChat = (record: STARRecord) => {
    setActiveTab('chat');
    // Pre-prompt follow-up
    handleSendMessage(
      `이전에 작성했던 [${record.headline}] 자소서를 바탕으로 조금 더 역량을 부각시키고 싶은데, 어떤 방향으로 수정하면 좋을지 피드백해줘.`
    );
  };

  const handleResetChat = () => {
    if (
      messages.length <= 1 ||
      window.confirm('채팅 대화 내용을 초기화하시겠습니까? (STAR 자소서 기록은 안전하게 보존됩니다)')
    ) {
      setMessages([INITIAL_WELCOME_MESSAGE]);
      setErrorMessage(null);
    }
  };

  const savedRecords = starRecords.filter((r) => r.isBookmarked);
  const bookmarkedHeadlines = new Set(savedRecords.map((r) => r.headline));
  const bookmarkedMessageIds = messages
    .filter((m) => m.translation && bookmarkedHeadlines.has(m.translation.headline))
    .map((m) => m.id);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between selection:bg-indigo-100 selection:text-indigo-900">
      {/* App Top Bar */}
      <AppTopBar
        activeTab={activeTab}
        onTabChange={(tab) => setActiveTab(tab)}
        recordCount={starRecords.length}
        savedCount={savedRecords.length}
        onOpenSingleHtml={() => setIsSingleHtmlModalOpen(true)}
        onResetChat={handleResetChat}
      />

      {/* Main Dynamic View */}
      {activeTab === 'chat' && (
        <div className="flex-1 flex flex-col justify-between">
          <main className="flex-1 max-w-4xl w-full mx-auto px-4 py-4 sm:py-6 pb-20 md:pb-6">
            {/* Intro Career App Banner */}
            <div className="mb-4 p-4 rounded-2xl bg-white border border-slate-200/90 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                  <MessageSquareHeart className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-slate-900">
                    &quot;오늘 하루 어떤 경험을 하셨나요?&quot;
                  </h2>
                  <p className="text-xs text-slate-500">
                    소소한 알바 일기나 일상을 적으면 실시간으로 STAR 자소서로 번역됩니다.
                  </p>
                </div>
              </div>

              {starRecords.length > 0 && (
                <button
                  onClick={() => setActiveTab('records')}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100/70 border border-indigo-200/60 transition-colors self-start sm:self-auto"
                >
                  <BookMarked className="w-3.5 h-3.5" />
                  <span>내 STAR 기록 {starRecords.length}건 모아보기</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Chat Stream */}
            <div className="space-y-4">
              {messages.map((message) => (
                <ChatMessageItem
                  key={message.id}
                  message={message}
                  savedIds={bookmarkedMessageIds}
                  onSaveTranslation={handleToggleBookmark}
                  onRefinePrompt={(refineText) => handleSendMessage(refineText)}
                  onViewInRecords={() => setActiveTab('records')}
                />
              ))}

              {/* Loading Indicator */}
              {isLoading && (
                <div className="flex gap-2.5 max-w-4xl mx-auto my-4 animate-in fade-in">
                  <div className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center shrink-0 shadow-xs">
                    <Sparkles className="w-4 h-4 animate-spin text-indigo-400" />
                  </div>
                  <div className="bg-white border border-slate-200/90 rounded-2xl rounded-tl-xs p-4 sm:p-5 shadow-xs max-w-md">
                    <div className="flex items-center gap-2 text-xs font-semibold text-indigo-700 mb-2">
                      <span className="w-2 h-2 rounded-full bg-indigo-600 animate-ping"></span>
                      경험을 STAR 구조와 직무 역량으로 번역하고 있어요...
                    </div>
                    <div className="space-y-2">
                      <div className="h-3 bg-slate-100 rounded-full w-4/5 animate-pulse"></div>
                      <div className="h-3 bg-slate-100 rounded-full w-full animate-pulse"></div>
                      <div className="h-3 bg-slate-100 rounded-full w-3/5 animate-pulse"></div>
                    </div>
                  </div>
                </div>
              )}

              {/* Error Message */}
              {errorMessage && (
                <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs sm:text-sm flex items-start gap-2.5 my-2">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold">번역 요청에 실패했습니다</p>
                    <p className="text-xs text-rose-600 mt-0.5">{errorMessage}</p>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>
          </main>

          {/* Bottom Chat Input Form */}
          <ChatInput onSendMessage={handleSendMessage} isLoading={isLoading} />
        </div>
      )}

      {/* STAR Records View */}
      {activeTab === 'records' && (
        <main className="flex-1">
          <STARRecordsView
            records={starRecords}
            onToggleBookmark={handleToggleBookmark}
            onDeleteRecord={handleDeleteRecord}
            onSelectForChat={handleSelectRecordForChat}
            onGoToChat={() => setActiveTab('chat')}
          />
        </main>
      )}

      {/* Saved Bookmarks View */}
      {activeTab === 'saved' && (
        <main className="flex-1">
          <SavedVaultView
            savedRecords={savedRecords}
            onToggleBookmark={handleToggleBookmark}
            onGoToChat={() => setActiveTab('chat')}
          />
        </main>
      )}

      {/* Guide & Education View */}
      {activeTab === 'guide' && (
        <main className="flex-1">
          <GuideView onGoToChat={() => setActiveTab('chat')} />
        </main>
      )}

      {/* App Mobile Bottom Tab Bar */}
      <BottomTabBar
        activeTab={activeTab}
        onTabChange={(tab) => setActiveTab(tab)}
        recordCount={starRecords.length}
        savedCount={savedRecords.length}
      />

      {/* Single HTML Code & Download Modal */}
      <SingleHtmlModal
        isOpen={isSingleHtmlModalOpen}
        onClose={() => setIsSingleHtmlModalOpen(false)}
      />
    </div>
  );
}
