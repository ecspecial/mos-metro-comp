import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/app/lib/prisma';
import { getToken } from "next-auth/jwt";

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
    try {
        const token = await getToken({ req: request });
        if (!token) {
            return NextResponse.json({ message: 'You are not authorized to make this request' }, { status: 401 });
        }

        const body = await request.json();
        let { passengerId } = body;
        passengerId = parseInt(passengerId);

        if (!passengerId) {
            return NextResponse.json({ message: 'Passenger ID is required' }, { status: 400 });
        }

        const passenger = await prisma.passenger.findUnique({
            where: { id: passengerId },
        });

        if (!passenger) {
            return NextResponse.json({ message: 'Passenger not found' }, { status: 404 });
        }

        return NextResponse.json(passenger, { status: 200 });
    } catch (error) {
        console.error('Error retrieving passenger:', error);

        let errorMessage = 'An error occurred';
        if (error instanceof Error) {
            errorMessage = error.message;
        } else if (typeof error === 'object' && error !== null && 'message' in error) {
            errorMessage = (error as { message: string }).message;
        }

        return NextResponse.json({ message: 'Error retrieving passenger', error: errorMessage }, { status: 500 });
    }
}