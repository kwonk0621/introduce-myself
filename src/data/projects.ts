import { Project } from "../types/project";

export const projects: Project[] = [
  {
    id: "aether-stream",
    title: "AetherStream: 실시간 대용량 분산 에이전트 오케스트레이션 플랫폼",
    category: "Systems",
    shortDescription: "다중 에이전트 환경에서 실시간 이벤트 스트리밍 및 오케스트레이션을 지원하는 고성능 분산 인프라 엔진입니다.",
    longDescription: "AetherStream은 수천 명의 동시 활성 에이전트 간의 통신 지연을 최소화하고, 이벤트 기반의 오케스트레이션을 효율적으로 관리하기 위해 구축된 엔지니어링 시스템입니다. 분산 메시지 큐와 인메모리 상태 관리를 통합하여 대규모 에이전트 협업 태스크의 흐름을 조율하며, 실패 복구 및 동적 에이전트 할당 알고리즘을 탑재하여 시스템 안정성을 보장합니다.",
    techStack: ["Python", "gRPC", "Redis", "Kafka", "FastAPI"],
    githubUrl: "https://github.com/example/aether-stream",
    liveUrl: "https://aether-stream-demo.vercel.app",
    imageUrl: "/images/aether-stream.jpg",
    features: [
      "초당 5만 건 이상의 메시지 처리량을 보장하는 gRPC 기반 경량 직렬화 프로토콜 도입",
      "에이전트 간 우선순위 큐 및 동적 작업 분배를 처리하는 오케스트레이터 구현",
      "실시간 상태 모니터링 및 복구(Failover)를 위한 Redis Cluster 연동",
      "이벤트 히스토리 역추적 및 재생(Event Sourcing) 시스템 구축"
    ],
    challenges: "다양한 외부 LLM API 응답 지연으로 인한 이벤트 루프 블로킹과 에이전트 간의 데드락(Deadlock) 상태가 빈번하게 발생하여 시스템 병목이 생겼습니다.",
    troubleshooting: "FastAPI의 비동기 코루틴(asyncio) 구조와 Kafka 파티셔닝을 최적화하고, 서킷 브레이커(Circuit Breaker) 패턴을 도입해 병목을 고립시켰습니다. 또한 분산 락(Distributed Lock) 기법을 사용해 다중 에이전트 상태 변경 충돌을 완전히 해소했습니다.",
    date: "2026.04",
    location: "Seoul, AIGravity Lab"
  },
  {
    id: "gravity-rag",
    title: "GravityRAG: 기업 문서 지식 베이스용 하이브리드 그래프-벡터 검색 엔진",
    category: "Systems",
    shortDescription: "단순 벡터 검색의 한계를 넘어 지식 그래프 구조와 임베딩 벡터 검색을 통합한 정밀 하이브리드 RAG 검색 시스템입니다.",
    longDescription: "기업 내 산재한 대량의 문서 데이터에서 정확한 맥락 정보를 추출하고 할루시네이션(Hallucination)을 억제하기 위해 설계된 시스템입니다. 문서 간 관계 정보를 그래프 데이터베이스(Neo4j)로 매핑하고, 의미적 유사도 검색(Dense Vector Search) 및 키워드 매칭(Sparse Search)을 Reranking 모델로 병합하여 고정밀 컨텍스트를 LLM에 전달합니다.",
    techStack: ["Next.js", "Neo4j", "LangChain", "HuggingFace", "Elasticsearch"],
    githubUrl: "https://github.com/example/gravity-rag",
    liveUrl: "https://gravity-rag-demo.vercel.app",
    imageUrl: "/images/gravity-rag.jpg",
    features: [
      "정형/비정형 문서에서 개체(Entity)와 관계(Relation)를 자동 추출하는 하이브리드 엔티티 추출기 구현",
      "Neo4j 그래프 쿼리와 밀집 벡터 검색을 조합한 하이브리드 검색 파이프라인 설계",
      "Cohere Rerank 모델을 활용해 상위 K개의 가장 유효한 컨텍스트 선별 최적화",
      "자체 구현한 청킹(Chunking) 알고리즘으로 토큰 레이아웃 보존성 극대화"
    ],
    challenges: "복잡한 도메인 용어와 개체 간 다대다 관계가 얽힐 때, 단순 벡터 검색이 중요한 맥락적 연결고리를 놓치거나 잘못된 대답(Hallucination)을 대량으로 생성하는 현상이 발생했습니다.",
    troubleshooting: "지식 그래프 데이터 파이프라인을 구축해 문맥적 관계를 명시화하고, 그래프 쿼리를 조합해 후보군을 1차 필터링한 후 벡터 공간에서 2차 유사도 검색을 수행하도록 아키텍처를 개편했습니다. Reranking 파이프라인의 조정을 거쳐 질답 정확도를 기존 대비 38% 향상시켰습니다.",
    date: "2026.02",
    location: "Seoul, AIGravity Lab"
  },
  {
    id: "neuro-morph",
    title: "NeuroMorph: 자율 주행 및 시각 추론을 위한 멀티모달 모델 최적화 연구",
    category: "Research",
    shortDescription: "자율 주행 제어 및 복잡한 시각 환경 추론에 특화된 소형 멀티모달 LLM(VLM) 파인튜닝 연구 과제입니다.",
    longDescription: "도로 상황 및 다차원 센서 이미지 데이터를 신속하게 해석하여 차량 제어 신호로 변환하는 경량 비전-언어 모델(Vision-Language Model) 최적화 프로젝트입니다. 고성능 거대 모델의 성능을 유지하면서, 차량용 온보드 컴퓨터 등 제한된 하드웨어 리소스에서 실시간 추론이 가능하도록 파라미터 효율적 파인튜닝(PEFT) 및 양자화 최적화를 연구했습니다.",
    techStack: ["PyTorch", "Transformers", "LoRA", "DeepSpeed", "QLoRA"],
    imageUrl: "/images/neuro-morph.jpg",
    features: [
      "LoRA(Low-Rank Adaptation) 가중치 기법을 활용한 멀티모달 어텐션 레이어 파인튜닝",
      "DeepSpeed ZeRO-3 분산 학습 프레임워크를 이용한 다중 GPU 학습 효율 향상",
      "다양한 조도 및 날씨 환경(비, 눈, 야간) 이미지 데이터셋 타겟 증강(Augmentation)",
      "4비트 양자화(QLoRA) 공정을 통한 추론 메모리 점유율 70% 감소"
    ],
    challenges: "대용량 비전 임베딩과 텍스트 임베딩 간의 정렬이 온전히 되지 않아 극단적인 주행 상황에서 비정상적인 의사결정이 유발되었고, FP16 학습 시 그래디언트 소실/폭주(Gradient Vanishing/Exploding) 현상이 관찰되었습니다.",
    troubleshooting: "정렬 손실 함수(Contrastive Loss) 레이어를 수정하여 텍스트-이미지 간 정렬의 규제를 정밀화하고, 학습 중 혼합 정밀도(Mixed Precision) 스케일링 파라미터를 미세조정하여 수렴 안정성을 확보했습니다. 연구 결과는 주요 AI 학회에 학술 페이퍼로 투고되었습니다.",
    date: "2025.11",
    location: "Seoul, AIGravity Lab"
  },
  {
    id: "semantics-100b",
    title: "Semantics-100B: 초경량 엣지 디바이스 구동을 위한 LLM 지식 증류 기법",
    category: "Research",
    shortDescription: "대규모 모델의 심층 인지 지식을 성능 손실 없이 소형 디바이스용 2B~7B 모델로 전수하는 지식 증류 기술 연구입니다.",
    longDescription: "초고성능이지만 서비스 비용이 매우 비싼 100B 규모의 거대 언어 모델의 지적 능력을 모바일 기기나 임베디드 엣지 디바이스에서도 동작 가능한 경량 모델로 이전하기 위한 연구입니다. 로스(Loss) 함수 변형, 토큰 로짓(Logit) 비교 및 어텐션 맵 매칭 기법을 조합해 소형 모델의 언어 추론력을 극대화하는 성과를 도출했습니다.",
    techStack: ["PyTorch", "Knowledge Distillation", "HuggingFace", "TensorRT"],
    imageUrl: "/images/semantics-100b.jpg",
    features: [
      "교사(Teacher) 모델과 학생(Student) 모델 간의 어텐션 분포 유사도 매칭 알고리즘 고안",
      "중요 단어의 예측 확률 분포(Soft Targets)에 가중치를 주는 커스텀 로스 함수 설계",
      "NVIDIA TensorRT-LLM 엔진을 활용한 엣지 보드 최적화 벤치마크 테스트 수행",
      "한국어 상식 및 이성적 추론 데이터셋(KLUE, Ko-Harness) 성능 검증"
    ],
    challenges: "증류된 학생 모델의 크기가 줄어들면서 논리적 연쇄 추론(CoT) 능력이 급격히 감소하고, 동일한 질문에 대해 단조롭거나 반복적인 답변을 내놓는 현상이 지속되었습니다.",
    troubleshooting: "온도 계수(Temperature Scaling)와 상호 정보량(Mutual Information) 손실 함수를 추가하여 학생 모델이 교사 모델의 다양한 답변 다양성을 포착하게 만들었으며, 다단계 연쇄 추론 증류(Step-by-step CoT Distillation) 방식을 도입해 논리적 연산력을 기존 경량 모델 평균 대비 22% 높였습니다.",
    date: "2025.08",
    location: "Seoul, AIGravity Lab"
  },
  {
    id: "aigravity-vision",
    title: "AIGravity Vision: 제스처 센싱 및 마스크 세그멘테이션 인터랙티브 UI 실험",
    category: "Demos",
    shortDescription: "웹캠 환경에서 딥러닝 기반 실시간 관절 추적과 인물 세그멘테이션을 활용한 무접촉 인터랙티브 브라우저 제어 시스템입니다.",
    longDescription: "사용자의 실시간 영상 데이터를 브라우저 단에서 고속 연산하여 제스처를 인식하고, 이를 기반으로 스크롤, 클릭, 드래그 등의 UI 상호작용을 처리하는 실험 데모입니다. 온디바이스 AI 모델을 웹 브라우저 환경에서 매끄럽게 구동하기 위해 WebGL 가속을 극대화하고 프레임 드랍을 원천 차단하는 엔지니어링을 적용했습니다.",
    techStack: ["TensorFlow.js", "MediaPipe", "WebGL", "TypeScript"],
    githubUrl: "https://github.com/example/aigravity-vision",
    imageUrl: "/images/aether-stream.jpg",
    features: [
      "MediaPipe 손가락 관절 추적(Hands) 및 얼굴 랜드마크 데이터 파이프라인 연동",
      "WebGL GPU 파이프라인 가속을 활용해 온디바이스에서 60FPS 실시간 추론 연산 보장",
      "비선형 보간법(Exponential Smoothing)을 사용한 떨림 없는 포인터 이동 로직 구축",
      "프라이버시 보호를 위해 로컬 환경에서 100% 처리되는 보안 아키텍처 수립"
    ],
    challenges: "싱글 스레드 기반의 자바스크립트 엔진 특성상 브라우저 UI 렌더링 루프와 TensorFlow.js의 GPU 메모리 버퍼 복사 연산이 충돌하여 마우스 포인터의 이동이 버벅거리고 버퍼 오버플로우가 발생했습니다.",
    troubleshooting: "비디오 프레임 캡처 및 제스처 예측 연산을 OffscreenCanvas 기술을 활용해 웹 워커(Web Worker) 내부의 독립 스레드로 이관했습니다. 렌더스레드와의 통신 병목을 없애 화면 주사율과 완벽히 동기화된 부드러운 60fps 무접촉 스크롤 및 핀치 줌을 구현했습니다.",
    date: "2025.05",
    location: "Seoul, AIGravity Lab"
  },
  {
    id: "synthsound-lab",
    title: "SynthSound Lab: 생성 AI 기반 실시간 오디오 스템 분리 및 믹서 실험",
    category: "Demos",
    shortDescription: "딥러닝 파형 분석 모델을 통해 오디오 음원을 보컬, 드럼, 베이스 트랙으로 실시간 분리 및 재합성하는 오디오 인터페이스 데모입니다.",
    longDescription: "단일 스테레오 오디오 소스를 브라우저 내에서 실시간으로 분석해 핵심 악기 파트(Stems)로 완벽 분리하고, 이를 사용자가 직접 웹 오디오 노드 믹서를 통해 개별 제어 및 이펙터 적용을 해볼 수 있는 실험적 웹 애플리케이션입니다. 엣지 가속을 기반으로 한 음원 분리와 실시간 사운드 재생의 저지연 처리를 입증했습니다.",
    techStack: ["Web Audio API", "ONNX Runtime Web", "WASM", "TypeScript"],
    githubUrl: "https://github.com/example/synthsound-lab",
    imageUrl: "/images/synthsound-lab.jpg",
    features: [
      "ONNX Runtime Web을 탑재해 브라우저 내에서 직접 구동되는 오디오 스템 분리 신경망 이식",
      "Web Audio API 기반 다중 채널 페이더, 음소거, 솔로 및 실시간 가인(Gain) 제어 노드 연결",
      "WASM(WebAssembly) SIMD 명령어를 활용한 CPU 고성능 신호 처리 처리",
      "악기 파트별 음향 다이내믹스 주파수를 표현하는 실시간 캔버스 애널라이저 탑재"
    ],
    challenges: "분리 모델의 대규모 가중치 파일(약 80MB)을 브라우저가 다운로드하고 WASM 힙 메모리에 적재할 때 긴 지연 시간과 함께 웹 브라우저 탭이 불시에 다운되는 현상이 관찰되었습니다.",
    troubleshooting: "모델 로드를 청크 단위 비동기 다운로드로 최적화하고 IndexedDB 캐싱 기법을 적용해 2회차 접속부터 즉시 로드되도록 했습니다. 또한 오디오 디코딩 처리를 AudioWorklet 노드를 사용하여 오디오 스레드 내부에서 무복사(Zero-copy) 버퍼링하도록 설계해 메모리 고갈과 프레임 끊김을 완전하게 해결했습니다.",
    date: "2024.12",
    location: "Seoul, AIGravity Lab"
  }
];
