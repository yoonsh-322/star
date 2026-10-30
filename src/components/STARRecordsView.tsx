import React, { useState } from 'react';
import {
  Search,
  Bookmark,
  BookmarkCheck,
  Copy,
  Check,
  MessageSquare,
  Trash2,
  Tag,
  ChevronDown,
  ChevronUp,
  FileText,
  Clock,
  Sparkles,
} from 'lucide-react';
import { STARRecord } from '../types';

interface STARRecordsViewProps {
  records: STARRecord[];
  onToggleBookmark: (id: string) => void;
  onDeleteRecord: (id: string) => void;
  onSelectForChat: (record: STARRecord) => void;
  onGoToChat: () => void;
}

const CATEGORIES = [
  '전체',
  '기획 / 마케팅',
  '영업 / 고객서비스(CS)',
  'IT / 개발',
  '경영지원 / 인사',
  '유통 / 물류 / 기타',
];

export const STARRecordsView: React.FC<STARRecordsViewProps> = ({
  records,
  onToggleBookmark,
  onDeleteRecord,
  onSelectForChat,
  onGoToChat,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('전체');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Filter records
  const filteredRecords = records.filter((rec) => {
    const matchesCategory =
      selectedCategory === '전체' ||
      (rec.targetJob && rec.targetJob.includes(selectedCategory.split(' ')[0]));

    const q = searchQuery.toLowerCase();
    const matchesSearch =
      !q ||
      rec.headline.toLowerCase().includes(q) ||
      rec.fullParagraph.toLowerCase().includes(q) ||
      rec.originalStory.toLowerCase().includes(q) ||
      rec.keywords.some((k) => k.keyword.toLowerCase().includes(q));

    return matchesCategory && matchesSearch;
  });

  // Calculate quick stats
  const totalRecords = records.length;
  const totalKeywords = new Set(records.flatMap((r) => r.keywords.map((k) => k.keyword))).size;
  const avgLength =
    totalRecords > 0
      ? Math.round(records.reduce((acc, r) => acc + r.fullParagraph.length, 0) / totalRecords)
      : 0;

  const handleCopyParagraph = async (rec: STARRecord) => {
    const text = `${rec.headline}\n\n${rec.fullParagraph}`;
    await navigator.clipboard.writeText(text);
    setCopiedId(rec.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 space-y-6 pb-24 md:pb-12 animate-in fade-in duration-150">
      {/* Top Banner & Stats */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <span>내 STAR 자소서 기록 아카이브</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              일상 일기에서 STAR 기법으로 번역된 모든 자기소개서와 직무 키워드 기록입니다
            </p>
          </div>

          <button
            onClick={onGoToChat}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-xs self-start sm:self-auto transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>새 경험 번역하기</span>
          </button>
        </div>

        {/* 3 Metric counters */}
        <div className="grid grid-cols-3 gap-3 pt-4">
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-center sm:text-left">
            <span className="text-[11px] font-medium text-slate-500 block">번역된 자소서</span>
            <span className="text-lg sm:text-2xl font-bold text-slate-900 tabular-nums">
              {totalRecords}
              <span className="text-xs font-normal text-slate-500 ml-0.5">건</span>
            </span>
          </div>
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-center sm:text-left">
            <span className="text-[11px] font-medium text-slate-500 block">발굴된 직무 역량</span>
            <span className="text-lg sm:text-2xl font-bold text-indigo-600 tabular-nums">
              {totalKeywords}
              <span className="text-xs font-normal text-slate-500 ml-0.5">개</span>
            </span>
          </div>
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-center sm:text-left">
            <span className="text-[11px] font-medium text-slate-500 block">평균 문단 분량</span>
            <span className="text-lg sm:text-2xl font-bold text-slate-900 tabular-nums">
              {avgLength}
              <span className="text-xs font-normal text-slate-500 ml-0.5">자</span>
            </span>
          </div>
        </div>
      </div>

      {/* Search & Category Filter Controls */}
      <div className="space-y-3">
        {/* Search Input */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="소제목, 자소서 본문 내용, 직무 키워드, 원래 일기 검색..."
            className="w-full bg-white border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all shadow-2xs"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600"
            >
              지우기
            </button>
          )}
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-xs">
          {CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-colors shrink-0 ${
                  isSelected
                    ? 'bg-slate-900 text-white'
                    : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200/80 hover:bg-slate-50'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* Record List */}
      <div className="space-y-4">
        {filteredRecords.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200/90 p-12 text-center space-y-3 shadow-xs">
            <div className="w-12 h-12 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto">
              <FileText className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-800 text-sm sm:text-base">
              {searchQuery || selectedCategory !== '전체'
                ? '검색 조건에 맞는 기록이 없습니다.'
                : '아직 기록된 STAR 자소서가 없습니다.'}
            </h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              [채팅 번역] 탭에서 오늘 겪은 일이나 아르바이트 일기를 입력하면, 이곳에 STAR 기법으로 정리된 전문 자소서 기록이 자동으로 차곡차곡 쌓입니다.
            </p>
            <button
              onClick={onGoToChat}
              className="mt-2 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-xs transition-colors"
            >
              <span>첫 경험 번역하러 가기</span>
            </button>
          </div>
        ) : (
          filteredRecords.map((record) => {
            const isExpanded = expandedId === record.id;
            const formattedDate = new Date(record.timestamp).toLocaleString('ko-KR', {
              month: 'short',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            });

            return (
              <article
                key={record.id}
                className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-xs hover:shadow-md transition-all space-y-4"
              >
                {/* Meta header */}
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <span className="font-semibold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded">
                        {record.targetJob || '일반 공통'}
                      </span>
                      <span aria-hidden="true">·</span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-slate-400" />
                        {formattedDate}
                      </span>
                    </div>

                    <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
                      {record.headline}
                    </h3>
                  </div>

                  {/* Bookmark and delete */}
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      onClick={() => onToggleBookmark(record.id)}
                      className={`p-2 rounded-lg transition-colors ${
                        record.isBookmarked
                          ? 'bg-amber-50 text-amber-600 border border-amber-200'
                          : 'text-slate-400 hover:text-slate-600 hover:bg-slate-100 border border-slate-200'
                      }`}
                      title={record.isBookmarked ? '보관함에서 제거' : '보관함에 저장'}
                      aria-label="보관함 토글"
                    >
                      {record.isBookmarked ? (
                        <BookmarkCheck className="w-4 h-4 text-amber-600" />
                      ) : (
                        <Bookmark className="w-4 h-4" />
                      )}
                    </button>

                    <button
                      onClick={() => onDeleteRecord(record.id)}
                      className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 border border-slate-200 rounded-lg transition-colors"
                      title="기록 삭제"
                      aria-label="기록 삭제"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Original User Diary quote if available */}
                {record.originalStory && (
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs text-slate-600 leading-relaxed">
                    <span className="font-semibold text-slate-700 block mb-1">
                      📝 내가 입력했던 경험/일기:
                    </span>
                    <p className="line-clamp-2 text-slate-600 italic">
                      &quot;{record.originalStory}&quot;
                    </p>
                  </div>
                )}

                {/* Finished Paragraph */}
                <div className="p-4 rounded-xl bg-slate-50/70 border border-slate-200/80 space-y-2">
                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <span className="font-semibold text-slate-700 flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-indigo-600"></span>
                      완성형 자기소개서 문단
                    </span>
                    <span>
                      공백포함 <strong className="text-slate-800">{record.fullParagraph.length}자</strong>
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-800 leading-relaxed whitespace-pre-wrap font-normal">
                    {record.fullParagraph}
                  </p>
                </div>

                {/* Recommended Job Keywords */}
                <div className="flex flex-wrap gap-2 pt-1">
                  {record.keywords.map((kw, i) => (
                    <div
                      key={i}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-indigo-50 border border-indigo-100 text-xs"
                      title={kw.howToUse}
                    >
                      <Tag className="w-3 h-3 text-indigo-600" />
                      <span className="font-bold text-indigo-900">#{kw.keyword}</span>
                      <span className="text-indigo-600 text-[11px] hidden sm:inline">
                        ({kw.howToUse})
                      </span>
                    </div>
                  ))}
                </div>

                {/* S-T-A-R Details Collapsible */}
                {isExpanded && (
                  <div className="pt-2 border-t border-slate-100 grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="p-3 rounded-lg bg-sky-50/70 border border-sky-100 text-xs">
                      <div className="font-bold text-sky-900 mb-1">🟦 S 상황 (Situation)</div>
                      <p className="text-slate-700 leading-relaxed">{record.star.situation}</p>
                    </div>
                    <div className="p-3 rounded-lg bg-amber-50/70 border border-amber-100 text-xs">
                      <div className="font-bold text-amber-900 mb-1">🟧 T 과제/문제 (Task)</div>
                      <p className="text-slate-700 leading-relaxed">{record.star.task}</p>
                    </div>
                    <div className="p-3 rounded-lg bg-emerald-50/70 border border-emerald-100 text-xs">
                      <div className="font-bold text-emerald-900 mb-1">🟩 A 주도적 행동 (Action)</div>
                      <p className="text-slate-700 leading-relaxed">{record.star.action}</p>
                    </div>
                    <div className="p-3 rounded-lg bg-purple-50/70 border border-purple-100 text-xs">
                      <div className="font-bold text-purple-900 mb-1">🟪 R 성과/결과 (Result)</div>
                      <p className="text-slate-700 leading-relaxed">{record.star.result}</p>
                    </div>
                  </div>
                )}

                {/* Bottom Action Strip */}
                <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
                  <button
                    onClick={() => setExpandedId(isExpanded ? null : record.id)}
                    className="flex items-center gap-1 font-semibold text-slate-600 hover:text-indigo-600 py-1"
                  >
                    <span>{isExpanded ? 'STAR 분석 접기' : 'STAR 4단계 상세 분석'}</span>
                    {isExpanded ? (
                      <ChevronUp className="w-3.5 h-3.5" />
                    ) : (
                      <ChevronDown className="w-3.5 h-3.5" />
                    )}
                  </button>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onSelectForChat(record)}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-lg font-semibold text-slate-700 hover:text-indigo-600 bg-slate-100 hover:bg-indigo-50 transition-colors"
                      title="채팅창에서 이어서 대화하며 다듬기"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>이어서 다듬기</span>
                    </button>

                    <button
                      onClick={() => handleCopyParagraph(record)}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-lg font-semibold text-white bg-indigo-600 hover:bg-indigo-700 transition-colors shadow-xs"
                    >
                      {copiedId === record.id ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          <span>복사 완료!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>자소서 복사</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </article>
            );
          })
        )}
      </div>
    </div>
  );
};
