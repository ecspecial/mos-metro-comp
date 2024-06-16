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
        const { id, fullName, phoneNumbers, gender, category, additionalInfo, eks, editingStatus } = body;

        console.log('id, fullName, phoneNumbers, gender, category, additionalInfo, eks, editingStatus', id, fullName, phoneNumbers, gender, category, additionalInfo, eks, editingStatus)
        const existingPassenger = await prisma.passenger.findUnique({
            where: { id: parseInt(id) },
        });

        if (!existingPassenger) {
            return NextResponse.json({ message: 'Passenger not found' }, { status: 404 });
        }

        const updatedPassenger = await prisma.passenger.update({
            where: { id: parseInt(id) },
            data: {
                fullName,
                phoneNumbers,
                gender,
                category,
                additionalInfo,
                eks,
                editingStatus,
            },
        });

        return NextResponse.json({ message: 'Passenger updated successfully', passenger: updatedPassenger }, { status: 200 });
    } catch (error) {
        console.error('Error updating passenger:', error);

        let errorMessage = 'An error occurred';
        if (error instanceof Error) {
            errorMessage = error.message;
        } else if (typeof error === 'object' && error !== null && 'message' in error) {
            errorMessage = (error as { message: string }).message;
        }

        return NextResponse.json({ message: 'Error updating passenger', error: errorMessage }, { status: 500 });
    }
}