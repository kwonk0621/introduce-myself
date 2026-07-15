import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { mockSchedules } from '@/data/mockMovies';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const movieId = searchParams.get('movieId');
  const theaterId = searchParams.get('theaterId');
  const date = searchParams.get('date');

  if (!movieId || !theaterId || !date) {
    return NextResponse.json({ error: 'Missing query parameters' }, { status: 400 });
  }

  try {
    if (!prisma) {
      // Fallback
      const filtered = mockSchedules.filter(s => s.movieId === movieId && s.theaterId === theaterId && s.date === date);
      return NextResponse.json(filtered);
    }

    // Query from Prisma PostgreSQL
    const schedules = await prisma.schedule.findMany({
      where: {
        movieId,
        theaterId,
        playDate: new Date(date)
      },
      include: {
        hall: true,
        screenTimes: true
      }
    });

    // Map Prisma models to Client interfaces
    const mapped = schedules.map(s => ({
      id: s.id,
      movieId: s.movieId,
      theaterId: s.theaterId,
      date: s.playDate.toISOString().split('T')[0],
      screenType: s.hall.screenType,
      times: s.screenTimes.map(t => ({
        id: t.id,
        time: t.startTime,
        endTime: t.endTime,
        totalSeats: t.availableSeats,
        hallName: s.hall.name
      }))
    }));

    return NextResponse.json(mapped);
  } catch (err: any) {
    console.error("API Schedules error:", err);
    return NextResponse.json({ error: err.message || 'Internal server error' }, { status: 500 });
  }
}
