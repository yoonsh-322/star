import React, { useState } from 'react';
import {
  Copy,
  Check,
  Bookmark,
  BookmarkCheck,
  Tag,
  ChevronDown,
  ChevronUp,
  Sparkles,
  HelpCircle,
  Lightbulb,
} from 'lucide-react';
import { TranslationData } from '../types';

interface STARCardProps {
  data: TranslationData;
  originalText?: string;
  isSaved?: boolean;
  onSave?: () => void;
  onRefinePrompt?: (promptText: string) => void;
}

export const STARCard: React.FC<STARCardProps> = ({
  data,
  isSaved = false,
  onSave,
  onRefinePrompt,
}) => {
  const [copiedType, setCopiedType] = useState<'paragraph' | 'all' | null>(null);
  const [showSTARDetails, setShowSTARDetails] = useState<boolean>(true);

  // Character counts
  const charCountWithSpaces = data.fullParagraph.length;
  const charCountWithoutSpaces = data.fullParagraph.replace(/\s/g, '').length;

  const handleCopyParagraph = async () => {
    const textToCopy = `${data.headline}\n\n${data.fullParagraph}`;
    await navigator.clipboard.writeText(textToCopy);
    setCopiedType('paragraph');
    setTimeout(() => setCopiedType(null), 2000);
  };

  const handleCopyAll = async () => {
    const fullText = `[소제목]\n${data.headline}\n\n[자기소개서 완성본]\n${data.fullParagraph}\n\n[STAR 단계별 분석]\n- S (상황): ${data.star.situation}\n- T (과제/문제): ${data.star.task}\n- A (행동): ${data.star.action}\n- R (결과): ${data.star.result}\n\n[추천 직무 키워드]\n${data.keywords.map((k) => `• ${k.keyword}: ${k.howToUse}`).join('\n')}`;
    await navigator.clipboard.writeText(fullText);
    setCopiedType('all');
    setTimeout(() => setCopiedType(null), 2000);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden transition-all hover:shadow-md">
      {/* Coach Commentary Header */}
      {data.coachMessage && (
        <div className="bg-gradient-to-r from-indigo-50/80 via-sky-50/50 to-white px-5 py-3.5 border-b border-indigo-100/70 flex items-start gap-3">
          <div className="w-7 h-7 rounded-lg bg-indigo-600/10 text-indigo-700 flex items-center justify-center shrink-0 mt-0.5">
            <Sparkles className="w-4 h-4 text-indigo-600" />
          </div>
          <div>
            <div className="text-xs font-semibold text-indigo-900 tracking-wide mb-0.5">
              자소서 코치의 응원 한마디
            </div>
            <p className="text-xs sm:text-sm text-indigo-950/80 leading-relaxed font-medium">
              {data.coachMessage}
            </p>
          </div>
        </div>
      )}

      {/* Main Content Body */}
      <div className="p-5 sm:p-6 space-y-6">
        {/* Headline & Save Action */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md inline-block mb-1.5">
              추천 소제목
            </span>
            <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
              {data.headline}
            </h3>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
            {onSave && (
              <button
                onClick={onSave}
                disabled={isSaved}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  isSaved
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 cursor-default'
                    : 'bg-slate-100 text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 border border-slate-200'
                }`}
                title="보관함에 저장하기"
              >
                {isSaved ? (
                  <>
                    <BookmarkCheck className="w-3.5 h-3.5 text-emerald-600" />
                    <span>저장됨</span>
                  </>
                ) : (
                  <>
                    <Bookmark className="w-3.5 h-3.5" />
                    <span>보관함 저장</span>
                  </>
                )}
              </button>
            )}

            <button
              onClick={handleCopyParagraph}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-indigo-600 text-white hover:bg-indigo-700 transition-colors shadow-xs"
              title="소제목과 완성본 복사하기"
            >
              {copiedType === 'paragraph' ? (
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

        {/* Full Finished Paragraph */}
        <div className="bg-slate-50/70 border border-slate-200/80 rounded-xl p-4 sm:p-5 relative group">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-indigo-600"></span>
              자기소개서 완성 문단
            </span>
            <div className="text-[11px] text-slate-500 font-medium">
              공백포함 <strong className="text-slate-800">{charCountWithSpaces}</strong>자 / 공백제외{' '}
              <strong className="text-slate-800">{charCountWithoutSpaces}</strong>자
            </div>
          </div>

          <p className="text-sm sm:text-[15px] leading-relaxed text-slate-800 whitespace-pre-wrap font-normal">
            {data.fullParagraph}
          </p>
        </div>

        {/* STAR Detailed Breakdown Accordion */}
        <div className="border border-slate-200/80 rounded-xl overflow-hidden bg-white">
          <button
            onClick={() => setShowSTARDetails(!showSTARDetails)}
            className="w-full flex items-center justify-between px-4 py-3 bg-slate-50 hover:bg-slate-100/80 transition-colors text-left"
          >
            <div className="flex items-center gap-2">
              <span className="font-bold text-xs sm:text-sm text-slate-800">
                STAR 4단계 구성 분석
              </span>
              <span className="text-[11px] text-slate-500 hidden sm:inline">
                (상황 · 과제 · 행동 · 결과)
              </span>
            </div>
            <div className="flex items-center gap-1 text-slate-500 text-xs font-medium">
              <span>{showSTARDetails ? '접기' : '자세히 보기'}</span>
              {showSTARDetails ? (
                <ChevronUp className="w-4 h-4" />
              ) : (
                <ChevronDown className="w-4 h-4" />
              )}
            </div>
          </button>

          {showSTARDetails && (
            <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-3.5 bg-slate-50/30">
              {/* Situation */}
              <div className="p-3.5 rounded-lg bg-sky-50/60 border border-sky-100 text-xs sm:text-sm">
                <div className="flex items-center gap-1.5 mb-1 text-sky-800 font-bold">
                  <span className="w-5 h-5 rounded-md bg-sky-600 text-white flex items-center justify-center text-[10px] font-black">
                    S
                  </span>
                  <span>상황 (Situation)</span>
                </div>
                <p className="text-slate-700 leading-relaxed text-xs sm:text-[13px]">
                  {data.star.situation}
                </p>
              </div>

              {/* Task */}
              <div className="p-3.5 rounded-lg bg-amber-50/60 border border-amber-100 text-xs sm:text-sm">
                <div className="flex items-center gap-1.5 mb-1 text-amber-800 font-bold">
                  <span className="w-5 h-5 rounded-md bg-amber-600 text-white flex items-center justify-center text-[10px] font-black">
                    T
                  </span>
                  <span>과제/문제 (Task)</span>
                </div>
                <p className="text-slate-700 leading-relaxed text-xs sm:text-[13px]">
                  {data.star.task}
                </p>
              </div>

              {/* Action */}
              <div className="p-3.5 rounded-lg bg-emerald-50/60 border border-emerald-100 text-xs sm:text-sm">
                <div className="flex items-center gap-1.5 mb-1 text-emerald-800 font-bold">
                  <span className="w-5 h-5 rounded-md bg-emerald-600 text-white flex items-center justify-center text-[10px] font-black">
                    A
                  </span>
                  <span>주도적 행동 (Action)</span>
                </div>
                <p className="text-slate-700 leading-relaxed text-xs sm:text-[13px]">
                  {data.star.action}
                </p>
              </div>

              {/* Result */}
              <div className="p-3.5 rounded-lg bg-purple-50/60 border border-purple-100 text-xs sm:text-sm">
                <div className="flex items-center gap-1.5 mb-1 text-purple-800 font-bold">
                  <span className="w-5 h-5 rounded-md bg-purple-600 text-white flex items-center justify-center text-[10px] font-black">
                    R
                  </span>
                  <span>결과/성과 (Result)</span>
                </div>
                <p className="text-slate-700 leading-relaxed text-xs sm:text-[13px]">
                  {data.star.result}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Recommended Job Keywords (Required by prompt: 글 끝에는 이 경험과 어울리는 직무 키워드 1-2가지 추천) */}
        <div className="bg-gradient-to-br from-indigo-50/50 to-slate-50 border border-indigo-100/80 rounded-xl p-4 sm:p-5">
          <div className="flex items-center gap-2 mb-3">
            <Tag className="w-4 h-4 text-indigo-600" />
            <h4 className="text-xs sm:text-sm font-bold text-slate-900">
              추천 직무 역량 키워드 & 자소서 작성 팁
            </h4>
          </div>

          <div className="space-y-2.5">
            {data.keywords.map((kw, idx) => (
              <div
                key={idx}
                className="bg-white p-3 rounded-lg border border-indigo-100/60 shadow-2xs flex flex-col sm:flex-row sm:items-start gap-2.5"
              >
                <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-indigo-600 text-white text-xs font-bold shrink-0 self-start">
                  <span>#{kw.keyword}</span>
                </div>
                <div className="text-xs sm:text-[13px] text-slate-700 flex items-start gap-1.5 leading-relaxed">
                  <Lightbulb className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
                  <span>{kw.howToUse}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Refinement Quick Prompts for Multi-turn refinement */}
        {onRefinePrompt && (
          <div className="pt-2 border-t border-slate-100">
            <div className="text-[11px] font-semibold text-slate-500 mb-2 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-indigo-500" />
              <span>원하는 방향으로 한 번 더 다듬어 볼까요?</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              <button
                onClick={() =>
                  onRefinePrompt(
                    '성과와 수치(퍼센트, 절감 시간, 인원 등)를 조금 더 구체적으로 추정해서 전문적으로 강조해 줘'
                  )
                }
                className="text-xs px-2.5 py-1 rounded-full bg-slate-100 hover:bg-indigo-50 hover:text-indigo-600 text-slate-700 transition-colors border border-slate-200/70"
              >
                📊 수치·성과 더 강조
              </button>
              <button
                onClick={() =>
                  onRefinePrompt(
                    '자소서 500자 제한 공채 항목에 딱 맞게 핵심만 간결하게 압축해 줘'
                  )
                }
                className="text-xs px-2.5 py-1 rounded-full bg-slate-100 hover:bg-indigo-50 hover:text-indigo-600 text-slate-700 transition-colors border border-slate-200/70"
              >
                ✂️ 500자 이내로 축약
              </button>
              <button
                onClick={() =>
                  onRefinePrompt(
                    '팀원과의 소통과 갈등 조율, 배려 역량을 중심으로 문단을 다시 다듬어 줘'
                  )
                }
                className="text-xs px-2.5 py-1 rounded-full bg-slate-100 hover:bg-indigo-50 hover:text-indigo-600 text-slate-700 transition-colors border border-slate-200/70"
              >
                🤝 소통·협업 중심 재작성
              </button>
              <button
                onClick={() =>
                  onRefinePrompt(
                    '이 경험을 바탕으로 실제 면접관이 물어볼 만한 날카로운 압박/꼬리 질문 2가지와 모범 답변 팁을 알려줘'
                  )
                }
                className="text-xs px-2.5 py-1 rounded-full bg-slate-100 hover:bg-indigo-50 hover:text-indigo-600 text-slate-700 transition-colors border border-slate-200/70"
              >
                <span className="flex items-center gap-1">
                  <HelpCircle className="w-3 h-3 text-amber-500" />
                  면접 예상 질문 보기
                </span>
              </button>
            </div>
          </div>
        )}

        {/* Copy All Button */}
        <div className="flex justify-end pt-1">
          <button
            onClick={handleCopyAll}
            className="text-[11px] text-slate-500 hover:text-indigo-600 flex items-center gap-1 font-medium transition-colors"
          >
            {copiedType === 'all' ? (
              <>
                <Check className="w-3 h-3 text-emerald-600" />
                <span className="text-emerald-600 font-semibold">
                  소제목+STAR+키워드 전체 복사됨!
                </span>
              </>
            ) : (
              <>
                <Copy className="w-3 h-3" />
                <span>전체 내용(소제목+본문+STAR분석+키워드) 텍스트 복사</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
