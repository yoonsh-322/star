import React, { useState } from 'react';
import { Bookmark, Download, Copy, Check, Trash2, Tag, FileText, ArrowRight } from 'lucide-react';
import { STARRecord } from '../types';

interface SavedVaultViewProps {
  savedRecords: STARRecord[];
  onToggleBookmark: (id: string) => void;
  onGoToChat: () => void;
}

export const SavedVaultView: React.FC<SavedVaultViewProps> = ({
  savedRecords,
  onToggleBookmark,
  onGoToChat,
}) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = async (record: STARRecord) => {
    const text = `${record.headline}\n\n${record.fullParagraph}\n\n[추천 직무 역량]\n${record.keywords.map((k) => `• ${k.keyword}: ${k.howToUse}`).join('\n')}`;
    await navigator.clipboard.writeText(text);
    setCopiedId(record.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleExportTxt = () => {
    if (savedRecords.length === 0) return;
    const content = savedRecords
      .map(
        (rec, idx) =>
          `==========================================\n[합격 자소서 #${idx + 1}] ${rec.headline}\n지원 직무: ${rec.targetJob || '일반'}\n작성 일시: ${new Date(rec.timestamp).toLocaleString()}\n\n[완성형 자기소개서 본문]\n${rec.fullParagraph}\n\n[STAR 4단계 상세 구조]\n- S (상황): ${rec.star.situation}\n- T (과제/문제): ${rec.star.task}\n- A (행동): ${rec.star.action}\n- R (결과/성과): ${rec.star.result}\n\n[추천 직무 키워드 및 연계 팁]\n${rec.keywords.map((k) => `• ${k.keyword}: ${k.howToUse}`).join('\n')}\n==========================================\n`
      )
      .join('\n\n');

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `STAR_합격_자소서_모음집_${new Date().toISOString().slice(0, 10)}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 space-y-6 pb-24 md:pb-12 animate-in fade-in duration-150">
      {/* Vault Header Card */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
              즐겨찾기 보관함
            </h2>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
              {savedRecords.length}개 보관 중
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            기업 서류 지원 시 바로 복사하거나 텍스트 문서로 다운로드할 수 있습니다
          </p>
        </div>

        {savedRecords.length > 0 && (
          <button
            onClick={handleExportTxt}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold shadow-xs transition-colors self-start sm:self-auto"
          >
            <Download className="w-3.5 h-3.5 text-indigo-400" />
            <span>TXT 파일로 전체 다운로드</span>
          </button>
        )}
      </div>

      {/* List */}
      <div className="space-y-4">
        {savedRecords.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200/90 p-12 text-center space-y-3 shadow-xs">
            <div className="w-12 h-12 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center mx-auto">
              <Bookmark className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-800 text-sm sm:text-base">
              아직 보관함에 담긴 자소서가 없습니다.
            </h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              [채팅 번역] 또는 [STAR 기록] 탭에서 마음에 드는 자기소개서의 북마크 아이콘을 누르면 이곳에 모아볼 수 있습니다.
            </p>
            <button
              onClick={onGoToChat}
              className="mt-2 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-xs transition-colors"
            >
              <span>자소서 번역하러 가기</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : (
          savedRecords.map((record) => (
            <article
              key={record.id}
              className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-xs hover:shadow-md transition-all space-y-3"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <span className="text-[11px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">
                    {record.targetJob || '일반 공통'}
                  </span>
                  <h3 className="text-base font-bold text-slate-900 mt-1.5 leading-snug">
                    {record.headline}
                  </h3>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    onClick={() => handleCopy(record)}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs transition-colors"
                  >
                    {copiedId === record.id ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>복사됨</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>복사</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => onToggleBookmark(record.id)}
                    className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors border border-slate-200"
                    title="보관함에서 해제"
                    aria-label="보관함에서 해제"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/70">
                <p className="text-xs sm:text-sm text-slate-800 leading-relaxed whitespace-pre-wrap">
                  {record.fullParagraph}
                </p>
              </div>

              <div className="flex flex-wrap gap-1.5 pt-1">
                {record.keywords.map((kw, i) => (
                  <span
                    key={i}
                    className="text-[11px] font-semibold text-indigo-700 bg-indigo-50 border border-indigo-100 px-2.5 py-0.5 rounded-md"
                  >
                    #{kw.keyword}
                  </span>
                ))}
              </div>
            </article>
          ))
        )}
      </div>
    </div>
  );
};
