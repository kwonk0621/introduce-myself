import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');

  if (!userId) {
    return NextResponse.json({ error: 'Missing userId parameter' }, { status: 400 });
  }

  try {
    if (!prisma) {
      return NextResponse.json([]); // Client will fall back to local storage history
    }

    const bookings = await prisma.booking.findMany({
      where: {
        userId: userId.includes('guest') ? undefined : userId // guest user accounts aren't uuids
      },
      include: {
        screenTime: {
          include: {
            schedule: {
              include: {
                movie: true,
                theater: true,
                hall: true
              }
            }
          }
        },
        bookedSeats: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    const mapped = bookings.map(b => ({
      id: b.id,
      userId: b.userId || 'guest',
      screenTimeId: b.screenTimeId,
      movieTitle: b.screenTime.schedule.movie.title,
      posterUrl: b.screenTime.schedule.movie.posterUrl,
      theaterName: b.screenTime.schedule.theater.name,
      hallName: b.screenTime.schedule.hall.name,
      playDate: b.screenTime.schedule.playDate.toISOString().split('T')[0],
      playTime: b.screenTime.startTime,
      seats: b.bookedSeats.map(s => s.seatId),
      totalPrice: b.totalPrice,
      paymentMethod: b.paymentMethod,
      createdAt: b.createdAt.toISOString()
    }));

    return NextResponse.json(mapped);
  } catch (err: any) {
    console.error("API Bookings fetch error:", err);
    return NextResponse.json({ error: err.message || 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      userId,
      screenTimeId,
      movieTitle,
      posterUrl,
      theaterName,
      hallName,
      playDate,
      playTime,
      seats,
      totalPrice,
      paymentMethod
    } = body;

    if (!userId || !screenTimeId || seats.length === 0) {
      return NextResponse.json({ error: 'Invalid parameters' }, { status: 400 });
    }

    if (!prisma) {
      return NextResponse.json({ mock: true }); // Client will handle fallback
    }

    const bookingId = 'BK-' + Math.floor(10000000 + Math.random() * 90000000);
    const parsedScreenTimeId = typeof screenTimeId === 'string' ? parseInt(screenTimeId) : screenTimeId;

    // Use Prisma transaction to ensure atomicity
    const booking = await prisma.$transaction(async (tx) => {
      // 1. Verify seat availability
      const existingSeats = await tx.bookedSeat.findMany({
        where: {
          seatId: { in: seats },
          booking: {
            screenTimeId: parsedScreenTimeId
          }
        }
      });

      if (existingSeats.length > 0) {
        const conflicted = existingSeats.map(s => s.seatId);
        throw new Error(`이미 다른 고객님께서 선택하신 좌석(${conflicted.join(', ')})이 포함되어 있습니다.`);
      }

      // 2. Create booking record
      const newBooking = await tx.booking.create({
        data: {
          id: bookingId,
          userId: userId.includes('guest') ? null : userId, // UUID check
          screenTimeId: parsedScreenTimeId,
          totalPrice,
          paymentMethod
        }
      });

      // 3. Create seat mappings
      await Promise.all(
        seats.map((seatId: string) =>
          tx.bookedSeat.create({
            data: {
              bookingId,
              seatId
            }
          })
        )
      );

      return newBooking;
    });

    return NextResponse.json({
      id: booking.id,
      createdAt: booking.createdAt.toISOString()
    });
  } catch (err: any) {
    console.error("API Booking transaction error:", err);
    return NextResponse.json({ error: err.message || 'Internal server error' }, { status: 500 });
  }
}
