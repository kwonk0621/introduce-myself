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
  id: string | number;
  time: string;
  endTime: string;
  totalSeats: number;
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
// DATABASE ADAPTER INTERFACE
// ────────────────────────────────────────────────────────────
class DatabaseAdapter {
  
  // 1. Movie operations
  async getMovies(): Promise<any[]> {
    if (supabase) {
      const { data, error } = await supabase.from('movies').select('*');
      if (!error && data && data.length > 0) return data;
    }
    return mockMovies;
  }

  async getMovieById(id: string): Promise<any | null> {
    if (supabase) {
      const { data, error } = await supabase.from('movies').select('*').eq('id', id).single();
      if (!error && data) return data;
    }
    return mockMovies.find(m => m.id === id) || null;
  }

  // 2. Theater operations
  async getTheaters(): Promise<any[]> {
    if (supabase) {
      const { data, error } = await supabase.from('theaters').select('*');
      if (!error && data && data.length > 0) return data;
    }
    return mockTheaters;
  }

  // 3. Schedule & Screen Time slots
  async getSchedules(movieId: string, theaterId: string, date: string): Promise<any[]> {
    if (supabase) {
      // Query schedules with inner tables from Supabase
      const { data, error } = await supabase
        .from('schedules')
        .select(`
          id,
          movie_id,
          theater_id,
          play_date,
          halls(name, screen_type),
          screen_times(id, start_time, end_time, available_seats)
        `)
        .eq('movie_id', movieId)
        .eq('theater_id', theaterId)
        .eq('play_date', date);

      if (!error && data && data.length > 0) {
        return data.map((s: any) => ({
          id: s.id,
          movieId: s.movie_id,
          theaterId: s.theater_id,
          date: s.play_date,
          screenType: s.halls?.screen_type || '2D',
          times: (s.screen_times || []).map((t: any) => ({
            id: t.id,
            time: t.start_time.substring(0, 5),
            endTime: t.end_time.substring(0, 5),
            totalSeats: t.available_seats,
            hallName: s.halls?.name || '일반관'
          }))
        }));
      }
    }

    // Local Mock Generation logic
    return mockSchedules.filter(s => s.movieId === movieId && s.theaterId === theaterId && s.date === date);
  }

  // 4. Seat Reservation Operations
  async getReservedSeats(screenTimeId: string | number): Promise<string[]> {
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
        
        // Combine with default mock reserved seats to make it look active
        const dayIdx = new Date().getDate();
        const baseReserved = ["B3", "B4", "H1", "H2"];
        if (typeof screenTimeId === 'number' || String(screenTimeId).startsWith('sched-')) {
          return Array.from(new Set([...baseReserved, ...matched]));
        }
        return matched;
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

    if (supabase) {
      // Execute the Database RPC function to ensure transaction atomicity
      const { error } = await supabase.rpc('create_booking_transaction', {
        p_booking_id: bookingId,
        p_user_id: userId,
        p_screen_time_id: typeof screenTimeId === 'string' ? parseInt(screenTimeId) : screenTimeId,
        p_total_price: totalPrice,
        p_payment_method: paymentMethod,
        p_seats: seats
      });

      if (error) {
        throw new Error(error.message || '예약 처리 중 동시성 오류가 발생했습니다.');
      }
      return newBooking;
    }

    // Local Storage processing
    if (typeof window !== 'undefined') {
      const bookingsJson = localStorage.getItem('cine_reserve_bookings') || '[]';
      const bookings: Booking[] = JSON.parse(bookingsJson);

      // Check double booking
      const alreadyReserved = bookings
        .filter(b => String(b.screenTimeId) === String(screenTimeId))
        .flatMap(b => b.seats);

      const conflicts = seats.filter(s => alreadyReserved.includes(s));
      if (conflicts.length > 0) {
        throw new Error(`이미 다른 고객님께서 선택하신 좌석(${conflicts.join(', ')})이 포함되어 있습니다.`);
      }

      bookings.push(newBooking);
      localStorage.setItem('cine_reserve_bookings', JSON.stringify(bookings));

      // Dispatch custom event to notify other tabs/components
      window.dispatchEvent(new CustomEvent('cine_reserve_booking_created', {
        detail: { screenTimeId, seats }
      }));
    }

    return newBooking;
  }

  // 6. Read Bookings (MyPage)
  async getBookings(userId: string): Promise<Booking[]> {
    if (supabase) {
      const { data, error } = await supabase
        .from('bookings')
        .select(`
          id,
          total_price,
          payment_method,
          created_at,
          screen_times(
            start_time,
            schedules(
              play_date,
              movies(title, poster_url),
              theaters(name),
              halls(name)
            )
          ),
          booked_seats(seat_id)
        `)
        .eq('user_id', userId);

      if (!error && data) {
        return data.map((b: any) => {
          const screenTime = b.screen_times;
          const schedule = screenTime?.schedules;
          const movie = schedule?.movies;
          const theater = schedule?.theaters;
          const hall = schedule?.halls;

          return {
            id: b.id,
            userId,
            screenTimeId: screenTime?.id || 0,
            movieTitle: movie?.title || '영화 정보 없음',
            posterUrl: movie?.poster_url || '',
            theaterName: theater?.name || '극장 정보 없음',
            hallName: hall?.name || '상영관 정보 없음',
            playDate: schedule?.play_date || '',
            playTime: screenTime?.start_time?.substring(0, 5) || '',
            seats: (b.booked_seats || []).map((s: any) => s.seat_id),
            totalPrice: b.total_price,
            paymentMethod: b.payment_method,
            createdAt: b.created_at
          };
        });
      }
    }

    // Local Storage Mock
    if (typeof window !== 'undefined') {
      const bookingsJson = localStorage.getItem('cine_reserve_bookings') || '[]';
      const bookings: Booking[] = JSON.parse(bookingsJson);
      return bookings.filter(b => b.userId === userId);
    }
    return [];
  }

  // 7. CineTalk chat stream fetch
  async getChats(movieId: string): Promise<ChatMessage[]> {
    if (supabase) {
      const { data, error } = await supabase
        .from('cinetalk_chats')
        .select('*')
        .eq('movie_id', movieId)
        .order('created_at', { ascending: true });

      if (!error && data) {
        return data.map((chat: any) => ({
          id: chat.id,
          username: chat.username,
          text: chat.text,
          time: new Date(chat.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }),
          movieId: chat.movie_id
        }));
      }
    }

    // Local Mock static seeding + storage
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
    
    if (supabase) {
      const { data, error } = await supabase
        .from('cinetalk_chats')
        .insert({
          movie_id: movieId,
          username,
          text
        })
        .select()
        .single();

      if (!error && data) {
        return {
          id: data.id,
          username: data.username,
          text: data.text,
          time: timeStr,
          movieId: data.movie_id
        };
      }
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

      // Trigger realtime mock update
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
