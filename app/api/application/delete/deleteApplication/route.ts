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
        let { applicationId } = body;
        let id = parseInt(applicationId);

        if (!id) {
            return NextResponse.json({ message: 'Application ID is required' }, { status: 400 });
        }

        const existingApplication = await prisma.application.findUnique({
            where: { id },
            include: {
                assignments: true,
                cancellations: true,
                changes: true,
                noShows: true
            }
        });

        if (!existingApplication) {
            return NextResponse.json({ message: 'Application not found' }, { status: 404 });
        }

        // First, delete related records
        await prisma.applicationAssignment.deleteMany({
            where: { applicationId: id }
        });

        await prisma.cancellation.deleteMany({
            where: { requestId: id }
        });

        await prisma.requestChange.deleteMany({
            where: { requestId: id }
        });

        await prisma.noShow.deleteMany({
            where: { requestId: id }
        });

        // Now, delete the application
        await prisma.application.delete({
            where: { id },
        });

        return NextResponse.json({ message: 'Application deleted successfully' }, { status: 200 });
    } catch (error) {
        console.error('Error deleting application:', error);

        let errorMessage = 'An error occurred';
        if (error instanceof Error) {
            errorMessage = error.message;
        } else if (typeof error === 'object' && error !== null && 'message' in error) {
            errorMessage = (error as { message: string }).message;
        }

        return NextResponse.json({ message: 'Error deleting application', error: errorMessage }, { status: 500 });
    }
}