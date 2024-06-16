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

        if (!id) {
            return NextResponse.json({ message: 'Employee ID is required' }, { status: 400 });
        }

        const employeeId = parseInt(id);

        console.log('employeeId', employeeId)
        
        const existingEmployee = await prisma.employee.findUnique({
            where: { id: employeeId },
            include: {
                assignments: true,
                user: true
            }
        });

        console.log('existingEmployee', existingEmployee)

        if (!existingEmployee) {
            return NextResponse.json({ message: 'Employee not found' }, { status: 404 });
        }

        // First, delete related records
        await prisma.applicationAssignment.deleteMany({
            where: { employeeId }
        });

        if (existingEmployee.userId) {
            await prisma.user.delete({
                where: { id: existingEmployee.userId }
            });
        }

        // Now, delete the employee
        await prisma.employee.delete({
            where: { id: employeeId },
        });

        return NextResponse.json({ message: 'Employee deleted successfully' }, { status: 200 });
    } catch (error) {
        console.error('Error deleting employee:', error);

        let errorMessage = 'An error occurred';
        if (error instanceof Error) {
            errorMessage = error.message;
        } else if (typeof error === 'object' && error !== null && 'message' in error) {
            errorMessage = (error as { message: string }).message;
        }

        return NextResponse.json({ message: 'Error deleting employee', error: errorMessage }, { status: 500 });
    }
}