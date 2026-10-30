import React from 'react';
import { X, BookOpen, CheckCircle2, Target, Zap, Award } from 'lucide-react';

interface GuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GuideModal: React.FC<GuideModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-xl max-h-[85vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-slate-200">
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center">
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-bold text-slate-900 text-base">STAR 기법 작성 가이드</h2>
              <p className="text-xs text-slate-500">채용 담당자가 평가하는 4단계 스토리텔링</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-5 text-sm text-slate-700">
          <div className="p-4 rounded-xl bg-indigo-50/70 border border-indigo-100 text-indigo-950 text-xs sm:text-[13px] leading-relaxed">
            💡 <strong>STAR 기법이란?</strong> 대기업, 공기업, 외국계 채용 담당자와 면접관이
            지원자의 경험을 객관적으로 검증하기 위해 가장 널리 활용하는 구조화된 서술 방식입니다.
            단순히 &apos;열심히 했다&apos;가 아니라, 구체적인 행동과 성과를 드러낼 수 있습니다.
          </div>

          <div className="space-y-3">
            <div className="p-3.5 rounded-xl border border-sky-200 bg-sky-50/40">
              <div className="flex items-center gap-2 font-bold text-sky-900 text-sm mb-1">
                <span className="w-5 h-5 rounded-md bg-sky-600 text-white flex items-center justify-center text-[10px]">
                  S
                </span>
                <span>Situation (상황) - 10~15% 비중</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed pl-7">
                어디서, 어떤 조직이나 환경이었는지 배경을 객관적으로 서술합니다.
                <br />
                <em>예: &quot;일 평균 300명 이상의 고객이 방문하는 프랜차이즈 카페 오픈 타임에서...&quot;</em>
              </p>
            </div>

            <div className="p-3.5 rounded-xl border border-amber-200 bg-amber-50/40">
              <div className="flex items-center gap-2 font-bold text-amber-900 text-sm mb-1">
                <span className="w-5 h-5 rounded-md bg-amber-600 text-white flex items-center justify-center text-[10px]">
                  T
                </span>
                <span>Task (과제 및 문제점) - 15~20% 비중</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed pl-7">
                직면했던 난관이나 갈등, 반드시 달성해야 했던 목표를 짚어냅니다.
                <br />
                <em>예: &quot;주문 밀림으로 인해 음료 온도에 대한 고객 불만이 제기된 위기 상황이었습니다.&quot;</em>
              </p>
            </div>

            <div className="p-3.5 rounded-xl border border-emerald-200 bg-emerald-50/40">
              <div className="flex items-center gap-2 font-bold text-emerald-900 text-sm mb-1">
                <span className="w-5 h-5 rounded-md bg-emerald-600 text-white flex items-center justify-center text-[10px]">
                  A
                </span>
                <span>Action (주도적 행동) - 50% 최고 배점!</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed pl-7">
                시키는 일만 한 것이 아니라, <strong>내가 주도적으로 어떻게 생각하고 행동했는지</strong>
                구체적인 해결 방안과 소통 방식을 기술합니다.
              </p>
            </div>

            <div className="p-3.5 rounded-xl border border-purple-200 bg-purple-50/40">
              <div className="flex items-center gap-2 font-bold text-purple-900 text-sm mb-1">
                <span className="w-5 h-5 rounded-md bg-purple-600 text-white flex items-center justify-center text-[10px]">
                  R
                </span>
                <span>Result (결과 및 교훈) - 15~20% 비중</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed pl-7">
                행동을 통해 얻은 정량적 수치(시간 절감, 고객 만족도 향상) 및 회사 직무에 어떻게
                기여할 것인지의 인사이트를 매듭짓습니다.
              </p>
            </div>
          </div>

          <div className="pt-2">
            <h4 className="font-bold text-slate-900 text-xs sm:text-sm mb-2 flex items-center gap-1.5">
              <Target className="w-4 h-4 text-indigo-600" />
              <span>직무 키워드는 어떻게 활용하나요?</span>
            </h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              추천된 직무 키워드는 자기소개서 질문 문항(예: &apos;지원동기&apos;, &apos;갈등극복
              경험&apos;, &apos;직무 전문성&apos;) 중 어떤 항목에 이 소재를 배치할지 결정하는 나침반이
              됩니다. 지원하시는 채용 공고의 &apos;우대 역량&apos;과 일치시켜 작성해 보세요!
            </p>
          </div>
        </div>

        <div className="px-6 py-3 border-t border-slate-200 bg-slate-50 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg text-xs font-semibold bg-indigo-600 text-white hover:bg-indigo-700 transition-colors"
          >
            확인했습니다
          </button>
        </div>
      </div>
    </div>
  );
};
