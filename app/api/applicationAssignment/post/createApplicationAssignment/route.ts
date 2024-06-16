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
        const { applicationId, employeeId } = body;

        const newAssignment = await prisma.applicationAssignment.create({
            data: {
                applicationId,
                employeeId,
            },
        });

        return NextResponse.json({ message: 'ApplicationAssignment created successfully', assignment: newAssignment }, { status: 201 });
    } catch (error) {
        console.error('Error creating ApplicationAssignment:', error);

        let errorMessage = 'An error occurred';
        if (error instanceof Error) {
            errorMessage = error.message;
        } else if (typeof error === 'object' && error !== null && 'message' in error) {
            errorMessage = (error as { message: string }).message;
        }

        return NextResponse.json({ message: 'Error creating ApplicationAssignment', error: errorMessage }, { status: 500 });
    }
}