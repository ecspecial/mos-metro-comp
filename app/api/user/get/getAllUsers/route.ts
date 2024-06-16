import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/app/lib/prisma';
import { getToken } from "next-auth/jwt";

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
    try {
        const token = await getToken({ req: request });
        if (token) {
            // Signed in
            console.log("JSON Web Token", JSON.stringify(token, null, 2));
            console.log("User Role:", token.role);
        } else {
            // Not Signed in
            return NextResponse.json({ message: 'You are not authorized to make this request' }, { status: 401 });
        }

        // Fetch all users from the database
        const users = await prisma.user.findMany({
            include: {
                employee: true, // Include related employee data if needed
            },
        });

        // Return the users as JSON
        return NextResponse.json(users, { status: 200 });
    } catch (error) {
        console.error('Error retrieving users:', error);

        let errorMessage = 'An error occurred';
        if (error instanceof Error) {
            errorMessage = error.message;
        } else if (typeof error === 'object' && error !== null && 'message' in error) {
            errorMessage = (error as { message: string }).message;
        }

        return NextResponse.json({ message: 'Error retrieving users', error: errorMessage }, { status: 500 });
    }
}