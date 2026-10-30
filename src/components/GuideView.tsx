import React from 'react';
import { BookOpen, CheckCircle2, Target, Award, ArrowRight } from 'lucide-react';

interface GuideViewProps {
  onGoToChat: () => void;
}

export const GuideView: React.FC<GuideViewProps> = ({ onGoToChat }) => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-6 space-y-6 pb-24 md:pb-12 animate-in fade-in duration-150">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-xs space-y-2">
        <div className="flex items-center gap-2 text-indigo-600">
          <BookOpen className="w-5 h-5" />
          <span className="text-xs font-bold uppercase tracking-wider">STAR Method Guide</span>
        </div>
        <h2 className="text-xl font-bold text-slate-900 tracking-tight">
          채용 담당자가 평가하는 STAR 기법의 모든 것
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
          대기업, 외국계, 공기업 취업 서류 심사에서 &apos;열심히 했다&apos;라는 추상적 문장 대신,
          지원자의 문제 해결 능력과 주도성을 객관적으로 증명하는 가장 확실한 공식입니다.
        </p>
      </div>

      {/* 4 Pillars Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Situation */}
        <div className="bg-white rounded-2xl border border-sky-100 p-5 shadow-xs space-y-2">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-lg bg-sky-600 text-white flex items-center justify-center font-bold text-xs">
              S
            </span>
            <h3 className="font-bold text-slate-900 text-sm">상황 (Situation)</h3>
            <span className="text-[11px] text-slate-400 ml-auto">비중 약 15%</span>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            언제, 어떤 조직이나 환경에서 발생한 일인지 배경을 객관적으로 제시합니다. 과도한 배경 설명은 줄이고 핵심 환경만 간결하게 기술합니다.
          </p>
          <div className="p-2.5 rounded-lg bg-sky-50/50 text-[11px] text-sky-900">
            <strong>💡 작성 팁:</strong> 매장 규모, 일 평균 고객 수, 프로젝트 규모 등 대략적인 숫자를 곁들이면 훨씬 신뢰도가 높아집니다.
          </div>
        </div>

        {/* Task */}
        <div className="bg-white rounded-2xl border border-amber-100 p-5 shadow-xs space-y-2">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-lg bg-amber-600 text-white flex items-center justify-center font-bold text-xs">
              T
            </span>
            <h3 className="font-bold text-slate-900 text-sm">과제 및 문제 (Task)</h3>
            <span className="text-[11px] text-slate-400 ml-auto">비중 약 15%</span>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            그 상황에서 반드시 해결해야 했던 문제점, 마주한 난관, 혹은 달성해야 했던 구체적 목표를 서술합니다.
          </p>
          <div className="p-2.5 rounded-lg bg-amber-50/50 text-[11px] text-amber-900">
            <strong>💡 작성 팁:</strong> 단순히 &quot;힘들었다&quot;가 아니라, 해결하지 않았을 때 조직에 미칠 부정적 영향을 짚어주면 긴장감이 생깁니다.
          </div>
        </div>

        {/* Action */}
        <div className="bg-white rounded-2xl border border-emerald-100 p-5 shadow-xs space-y-2">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold text-xs">
              A
            </span>
            <h3 className="font-bold text-slate-900 text-sm">주도적 행동 (Action)</h3>
            <span className="text-[11px] font-bold text-emerald-600 ml-auto">배점 50% (최고)</span>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            자소서 심사관이 가장 집중해서 읽는 핵심 파트입니다. 시키는 일만 한 수동적 행동이 아닌, <strong>내가 능동적으로 분석하고 시도한 구체적 실행</strong>을 씁니다.
          </p>
          <div className="p-2.5 rounded-lg bg-emerald-50/50 text-[11px] text-emerald-900">
            <strong>💡 작성 팁:</strong> &apos;어떻게&apos; 소통했고, &apos;무엇을&apos; 근거로 결정을 내렸는지 행동 동사를 구체화하세요.
          </div>
        </div>

        {/* Result */}
        <div className="bg-white rounded-2xl border border-purple-100 p-5 shadow-xs space-y-2">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-lg bg-purple-600 text-white flex items-center justify-center font-bold text-xs">
              R
            </span>
            <h3 className="font-bold text-slate-900 text-sm">결과 및 성과 (Result)</h3>
            <span className="text-[11px] text-slate-400 ml-auto">비중 약 20%</span>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            행동의 결과로 얻은 정량적 수치(시간 절감, 만족도, 폐기율 감소 등)나 정성적 피드백, 그리고 이 경험을 입사 후 직무에 어떻게 적용할 것인지 연결합니다.
          </p>
          <div className="p-2.5 rounded-lg bg-purple-50/50 text-[11px] text-purple-900">
            <strong>💡 작성 팁:</strong> 실패했던 경험이라도 배운 점과 개선 의지가 명확하다면 훌륭한 성과가 됩니다.
          </div>
        </div>
      </div>

      {/* Job Keyword Tips Card */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-xs space-y-3">
        <h3 className="font-bold text-slate-900 text-sm sm:text-base flex items-center gap-2">
          <Target className="w-4 h-4 text-indigo-600" />
          <span>직무 키워드는 어떻게 활용하나요?</span>
        </h3>
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
          기업 채용 공고를 보면 직무 기술서(JD)에 요구 역량이 명시되어 있습니다. 챗봇이 추천해 드린 <strong>#위기대응능력, #데이터기반개선, #고객경험관리</strong> 등의 직무 키워드를 공고의 우대 사항과 일치시켜 소제목과 첫 문장에 자연스럽게 배치하면 서류 합격률이 대폭 상승합니다.
        </p>

        <div className="pt-2">
          <button
            onClick={onGoToChat}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-xs transition-colors"
          >
            <span>지금 바로 내 경험 번역해보기</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
