import { NextRequest, NextResponse } from 'next/server';
import { findAndDecodePath } from '@/app/lib/utility/pathFinder';

export async function POST(request: NextRequest) {
    try {
        const { start, end } = await request.json();
        const result = await findAndDecodePath(start, end);
        return NextResponse.json({ message: 'Path found successfully', result }, { status: 200 });
    } catch (error) {
        console.error('Error finding path:', error);
        return NextResponse.json({ message: 'Error finding path', error: (error as Error).message }, { status: 500 });
    }
}