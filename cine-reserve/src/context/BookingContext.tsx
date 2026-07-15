"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Movie, Theater, Schedule, ScreenTime, mockMovies, mockTheaters } from '../data/mockMovies';

export interface Booking {
  id: string;
  movie: Movie;
  theater: Theater;
  schedule: Schedule;
  timeSlot: ScreenTime;
  headcount: { adult: number; youth: number; special: number; senior: number };
  selectedSeats: string[];
  totalPrice: number;
  bookingDate: string;
  paymentMethod: string;
}

export interface User {
  name: string;
  isGuest: boolean;
  id: string;
}

interface BookingContextType {
  user: User | null;
  activeStep: number; // 0: Home, 1: Detail, 2: Schedule Select, 3: Headcount & Seat Select, 4: Payment, 5: Ticket (success)
  selectedMovie: Movie | null;
  selectedTheater: Theater | null;
  selectedDate: string | null;
  selectedSchedule: Schedule | null;
  selectedTimeSlot: ScreenTime | null;
  headcount: { adult: number; youth: number; special: number; senior: number };
  selectedSeats: string[];
  bookingHistory: Booking[];
  searchQuery: string;
  isSearchOpen: boolean;
  
  login: (name: string, isGuest: boolean) => void;
  logout: () => void;
  setSearchQuery: (query: string) => void;
  setIsSearchOpen: (isOpen: boolean) => void;
  
  // Booking flow navigation and selection
  selectMovie: (movie: Movie) => void;
  selectTheaterAndDate: (theater: Theater, date: string) => void;
  selectScheduleTime: (schedule: Schedule, timeSlot: ScreenTime) => void;
  updateHeadcount: (type: 'adult' | 'youth' | 'special' | 'senior', count: number) => void;
  toggleSeat: (seatId: string) => void;
  goToStep: (step: number) => void;
  resetBookingFlow: () => void;
  clearSelectedSeats: () => void;
  
  // Final actions
  completePayment: (paymentMethod: string) => Booking | null;
  cancelBooking: (bookingId: string) => void;
}

const BookingContext = createContext<BookingContextType | undefined>(undefined);

export const BookingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Pre-login as 용감한납득이5754 by default (to mirror CGV screenshot user state)
  const defaultUser = { name: "용감한납득이5754", isGuest: false, id: "user-5754" };
  const [user, setUser] = useState<User | null>(defaultUser);
  const [activeStep, setActiveStep] = useState<number>(0);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [selectedTheater, setSelectedTheater] = useState<Theater | null>(null);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedSchedule, setSelectedSchedule] = useState<Schedule | null>(null);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<ScreenTime | null>(null);
  const [headcount, setHeadcount] = useState<{ adult: number; youth: number; special: number; senior: number }>({
    adult: 2, // default 2 adults
    youth: 0,
    special: 0,
    senior: 0
  });
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const [bookingHistory, setBookingHistory] = useState<Booking[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);

  // Load user and booking history from LocalStorage
  useEffect(() => {
    const storedUser = localStorage.getItem('cgv_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else {
      // Seed default user
      localStorage.setItem('cgv_user', JSON.stringify(defaultUser));
    }
    const storedHistory = localStorage.getItem('cgv_bookings');
    if (storedHistory) {
      setBookingHistory(JSON.parse(storedHistory));
    }
  }, []);

  const login = (name: string, isGuest: boolean) => {
    const newUser = {
      name,
      isGuest,
      id: isGuest ? `guest-${Math.floor(1000 + Math.random() * 9000)}` : `user-${Math.floor(1000 + Math.random() * 9000)}`
    };
    setUser(newUser);
    localStorage.setItem('cgv_user', JSON.stringify(newUser));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('cgv_user');
  };

  const getLocalDateString = (d: Date = new Date()) => {
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const selectMovie = (movie: Movie) => {
    setSelectedMovie(movie);
    // Set default values (e.g. Theater = 건대입구)
    setSelectedTheater(mockTheaters[0]);
    // Set default date (today, local timezone)
    setSelectedDate(getLocalDateString());
    
    setSelectedSchedule(null);
    setSelectedTimeSlot(null);
    setSelectedSeats([]);
    setHeadcount({ adult: 2, youth: 0, special: 0, senior: 0 });
    setActiveStep(2); // Go to Schedule screen
  };

  const selectTheaterAndDate = (theater: Theater, date: string) => {
    setSelectedTheater(theater);
    setSelectedDate(date);
    setSelectedSchedule(null);
    setSelectedTimeSlot(null);
    setSelectedSeats([]);
  };

  const selectScheduleTime = (schedule: Schedule, timeSlot: ScreenTime) => {
    setSelectedSchedule(schedule);
    setSelectedTimeSlot(timeSlot);
    setSelectedSeats([]);
    setActiveStep(3); // Go to Headcount/Seat map
  };

  const updateHeadcount = (type: 'adult' | 'youth' | 'special' | 'senior', count: number) => {
    setHeadcount(prev => {
      const next = { ...prev, [type]: count };
      const total = next.adult + next.youth + next.special + next.senior;
      if (selectedSeats.length > total) {
        setSelectedSeats(selectedSeats.slice(0, total));
      }
      return next;
    });
  };

  const toggleSeat = (seatId: string) => {
    const totalHeadcount = headcount.adult + headcount.youth + headcount.special + headcount.senior;
    if (totalHeadcount <= 0) return;

    setSelectedSeats(prev => {
      if (prev.includes(seatId)) {
        return prev.filter(s => s !== seatId);
      } else {
        if (prev.length >= totalHeadcount) {
          // shift out the oldest
          return [...prev.slice(1), seatId];
        }
        return [...prev, seatId];
      }
    });
  };

  const goToStep = (step: number) => {
    setActiveStep(step);
  };

  const resetBookingFlow = () => {
    setSelectedMovie(null);
    setSelectedTheater(null);
    setSelectedDate(null);
    setSelectedSchedule(null);
    setSelectedTimeSlot(null);
    setHeadcount({ adult: 2, youth: 0, special: 0, senior: 0 });
    setSelectedSeats([]);
    setActiveStep(0);
  };

  const clearSelectedSeats = () => {
    setSelectedSeats([]);
  };

  const completePayment = (paymentMethod: string): Booking | null => {
    if (!selectedMovie || !selectedTheater || !selectedSchedule || !selectedTimeSlot || selectedSeats.length === 0) {
      return null;
    }

    // CGV Price: 10,000 KRW per adult, 8,000 per youth, 7,000 special, 6,000 senior
    const totalPrice = headcount.adult * 10000 + 
                        headcount.youth * 8000 + 
                        headcount.special * 7000 + 
                        headcount.senior * 6000;

    const newBooking: Booking = {
      id: `cgv-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
      movie: selectedMovie,
      theater: selectedTheater,
      schedule: selectedSchedule,
      timeSlot: selectedTimeSlot,
      headcount,
      selectedSeats,
      totalPrice,
      bookingDate: new Date().toISOString(),
      paymentMethod
    };

    const updatedHistory = [newBooking, ...bookingHistory];
    setBookingHistory(updatedHistory);
    localStorage.setItem('cgv_bookings', JSON.stringify(updatedHistory));
    
    setActiveStep(5); // Go to ticket view (success)
    return newBooking;
  };

  const cancelBooking = (bookingId: string) => {
    const updatedHistory = bookingHistory.filter(b => b.id !== bookingId);
    setBookingHistory(updatedHistory);
    localStorage.setItem('cgv_bookings', JSON.stringify(updatedHistory));
  };

  return (
    <BookingContext.Provider
      value={{
        user,
        activeStep,
        selectedMovie,
        selectedTheater,
        selectedDate,
        selectedSchedule,
        selectedTimeSlot,
        headcount,
        selectedSeats,
        bookingHistory,
        searchQuery,
        isSearchOpen,
        login,
        logout,
        setSearchQuery,
        setIsSearchOpen,
        selectMovie,
        selectTheaterAndDate,
        selectScheduleTime,
        updateHeadcount,
        toggleSeat,
        goToStep,
        resetBookingFlow,
        clearSelectedSeats,
        completePayment,
        cancelBooking
      }}
    >
      {children}
    </BookingContext.Provider>
  );
};

export const useBooking = () => {
  const context = useContext(BookingContext);
  if (context === undefined) {
    throw new Error('useBooking must be used within a BookingProvider');
  }
  return context;
};
