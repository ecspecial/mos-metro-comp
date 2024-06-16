import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/app/lib/prisma';
import { getToken } from "next-auth/jwt";
import bcrypt from 'bcryptjs';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
    try {
        const token = await getToken({ req: request });
        if (!token) {
            return NextResponse.json({ message: 'You are not authorized to make this request' }, { status: 401 });
        }

        console.log("User Role:", token.role);

        if (token.role !== 'администратор' && token.role !== 'специалист' && token.role !== 'ЦИО') {
            return NextResponse.json({ message: 'You are not authorized to create a user' }, { status: 403 });
        }

        const body = await request.json();
        const { login, password, role } = body;

        if (!login || !password || !role) {
            return NextResponse.json({ message: 'Login, password, and role are required' }, { status: 400 });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await prisma.user.create({
            data: {
                login,
                password: hashedPassword,
                role,
                createdAt: new Date().toISOString(),
            },
        });

        return NextResponse.json(newUser, { status: 201 });
    } catch (error) {
        console.error('Error creating user:', error);

        let errorMessage = 'An error occurred';
        if (error instanceof Error) {
            errorMessage = error.message;
        } else if (typeof error === 'object' && error !== null && 'message' in error) {
            errorMessage = (error as { message: string }).message;
        }

        return NextResponse.json({ message: 'Error creating user', error: errorMessage }, { status: 500 });
    }
}