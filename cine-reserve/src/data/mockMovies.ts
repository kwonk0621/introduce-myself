export interface Movie {
  id: string;
  title: string;
  englishTitle: string;
  genre: string[];
  runtime: number; // in minutes
  rating: number; // e.g., 4.8
  releaseDate: string;
  director: string;
  cast: string[];
  synopsis: string;
  posterUrl: string;
  bannerUrl?: string;
  status: 'now-showing' | 'upcoming';
  ageLimit: 12 | 15 | 19 | 0; // 0 is All
  reservationRate: number; // e.g., 41.8
}

export interface Theater {
  id: string;
  name: string;
  location: string;
}

export interface ScreenTime {
  time: string;
  endTime: string;
  totalSeats: number;
  reservedSeats: string[]; // e.g., ["L1", "L2"]
  hallName: string; // e.g. "5관" or "2관"
}

export interface Schedule {
  id: string;
  movieId: string;
  theaterId: string;
  date: string; // YYYY-MM-DD
  screenType: '2D' | 'IMAX' | '4DX' | 'SCREENX' | 'DOLBY';
  times: ScreenTime[];
}

export const mockMovies: Movie[] = [
  {
    id: "hope",
    title: "호프",
    englishTitle: "HOPE",
    genre: ["SF", "스릴러", "액션"],
    runtime: 156, // 2시간 36분
    rating: 4.8,
    releaseDate: "2026-07-15",
    director: "나홍진",
    cast: ["황정민", "조인성", "정호연", "데인 드한", "알리시아 비칸데르", "마이클 패스벤더"],
    synopsis: "고립된 항구마을 호포구에서 외계인으로 의심되는 정체불명의 존재가 발견되면서 벌어지는 SF 스릴러 액션 블록버스터. 마을을 집어삼키는 혼돈과 사투를 그린 나홍진 감독의 초대형 신작.",
    posterUrl: "/images/hope.jpg",
    bannerUrl: "/images/hope.jpg",
    status: "now-showing",
    ageLimit: 15,
    reservationRate: 41.8
  },
  {
    id: "inception",
    title: "인셉션",
    englishTitle: "Inception",
    genre: ["액션", "SF", "스릴러"],
    runtime: 147,
    rating: 4.7,
    releaseDate: "2010-07-21",
    director: "크리스토퍼 놀란",
    cast: ["레오나르도 디카프리오", "와타나베 켄", "조셉 고든 레빗", "마리옹 꼬띠아르"],
    synopsis: "타인의 꿈속에 침투해 생각을 훔치는 특수 보안팀의 리더 코브가 은퇴와 가족 품으로의 귀환을 대가로, 생각을 훔치는 것이 아닌 생각을 심는 거대한 음모 '인셉션' 작전을 수행하는 지적인 SF 스릴러.",
    posterUrl: "/images/inception.jpg",
    status: "now-showing",
    ageLimit: 15,
    reservationRate: 15.4
  },
  {
    id: "dune-2",
    title: "듄: 파트 2",
    englishTitle: "Dune: Part Two",
    genre: ["액션", "모험", "SF"],
    runtime: 166,
    rating: 4.9,
    releaseDate: "2024-02-28",
    director: "드니 빌뇌브",
    cast: ["티모시 샬라메", "젠데이아", "레베카 페르구손", "오스틴 버틀러"],
    synopsis: "자신의 가문을 파멸시킨 이들에 대한 복수를 위한 여정에서 우주의 운명을 결정할 선택의 기로에 서게 된 폴 아트레이데스가 아라키스 행성에서 운명적인 전쟁을 준비하는 서사적 액션 블록버스터.",
    posterUrl: "/images/dune.jpg",
    bannerUrl: "/images/dune-banner.jpg",
    status: "now-showing",
    ageLimit: 12,
    reservationRate: 18.2
  },
  {
    id: "interstellar",
    title: "인터스텔라",
    englishTitle: "Interstellar",
    genre: ["SF", "드라마", "모험"],
    runtime: 169,
    rating: 4.8,
    releaseDate: "2014-11-06",
    director: "크리스토퍼 놀란",
    cast: ["매тую 맥커너히", "앤 해서웨이", "마이클 케인", "제시카 차스테인"],
    synopsis: "세계 각국의 정부와 경제가 완전히 붕괴된 미래, 인류의 멸망을 막기 위해 시공간의 틈을 찾아 우주로 떠나는 탐사대의 모험과 가족간의 사랑을 그린 감동적인 SF 대작.",
    posterUrl: "/images/interstellar.jpg",
    status: "now-showing",
    ageLimit: 0, // All
    reservationRate: 8.7
  },
  {
    id: "ratatouille",
    title: "라따뚜이",
    englishTitle: "Ratatouille",
    genre: ["애니메이션", "코미디", "가족"],
    runtime: 111,
    rating: 4.8,
    releaseDate: "2007-07-25",
    director: "브래드 버드",
    cast: ["패튼 오스왈트", "루 로마노", "이안 홈"],
    synopsis: "절대미각을 지닌 생쥐 레미와 재능 없는 요리사 링귀니가 파리 최고급 레스토랑에서 비밀리에 파트너십을 맺어 진정한 셰프를 꿈꾸는 감동적인 애니메이션.",
    posterUrl: "/images/ratatouille.jpg",
    status: "now-showing",
    ageLimit: 0,
    reservationRate: 5.3
  },
  {
    id: "chef",
    title: "아메리칸 셰프",
    englishTitle: "Chef",
    genre: ["코미디", "드라마"],
    runtime: 114,
    rating: 4.7,
    releaseDate: "2015-01-07",
    director: "존 파브로",
    cast: ["존 파브로", "엠제이 안소니", "소피아 베르가라", "스칼렛 요한슨"],
    synopsis: "유명 레스토랑의 헤드 셰프 칼 캐스퍼가 평론가와의 불화로 직장을 잃고, 아들과 함께 푸드트럭을 타고 미국 전역을 여행하며 요리의 열정과 가족의 사랑을 되찾는 맛있는 여정.",
    posterUrl: "/images/chef.jpg",
    status: "now-showing",
    ageLimit: 15,
    reservationRate: 4.2
  },
  {
    id: "callme",
    title: "콜미바이유어네임",
    englishTitle: "Call Me by Your Name",
    genre: ["로맨스", "드라마"],
    runtime: 132,
    rating: 4.8,
    releaseDate: "2018-03-22",
    director: "루카 구아다니노",
    cast: ["티모시 샬라메", "아미 해머", "마이클 스툴바그"],
    synopsis: "1983년 이탈리아의 찬란한 햇살이 내리쬐는 시골 별장에서 펼쳐지는 17세 소년 엘리오와 아버지의 연구 보조로 찾아온 24세 청년 올리버의 잊지 못할 첫사랑의 기록.",
    posterUrl: "/images/callme.jpg",
    status: "now-showing",
    ageLimit: 19,
    reservationRate: 3.1
  },
  {
    id: "moodforlove",
    title: "화양연화",
    englishTitle: "In the Mood for Love",
    genre: ["로맨스", "드라마"],
    runtime: 99,
    rating: 4.9,
    releaseDate: "2000-10-20",
    director: "왕가위",
    cast: ["양조위", "장만옥"],
    synopsis: "1962년 홍콩, 같은 날 같은 아파트로 이사 오며 이웃이 된 두 남녀 차우와 리첸이 각자의 배우자가 외도를 벌인다는 슬픈 비밀을 공유하며 서로에게 깊이 빠져드는 애틋한 로맨스 명작.",
    posterUrl: "/images/moodforlove.jpg",
    status: "now-showing",
    ageLimit: 15,
    reservationRate: 2.8
  },
  {
    id: "oppenheimer",
    title: "오펜하이머",
    englishTitle: "Oppenheimer",
    genre: ["전기", "드라마", "역사"],
    runtime: 180,
    rating: 4.6,
    releaseDate: "2023-08-15",
    director: "크리스토퍼 놀란",
    cast: ["킬리언 머피", "에밀리 블런트", "맷 데이먼", "로버트 다우니 주니어"],
    synopsis: "세상을 구하기 위해 세상을 파괴할 위험을 감수해야 하는 천재 물리학자 J. 로버트 오펜하이머의 핵개발 프로젝트 '맨해튼 계획'의 숨겨진 비화와 고뇌를 다룬 대서사극.",
    posterUrl: "/images/oppenheimer.jpg",
    status: "upcoming",
    ageLimit: 15,
    reservationRate: 0
  },
  {
    id: "ring-quest",
    title: "반지의 퀘스트",
    englishTitle: "The Ring Quest",
    genre: ["판타지", "모험", "액션"],
    runtime: 178,
    rating: 4.8,
    releaseDate: "2026-12-18",
    director: "피터 잭슨",
    cast: ["일라이저 우드", "이안 맥켈런", "비고 모텐슨", "올랜도 블룸"],
    synopsis: "어둠의 군주 사우론이 세상을 지배하기 위해 만든 절대반지를 파괴하기 위한 절대 운명을 짊어진 호빗 프로도와 반지원정대의 장엄한 대장정을 그린 최고의 판타지 서사시.",
    posterUrl: "/images/fantasy.jpg",
    status: "upcoming",
    ageLimit: 12,
    reservationRate: 0
  },
  {
    id: "toystory-5",
    title: "토이 스토리 5",
    englishTitle: "Toy Story 5",
    genre: ["애니메이션", "모험", "코미디"],
    runtime: 105,
    rating: 4.7,
    releaseDate: "2026-06-19",
    director: "앤드류 스탠튼",
    cast: ["톰 행크스", "팀 알렌"],
    synopsis: "어느새 스크린과 디지털 기기가 지배하게 된 새로운 놀이 문화 속에서, 우디와 버즈, 그리고 토이 친구들이 어린이의 사랑을 지키고 장난감으로서의 가치를 증명하기 위해 떠나는 새로운 여정.",
    posterUrl: "/images/toystory.jpg",
    status: "upcoming",
    ageLimit: 0,
    reservationRate: 0
  }
];

export const mockTheaters: Theater[] = [
  { id: "th-kundae", name: "건대입구", location: "서울 광진구" },
  { id: "th-yongsan", name: "용산아이파크몰", location: "서울 용산구" },
  { id: "th-hongdae", name: "홍대", location: "서울 마포구" }
];

// Generate schedules dynamically for next 3 days
const generateSchedules = (): Schedule[] => {
  const schedules: Schedule[] = [];
  const dates: string[] = [];
  
  for (let i = 0; i < 3; i++) {
    const d = new Date();
    d.setDate(d.getDate() + i);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const dateStr = `${year}-${month}-${day}`;
    dates.push(dateStr);
  }

  // Predefined times from screenshots
  const screenTimesHope = [
    { time: "10:30", endTime: "13:16", totalSeats: 183, reserved: ["L10", "L11", "M5", "M6", "K8"], hallName: "5관" },
    { time: "13:40", endTime: "16:26", totalSeats: 183, reserved: ["B10", "B11", "C5", "C6"], hallName: "5관" },
    { time: "14:30", endTime: "17:16", totalSeats: 153, reserved: ["E4", "E5", "F6"], hallName: "2관" },
    { time: "16:10", endTime: "18:56", totalSeats: 140, reserved: ["D1", "D2", "D3"], hallName: "1관" },
    { time: "16:50", endTime: "19:36", totalSeats: 183, reserved: ["I3", "I4", "I5"], hallName: "5관" },
    { time: "17:40", endTime: "20:26", totalSeats: 153, reserved: ["J1", "J2", "J3"], hallName: "2관" },
    { time: "19:20", endTime: "22:06", totalSeats: 140, reserved: ["K6", "K7"], hallName: "1관" },
    { time: "20:00", endTime: "22:46", totalSeats: 183, reserved: ["L10", "L11"], hallName: "5관" },
    { time: "20:40", endTime: "23:26", totalSeats: 127, reserved: ["N5", "N6"], hallName: "4관" }
  ];

  let scheduleId = 1;

  mockMovies.forEach(movie => {
    if (movie.status === 'now-showing') {
      mockTheaters.forEach(theater => {
        dates.forEach(date => {
          const dayIdx = dates.indexOf(date);
          const theaterOffset = theater.id === 'th-konda' ? 0 : (theater.id === 'th-yongsan' ? 15 : 30);
          
          // dynamic minute shift based on date index & theater to ensure non-identical daily schedules
          const offsetMinutes = (dayIdx * 20 + theaterOffset) % 60;

          const shiftTime = (timeStr: string, offsetMins: number) => {
            const [h, m] = timeStr.split(':').map(Number);
            let totalM = m + offsetMins;
            let newH = h;
            if (totalM >= 60) {
              newH = (h + Math.floor(totalM / 60)) % 24;
              totalM = totalM % 60;
            }
            return `${String(newH).padStart(2, '0')}:${String(totalM).padStart(2, '0')}`;
          };

          // 1. Add standard 2D schedule
          schedules.push({
            id: `sched-${scheduleId++}`,
            movieId: movie.id,
            theaterId: theater.id,
            date,
            screenType: '2D',
            times: screenTimesHope.map(t => {
              const startTime = shiftTime(t.time, offsetMinutes);
              const endTime = shiftTime(t.endTime, offsetMinutes);
              const reservedSeats = t.reserved.map(seat => {
                const row = seat[0];
                const num = parseInt(seat.substring(1));
                const offset = (num + (movie.id === 'hope' ? 0 : 2) + dayIdx) % 13 || 1;
                return `${row}${offset}`;
              });
              return {
                time: startTime,
                endTime: endTime,
                totalSeats: t.totalSeats,
                hallName: t.hallName,
                reservedSeats
              };
            })
          });

          // 2. Add special IMAX schedule (for blockbusters like Hope and Dune 2)
          if (movie.id === 'hope' || movie.id === 'dune-2') {
            schedules.push({
              id: `sched-${scheduleId++}`,
              movieId: movie.id,
              theaterId: theater.id,
              date,
              screenType: 'IMAX',
              times: [
                { time: "11:00", endTime: "13:46", totalSeats: 250, reservedSeats: ["H10", "H11"], hallName: "IMAX관" },
                { time: "14:00", endTime: "16:46", totalSeats: 250, reservedSeats: ["G5", "G6"], hallName: "IMAX관" },
                { time: "17:00", endTime: "19:46", totalSeats: 250, reservedSeats: ["J12"], hallName: "IMAX관" }
              ].map(t => ({
                ...t,
                time: shiftTime(t.time, offsetMinutes),
                endTime: shiftTime(t.endTime, offsetMinutes),
                reservedSeats: t.reservedSeats.map(seat => {
                  const row = seat[0];
                  const num = parseInt(seat.substring(1));
                  const offset = (num + dayIdx * 3) % 13 || 1;
                  return `${row}${offset}`;
                })
              }))
            });

            // 3. Add 4DX schedule
            schedules.push({
              id: `sched-${scheduleId++}`,
              movieId: movie.id,
              theaterId: theater.id,
              date,
              screenType: '4DX',
              times: [
                { time: "12:00", endTime: "14:46", totalSeats: 160, reservedSeats: ["F1", "F2"], hallName: "4DX 3D관" },
                { time: "15:20", endTime: "18:06", totalSeats: 160, reservedSeats: ["L10"], hallName: "4DX 3D관" },
                { time: "18:30", endTime: "21:16", totalSeats: 160, reservedSeats: ["E3", "E4"], hallName: "4DX 2D관" }
              ].map(t => ({
                ...t,
                time: shiftTime(t.time, offsetMinutes),
                endTime: shiftTime(t.endTime, offsetMinutes),
                reservedSeats: t.reservedSeats.map(seat => {
                  const row = seat[0];
                  const num = parseInt(seat.substring(1));
                  const offset = (num + dayIdx * 4) % 13 || 1;
                  return `${row}${offset}`;
                })
              }))
            });

            // 4. Add SCREENX schedule
            schedules.push({
              id: `sched-${scheduleId++}`,
              movieId: movie.id,
              theaterId: theater.id,
              date,
              screenType: 'SCREENX',
              times: [
                { time: "13:00", endTime: "15:46", totalSeats: 220, reservedSeats: ["K5"], hallName: "ScreenX관" },
                { time: "16:30", endTime: "19:16", totalSeats: 220, reservedSeats: ["H8", "H9"], hallName: "ScreenX관" },
                { time: "19:40", endTime: "22:26", totalSeats: 220, reservedSeats: ["L12"], hallName: "ScreenX관" }
              ].map(t => ({
                ...t,
                time: shiftTime(t.time, offsetMinutes),
                endTime: shiftTime(t.endTime, offsetMinutes),
                reservedSeats: t.reservedSeats.map(seat => {
                  const row = seat[0];
                  const num = parseInt(seat.substring(1));
                  const offset = (num + dayIdx * 2) % 13 || 1;
                  return `${row}${offset}`;
                })
              }))
            });

            // 5. Add DOLBY schedule
            schedules.push({
              id: `sched-${scheduleId++}`,
              movieId: movie.id,
              theaterId: theater.id,
              date,
              screenType: 'DOLBY',
              times: [
                { time: "10:00", endTime: "12:46", totalSeats: 200, reservedSeats: ["G7"], hallName: "Dolby관" },
                { time: "15:40", endTime: "18:26", totalSeats: 200, reservedSeats: ["A5"], hallName: "Dolby관" },
                { time: "20:50", endTime: "23:36", totalSeats: 200, reservedSeats: ["J6", "J7"], hallName: "Dolby관" }
              ].map(t => ({
                ...t,
                time: shiftTime(t.time, offsetMinutes),
                endTime: shiftTime(t.endTime, offsetMinutes),
                reservedSeats: t.reservedSeats.map(seat => {
                  const row = seat[0];
                  const num = parseInt(seat.substring(1));
                  const offset = (num + dayIdx * 5) % 13 || 1;
                  return `${row}${offset}`;
                })
              }))
            });
          }
        });
      });
    }
  });

  return schedules;
};

export const mockSchedules = generateSchedules();
