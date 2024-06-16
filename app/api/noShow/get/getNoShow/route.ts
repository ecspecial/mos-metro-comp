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
            return NextResponse.json({ message: 'NoShow ID is required' }, { status: 400 });
        }

        const noShow = await prisma.noShow.findUnique({
            where: { id },
        });

        if (!noShow) {
            return NextResponse.json({ message: 'NoShow not found' }, { status: 404 });
        }

        return NextResponse.json(noShow, { status: 200 });
    } catch (error) {
        console.error('Error retrieving NoShow:', error);

        let errorMessage = 'An error occurred';
        if (error instanceof Error) {
            errorMessage = error.message;
        } else if (typeof error === 'object' && error !== null && 'message' in error) {
            errorMessage = (error as { message: string }).message;
        }

        return NextResponse.json({ message: 'Error retrieving NoShow', error: errorMessage }, { status: 500 });
    }
}