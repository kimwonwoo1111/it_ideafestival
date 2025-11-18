import { useState, useRef, useEffect } from "react";
import { Upload } from "lucide-react";
import { Toaster } from "./components/ui/sonner";
import { toast } from "sonner";
import { FeedItem } from "./components/FeedItem";
import { FeedModal } from "./components/FeedModal";
import { RankingList } from "./components/RankingList";
import { ProfileMenu } from "./components/ProfileMenu";
import { ContentSheet } from "./components/ContentSheet";
import { motion } from "motion/react";

interface Evidence {
  id: number;
  username: string;
  text: string;
  timeAgo: string;
  upvotes: number;
  type: "support" | "refute";
  evidenceType?: "link" | "image" | "text";
  imageUrl?: string;
  linkUrl?: string;
  linkTitle?: string;
}

interface Post {
  id: number;
  username: string;
  userAvatar: string;
  image: string;
  caption: string;
  likes: number;
  comments: Evidence[];
  timeAgo: string;
  category: string;
  truthScore: number;
  sourceType: "youtube" | "news" | "article";
  sourceUrl: string;
  sourceName: string;
}

const mockPosts: Post[] = [
  {
    id: 1,
    username: "김경제",
    userAvatar: "",
    image:
      "https://images.unsplash.com/photo-1504711434969-e33886168f5c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidXNpbmVzcyUyMG5ld3N8ZW58MXx8fHwxNzYxNjY2MjU0fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    caption:
      "글로벌 기업들의 4분기 실적 발표 시작, 투자자들의 이목 집중",
    likes: 15240,
    sourceType: "news",
    sourceUrl: "https://www.chosun.com/economy/example-article",
    sourceName: "조선일보",
    comments: [
      {
        id: 1,
        username: "경제분석가",
        text: "Bloomberg 보도에 따르면 주요 기업들의 실적이 전년 대비 15% 상승했습니다.",
        timeAgo: "1시간 전",
        upvotes: 245,
        type: "support",
        evidenceType: "link",
        linkUrl: "https://bloomberg.com/example",
        linkTitle: "Bloomberg: Q4 Corporate Earnings Report",
      },
      {
        id: 2,
        username: "투자자K",
        text: "실제 증권거래소 데이터를 인한 결과 거래량이 크게 증가했습니다.",
        timeAgo: "2시간 전",
        upvotes: 189,
        type: "support",
        evidenceType: "image",
        imageUrl:
          "https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?w=400",
      },
      {
        id: 3,
        username: "시장관찰자",
        text: "환율 변동을 고려하면 실질 성장률은 다소 낮을 수 있습니다.",
        timeAgo: "3시간 전",
        upvotes: 67,
        type: "refute",
        evidenceType: "text",
      },
    ],
    timeAgo: "2시간 전",
    category: "경제",
    truthScore: 87,
  },
  {
    id: 2,
    username: "테크매니아",
    userAvatar: "",
    image:
      "https://images.unsplash.com/photo-1568952433726-3896e3881c65?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0ZWNobm9sb2d5JTIwaW5ub3ZhdGlvbnxlbnwxfHx8fDE3NjE2OTQxNTB8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    caption:
      "AI 기술의 새로운 돌파구, 자율주행 시스템에 혁신적 변화 예고",
    likes: 23567,
    sourceType: "youtube",
    sourceUrl: "https://youtube.com/watch?v=example",
    sourceName: "YouTube",
    comments: [
      {
        id: 1,
        username: "테크리뷰어",
        text: "Tesla의 최신 FSD 버전이 실제로 레벨 4에 근접한 성능을 보여주고 있습니다.",
        timeAgo: "30분 전",
        upvotes: 342,
        type: "support",
        evidenceType: "link",
        linkUrl: "https://techcrunch.com/example",
        linkTitle: "TechCrunch: Tesla FSD Beta 12 Review",
      },
      {
        id: 2,
        username: "개발자J",
        text: "AI 모델의 발전 속도가 정말 놀랍습니다. 직접 테스트해본 결과입니다.",
        timeAgo: "1시간 ",
        upvotes: 198,
        type: "support",
        evidenceType: "image",
        imageUrl:
          "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=400",
      },
    ],
    timeAgo: "3시간 전",
    category: "기술",
    truthScore: 92,
  },
  {
    id: 3,
    username: "이정치",
    userAvatar: "",
    image:
      "https://images.unsplash.com/photo-1510993968327-0766450f8a11?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwb2xpdGljcyUyMGdvdmVybm1lbnR8ZW58MXx8fHwxNzYxNjQ0MjM5fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    caption:
      "정부, 신규 경제 정책 발표...중소기업 지원 확대 방안 공개",
    likes: 18934,
    sourceType: "news",
    sourceUrl: "https://www.joongang.co.kr/politics/example",
    sourceName: "중앙일보",
    comments: [
      {
        id: 1,
        username: "중소기업대표",
        text: "실제 정책 문서를 확인했으나 구체적인 예산 배정은 아직 명시되지 않았습니다.",
        timeAgo: "45분 전",
        upvotes: 156,
        type: "refute",
        evidenceType: "link",
        linkUrl: "https://government.kr/policy",
        linkTitle: "정부 공식 정책 문서",
      },
      {
        id: 2,
        username: "정책분석가",
        text: "과거 유사한 정책들의 집행률이 평균 60% 수준이었습니다.",
        timeAgo: "1시간 전",
        upvotes: 234,
        type: "refute",
        evidenceType: "image",
        imageUrl:
          "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=400",
      },
      {
        id: 3,
        username: "시민A",
        text: "청년 창업 지원 항목이 실제로 포함되어 있음을 확인했습니다.",
        timeAgo: "2시간 전",
        upvotes: 89,
        type: "support",
        evidenceType: "text",
      },
    ],
    timeAgo: "4시간 전",
    category: "정치",
    truthScore: 58,
  },
  {
    id: 4,
    username: "축구광",
    userAvatar: "",
    image:
      "https://images.unsplash.com/photo-1565483276060-e6730c0cc6a1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzcG9ydHMlMjBzdGFkaXVtfGVufDF8fHx8MTc2MTY4NzkxOHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    caption:
      "프로 축구 개막전, 역대급 관중 동원...스포츠 산업 회복 신호탄",
    likes: 31245,
    sourceType: "news",
    sourceUrl: "https://sports.news.naver.com/example",
    sourceName: "네이버 스포츠",
    comments: [
      {
        id: 1,
        username: "축구팬",
        text: "직관하고 왔는데 실제로 매진이었습니다! 현장 사진 첨부합니다.",
        timeAgo: "20분 전",
        upvotes: 412,
        type: "support",
        evidenceType: "image",
        imageUrl:
          "https://images.unsplash.com/photo-1565483276060-e6730c0cc6a1?w=400",
      },
      {
        id: 2,
        username: "스포츠기자",
        text: "공식 발표된 관중 수치와 일치합니다.",
        timeAgo: "1시간 전",
        upvotes: 278,
        type: "support",
        evidenceType: "link",
        linkUrl: "https://kfa.or.kr/news",
        linkTitle: "대한축구협회 공식 발표",
      },
    ],
    timeAgo: "5시간 전",
    category: "스포츠",
    truthScore: 95,
  },
  {
    id: 5,
    username: "주식왕",
    userAvatar: "",
    image:
      "https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdG9jayUyMG1hcmtldHxlbnwxfHx8fDE3NjE3MTg0ODV8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    caption:
      "증시 상승세 지속, 외국인 매수세 유입으로 코스피 4,000 돌파",
    likes: 12789,
    sourceType: "youtube",
    sourceUrl:
      "https://youtube.com/watch?v=stock-market-analysis",
    sourceName: "YouTube",
    comments: [
      {
        id: 1,
        username: "주식투자자",
        text: "한국거래소 공식 데이터 확인 결과 사실입니다.",
        timeAgo: "15분 전",
        upvotes: 198,
        type: "support",
        evidenceType: "link",
        linkUrl: "https://krx.co.kr",
        linkTitle: "한국거래소 - 실시간 시세",
      },
      {
        id: 2,
        username: "재테크러",
        text: "외국인 매수 금액이 실제로 증가한 것을 확인했습니다.",
        timeAgo: "40분 전",
        upvotes: 145,
        type: "support",
        evidenceType: "image",
        imageUrl:
          "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=400",
      },
      {
        id: 3,
        username: "금융분석가",
        text: "단기 조정 가능성도 염두에 두어야 합니다. 과거 패턴 분석 자료입니다.",
        timeAgo: "1시간 전",
        upvotes: 87,
        type: "refute",
        evidenceType: "text",
      },
    ],
    timeAgo: "6시간 전",
    category: "증권",
    truthScore: 78,
  },
  {
    id: 6,
    username: "과학덕후",
    userAvatar: "",
    image:
      "https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzY2llbmNlJTIwcmVzZWFyY2h8ZW58MXx8fHwxNzYxNjY3OTU0fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    caption:
      "새로운 백신 개발 성공, 임상 3상 결과 95% 효능 입증",
    likes: 27456,
    sourceType: "news",
    sourceUrl:
      "https://www.sciencedaily.com/vaccine-breakthrough",
    sourceName: "BBC News",
    comments: [
      {
        id: 1,
        username: "의료전문가",
        text: "Nature 저널에 게재된 논문을 확인했습니다. 데이터가 정확합니다.",
        timeAgo: "2시간 전",
        upvotes: 456,
        type: "support",
        evidenceType: "link",
        linkUrl: "https://nature.com/articles/example",
        linkTitle: "Nature: Phase 3 Clinical Trial Results",
      },
      {
        id: 2,
        username: "연구원K",
        text: "임상 데이터가 매우 고무적이네요. 실제 논문 그래프입니다.",
        timeAgo: "3시간 전",
        upvotes: 312,
        type: "support",
        evidenceType: "image",
        imageUrl:
          "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=400",
      },
    ],
    timeAgo: "7시간 전",
    category: "과학",
    truthScore: 89,
  },
  {
    id: 7,
    username: "환경지킴이",
    userAvatar: "",
    image:
      "https://images.unsplash.com/photo-1576811526908-f6f644268b04?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlbnZpcm9ubWVudCUyMGNsaW1hdGV8ZW58MXx8fHwxNzYxNzE4NDg2fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    caption:
      "재생에너지 투자 급증, 2025년 글로벌 목표 달성 가능성 높아져",
    likes: 19823,
    sourceType: "youtube",
    sourceUrl:
      "https://youtube.com/watch?v=renewable-energy-2025",
    sourceName: "YouTube",
    comments: [
      {
        id: 1,
        username: "환경운동가",
        text: "IEA 보고서에는 목표 달성이 어려울 것으로 나와있습니다.",
        timeAgo: "1시간 전",
        upvotes: 289,
        type: "refute",
        evidenceType: "link",
        linkUrl: "https://iea.org/reports",
        linkTitle: "IEA: World Energy Outlook 2024",
      },
      {
        id: 2,
        username: "에너지전문가",
        text: "투자는 증가했지만 실제 발전량은 예상보다 낮습니다.",
        timeAgo: "2시간 전",
        upvotes: 167,
        type: "refute",
        evidenceType: "image",
        imageUrl:
          "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=400",
      },
    ],
    timeAgo: "8시간 전",
    category: "환경",
    truthScore: 34,
  },
  {
    id: 8,
    username: "건강한삶",
    userAvatar: "",
    image:
      "https://images.unsplash.com/photo-1668874896975-7f874c90600a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoZWFsdGglMjBtZWRpY2FsfGVufDF8fHx8MTc2MTcxODQ4Nnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    caption:
      "디지털 헬스케어 시장 급성장, AI 기반 진단 시스템 도입 확대",
    likes: 14567,
    sourceType: "news",
    sourceUrl: "https://www.healthnews.com/digital-healthcare",
    sourceName: "CNN Health",
    comments: [
      {
        id: 1,
        username: "의사A",
        text: "의료 현장에서 실제로 많은 도움이 되고 있습니다. 사용 사례 공유합니다.",
        timeAgo: "30분 전",
        upvotes: 234,
        type: "support",
        evidenceType: "image",
        imageUrl:
          "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=400",
      },
      {
        id: 2,
        username: "환자B",
        text: "접근성이 좋아져서 정말 편리해졌어요. 실제 사용 후기입니다.",
        timeAgo: "1시간 전",
        upvotes: 178,
        type: "support",
        evidenceType: "text",
      },
      {
        id: 3,
        username: "헬스케어CEO",
        text: "시장 보고서에 따르면 성장률이 연 25% 수준입니다.",
        timeAgo: "2시간 전",
        upvotes: 145,
        type: "support",
        evidenceType: "link",
        linkUrl: "https://healthcare-report.com",
        linkTitle: "Digital Healthcare Market Report 2024",
      },
    ],
    timeAgo: "10시간 전",
    category: "의료",
    truthScore: 82,
  },
  {
    id: 9,
    username: "부동산전문가",
    userAvatar: "",
    image:
      "https://images.unsplash.com/photo-1560518883-ce09059eeffa?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyZWFsJTIwZXN0YXRlfGVufDF8fHx8MTc2MTcxODQ4Nnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    caption:
      "서울 아파트 가격 급등, 전월 대비 평균 5% 상승...정부 규제 예고",
    likes: 28934,
    sourceType: "news",
    sourceUrl: "https://www.realestate.com/seoul-price",
    sourceName: "한국경제",
    comments: [
      {
        id: 1,
        username: "부동산중개사",
        text: "국토교통부 실거래가 데이터로 확인했습니다. 실제로 급등세입니다.",
        timeAgo: "1시간 전",
        upvotes: 523,
        type: "support",
        evidenceType: "link",
        linkUrl: "https://rt.molit.go.kr",
        linkTitle: "국토교통부 실거래가 공개시스템",
      },
      {
        id: 2,
        username: "주택소유자",
        text: "우리 동네도 실제로 가격이 많이 올랐어요. 매물도 없습니다.",
        timeAgo: "2시간 전",
        upvotes: 298,
        type: "support",
        evidenceType: "text",
      },
    ],
    timeAgo: "1시간 전",
    category: "부동산",
    truthScore: 91,
  },
  {
    id: 10,
    username: "교육맘",
    userAvatar: "",
    image:
      "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlZHVjYXRpb24lMjBzY2hvb2x8ZW58MXx8fHwxNzYxNzE4NDg2fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    caption:
      "2025 대입 제도 개편안 발표, 수능 절대평가 전환 검토 중",
    likes: 35678,
    sourceType: "youtube",
    sourceUrl: "https://youtube.com/watch?v=education-reform",
    sourceName: "YouTube",
    comments: [
      {
        id: 1,
        username: "교육부관계자",
        text: "아직 확정된 사항이 아닙니다. 현재 검토 단계입니다.",
        timeAgo: "30분 전",
        upvotes: 412,
        type: "refute",
        evidenceType: "text",
      },
      {
        id: 2,
        username: "학부모A",
        text: "교육부 공식 브리핑에서는 다르게 발표했습니다.",
        timeAgo: "1시간 전",
        upvotes: 334,
        type: "refute",
        evidenceType: "link",
        linkUrl: "https://moe.go.kr/briefing",
        linkTitle: "교육부 공식 보도자료",
      },
    ],
    timeAgo: "30분 전",
    category: "교육",
    truthScore: 42,
  },
  {
    id: 11,
    username: "자동차매니아",
    userAvatar: "",
    image:
      "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYXIlMjBhdXRvbW90aXZlfGVufDF8fHx8MTc2MTcxODQ4Nnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    caption:
      "국내 전기차 판매 급증, 작년 대비 200% 증가...충전소 부족 우려",
    likes: 21456,
    sourceType: "news",
    sourceUrl: "https://auto.news.com/ev-sales",
    sourceName: "머니투데이",
    comments: [
      {
        id: 1,
        username: "전기차오너",
        text: "실제로 충전소 찾기가 어렵습니다. 현장 사진 공유합니다.",
        timeAgo: "45분 전",
        upvotes: 267,
        type: "support",
        evidenceType: "image",
        imageUrl:
          "https://images.unsplash.com/photo-1593941707882-a5bba14938c7?w=400",
      },
      {
        id: 2,
        username: "자동차산업연구원",
        text: "판매 증가율은 맞지만, 기저효과를 고려해야 합니다.",
        timeAgo: "1시간 전",
        upvotes: 189,
        type: "refute",
        evidenceType: "text",
      },
    ],
    timeAgo: "2시간 전",
    category: "자동차",
    truthScore: 73,
  },
  {
    id: 12,
    username: "푸드블로거",
    userAvatar: "",
    image:
      "https://images.unsplash.com/photo-1504674900247-0877df9cc836?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmb29kJTIwcmVzdGF1cmFudHxlbnwxfHx8fDE3NjE3MTg0ODZ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    caption:
      "밀키트 시장 급성장, 외식업계 위기감 고조...전통 요식업 매출 감소",
    likes: 16789,
    sourceType: "youtube",
    sourceUrl: "https://youtube.com/watch?v=mealkit-trend",
    sourceName: "YouTube",
    comments: [
      {
        id: 1,
        username: "요식업자",
        text: "실제로 매출이 줄었습니다. 업계 데이터 공유합니다.",
        timeAgo: "1시간 전",
        upvotes: 198,
        type: "support",
        evidenceType: "link",
        linkUrl: "https://restaurant-report.com",
        linkTitle: "외식업계 동향 보고서 2024",
      },
    ],
    timeAgo: "3시간 전",
    category: "식품",
    truthScore: 68,
  },
  {
    id: 13,
    username: "게임리뷰어",
    userAvatar: "",
    image:
      "https://images.unsplash.com/photo-1538481199705-c710c4e965fc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnYW1pbmclMjBlc3BvcnRzfGVufDF8fHx8MTc2MTcxODQ4Nnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    caption:
      "국내 게임사 신작, 글로벌 시장서 대박...출시 일주일 만에 1000만 다운로드 돌파",
    likes: 42367,
    sourceType: "news",
    sourceUrl: "https://gamemeca.com/new-game-hit",
    sourceName: "게임메카",
    comments: [
      {
        id: 1,
        username: "게임개발자",
        text: "Google Play와 App Store 공식 통계로 확인했습니다.",
        timeAgo: "20분 전",
        upvotes: 612,
        type: "support",
        evidenceType: "link",
        linkUrl: "https://play.google.com/store",
        linkTitle: "Google Play 다운로드 통계",
      },
      {
        id: 2,
        username: "게이머",
        text: "실제로 주변에서 다들 하고 있어요. 정말 재밌습니다!",
        timeAgo: "1시간 전",
        upvotes: 456,
        type: "support",
        evidenceType: "text",
      },
    ],
    timeAgo: "4시간 전",
    category: "게임",
    truthScore: 94,
  },
  {
    id: 14,
    username: "패션인플루언서",
    userAvatar: "",
    image:
      "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYXNoaW9uJTIwc3R5bGV8ZW58MXx8fHwxNzYxNzE4NDg2fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    caption:
      "명품 브랜드 가격 인상, 샤넬 가방 평균 15% 올라...소비자 반발",
    likes: 25123,
    sourceType: "news",
    sourceUrl: "https://fashion.com/luxury-price-hike",
    sourceName: "보그 코리아",
    comments: [
      {
        id: 1,
        username: "명품매니저",
        text: "실제로 가격표가 변경되었습니다. 매장에서 확인했습니다.",
        timeAgo: "2시간 전",
        upvotes: 387,
        type: "support",
        evidenceType: "image",
        imageUrl:
          "https://images.unsplash.com/photo-1591348278863-df0eab1f5fa5?w=400",
      },
    ],
    timeAgo: "5시간 전",
    category: "패션",
    truthScore: 88,
  },
  {
    id: 15,
    username: "여행러버",
    userAvatar: "",
    image:
      "https://images.unsplash.com/photo-1488646953014-85cb44e25828?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0cmF2ZWwlMjBhaXJwbGFuZXxlbnwxfHx8fDE3NjE3MTg0ODZ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    caption:
      "항공권 가격 폭등, 성수기 해외여행 비용 작년보다 40% 증가",
    likes: 19867,
    sourceType: "youtube",
    sourceUrl: "https://youtube.com/watch?v=flight-price-surge",
    sourceName: "YouTube",
    comments: [
      {
        id: 1,
        username: "여행사직원",
        text: "유류할증료와 환율 영향이 큽니다. 실제 견적서 공유합니다.",
        timeAgo: "1시간 전",
        upvotes: 234,
        type: "support",
        evidenceType: "text",
      },
      {
        id: 2,
        username: "여행블로거",
        text: "작년 같은 시기와 비교한 결과 정확합니다.",
        timeAgo: "2시간 전",
        upvotes: 198,
        type: "support",
        evidenceType: "link",
        linkUrl: "https://skyscanner.com",
        linkTitle: "스카이스캐너 가격 비교",
      },
    ],
    timeAgo: "6시간 전",
    category: "여행",
    truthScore: 85,
  },
  {
    id: 16,
    username: "영화평론가",
    userAvatar: "",
    image:
      "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb3ZpZSUyMGNpbmVtYXxlbnwxfHx8fDE3NjE3MTg0ODZ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    caption:
      "한국 영화 역대 최고 흥행, 올해 누적 관객 5000만 관객 돌파",
    likes: 38945,
    sourceType: "news",
    sourceUrl: "https://moviechart.com/blockbuster",
    sourceName: "씨네21",
    comments: [
      {
        id: 1,
        username: "영화관관계자",
        text: "영화진흥위원회 공식 통합전산망 확인 결과 정확합니다.",
        timeAgo: "30분 전",
        upvotes: 589,
        type: "support",
        evidenceType: "link",
        linkUrl: "https://kobis.or.kr",
        linkTitle: "영화진흥위원회 박스오피스",
      },
    ],
    timeAgo: "1시간 전",
    category: "영화",
    truthScore: 97,
  },
  {
    id: 17,
    username: "날씨박사",
    userAvatar: "",
    image:
      "https://images.unsplash.com/photo-1534088568595-a066f410bcda?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3ZWF0aGVyJTIwY2xpbWF0ZXxlbnwxfHx8fDE3NjE3MTg0ODZ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    caption:
      "이상기후 심화, 올해 겨울 평균 기온 역대 최고 기록...지구온난화 가속",
    likes: 22134,
    sourceType: "news",
    sourceUrl: "https://weather.com/climate-change",
    sourceName: "연합뉴스",
    comments: [
      {
        id: 1,
        username: "기상청연구원",
        text: "기상청 공식 데이터로 확인했습니다. 정확한 정보입니다.",
        timeAgo: "1시간 전",
        upvotes: 423,
        type: "support",
        evidenceType: "link",
        linkUrl: "https://kma.go.kr",
        linkTitle: "기상청 기후통계",
      },
    ],
    timeAgo: "7시간 전",
    category: "환경",
    truthScore: 93,
  },
  {
    id: 18,
    username: "음악평론가",
    userAvatar: "",
    image:
      "https://images.unsplash.com/photo-1511379938547-c1f69419868d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtdXNpYyUyMGNvbmNlcnR8ZW58MXx8fHwxNzYxNzE4NDg2fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    caption:
      "K-POP 글로벌 진출 가속화, 빌보드 차트 동시 10곡 진입",
    likes: 45678,
    sourceType: "youtube",
    sourceUrl: "https://youtube.com/watch?v=kpop-billboard",
    sourceName: "YouTube",
    comments: [
      {
        id: 1,
        username: "음악팬",
        text: "빌보드 공식 사이트에서 확인했습니다. 대단합니다!",
        timeAgo: "15분 전",
        upvotes: 723,
        type: "support",
        evidenceType: "link",
        linkUrl: "https://billboard.com/charts",
        linkTitle: "Billboard Hot 100",
      },
    ],
    timeAgo: "2시간 전",
    category: "음악",
    truthScore: 96,
  },
  {
    id: 19,
    username: "암호화폐전문가",
    userAvatar: "",
    image:
      "https://images.unsplash.com/photo-1621416894569-0f39ed31d247?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjcnlwdG8lMjBiaXRjb2lufGVufDF8fHx8MTc2MTcxODQ4Nnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    caption:
      "비트코인 급등, 10만 달러 돌파...기관 투자자들 매수세 집중",
    likes: 33245,
    sourceType: "news",
    sourceUrl: "https://coindesk.com/bitcoin-surge",
    sourceName: "코인데스크",
    comments: [
      {
        id: 1,
        username: "트레이더",
        text: "거래소 실시간 시세로 확인했습니다. 정합니다.",
        timeAgo: "10분 전",
        upvotes: 567,
        type: "support",
        evidenceType: "link",
        linkUrl: "https://coinmarketcap.com",
        linkTitle: "CoinMarketCap 시세",
      },
      {
        id: 2,
        username: "투자자",
        text: "변동성이 크니 주의가 필요합니다.",
        timeAgo: "30분 전",
        upvotes: 234,
        type: "refute",
        evidenceType: "text",
      },
    ],
    timeAgo: "3시간 전",
    category: "암호화폐",
    truthScore: 86,
  },
  {
    id: 20,
    username: "반려동물전문가",
    userAvatar: "",
    image:
      "https://images.unsplash.com/photo-1450778869180-41d0601e046e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwZXQlMjBkb2clMjBjYXR8ZW58MXx8fHwxNzYxNzE4NDg2fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    caption:
      "반려동물 양육 가구 1400만 돌파, 펫케어 산업 급성장 전망",
    likes: 17892,
    sourceType: "news",
    sourceUrl: "https://petnews.com/pet-industry",
    sourceName: "펫타임즈",
    comments: [
      {
        id: 1,
        username: "수의사",
        text: "동물병원 방문 건수도 크게 증가했습니다. 체감됩니다.",
        timeAgo: "1시간 전",
        upvotes: 312,
        type: "support",
        evidenceType: "text",
      },
      {
        id: 2,
        username: "펫산업연구원",
        text: "농림축산식품부 통계 자료로 확인했습니다.",
        timeAgo: "2시간 전",
        upvotes: 245,
        type: "support",
        evidenceType: "link",
        linkUrl: "https://mafra.go.kr",
        linkTitle: "농림축산식품부 반려동물 통계",
      },
    ],
    timeAgo: "9시간 전",
    category: "반려동물",
    truthScore: 90,
  },
];

// Ranking 데이터 생성 - 복합 점수로 정렬하되 무작위성 추가
const calculatePopularityScore = (post: Post) => {
  // likes, truthScore, 최신도를 조합한 점수 + 무작위 요소
  const likesScore = post.likes / 1000;
  const truthBonus = post.truthScore / 10;
  const randomFactor = Math.random() * 30; // 0-30 사이의 무작위 점수

  return likesScore + truthBonus + randomFactor;
};

// 상위 15개 중에서 무작위로 10개 선택
const topPosts = [...mockPosts]
  .map((post) => ({
    post,
    score: calculatePopularityScore(post),
  }))
  .sort((a, b) => b.score - a.score)
  .slice(0, 15);

// Fisher-Yates shuffle로 무작위 섞기
const shuffledPosts = [...topPosts].sort(
  () => Math.random() - 0.5,
);

const rankingItems = shuffledPosts
  .slice(0, 10)
  .map((item, index) => ({
    rank: index + 1,
    id: item.post.id,
    title: item.post.caption,
    category: item.post.category,
    views: `${(item.post.likes / 1000).toFixed(1)}k`,
  }));

// 새 포스트 업로드 시 랜덤으로 선택될 이미지들
const uploadImages = [
  "https://images.unsplash.com/photo-1675973094287-f4af3e49bb3d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxuZXdzJTIwYnJlYWtpbmd8ZW58MXx8fHwxNzYzNDQ2NjY3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
  "https://images.unsplash.com/photo-1623039405147-547794f92e9e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxuZXdzcGFwZXIlMjBhcnRpY2xlfGVufDF8fHx8MTc2MzQwMjc1Nnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
  "https://images.unsplash.com/photo-1579532537902-1e50099867b4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0ZWNobm9sb2d5JTIwbmV3c3xlbnwxfHx8fDE3NjMzNjg0MjZ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
  "https://images.unsplash.com/photo-1709715357520-5e1047a2b691?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidXNpbmVzcyUyMG1lZXRpbmd8ZW58MXx8fHwxNzYzNDA0ODY1fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
  "https://images.unsplash.com/photo-1579869847557-1f67382cc158?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwyfHxzb2NpYWwlMjBtZWRpYXxlbnwxfHx8fDE3NjMzNTMyMTd8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
  "https://images.unsplash.com/photo-1633098096956-afdc8bcc8552?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkaWdpdGFsJTIwc2NyZWVufGVufDF8fHx8MTc2MzQ0NjY2OXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
  "https://images.unsplash.com/photo-1666875753105-c63a6f3bdc86?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkYXRhJTIwYW5hbHl0aWNzfGVufDF8fHx8MTc2MzQyMTgzMHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
  "https://images.unsplash.com/photo-1462826303086-329426d1aef5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxvZmZpY2UlMjB3b3Jrc3BhY2V8ZW58MXx8fHwxNzYzNDAzMjE1fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
  "https://images.unsplash.com/photo-1757730979491-9bf86e48cba7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaXR5JTIwdXJiYW58ZW58MXx8fHwxNzYzMzI3NDU5fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
  "https://images.unsplash.com/photo-1595411425732-e69c1abe2763?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhYnN0cmFjdCUyMHBhdHRlcm58ZW58MXx8fHwxNzYzNDAzNjEyfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
];

export default function App() {
  const [scrolled, setScrolled] = useState(false);
  const [selectedPost, setSelectedPost] = useState<Post | null>(
    null,
  );
  const [urlInput, setUrlInput] = useState("");
  const [titleInput, setTitleInput] = useState("");
  const [showMyFacts, setShowMyFacts] = useState(false);
  const [showSaved, setShowSaved] = useState(false);
  const [posts, setPosts] = useState<Post[]>(mockPosts);
  const feedRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () =>
      window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToFeed = () => {
    feedRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleUpload = () => {
    if (!urlInput.trim() || !titleInput.trim()) {
      toast.error("URL과 제목을 모두 입력해주세요");
      return;
    }

    // URL 유효성 체크 (간단한 검증)
    try {
      new URL(urlInput);
    } catch {
      toast.error("올바른 URL 형식이 아닙니다");
      return;
    }

    // 소스 타입 판별
    let sourceType: "youtube" | "news" | "article" = "news";
    let sourceName = "news";

    if (
      urlInput.includes("youtube.com") ||
      urlInput.includes("youtu.be")
    ) {
      sourceType = "youtube";
      sourceName = "YouTube";
    } else if (urlInput.includes("chosun.com")) {
      sourceName = "조선일보";
    } else if (urlInput.includes("joongang.co.kr")) {
      sourceName = "중앙일보";
    } else if (urlInput.includes("naver.com")) {
      sourceName = "네이버";
    }

    // 새 포스트 생성
    const newPost: Post = {
      id: Date.now(), // 고유 ID 생성
      username: "나", // 현재 사용자
      userAvatar: "",
      image:
        uploadImages[
          Math.floor(Math.random() * uploadImages.length)
        ],
      caption: titleInput,
      likes: 0,
      comments: [],
      timeAgo: "방금 전",
      category: "일반",
      truthScore: Math.floor(Math.random() * 60) + 20, // 20-80 사이 랜덤 점수 (AI 검증 중)
      sourceType,
      sourceUrl: urlInput,
      sourceName,
    };

    // 피드 맨 위에 추가
    setPosts([newPost, ...posts]);

    // 입력창 초기화
    setUrlInput("");
    setTitleInput("");

    // 성공 메시지
    toast.success("팩트 체크가 등록되었습니다!");

    // 피드로 스크롤
    /*setTimeout(() => {
      scrollToFeed();
    }, 10);*/
  };

  const handleRankingClick = (id: number) => {
    const post = posts.find((p) => p.id === id);
    if (post) {
      setSelectedPost(post);
    }
  };

  const handleSubmitEvidence = (evidence: Omit<Evidence, "id" | "timeAgo">) => {
    if (!selectedPost) return;

    const newEvidence: Evidence = {
      ...evidence,
      id: Date.now(),
      timeAgo: "방금 전",
    };

    // 선택된 포스트의 댓글에 추가
    const updatedPosts = posts.map((post) => {
      if (post.id === selectedPost.id) {
        return {
          ...post,
          comments: [newEvidence, ...post.comments],
        };
      }
      return post;
    });

    setPosts(updatedPosts);

    // selectedPost도 업데이트
    setSelectedPost({
      ...selectedPost,
      comments: [newEvidence, ...selectedPost.comments],
    });
  };

  // Mock data for my facts (user's posted content)
  const myFactsPosts = posts
    .filter((p) => p.username === "나")
    .slice(0, 10)
    .map((post) => ({
      id: post.id,
      caption: post.caption,
      image: post.image,
      truthScore: post.truthScore,
      category: post.category,
      timeAgo: post.timeAgo,
      sourceName: post.sourceName,
    }));

  // Mock data for saved content
  const savedPosts = mockPosts.slice(3, 6).map((post) => ({
    id: post.id,
    caption: post.caption,
    image: post.image,
    truthScore: post.truthScore,
    category: post.category,
    timeAgo: post.timeAgo,
    sourceName: post.sourceName,
  }));

  return (
    <div className="min-h-screen bg-gray-50">
      <Toaster />
      {/* Profile Menu - Fixed Top Right */}
      <div className="fixed top-6 right-6 z-50">
        <ProfileMenu
          onMyFactsClick={() => setShowMyFacts(true)}
          onSavedClick={() => setShowSaved(true)}
        />
      </div>

      {/* Hero Section */}
      <div
        className={`transition-all duration-1000 ${
          // 0위치에서 20위치까지로 조정
          // 스크롤 했을때 멈추는 위치
          scrolled ? "h-35 opacity-0" : "h-screen"
        } flex flex-col items-center justify-center px-4 relative`}
      >
        {/* Logo */}
        <div className="mb-12">
          <h1 className="text-6xl tracking-tight bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Facter
          </h1>
          <p className="text-center text-gray-500 mt-2">
            AI 기반 사실 확인 플랫폼
          </p>
        </div>

        {/* Search Input */}
        <div className="w-full max-w-3xl space-y-4">
          <div className="relative">
            <input
              type="url"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              placeholder="뉴스 링크나 유튜브 URL을 입력하세요"
              className="w-full px-6 py-4 rounded-2xl bg-white/90 backdrop-blur-sm border border-gray-200/50 focus:border-purple-300 focus:outline-none transition-all shadow-sm"
            />
          </div>
          <div className="flex gap-3">
            <input
              type="text"
              value={titleInput}
              onChange={(e) => setTitleInput(e.target.value)}
              placeholder="확인하고 싶은 내용을 간단히 작성해주세요"
              className="flex-1 px-6 py-4 rounded-2xl bg-white/90 backdrop-blur-sm border border-gray-200/50 focus:border-purple-300 focus:outline-none transition-all shadow-sm"
            />
            <button
              onClick={handleUpload}
              className="px-10 py-4 rounded-2xl bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:shadow-md transition-all hover:scale-[1.02]"
            >
              등록
            </button>
          </div>
        </div>

        {/* Scroll Indicator - Only show when not scrolled */}
        {!scrolled && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.6 }}
            className="absolute bottom-12 left-1/2 transform -translate-x-1/2 flex flex-col items-center gap-3 cursor-pointer"
            onClick={scrollToFeed}
          >
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="flex flex-col items-center gap-2"
            >
              <div className="px-6 py-2 bg-white/80 backdrop-blur-md border border-gray-200/60 rounded-full shadow-lg">
                <p className="text-sm font-medium bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  최신 팩트 확인하기
                </p>
              </div>
              <div className="relative">
                <motion.div
                  animate={{ opacity: [0.3, 1, 0.3] }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="w-8 h-12 border-2 border-gray-300 rounded-full flex items-start justify-center pt-2"
                >
                  <motion.div
                    animate={{ y: [0, 12, 0] }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                    className="w-1.5 h-1.5 bg-gradient-to-b from-purple-600 to-pink-600 rounded-full"
                  />
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* Gradient Fade to indicate more content below */}
        {!scrolled && (
          <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-gray-50 to-transparent pointer-events-none" />
        )}
      </div>

      {/* Main Content with Sidebar */}
      <div
        ref={feedRef}
        className="max-w-[1600px] mx-auto px-6 py-12"
      >
        <div className="flex gap-8">
          {/* Main Feed */}
          <div className="flex-1">
            <div className="space-y-6">
              {posts.map((post) => (
                <FeedItem
                  key={post.id}
                  id={post.id}
                  username={post.username}
                  userAvatar={post.userAvatar}
                  image={post.image}
                  caption={post.caption}
                  likes={post.likes}
                  comments={post.comments.length}
                  timeAgo={post.timeAgo}
                  category={post.category}
                  truthScore={post.truthScore}
                  sourceType={post.sourceType}
                  sourceUrl={post.sourceUrl}
                  sourceName={post.sourceName}
                  onClick={() => setSelectedPost(post)}
                />
              ))}
            </div>
          </div>

          {/* Sidebar - Ranking */}
          <aside className="w-80 flex-shrink-0">
            <RankingList
              items={rankingItems}
              onItemClick={handleRankingClick}
            />
          </aside>
        </div>
      </div>

      {/* Modal */}
      <FeedModal
        isOpen={selectedPost !== null}
        onClose={() => setSelectedPost(null)}
        username={selectedPost?.username || ""}
        image={selectedPost?.image || ""}
        caption={selectedPost?.caption || ""}
        likes={selectedPost?.likes || 0}
        comments={selectedPost?.comments || []}
        timeAgo={selectedPost?.timeAgo || ""}
        truthScore={selectedPost?.truthScore || 0}
        sourceType={selectedPost?.sourceType || "news"}
        sourceUrl={selectedPost?.sourceUrl || ""}
        sourceName={selectedPost?.sourceName || ""}
        onSubmitEvidence={handleSubmitEvidence}
      />

      {/* My Facts Sheet */}
      <ContentSheet
        isOpen={showMyFacts}
        onClose={() => setShowMyFacts(false)}
        title="내가 올린 컨텐츠"
        items={myFactsPosts}
        onItemClick={(id) => {
          const post = posts.find((p) => p.id === id);
          if (post) setSelectedPost(post);
        }}
      />

      {/* Saved Content Sheet */}
      <ContentSheet
        isOpen={showSaved}
        onClose={() => setShowSaved(false)}
        title="저장된 컨텐츠"
        items={savedPosts}
        onItemClick={(id) => {
          const post = posts.find((p) => p.id === id);
          if (post) setSelectedPost(post);
        }}
      />
    </div>
  );
}