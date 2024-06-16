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
        const { fullName, phoneNumbers, gender, category, additionalInfo, eks } = body;

        let createdAt = new Date().toISOString();

        console.log('fullName, phoneNumbers, gender, category, additionalInfo, createdAt, eks', fullName, phoneNumbers, gender, category, additionalInfo, createdAt, eks);
        const newPassenger = await prisma.passenger.create({
            data: {
                fullName,
                phoneNumbers,
                gender,
                category,
                additionalInfo,
                createdAt,
                eks,
            },
        });

        return NextResponse.json({ message: 'Passenger created successfully', passenger: newPassenger }, { status: 201 });
    } catch (error) {
        console.error('Error creating passenger:', error);

        let errorMessage = 'An error occurred';
        if (error instanceof Error) {
            errorMessage = error.message;
        } else if (typeof error === 'object' && error !== null && 'message' in error) {
            errorMessage = (error as { message: string }).message;
        }

        return NextResponse.json({ message: 'Error creating passenger', error: errorMessage }, { status: 500 });
    }
}