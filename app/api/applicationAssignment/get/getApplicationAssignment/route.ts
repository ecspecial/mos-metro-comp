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
        let { id } = body;
        id = parseInt(id);

        if (!id) {
            return NextResponse.json({ message: 'ApplicationAssignment ID is required' }, { status: 400 });
        }

        const assignment = await prisma.applicationAssignment.findUnique({
            where: { id },
            include: {
                application: true,
                employee: true,
            },
        });

        if (!assignment) {
            return NextResponse.json({ message: 'ApplicationAssignment not found' }, { status: 404 });
        }

        return NextResponse.json(assignment, { status: 200 });
    } catch (error) {
        console.error('Error retrieving ApplicationAssignment:', error);

        let errorMessage = 'An error occurred';
        if (error instanceof Error) {
            errorMessage = error.message;
        } else if (typeof error === 'object' && error !== null && 'message' in error) {
            errorMessage = (error as { message: string }).message;
        }

        return NextResponse.json({ message: 'Error retrieving ApplicationAssignment', error: errorMessage }, { status: 500 });
    }
}