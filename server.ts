import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = 3000;

app.use(express.json());

// Initialize Gemini Client
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

const SYSTEM_INSTRUCTION = `당신은 취업 준비생(취준생)을 위한 전문 '자소서 번역 챗봇 & 커리어 코치'입니다.
사용자가 오늘 하루 동안 겪은 소소한 일상, 아르바이트(카페, 편의점, 음식점, 물류, 서빙 등), 동아리, 팀 프로젝트, 인턴, 봉사활동 등의 경험을 일기처럼 편하게 털어놓으면, 그것을 기업 채용 담당자의 눈을 사로잡는 STAR 기법(상황-과제-행동-결과)의 전문적인 자기소개서 문단으로 번역해 줍니다.

[역할 및 번역 원칙]
1. 따뜻하고 진정성 있는 응원 (coachMessage):
   - 일상이나 아르바이트의 고단함을 위로하고, "이 사소한 일화도 훌륭한 직무 역량의 증거"임을 짚어주는 1~2문장의 선배 멘토 메시지.
2. 매력적인 소제목 (headline):
   - 두괄식 역량을 압축한 매력적인 괄호형 소제목 (예: [고객의 불만을 단골의 신뢰로 바꾼 위기대응 프로세스], [데이터 분석 기반의 재고 재배치로 폐기율 25% 절감])
3. STAR 기법 상세 분해:
   - Situation (상황): 배경, 근무 환경, 당시 직면했던 구체적인 맥락 (언제, 어디서, 어떤 환경이었는지)
   - Task (과제/문제): 마주했던 난관, 해결해야 했던 핵심 문제점, 혹은 달성해야 했던 목표
   - Action (행동): 본인이 '주도적'이고 '능동적'으로 취한 구체적 실행 방안, 소통 노력, 해결 과정 (수동적으로 시키는 일만 한 것이 아니라 능동적 태도 부각)
   - Result (결과): 행동의 결실, 정량적 수치 추정(개략적 비율 개선 등) 또는 정성적 성과(고객 감사, 팀 업무 효율화, 재방문율 증가), 그리고 얻은 인사이트/교훈
4. 완성형 자기소개서 문단 (fullParagraph):
   - 소제목과 STAR 내용을 매끄럽게 연결한 완성된 자기소개서 본문 단락 (약 450~650자 내외).
   - 신뢰감 있고 설득력 있는 비즈니스 문체(~했습니다, ~하고자 노력했습니다).
   - 복사해서 바로 서류에 활용할 수 있도록 군더더기 없는 문단.
5. 직무 키워드 추천 (keywords):
   - 이 경험과 가장 잘 어울리는 대표 직무 역량 키워드 1~2개 엄선 (예: '위기 대응 및 고객 경험 관리', '주도적 문제 해결력', '데이터 기반 프로세스 개선', '갈등 중재 및 소통 역량' 등).
   - 각 키워드마다 "자기소개서 작성 팁(이 역량으로 지원서 항목에 연결하는 방법)" 1문장 작성.
6. 전체 종합 답변 (replyText):
   - 코치 메시지, 소제목, 완성 문단, STAR 단계별 정리, 추천 직무 키워드 및 활용 팁이 보기 쉽게 정리된 친절한 한국어 메시지.`;

// Endpoint: STAR Translation & Conversational Refinement
app.post('/api/chat', async (req, res) => {
  try {
    const { message, history, targetJob, tone } = req.body;

    if (!message || typeof message !== 'string') {
      res.status(400).json({ error: '메시지를 입력해 주세요.' });
      return;
    }

    if (!process.env.GEMINI_API_KEY) {
      res.status(500).json({ error: 'GEMINI_API_KEY 환경변수가 설정되지 않았습니다.' });
      return;
    }

    // Build context with optional user preferences
    let userPromptWithContext = message;
    const additionalContext: string[] = [];
    if (targetJob && targetJob !== '전체 / 미정') {
      additionalContext.push(`지원 희망 직무: ${targetJob}`);
    }
    if (tone) {
      additionalContext.push(`원하는 서술 톤: ${tone}`);
    }
    if (additionalContext.length > 0) {
      userPromptWithContext = `[추가 조건: ${additionalContext.join(', ')}]\n\n${message}`;
    }

    // Prepare contents: if history is present, format it
    const contents: any[] = [];

    if (Array.isArray(history) && history.length > 0) {
      for (const h of history) {
        if (h.role && h.content) {
          contents.push({
            role: h.role === 'assistant' ? 'model' : 'user',
            parts: [{ text: typeof h.content === 'string' ? h.content : JSON.stringify(h.content) }],
          });
        }
      }
    }

    contents.push({
      role: 'user',
      parts: [{ text: userPromptWithContext }],
    });

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            coachMessage: {
              type: Type.STRING,
              description: '취업 준비생에게 전하는 따뜻하고 격려가 담긴 1-2문장 코멘트',
            },
            headline: {
              type: Type.STRING,
              description: '자기소개서용 괄호 소제목 (예: [소통으로 일궈낸 ...])',
            },
            star: {
              type: Type.OBJECT,
              properties: {
                situation: {
                  type: Type.STRING,
                  description: 'Situation: 경험의 배경 및 당시 구체적 상황 서술',
                },
                task: {
                  type: Type.STRING,
                  description: 'Task: 직면했던 과제, 갈등, 목표 또는 문제점 서술',
                },
                action: {
                  type: Type.STRING,
                  description: 'Action: 본인이 주도적으로 취한 구체적 행동 및 노력 서술',
                },
                result: {
                  type: Type.STRING,
                  description: 'Result: 정량/정성적 성과 및 교훈 서술',
                },
              },
              required: ['situation', 'task', 'action', 'result'],
            },
            fullParagraph: {
              type: Type.STRING,
              description: 'STAR를 자연스럽게 엮어 완성한 450~650자 내외의 전문적인 자기소개서 완성 문단',
            },
            keywords: {
              type: Type.ARRAY,
              description: '어울리는 1~2가지 대표 직무 역량 키워드와 자소서 작성 팁',
              items: {
                type: Type.OBJECT,
                properties: {
                  keyword: {
                    type: Type.STRING,
                    description: '직무 역량 키워드 (예: 위기대응능력, 고객경험관리 등)',
                  },
                  howToUse: {
                    type: Type.STRING,
                    description: '이 경험을 해당 키워드로 자소서 항목에 엮는 1줄 팁',
                  },
                },
                required: ['keyword', 'howToUse'],
              },
            },
            replyText: {
              type: Type.STRING,
              description: '채팅창에 출력하기 좋은 종합 마크다운 텍스트',
            },
          },
          required: ['coachMessage', 'headline', 'star', 'fullParagraph', 'keywords', 'replyText'],
        },
      },
    });

    const textOutput = response.text;
    if (!textOutput) {
      throw new Error('Gemini API로부터 응답을 받지 못했습니다.');
    }

    const parsed = JSON.parse(textOutput);
    res.json({
      success: true,
      data: parsed,
    });
  } catch (error: any) {
    console.error('Gemini API Error:', error);
    res.status(500).json({
      success: false,
      error: error?.message || '자기소개서 번역 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.',
    });
  }
});

// Dev vs Prod Vite mounting
if (process.env.NODE_ENV !== 'production') {
  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: 'spa',
  });
  app.use(vite.middlewares);
} else {
  app.use(express.static(path.resolve(__dirname, 'dist')));
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
  });
}

app.listen(port, '0.0.0.0', () => {
  console.log(`STAR Cover Letter Bot server running on http://0.0.0.0:${port}`);
});
