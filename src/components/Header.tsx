import React from 'react';
import { Sparkles, Bookmark, BookOpen, RotateCcw, FileCode } from 'lucide-react';

interface HeaderProps {
  savedCount: number;
  onOpenSaved: () => void;
  onOpenGuide: () => void;
  onOpenSingleHtml: () => void;
  onResetChat: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  savedCount,
  onOpenSaved,
  onOpenGuide,
  onOpenSingleHtml,
  onResetChat,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200 px-4 lg:px-8 py-3.5 transition-all shadow-xs">
      <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-sky-400 flex items-center justify-center text-white shadow-md shadow-indigo-500/20">
            <Sparkles className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-bold text-slate-900 text-lg leading-tight tracking-tight">
                자소서 번역 챗봇
              </h1>
              <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200/60">
                STAR 기법 AI 코치
              </span>
            </div>
            <p className="text-xs text-slate-500 hidden sm:block">
              소소한 일상과 알바 일기를 서류 합격 자기소개서 문단으로 번역합니다
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={onOpenGuide}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-indigo-600 hover:bg-slate-100 rounded-lg transition-colors border border-slate-200/80"
            title="STAR 기법이란?"
          >
            <BookOpen className="w-4 h-4 text-indigo-500" />
            <span className="hidden sm:inline">STAR 작성 가이드</span>
          </button>

          <button
            onClick={onOpenSaved}
            className="relative flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 hover:text-indigo-600 hover:bg-indigo-50/60 rounded-lg transition-colors border border-slate-200/80"
            title="저장된 자소서 보관함"
          >
            <Bookmark className="w-4 h-4 text-indigo-600" />
            <span>내 보관함</span>
            {savedCount > 0 && (
              <span className="ml-0.5 px-1.5 py-0.2 text-[10px] font-bold rounded-full bg-indigo-600 text-white">
                {savedCount}
              </span>
            )}
          </button>

          <button
            onClick={onOpenSingleHtml}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-emerald-700 hover:text-emerald-800 bg-emerald-50 hover:bg-emerald-100/80 rounded-lg transition-colors border border-emerald-200"
            title="단일 HTML 파일 다운로드 및 코드 복사"
          >
            <FileCode className="w-4 h-4 text-emerald-600" />
            <span className="hidden sm:inline">단일 HTML 파일</span>
          </button>

          <button
            onClick={onResetChat}
            className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
            title="새 대화 시작하기"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
