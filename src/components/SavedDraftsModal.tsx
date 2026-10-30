import React, { useState } from 'react';
import { X, Bookmark, Trash2, Copy, Check, Download, ExternalLink } from 'lucide-react';
import { SavedDraft } from '../types';

interface SavedDraftsModalProps {
  isOpen: boolean;
  onClose: () => void;
  drafts: SavedDraft[];
  onDeleteDraft: (id: string) => void;
  onClearAll: () => void;
}

export const SavedDraftsModal: React.FC<SavedDraftsModalProps> = ({
  isOpen,
  onClose,
  drafts,
  onDeleteDraft,
  onClearAll,
}) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleCopyDraft = async (draft: SavedDraft) => {
    const text = `${draft.headline}\n\n${draft.fullParagraph}\n\n[추천 직무 키워드]\n${draft.keywords.map((k) => `• ${k.keyword}: ${k.howToUse}`).join('\n')}`;
    await navigator.clipboard.writeText(text);
    setCopiedId(draft.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleExportAll = () => {
    if (drafts.length === 0) return;
    const content = drafts
      .map(
        (d, idx) =>
          `==========================================\n[자소서 #${idx + 1}] ${d.headline}\n작성일: ${new Date(d.savedAt).toLocaleDateString()}\n지원직무: ${d.targetJob || '일반'}\n\n[완성본]\n${d.fullParagraph}\n\n[STAR 단계별 분석]\n- 상황 (S): ${d.star.situation}\n- 과제 (T): ${d.star.task}\n- 행동 (A): ${d.star.action}\n- 결과 (R): ${d.star.result}\n\n[직무 키워드]\n${d.keywords.map((k) => `- ${k.keyword} (${k.howToUse})`).join('\n')}\n==========================================\n`
      )
      .join('\n\n');

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `STAR_자소서_모음집_${new Date().toISOString().slice(0, 10)}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-2xl max-h-[85vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-slate-200">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center">
              <Bookmark className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-bold text-slate-900 text-base">내 자소서 보관함</h2>
              <p className="text-xs text-slate-500">저장된 STAR 자기소개서 ({drafts.length}개)</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {drafts.length > 0 && (
              <button
                onClick={handleExportAll}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:text-indigo-600 bg-white hover:bg-indigo-50 border border-slate-200 rounded-lg transition-colors"
                title="전체 텍스트 파일로 다운로드"
              >
                <Download className="w-3.5 h-3.5 text-indigo-600" />
                <span>전체 내보내기</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content list */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {drafts.length === 0 ? (
            <div className="text-center py-16 space-y-3">
              <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                <Bookmark className="w-6 h-6" />
              </div>
              <p className="text-sm font-semibold text-slate-600">
                아직 보관함에 저장된 자소서가 없습니다.
              </p>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                챗봇이 번역해 준 자기소개서 카드의 [보관함 저장] 버튼을 누르면 여기에 안전하게 보관됩니다.
              </p>
            </div>
          ) : (
            drafts.map((draft) => (
              <div
                key={draft.id}
                className="bg-slate-50/70 border border-slate-200 rounded-xl p-4 sm:p-5 space-y-3 transition-all hover:bg-white hover:shadow-xs"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded mr-2">
                      {draft.targetJob || '일반'}
                    </span>
                    <span className="text-[11px] text-slate-400">
                      {new Date(draft.savedAt).toLocaleDateString()}
                    </span>
                    <h3 className="font-bold text-slate-900 text-sm sm:text-base mt-1">
                      {draft.headline}
                    </h3>
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      onClick={() => handleCopyDraft(draft)}
                      className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                      title="복사"
                    >
                      {copiedId === draft.id ? (
                        <Check className="w-4 h-4 text-emerald-600" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </button>
                    <button
                      onClick={() => onDeleteDraft(draft.id)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                      title="삭제"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed bg-white p-3 rounded-lg border border-slate-200/60 whitespace-pre-wrap">
                  {draft.fullParagraph}
                </p>

                {/* Job Keywords */}
                <div className="flex flex-wrap gap-1.5">
                  {draft.keywords.map((kw, i) => (
                    <span
                      key={i}
                      className="text-[11px] font-semibold text-indigo-700 bg-indigo-50 border border-indigo-100 px-2 py-0.5 rounded-md"
                    >
                      #{kw.keyword}
                    </span>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {drafts.length > 0 && (
          <div className="px-6 py-3 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
            <button
              onClick={onClearAll}
              className="text-xs text-rose-600 hover:text-rose-700 font-medium hover:underline"
            >
              전체 비우기
            </button>
            <button
              onClick={onClose}
              className="px-4 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 text-white hover:bg-slate-900 transition-colors"
            >
              닫기
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
