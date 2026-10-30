import React, { useState } from 'react';
import { X, FileCode, Download, Copy, Check, ExternalLink } from 'lucide-react';

interface SingleHtmlModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SingleHtmlModal: React.FC<SingleHtmlModalProps> = ({ isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleDownload = async () => {
    try {
      setIsLoading(true);
      const res = await fetch('/star_translator.html');
      const htmlText = await res.text();
      const blob = new Blob([htmlText], { type: 'text/html;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'STAR_자소서_번역기.html';
      a.click();
      URL.revokeObjectURL(url);
    } catch (e) {
      console.error(e);
      alert('파일을 다운로드하는 중 문제가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyCode = async () => {
    try {
      setIsLoading(true);
      const res = await fetch('/star_translator.html');
      const htmlText = await res.text();
      await navigator.clipboard.writeText(htmlText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      console.error(e);
      alert('코드를 복사하는 중 문제가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-xl rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-slate-200">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <FileCode className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-bold text-slate-900 text-base">단일 HTML 파일 (Single HTML)</h2>
              <p className="text-xs text-slate-500">HTML 1개 파일로 프론트엔드 전체가 완벽하게 동작합니다</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4 text-xs sm:text-sm text-slate-700">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
            <p className="font-semibold text-slate-900 text-xs sm:text-sm flex items-center gap-1.5">
              <span>📦</span>
              <span>파일 위치: <code className="bg-white px-1.5 py-0.5 rounded border border-slate-300 font-mono text-indigo-600">/public/star_translator.html</code></span>
            </p>
            <p className="text-xs text-slate-600 leading-relaxed">
              Tailwind CSS, Pretendard 폰트, STAR 단계별 분석 카드, 소제목, 1-2가지 추천 직무 키워드 및 내 보관함 로직까지 <strong>오직 하나의 HTML 파일 안에 모두 포함</strong>되어 있습니다.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <button
              onClick={handleDownload}
              disabled={isLoading}
              className="flex items-center justify-center gap-2 p-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs sm:text-sm shadow-sm transition-all active:scale-98"
            >
              <Download className="w-4 h-4" />
              <span>HTML 파일 다운로드 (.html)</span>
            </button>

            <button
              onClick={handleCopyCode}
              disabled={isLoading}
              className="flex items-center justify-center gap-2 p-3.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs sm:text-sm border border-slate-300 transition-all active:scale-98"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span className="text-emerald-700">전체 코드 복사 완료!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 text-slate-600" />
                  <span>전체 HTML 코드 복사</span>
                </>
              )}
            </button>
          </div>

          <div className="text-center pt-2">
            <a
              href="/star_translator.html"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 text-xs text-indigo-600 hover:text-indigo-800 font-semibold underline underline-offset-2"
            >
              <span>새 탭에서 단일 HTML 파일 직접 열어보기</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-200 bg-slate-50 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 text-white hover:bg-slate-900 transition-colors"
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  );
};
