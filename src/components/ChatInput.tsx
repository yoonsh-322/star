import React, { useState, useRef, useEffect } from 'react';
import { Send, Sparkles, SlidersHorizontal, ChevronDown, ChevronUp } from 'lucide-react';

interface ChatInputProps {
  onSendMessage: (text: string, targetJob: string, tone: string) => void;
  isLoading: boolean;
}

const PRESET_STORIES = [
  {
    icon: '☕',
    title: '카페 알바 컴플레인 응대',
    text: '오늘 카페 점심 피크타임에 주문이 엄청 밀렸는데 한 손님이 커피가 너무 미지근하고 늦게 나왔다고 언성을 높였다. 우선 당황하지 않고 진심으로 죄송하다고 사과드린 뒤, 주문서를 재확인해서 스팀 온도를 세심하게 맞춰 3분 만에 다시 만들어드렸다. 기다리시는 동안 드실 수 있는 미니 쿠키도 서비스로 챙겨드렸다. 손님이 나가실 때 오히려 화내서 미안하다며 고맙다고 하셨고, 사장님께도 피크타임용 주문 번호표 동선을 개선하자고 제안드렸다.',
  },
  {
    icon: '🏪',
    title: '편의점 유통기한 폐기율 절감',
    text: '편의점 야간 알바를 하는데 매주 삼각김밥과 샌드위치 폐기가 20개 이상씩 나와서 사장님 손해가 커 보였다. 손님들이 보통 진열대 깊은 곳이나 눈높이 위치만 집어가는 것을 발견하고, 유통기한 임박 상품을 계산대 바로 앞 눈에 띄는 "오늘의 추천 타임세일존"으로 재배치했다. 사장님께 말씀드려 폐기 3시간 전 20% 할인 태그를 붙여 팔았더니 폐기율이 기존 대비 거의 절반으로 줄었고, 사장님께 보너스 시급도 받았다.',
  },
  {
    icon: '💻',
    title: '반복 엑셀 업무 3시간→30분 단축',
    text: '방학 동안 사무 보조 알바를 했는데 매주 각 지점별 매출 데이터를 수기로 하나하나 취합해서 엑셀 보고서를 만드느라 3시간 넘게 걸렸다. 매번 오타도 나고 비효율적인 것 같아서 주말에 유튜브로 엑셀 VLOOKUP과 피벗테이블, 간단한 매크로를 독학했다. 지점별 파일만 넣으면 자동으로 합산되는 템플릿을 만들어 팀에 공유했더니 매주 3시간 걸리던 단순 반복 작업이 30분으로 줄어 팀장님께 큰 칭찬을 받았다.',
  },
  {
    icon: '👥',
    title: '조별과제 무임승차 갈등 조율',
    text: '전공 팀 프로젝트에서 4명 중 1명이 중간고사 이후 연락이 두절되고 자료 조사를 하나도 해오지 않았다. 다른 팀원들이 격분해서 이름에서 빼버리자고 했지만, 내가 먼저 개인적으로 연락해 전화를 걸어 사정을 들어봤다. 알고 보니 복수전공이라 과제 양이 과도해 포기 상태였던 것이었다. 그래서 과제 분량을 난이도별로 다시 쪼개어, 그 팀원에게는 디자인 및 PPT 템플릿 제작 역할을 부여해 참여를 유도했다. 결과적으로 팀원 모두가 만족하며 A+ 학점을 받았다.',
  },
];

const TARGET_JOBS = [
  '전체 / 일반 (공통역량)',
  '기획 / 마케팅',
  '영업 / 고객서비스(CS)',
  'IT / 소프트웨어 개발',
  '경영지원 / 인사 / 총무',
  '유통 / 물류 / 생산관리',
];

const TONES = [
  '신입 공채 표준체 (~습니다, 정중한 어조)',
  '주도적 실행·성과형 (문제해결 및 역량 강조)',
  '협업·소통형 (팀워크와 배려 강조)',
];

export const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage, isLoading }) => {
  const [inputText, setInputText] = useState('');
  const [targetJob, setTargetJob] = useState(TARGET_JOBS[0]);
  const [tone, setTone] = useState(TONES[0]);
  const [showOptions, setShowOptions] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim() || isLoading) return;

    onSendMessage(inputText.trim(), targetJob, tone);
    setInputText('');

    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Submit on Enter without shift
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleApplyPreset = (text: string) => {
    setInputText(text);
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  };

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(
        textareaRef.current.scrollHeight,
        200
      )}px`;
    }
  }, [inputText]);

  return (
    <div className="sticky bottom-0 z-20 bg-gradient-to-t from-slate-100 via-slate-50/95 to-slate-50/70 pt-3 pb-4 sm:pb-6 px-3 sm:px-6">
      <div className="max-w-4xl mx-auto space-y-2.5">
        {/* Preset Stories Carousel/Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-xs">
          <span className="text-[11px] font-bold text-slate-500 shrink-0 flex items-center gap-1 px-1">
            <Sparkles className="w-3 h-3 text-indigo-500" />
            예시 경험:
          </span>
          {PRESET_STORIES.map((preset, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleApplyPreset(preset.text)}
              className="shrink-0 flex items-center gap-1 px-2.5 py-1 rounded-full bg-white hover:bg-indigo-50 text-slate-700 hover:text-indigo-600 border border-slate-200/90 text-xs font-medium transition-all shadow-2xs hover:border-indigo-300"
            >
              <span>{preset.icon}</span>
              <span>{preset.title}</span>
            </button>
          ))}
        </div>

        {/* Input Card Container */}
        <div className="bg-white rounded-2xl border border-slate-300/80 shadow-md p-3 sm:p-4 transition-all focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-500/20">
          {/* Options Bar Toggle */}
          <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100 text-xs">
            <button
              type="button"
              onClick={() => setShowOptions(!showOptions)}
              className="flex items-center gap-1.5 text-slate-600 hover:text-indigo-600 font-medium py-0.5 px-1 rounded transition-colors"
            >
              <SlidersHorizontal className="w-3.5 h-3.5 text-indigo-500" />
              <span>
                지원 조건 맞춤 설정 ({targetJob.split(' ')[0]} / {tone.split(' ')[0]})
              </span>
              {showOptions ? (
                <ChevronUp className="w-3.5 h-3.5 text-slate-400" />
              ) : (
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              )}
            </button>

            <span className="text-[11px] text-slate-400 hidden sm:inline">
              Shift + Enter 줄바꿈 | Enter 전송
            </span>
          </div>

          {/* Collapsible Options Dropdowns */}
          {showOptions && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mb-3 p-2.5 rounded-xl bg-slate-50 border border-slate-200/70 text-xs">
              <div>
                <label className="block text-slate-600 font-semibold mb-1">
                  지원 희망 직무
                </label>
                <select
                  value={targetJob}
                  onChange={(e) => setTargetJob(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-800 font-medium focus:outline-none focus:border-indigo-500"
                >
                  {TARGET_JOBS.map((j) => (
                    <option key={j} value={j}>
                      {j}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">
                  서술 어조 (톤앤매너)
                </label>
                <select
                  value={tone}
                  onChange={(e) => setTone(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-800 font-medium focus:outline-none focus:border-indigo-500"
                >
                  {TONES.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {/* Textarea & Send Button */}
          <div className="flex items-end gap-2">
            <textarea
              ref={textareaRef}
              rows={2}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={isLoading}
              placeholder="오늘 있었던 일이나 아르바이트 경험을 일기 쓰듯 편하게 적어보세요... (예: 오늘 카페 알바하는데 진상 손님이 와서...)"
              className="w-full resize-none border-none focus:ring-0 p-1 text-sm text-slate-800 placeholder-slate-400 bg-transparent focus:outline-none leading-relaxed"
            />

            <button
              type="button"
              onClick={() => handleSubmit()}
              disabled={!inputText.trim() || isLoading}
              className={`p-2.5 sm:px-4 sm:py-2.5 rounded-xl font-semibold text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-all shrink-0 ${
                !inputText.trim() || isLoading
                  ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                  : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm shadow-indigo-600/30 active:scale-95'
              }`}
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span className="hidden sm:inline">번역 중...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span className="hidden sm:inline">번역하기</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
