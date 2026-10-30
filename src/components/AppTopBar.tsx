import React from 'react';
import { Sparkles, MessageSquare, BookMarked, Bookmark, HelpCircle, FileCode, RotateCcw } from 'lucide-react';
import { AppTab } from '../types';

interface AppTopBarProps {
  activeTab: AppTab;
  onTabChange: (tab: AppTab) => void;
  recordCount: number;
  savedCount: number;
  onOpenSingleHtml: () => void;
  onResetChat: () => void;
}

export const AppTopBar: React.FC<AppTopBarProps> = ({
  activeTab,
  onTabChange,
  recordCount,
  savedCount,
  onOpenSingleHtml,
  onResetChat,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-slate-200/90 transition-all">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 sm:h-16 flex items-center justify-between gap-4">
        {/* Brand Lockup */}
        <div className="flex items-center gap-2.5 shrink-0">
          <div className="w-9 h-9 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold text-sm shadow-xs">
            <Sparkles className="w-4 h-4 text-indigo-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-900 text-base leading-none">
                STAR 자소서 번역기
              </span>
              <span className="text-[11px] font-medium text-slate-500 hidden sm:inline">
                취준생 전용 커리어 앱
              </span>
            </div>
          </div>
        </div>

        {/* Desktop Navigation Segmented Controls */}
        <nav className="hidden md:flex items-center gap-1 p-1 bg-slate-100 rounded-xl border border-slate-200/60">
          <button
            onClick={() => onTabChange('chat')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'chat'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5 text-indigo-600" />
            <span>채팅 번역</span>
          </button>

          <button
            onClick={() => onTabChange('records')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'records'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <BookMarked className="w-3.5 h-3.5 text-indigo-600" />
            <span>STAR 자소서 기록</span>
            {recordCount > 0 && (
              <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200/50">
                {recordCount}
              </span>
            )}
          </button>

          <button
            onClick={() => onTabChange('saved')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'saved'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Bookmark className="w-3.5 h-3.5 text-indigo-600" />
            <span>보관함</span>
            {savedCount > 0 && (
              <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200/50">
                {savedCount}
              </span>
            )}
          </button>

          <button
            onClick={() => onTabChange('guide')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'guide'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <HelpCircle className="w-3.5 h-3.5 text-indigo-600" />
            <span>STAR 가이드</span>
          </button>
        </nav>

        {/* Right Utility Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={onOpenSingleHtml}
            className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 text-xs font-medium text-slate-700 hover:text-indigo-600 bg-white hover:bg-slate-50 border border-slate-200 rounded-lg transition-colors"
            title="단일 HTML 파일 다운로드 및 코드 복사"
          >
            <FileCode className="w-3.5 h-3.5 text-emerald-600" />
            <span className="hidden sm:inline">단일 HTML</span>
          </button>

          <button
            onClick={onResetChat}
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
            title="새 대화 시작하기"
            aria-label="새 대화 시작"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
