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
        const { requestId, dateTime } = body;

        const newCancellation = await prisma.cancellation.create({
            data: {
                requestId,
                dateTime,
            },
        });

        return NextResponse.json({ message: 'Cancellation created successfully', cancellation: newCancellation }, { status: 201 });
    } catch (error) {
        console.error('Error creating Cancellation:', error);

        let errorMessage = 'An error occurred';
        if (error instanceof Error) {
            errorMessage = error.message;
        } else if (typeof error === 'object' && error !== null && 'message' in error) {
            errorMessage = (error as { message: string }).message;
        }

        return NextResponse.json({ message: 'Error creating Cancellation', error: errorMessage }, { status: 500 });
    }
}