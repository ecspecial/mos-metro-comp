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

        console.log("User Role:", token.role);

        const body = await request.json();
        const { date } = body;

        // Ensure the date is valid
        if (!date) {
            return NextResponse.json({ message: 'Invalid date provided' }, { status: 400 });
        }

        const startOfDay = new Date(date);
        startOfDay.setUTCHours(0, 0, 0, 0);

        const endOfDay = new Date(date);
        endOfDay.setUTCHours(23, 59, 59, 999);

        const applications = await prisma.application.findMany({
            where: {
                datetime: {
                    gte: startOfDay.toISOString(),
                    lt: endOfDay.toISOString(),
                },
            },
            include: {
                station1: true,
                station2: true,
                passenger: true,
            },
        });

        return NextResponse.json(applications, { status: 200 });
    } catch (error) {
        console.error('Error retrieving applications:', error);

        let errorMessage = 'An error occurred';
        if (error instanceof Error) {
            errorMessage = error.message;
        } else if (typeof error === 'object' && error !== null && 'message' in error) {
            errorMessage = (error as { message: string }).message;
        }

        return NextResponse.json({ message: 'Error retrieving applications', error: errorMessage }, { status: 500 });
    }
}