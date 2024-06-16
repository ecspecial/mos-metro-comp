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
        let { passengerId } = body;
        passengerId = parseInt(passengerId);


        if (!passengerId) {
            return NextResponse.json({ message: 'Passenger ID is required' }, { status: 400 });
        }

        const existingPassenger = await prisma.passenger.findUnique({
            where: { id: passengerId },
            include: {
                applications: true
            }
        });

        if (!existingPassenger) {
            return NextResponse.json({ message: 'Passenger not found' }, { status: 404 });
        }

        // First, delete related records
        await prisma.application.deleteMany({
            where: { passengerId }
        });

        // Now, delete the passenger
        await prisma.passenger.delete({
            where: { id: passengerId },
        });

        return NextResponse.json({ message: 'Passenger deleted successfully' }, { status: 200 });
    } catch (error) {
        console.error('Error deleting passenger:', error);

        let errorMessage = 'An error occurred';
        if (error instanceof Error) {
            errorMessage = error.message;
        } else if (typeof error === 'object' && error !== null && 'message' in error) {
            errorMessage = (error as { message: string }).message;
        }

        return NextResponse.json({ message: 'Error deleting passenger', error: errorMessage }, { status: 500 });
    }
}