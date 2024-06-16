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
        let { id } = body;
        id = parseInt(id);

        if (!id) {
            return NextResponse.json({ message: 'RequestChange ID is required' }, { status: 400 });
        }

        const requestChange = await prisma.requestChange.findUnique({
            where: { id },
            include: {
                request: true,
            },
        });

        if (!requestChange) {
            return NextResponse.json({ message: 'RequestChange not found' }, { status: 404 });
        }

        return NextResponse.json(requestChange, { status: 200 });
    } catch (error) {
        console.error('Error retrieving RequestChange:', error);

        let errorMessage = 'An error occurred';
        if (error instanceof Error) {
            errorMessage = error.message;
        } else if (typeof error === 'object' && error !== null && 'message' in error) {
            errorMessage = (error as { message: string }).message;
        }

        return NextResponse.json({ message: 'Error retrieving RequestChange', error: errorMessage }, { status: 500 });
    }
}