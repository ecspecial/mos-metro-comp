import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/app/lib/prisma';
import { getToken } from "next-auth/jwt";

export const dynamic = 'force-dynamic';

export async function DELETE(request: NextRequest) {
    try {
        const token = await getToken({ req: request });
        if (!token) {
            return NextResponse.json({ message: 'You are not authorized to make this request' }, { status: 401 });
        }

        const body = await request.json();
        let { id } = body;
        id = parseInt(id);

        if (!id) {
            return NextResponse.json({ message: 'Cancellation ID is required' }, { status: 400 });
        }

        const existingCancellation = await prisma.cancellation.findUnique({
            where: { id },
        });

        if (!existingCancellation) {
            return NextResponse.json({ message: 'Cancellation not found' }, { status: 404 });
        }

        await prisma.cancellation.delete({
            where: { id },
        });

        return NextResponse.json({ message: 'Cancellation deleted successfully' }, { status: 200 });
    } catch (error) {
        console.error('Error deleting Cancellation:', error);

        let errorMessage = 'An error occurred';
        if (error instanceof Error) {
            errorMessage = error.message;
        } else if (typeof error === 'object' && error !== null && 'message' in error) {
            errorMessage = (error as { message: string }).message;
        }

        return NextResponse.json({ message: 'Error deleting Cancellation', error: errorMessage }, { status: 500 });
    }
}