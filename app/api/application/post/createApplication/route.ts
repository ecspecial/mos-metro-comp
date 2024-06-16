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
        const { passengerId, datetime, startTime, endTime, category, status, maleStaffCount, femaleStaffCount, station1Id, station2Id, applicationType, railway, transferStations, pathTime, pathString, description, passengerQty, baggage, editingStatus } = body;

        let registrationTime = new Date().toISOString();

        const newApplication = await prisma.application.create({
            data: {
                passengerId,
                datetime,
                startTime,
                endTime,
                category,
                status,
                registrationTime,
                maleStaffCount,
                femaleStaffCount,
                station1Id,
                station2Id,
                applicationType,
                railway,
                transferStations,
                pathTime,
                pathString,
                description,
                passengerQty,
                baggage,
                editingStatus,
            },
        });

        return NextResponse.json({ message: 'Application created successfully', application: newApplication }, { status: 201 });
    } catch (error) {
        console.error('Error creating application:', error);

        let errorMessage = 'An error occurred';
        if (error instanceof Error) {
            errorMessage = error.message;
        } else if (typeof error === 'object' && error !== null && 'message' in error) {
            errorMessage = (error as { message: string }).message;
        }

        return NextResponse.json({ message: 'Error creating application', error: errorMessage }, { status: 500 });
    }
}