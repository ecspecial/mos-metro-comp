import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/app/lib/prisma';
import { getToken } from "next-auth/jwt";

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
    try {
        const token = await getToken({ req: request });
        if (!token) {
            return NextResponse.json({ message: 'You are not authorized to make this request' }, { status: 401 });
        }

        const requestChanges = await prisma.requestChange.findMany({
            include: {
                request: true,
            },
        });

        return NextResponse.json(requestChanges, { status: 200 });
    } catch (error) {
        console.error('Error retrieving RequestChanges:', error);

        let errorMessage = 'An error occurred';
        if (error instanceof Error) {
            errorMessage = error.message;
        } else if (typeof error === 'object' && error !== null && 'message' in error) {
            errorMessage = (error as { message: string }).message;
        }

        return NextResponse.json({ message: 'Error retrieving RequestChanges', error: errorMessage }, { status: 500 });
    }
}