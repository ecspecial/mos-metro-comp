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
        const { id, fullName, shortName, gender, lunchBreak, timeWork, shift, workPhone, personalPhone, rankNumber, entryDate, section, rank, workStatus, extraShift, studyTime, workTimeChange, internship, userId, editingStatus } = body;

        const existingEmployee = await prisma.employee.findUnique({
            where: { id: parseInt(id) },
        });

        if (!existingEmployee) {
            return NextResponse.json({ message: 'Employee not found' }, { status: 404 });
        }

        const updatedEmployee = await prisma.employee.update({
            where: { id: parseInt(id) },
            data: {
                fullName,
                shortName,
                gender,
                lunchBreak,
                timeWork,
                shift,
                workPhone,
                personalPhone,
                rankNumber,
                entryDate,
                section,
                rank,
                workStatus,
                extraShift,
                studyTime,
                workTimeChange,
                internship,
                userId,
                editingStatus,
            },
        });

        return NextResponse.json({ message: 'Employee updated successfully', employee: updatedEmployee }, { status: 200 });
    } catch (error) {
        console.error('Error updating employee:', error);

        let errorMessage = 'An error occurred';
        if (error instanceof Error) {
            errorMessage = error.message;
        } else if (typeof error === 'object' && error !== null && 'message' in error) {
            errorMessage = (error as { message: string }).message;
        }

        return NextResponse.json({ message: 'Error updating employee', error: errorMessage }, { status: 500 });
    }
}