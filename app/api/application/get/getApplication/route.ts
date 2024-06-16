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

        console.log("User Role:", token.role);

        const body = await request.json();
        let { applicationId } = body;
        applicationId = parseInt(applicationId);

        const application = await prisma.application.findUnique({
            where: { id: applicationId },
            include: {
                station1: true,
                station2: true,
                passenger: true,
                assignments: {
                    include: {
                      employee: true, // Include the employee details in each assignment
                    },
                  },
            },
        });

        if (!application) {
            return NextResponse.json({ message: 'Application not found' }, { status: 404 });
        }

        return NextResponse.json(application, { status: 200 });
    } catch (error) {
        console.error('Error retrieving application:', error);

        let errorMessage = 'An error occurred';
        if (error instanceof Error) {
            errorMessage = error.message;
        } else if (typeof error === 'object' && error !== null && 'message' in error) {
            errorMessage = (error as { message: string }).message;
        }

        return NextResponse.json({ message: 'Error retrieving application', error: errorMessage }, { status: 500 });
    }
}