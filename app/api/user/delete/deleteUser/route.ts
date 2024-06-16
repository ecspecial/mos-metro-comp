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
        let { userId } = body;
        let id = parseInt(userId);

        if (!id) {
            return NextResponse.json({ message: 'User ID is required' }, { status: 400 });
        }

        const existingUser = await prisma.user.findUnique({
            where: { id },
            include: { employee: true }
        });

        if (!existingUser) {
            return NextResponse.json({ message: 'User not found' }, { status: 404 });
        }

        // First, delete related employee and assignments if they exist
        if (existingUser.employee) {
            await prisma.applicationAssignment.deleteMany({
                where: { employeeId: existingUser.employee.id }
            });
            await prisma.employee.delete({
                where: { id: existingUser.employee.id }
            });
        }

        // Now, delete the user
        await prisma.user.delete({
            where: { id },
        });

        return NextResponse.json({ message: 'User deleted successfully' }, { status: 200 });
    } catch (error) {
        console.error('Error deleting user:', error);

        let errorMessage = 'An error occurred';
        if (error instanceof Error) {
            errorMessage = error.message;
        } else if (typeof error === 'object' && error !== null && 'message' in error) {
            errorMessage = (error as { message: string }).message;
        }

        return NextResponse.json({ message: 'Error deleting user', error: errorMessage }, { status: 500 });
    }
}