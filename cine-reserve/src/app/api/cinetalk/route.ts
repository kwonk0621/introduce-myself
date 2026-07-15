import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const movieId = searchParams.get('movieId');

  if (!movieId) {
    return NextResponse.json({ error: 'Missing movieId parameter' }, { status: 400 });
  }

  try {
    if (!prisma) {
      return NextResponse.json({ mock: true }); // Client fallback
    }

    const chats = await prisma.cineTalkChat.findMany({
      where: { movieId },
      orderBy: { createdAt: 'asc' }
    });

    const mapped = chats.map((c: any) => ({
      id: c.id,
      username: c.username,
      text: c.text,
      time: c.createdAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }),
      movieId: c.movieId
    }));

    return NextResponse.json(mapped);
  } catch (err: any) {
    console.error("API CineTalk fetch error:", err);
    return NextResponse.json({ error: err.message || 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { movieId, username, text } = body;

    if (!movieId || !username || !text) {
      return NextResponse.json({ error: 'Invalid parameters' }, { status: 400 });
    }

    if (!prisma) {
      return NextResponse.json({ mock: true }); // Client fallback
    }

    const newChat = await prisma.cineTalkChat.create({
      data: {
        movieId,
        username,
        text
      }
    });

    return NextResponse.json({
      id: newChat.id,
      username: newChat.username,
      text: newChat.text,
      time: newChat.createdAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }),
      movieId: newChat.movieId
    });
  } catch (err: any) {
    console.error("API CineTalk save error:", err);
    return NextResponse.json({ error: err.message || 'Internal server error' }, { status: 500 });
  }
}
