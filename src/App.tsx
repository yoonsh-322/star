import React, { useState, useEffect, useRef } from 'react';
import { Header } from './components/Header';
import { ChatInput } from './components/ChatInput';
import { ChatMessageItem } from './components/ChatMessageItem';
import { SavedDraftsModal } from './components/SavedDraftsModal';
import { GuideModal } from './components/GuideModal';
import { SingleHtmlModal } from './components/SingleHtmlModal';
import { ChatMessage, SavedDraft, TranslationData } from './types';
import { Sparkles, MessageSquareHeart, AlertCircle } from 'lucide-react';

const INITIAL_WELCOME_MESSAGE: ChatMessage = {
  id: 'welcome-msg',
  role: 'assistant',
  content: `안녕하세요, 취업 준비생 여러분! 🎓\n저는 여러분의 소소한 하루 일상이나 아르바이트 경험을 합격 자기소개서로 번역해 드리는 **STAR 자소서 번역 챗봇**입니다.\n\n카페, 편의점, 음식점, 물류, 사무보조 알바부터 조별과제, 동아리까지 오늘 겪은 일이나 기억에 남는 경험을 일기 쓰듯 편하게 말씀해 주세요!\n\n기업 채용 담당자가 가장 선호하는 **STAR 기법(상황-과제-행동-결과)**의 전문적인 자기소개서 문단과, 서류에 바로 엮어 쓸 수 있는 **핵심 직무 키워드 1~2가지**를 추천해 드릴게요. ✨`,
  timestamp: Date.now(),
};

const STORAGE_KEY = 'star_cover_letter_drafts_v1';

export default function App() {
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    return [INITIAL_WELCOME_MESSAGE];
  });
  const [savedDrafts, setSavedDrafts] = useState<SavedDraft[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isSavedModalOpen, setIsSavedModalOpen] = useState(false);
  const [isGuideModalOpen, setIsGuideModalOpen] = useState(false);
  const [isSingleHtmlModalOpen, setIsSingleHtmlModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Sync savedDrafts to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(savedDrafts));
    } catch (e) {
      console.error('Failed to save to localStorage:', e);
    }
  }, [savedDrafts]);

  // Scroll to bottom on message update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

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
      // Build lightweight history context
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
    } catch (err: any) {
      console.error('Error translating story:', err);
      setErrorMessage(
        err.message || '서버와 통신하는 중 문제가 발생했습니다. 잠시 후 다시 시도해 주세요.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveTranslation = (messageId: string) => {
    const msg = messages.find((m) => m.id === messageId);
    if (!msg || !msg.translation) return;

    // Find original user prompt if available
    const msgIndex = messages.findIndex((m) => m.id === messageId);
    let originalStory = '';
    if (msgIndex > 0 && messages[msgIndex - 1].role === 'user') {
      originalStory = messages[msgIndex - 1].content;
    }

    const newDraft: SavedDraft = {
      id: `draft-${Date.now()}`,
      originalStory,
      headline: msg.translation.headline,
      star: msg.translation.star,
      fullParagraph: msg.translation.fullParagraph,
      keywords: msg.translation.keywords,
      savedAt: Date.now(),
    };

    setSavedDrafts((prev) => [newDraft, ...prev]);
  };

  const handleDeleteDraft = (id: string) => {
    setSavedDrafts((prev) => prev.filter((d) => d.id !== id));
  };

  const handleClearAllDrafts = () => {
    if (window.confirm('저장된 보관함의 모든 자소서를 삭제하시겠습니까?')) {
      setSavedDrafts([]);
    }
  };

  const handleResetChat = () => {
    if (
      messages.length <= 1 ||
      window.confirm('대화 내용을 초기화하고 새로운 경험을 번역하시겠습니까?')
    ) {
      setMessages([INITIAL_WELCOME_MESSAGE]);
      setErrorMessage(null);
    }
  };

  // Determine saved message ids
  const savedHeadlines = new Set(savedDrafts.map((d) => d.headline));
  const savedMessageIds = messages
    .filter((m) => m.translation && savedHeadlines.has(m.translation.headline))
    .map((m) => m.id);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between">
      {/* Top Header */}
      <Header
        savedCount={savedDrafts.length}
        onOpenSaved={() => setIsSavedModalOpen(true)}
        onOpenGuide={() => setIsGuideModalOpen(true)}
        onOpenSingleHtml={() => setIsSingleHtmlModalOpen(true)}
        onResetChat={handleResetChat}
      />

      {/* Main Chat Area */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 py-4 sm:py-6">
        {/* Intro Banner for Job Seekers */}
        <div className="mb-4 p-4 rounded-2xl bg-gradient-to-r from-indigo-500/10 via-sky-500/10 to-indigo-500/5 border border-indigo-200/60 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center shrink-0 shadow-sm">
              <MessageSquareHeart className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs sm:text-sm font-bold text-slate-800">
                &quot;오늘 하루 어떤 경험을 하셨나요?&quot;
              </p>
              <p className="text-xs text-slate-500">
                아무리 사소해 보이는 일도 채용 담당자에게는 소중한 문제해결 역량이 됩니다.
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsGuideModalOpen(true)}
            className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 shrink-0 underline underline-offset-2 hidden sm:block"
          >
            STAR 작성 팁 보기
          </button>
        </div>

        {/* Messages Stream */}
        <div className="space-y-4">
          {messages.map((message) => (
            <ChatMessageItem
              key={message.id}
              message={message}
              savedIds={savedMessageIds}
              onSaveTranslation={handleSaveTranslation}
              onRefinePrompt={(refineText) => handleSendMessage(refineText)}
            />
          ))}

          {/* Loading Indicator */}
          {isLoading && (
            <div className="flex gap-2.5 max-w-4xl mx-auto my-4 animate-in fade-in">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-600 to-sky-500 text-white flex items-center justify-center shrink-0 shadow-xs">
                <Sparkles className="w-4 h-4 animate-spin" />
              </div>
              <div className="bg-white border border-slate-200/90 rounded-2xl rounded-tl-xs p-4 sm:p-5 shadow-xs max-w-md">
                <div className="flex items-center gap-2 text-xs font-semibold text-indigo-700 mb-2">
                  <span className="w-2 h-2 rounded-full bg-indigo-600 animate-ping"></span>
                  경험을 STAR 기법과 직무 키워드로 번역하고 있어요...
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

      {/* Input Form at Bottom */}
      <ChatInput onSendMessage={handleSendMessage} isLoading={isLoading} />

      {/* Saved Drafts Modal */}
      <SavedDraftsModal
        isOpen={isSavedModalOpen}
        onClose={() => setIsSavedModalOpen(false)}
        drafts={savedDrafts}
        onDeleteDraft={handleDeleteDraft}
        onClearAll={handleClearAllDrafts}
      />

      {/* STAR Guide Modal */}
      <GuideModal isOpen={isGuideModalOpen} onClose={() => setIsGuideModalOpen(false)} />

      {/* Single HTML Modal */}
      <SingleHtmlModal
        isOpen={isSingleHtmlModalOpen}
        onClose={() => setIsSingleHtmlModalOpen(false)}
      />
    </div>
  );
}
