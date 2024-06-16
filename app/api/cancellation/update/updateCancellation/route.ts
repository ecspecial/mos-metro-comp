import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/app/lib/prisma';
import { getToken } from "next-auth/jwt";

export const dynamic = 'force-dynamic';

export async function PUT(request: NextRequest) {
    try {
        const token = await getToken({ req: request });
        if (!token) {
            return NextResponse.json({ message: 'You are not authorized to make this request' }, { status: 401 });
        }

        const body = await request.json();
        const { id, requestId, dateTime } = body;

        const updatedCancellation = await prisma.cancellation.update({
            where: { id: parseInt(id) },
            data: {
                requestId,
                dateTime,
            },
        });

        return NextResponse.json({ message: 'Cancellation updated successfully', cancellation: updatedCancellation }, { status: 200 });
    } catch (error) {
        console.error('Error updating Cancellation:', error);

        let errorMessage = 'An error occurred';
        if (error instanceof Error) {
            errorMessage = error.message;
        } else if (typeof error === 'object' && error !== null && 'message' in error) {
            errorMessage = (error as { message: string }).message;
        }

        return NextResponse.json({ message: 'Error updating Cancellation', error: errorMessage }, { status: 500 });
    }
}