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

        console.log("new Date()", new Date())
        const body = await request.json();
        const { id, passengerId, datetime, startTime, endTime, category, status, registrationTime, maleStaffCount, femaleStaffCount, station1Id, station2Id, applicationType, railway, transferStations, pathTime, description, passengerQty, baggage, editingStatus } = body;

        console.log("datetime", datetime)
        const updatedApplication = await prisma.application.update({
            where: { id: parseInt(id) },
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
                description,
                passengerQty,
                baggage,
                editingStatus,
            },
        });

        return NextResponse.json({ message: 'Application updated successfully', application: updatedApplication }, { status: 200 });
    } catch (error) {
        console.error('Error updating application:', error);

        let errorMessage = 'An error occurred';
        if (error instanceof Error) {
            errorMessage = error.message;
        } else if (typeof error === 'object' && error !== null && 'message' in error) {
            errorMessage = (error as { message: string }).message;
        }

        return NextResponse.json({ message: 'Error updating application', error: errorMessage }, { status: 500 });
    }
}