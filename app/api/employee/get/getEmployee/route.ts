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
            return NextResponse.json({ message: 'Employee ID is required' }, { status: 400 });
        }

        const employee = await prisma.employee.findUnique({
            where: { id },
            include: {
                user: true,
            },
        });

        if (!employee) {
            return NextResponse.json({ message: 'Employee not found' }, { status: 404 });
        }

        return NextResponse.json(employee, { status: 200 });
    } catch (error) {
        console.error('Error retrieving employee:', error);

        let errorMessage = 'An error occurred';
        if (error instanceof Error) {
            errorMessage = error.message;
        } else if (typeof error === 'object' && error !== null && 'message' in error) {
            errorMessage = (error as { message: string }).message;
        }

        return NextResponse.json({ message: 'Error retrieving employee', error: errorMessage }, { status: 500 });
    }
}