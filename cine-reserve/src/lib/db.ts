import { createClient } from '@supabase/supabase-js';
import { mockMovies, mockTheaters, mockSchedules } from '../data/mockMovies';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Check if real Supabase configuration is available
const isSupabaseConfigured = !!(supabaseUrl && supabaseAnonKey && supabaseUrl !== 'your-supabase-url-here');

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl!, supabaseAnonKey!)
  : null;

if (!isSupabaseConfigured) {
  console.warn("⚠️ Supabase credentials not found or placeholder used. Running movie booking in Local Mock mode (offline storage).");
}

// ────────────────────────────────────────────────────────────
// TYPE DEFINITIONS matching DB schema
// ────────────────────────────────────────────────────────────
export interface Movie {
  id: string;
  title: string;
  english_title?: string;
  director?: string;
  cast?: string[];
  genre: string[];
  runtime: number;
  release_date: string;
  synopsis?: string;
  poster_url: string;
  banner_url?: string;
  status: 'now-showing' | 'upcoming';
  age_limit: number;
  rating: number;
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
  reservedSeats: string[];
  hallName: string;
}

export interface Schedule {
  id: string | number;
  movieId: string;
  theaterId: string;
  date: string;
  screenType: string;
  times: ScreenTime[];
}

export interface Booking {
  id: string;
  userId: string;
  screenTimeId: string | number;
  movieTitle: string;
  posterUrl: string;
  theaterName: string;
  hallName: string;
  playDate: string;
  playTime: string;
  seats: string[];
  totalPrice: number;
  paymentMethod: string;
  createdAt: string;
}

export interface ChatMessage {
  id: string;
  username: string;
  text: string;
  time: string;
  movieId: string;
}

// ────────────────────────────────────────────────────────────
// DATABASE ADAPTER IMPLEMENTATION (Prisma API fetch + Supabase Realtime)
// ────────────────────────────────────────────────────────────
class DatabaseAdapter {
  
  // 1. Movie operations
  async getMovies(): Promise<any[]> {
    try {
      const res = await fetch('/api/movies');
      if (res.ok) {
        const data = await res.json();
        if (data && !data.error) return data;
      }
    } catch (err) {
      console.warn("API movies fetch failed. Falling back to mock data.", err);
    }
    return mockMovies;
  }

  async getMovieById(id: string): Promise<any | null> {
    try {
      const res = await fetch(`/api/movies?id=${id}`);
      if (res.ok) {
        const data = await res.json();
        if (data && !data.error) return data;
      }
    } catch (err) {
      console.warn("API movie fetch failed. Falling back to mock data.", err);
    }
    return mockMovies.find(m => m.id === id) || null;
  }

  // 2. Theater operations
  async getTheaters(): Promise<any[]> {
    return mockTheaters;
  }

  // 3. Schedule & Screen Time slots
  async getSchedules(movieId: string, theaterId: string, date: string): Promise<any[]> {
    try {
      const res = await fetch(`/api/schedules?movieId=${movieId}&theaterId=${theaterId}&date=${date}`);
      if (res.ok) {
        const data = await res.json();
        if (data && !data.error && !data.mock) return data;
      }
    } catch (err) {
      console.warn("API schedules fetch failed. Falling back to mock data.", err);
    }
    return mockSchedules.filter(s => s.movieId === movieId && s.theaterId === theaterId && s.date === date);
  }

  // 4. Seat Reservation Operations
  async getReservedSeats(screenTimeId: string | number): Promise<string[]> {
    // If Supabase is active in client, fetch from Supabase for real-time
    if (supabase) {
      const { data, error } = await supabase
        .from('booked_seats')
        .select('seat_id, bookings!inner(screen_time_id)')
        .eq('bookings.screen_time_id', screenTimeId);

      if (!error && data) {
        return data.map((d: any) => d.seat_id);
      }
    }

    // Local Storage Mock fallback
    if (typeof window !== 'undefined') {
      const bookingsJson = localStorage.getItem('cine_reserve_bookings');
      if (bookingsJson) {
        const bookings: Booking[] = JSON.parse(bookingsJson);
        const matched = bookings
          .filter(b => String(b.screenTimeId) === String(screenTimeId))
          .flatMap(b => b.seats);
        
        const baseReserved = ["B3", "B4", "H1", "H2"];
        return Array.from(new Set([...baseReserved, ...matched]));
      }
    }
    return ["B3", "B4", "H1", "H2"];
  }

  // 5. Create new Booking
  async createBooking(
    userId: string,
    screenTimeId: string | number,
    movie: any,
    theater: any,
    schedule: any,
    timeSlot: any,
    seats: string[],
    totalPrice: number,
    paymentMethod: string
  ): Promise<Booking> {
    const bookingId = 'BK-' + Math.floor(10000000 + Math.random() * 90000000);
    const newBooking: Booking = {
      id: bookingId,
      userId,
      screenTimeId,
      movieTitle: movie.title,
      posterUrl: movie.posterUrl,
      theaterName: theater.name,
      hallName: timeSlot.hallName || '1관',
      playDate: schedule.date,
      playTime: timeSlot.time,
      seats,
      totalPrice,
      paymentMethod,
      createdAt: new Date().toISOString()
    };

    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          screenTimeId,
          movieTitle: movie.title,
          posterUrl: movie.posterUrl,
          theaterName: theater.name,
          hallName: timeSlot.hallName,
          playDate: schedule.date,
          playTime: timeSlot.time,
          seats,
          totalPrice,
          paymentMethod
        })
      });

      if (res.ok) {
        const data = await res.json();
        if (data && !data.mock) {
          newBooking.id = data.id;
          newBooking.createdAt = data.createdAt;
          return newBooking;
        }
      } else {
        const errData = await res.json();
        throw new Error(errData.error || '예약 처리 중 오류가 발생했습니다.');
      }
    } catch (err: any) {
      if (err.message && err.message.includes('이미 다른 고객님께서')) {
        throw err;
      }
      console.warn("API booking failed. Falling back to local storage.", err);
    }

    // Local Storage processing
    if (typeof window !== 'undefined') {
      const bookingsJson = localStorage.getItem('cine_reserve_bookings') || '[]';
      const bookings: Booking[] = JSON.parse(bookingsJson);

      const alreadyReserved = bookings
        .filter(b => String(b.screenTimeId) === String(screenTimeId))
        .flatMap(b => b.seats);

      const conflicts = seats.filter(s => alreadyReserved.includes(s));
      if (conflicts.length > 0) {
        throw new Error(`이미 다른 고객님께서 선택하신 좌석(${conflicts.join(', ')})이 포함되어 있습니다.`);
      }

      bookings.push(newBooking);
      localStorage.setItem('cine_reserve_bookings', JSON.stringify(bookings));

      window.dispatchEvent(new CustomEvent('cine_reserve_booking_created', {
        detail: { screenTimeId, seats }
      }));
    }

    return newBooking;
  }

  // 6. Read Bookings (MyPage)
  async getBookings(userId: string): Promise<Booking[]> {
    try {
      const res = await fetch(`/api/bookings?userId=${userId}`);
      if (res.ok) {
        const data = await res.json();
        if (data && !data.error && !data.mock) return data;
      }
    } catch (err) {
      console.warn("API bookings fetch failed. Falling back to local storage.", err);
    }

    if (typeof window !== 'undefined') {
      const bookingsJson = localStorage.getItem('cine_reserve_bookings') || '[]';
      const bookings: Booking[] = JSON.parse(bookingsJson);
      return bookings.filter(b => b.userId === userId);
    }
    return [];
  }

  // 7. CineTalk chat stream fetch
  async getChats(movieId: string): Promise<ChatMessage[]> {
    try {
      const res = await fetch(`/api/cinetalk?movieId=${movieId}`);
      if (res.ok) {
        const data = await res.json();
        if (data && !data.error && !data.mock) return data;
      }
    } catch (err) {
      console.warn("API chats fetch failed. Falling back to local storage.", err);
    }

    if (typeof window !== 'undefined') {
      const chatsJson = localStorage.getItem(`cine_talk_chats_${movieId}`);
      if (chatsJson) {
        return JSON.parse(chatsJson);
      }
      
      const seedChats: Record<string, ChatMessage[]> = {
        hope: [
          { id: "1", username: "무비스타", text: "나홍진 감독의 대작 HOPE 드디어 개봉하네요!", time: "13:40", movieId: "hope" },
          { id: "2", username: "영화귀신", text: "황정민, 조인성 라인업 실화냐... 연기 대결 미쳤다.", time: "13:42", movieId: "hope" },
          { id: "3", username: "CGVVIP", text: "스토리 유출 막으려고 보안 엄청 철저했다던데 엄청 기대중!", time: "13:45", movieId: "hope" },
        ],
        ratatouille: [
          { id: "1", username: "디즈니덕후", text: "인생 최고의 힐링 애니메이션.. 레미 너무 귀여움.", time: "12:10", movieId: "ratatouille" },
          { id: "2", username: "맛있는요리", text: "누구나 요리를 할 수 있다! 라는 메시지가 너무 울림이 커요.", time: "12:15", movieId: "ratatouille" },
        ],
        chef: [
          { id: "1", username: "푸드파이터", text: "이 영화 보면 야식 무조건 시키게 됨 ㅋㅋㅋ 쿠바 샌드위치 먹고싶다.", time: "10:05", movieId: "chef" },
        ],
        "dune-2": [
          { id: "1", username: "SF매니아", text: "듄 파트 2는 극장에서 무조건 봐야함. 사운드 미쳤음.", time: "11:20", movieId: "dune-2" },
        ]
      };
      
      const defaultChats = seedChats[movieId] || [];
      localStorage.setItem(`cine_talk_chats_${movieId}`, JSON.stringify(defaultChats));
      return defaultChats;
    }
    return [];
  }

  // 8. CineTalk chat send
  async sendChat(movieId: string, username: string, text: string): Promise<ChatMessage> {
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
    
    try {
      const res = await fetch('/api/cinetalk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ movieId, username, text })
      });

      if (res.ok) {
        const data = await res.json();
        if (data && !data.mock) return data;
      }
    } catch (err) {
      console.warn("API send chat failed. Falling back to local storage.", err);
    }

    const newChat: ChatMessage = {
      id: Math.random().toString(),
      username,
      text,
      time: timeStr,
      movieId
    };

    if (typeof window !== 'undefined') {
      const chats = await this.getChats(movieId);
      chats.push(newChat);
      localStorage.setItem(`cine_talk_chats_${movieId}`, JSON.stringify(chats));

      window.dispatchEvent(new CustomEvent(`cine_talk_chat_sent_${movieId}`, {
        detail: newChat
      }));
    }

    return newChat;
  }

  // 9. Realtime Subscription helper for seats map
  subscribeSeats(screenTimeId: string | number, onUpdate: (seats: string[]) => void) {
    if (supabase) {
      const channel = supabase
        .channel(`realtime-seats-${screenTimeId}`)
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'booked_seats' },
          async () => {
            const updatedSeats = await this.getReservedSeats(screenTimeId);
            onUpdate(updatedSeats);
          }
        )
        .subscribe();
      
      return () => {
        supabase.removeChannel(channel);
      };
    }

    // Local Storage Mock interval subscription
    if (typeof window !== 'undefined') {
      const handleCustomEvent = async () => {
        const updatedSeats = await this.getReservedSeats(screenTimeId);
        onUpdate(updatedSeats);
      };

      window.addEventListener('cine_reserve_booking_created', handleCustomEvent);

      return () => {
        window.removeEventListener('cine_reserve_booking_created', handleCustomEvent);
      };
    }

    return () => {};
  }

  // 10. Realtime Subscription helper for chats
  subscribeChats(movieId: string, onNewChat: (chat: ChatMessage) => void) {
    if (supabase) {
      const channel = supabase
        .channel(`realtime-chats-${movieId}`)
        .on(
          'postgres_changes',
          { event: 'INSERT', schema: 'public', table: 'cinetalk_chats', filter: `movie_id=eq.${movieId}` },
          (payload) => {
            const chat = payload.new;
            onNewChat({
              id: chat.id,
              username: chat.username,
              text: chat.text,
              time: new Date(chat.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }),
              movieId: chat.movie_id
            });
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }

    // Local Mock listener
    if (typeof window !== 'undefined') {
      const handleCustomChat = (e: Event) => {
        const customEvent = e as CustomEvent<ChatMessage>;
        onNewChat(customEvent.detail);
      };

      window.addEventListener(`cine_talk_chat_sent_${movieId}`, handleCustomChat);

      return () => {
        window.removeEventListener(`cine_talk_chat_sent_${movieId}`, handleCustomChat);
      };
    }

    return () => {};
  }
}

export const db = new DatabaseAdapter();
