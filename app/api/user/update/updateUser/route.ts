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

        console.log("User Role:", token.role);

        if (token.role !== 'администратор') {
            return NextResponse.json({ message: 'You are not authorized to update a user' }, { status: 403 });
        }

        const body = await request.json();
        const { userId, login, password, role, employeeData } = body;

        if (!userId) {
            return NextResponse.json({ message: 'User ID is required' }, { status: 400 });
        }

        const existingUser = await prisma.user.findUnique({
            where: { id: parseInt(userId) },
            include: {
                employee: true,
            },
        });

        if (!existingUser) {
            return NextResponse.json({ message: 'User not found' }, { status: 404 });
        }

        const updateData: any = {};
        if (login) updateData.login = login;
        if (password) updateData.password = password;
        if (role) updateData.role = role;

        const updatedUser = await prisma.user.update({
            where: { id: parseInt(userId) },
            data: updateData,
        });

        if (employeeData && existingUser.employee) {
            await prisma.employee.update({
                where: { id: existingUser.employee.id },
                data: employeeData,
            });
        }

        return NextResponse.json({ message: 'User updated successfully', user: updatedUser }, { status: 200 });
    } catch (error) {
        console.error('Error updating user:', error);

        let errorMessage = 'An error occurred';
        if (error instanceof Error) {
            errorMessage = error.message;
        } else if (typeof error === 'object' && error !== null && 'message' in error) {
            errorMessage = (error as { message: string }).message;
        }

        return NextResponse.json({ message: 'Error updating user', error: errorMessage }, { status: 500 });
    }
}