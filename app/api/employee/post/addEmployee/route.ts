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
        const { fullName, shortName, gender, timeWork, shift, workPhone, personalPhone, rankNumber, section, rank, workStatus, extraShift, studyTime, workTimeChange, internship, userId } = body;

        const entryDate = new Date().toISOString();
        const lunchBreak = '13:00-14:00'

        const newEmployee = await prisma.employee.create({
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
            },
        });

        return NextResponse.json({ message: 'Employee created successfully', employee: newEmployee }, { status: 201 });
    } catch (error) {
        console.error('Error creating employee:', error);

        let errorMessage = 'An error occurred';
        if (error instanceof Error) {
            errorMessage = error.message;
        } else if (typeof error === 'object' && error !== null && 'message' in error) {
            errorMessage = (error as { message: string }).message;
        }

        return NextResponse.json({ message: 'Error creating employee', error: errorMessage }, { status: 500 });
    }
}