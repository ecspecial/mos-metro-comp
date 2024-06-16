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
        let { userId } = body;
        userId = parseInt(userId);

        if (!userId) {
            return NextResponse.json({ message: 'User ID is required' }, { status: 400 });
        }

        const userAssignments = await prisma.applicationAssignment.findMany({
            where: {
                employee: {
                    userId: parseInt(userId)
                }
            },
            include: {
                application: true, // Include related application data
                employee: true, // Include related employee data
            }
        });

        return NextResponse.json({ assignments: userAssignments }, { status: 200 });
    } catch (error) {
        console.error('Error fetching user assignments:', error);

        let errorMessage = 'An error occurred';
        if (error instanceof Error) {
            errorMessage = error.message;
        } else if (typeof error === 'object' && error !== null && 'message' in error) {
            errorMessage = (error as { message: string }).message;
        }

        return NextResponse.json({ message: 'Error fetching user assignments', error: errorMessage }, { status: 500 });
    }
}