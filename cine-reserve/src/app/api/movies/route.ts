import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { mockMovies } from '@/data/mockMovies';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const movieId = searchParams.get('id');

  try {
    if (!prisma) {
      // Fallback to mock data if DB is offline
      if (movieId) {
        const movie = mockMovies.find(m => m.id === movieId);
        return NextResponse.json(movie || { error: 'Movie not found' }, { status: movie ? 200 : 404 });
      }
      return NextResponse.json(mockMovies);
    }

    if (movieId) {
      const movie = await prisma.movie.findUnique({
        where: { id: movieId }
      });
      return NextResponse.json(movie || { error: 'Movie not found' }, { status: movie ? 200 : 404 });
    }

    const movies = await prisma.movie.findMany();
    if (movies.length === 0) {
      // Seed initial movies if tables are empty for developer convenience
      await Promise.all(
        mockMovies.map(async (m) => {
          await prisma!.movie.create({
            data: {
              id: m.id,
              title: m.title,
              englishTitle: m.englishTitle,
              director: m.director,
              cast: m.cast,
              genre: m.genre,
              runtime: m.runtime,
              releaseDate: new Date(m.releaseDate),
              synopsis: m.synopsis,
              posterUrl: m.posterUrl,
              bannerUrl: m.bannerUrl,
              status: m.status,
              ageLimit: m.ageLimit,
              rating: m.rating
            }
          });
        })
      );
      return NextResponse.json(mockMovies);
    }

    return NextResponse.json(movies);
  } catch (err: any) {
    console.error("API Movie error:", err);
    return NextResponse.json({ error: err.message || 'Internal server error' }, { status: 500 });
  }
}
