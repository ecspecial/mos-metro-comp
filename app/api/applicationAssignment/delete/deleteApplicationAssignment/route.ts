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
        let { id } = body;
        id = parseInt(id);

        if (!id) {
            return NextResponse.json({ message: 'ApplicationAssignment ID is required' }, { status: 400 });
        }

        const existingAssignment = await prisma.applicationAssignment.findUnique({
            where: { id },
        });

        if (!existingAssignment) {
            return NextResponse.json({ message: 'ApplicationAssignment not found' }, { status: 404 });
        }

        await prisma.applicationAssignment.delete({
            where: { id },
        });

        return NextResponse.json({ message: 'ApplicationAssignment deleted successfully' }, { status: 200 });
    } catch (error) {
        console.error('Error deleting ApplicationAssignment:', error);

        let errorMessage = 'An error occurred';
        if (error instanceof Error) {
            errorMessage = error.message;
        } else if (typeof error === 'object' && error !== null && 'message' in error) {
            errorMessage = (error as { message: string }).message;
        }

        return NextResponse.json({ message: 'Error deleting ApplicationAssignment', error: errorMessage }, { status: 500 });
    }
}