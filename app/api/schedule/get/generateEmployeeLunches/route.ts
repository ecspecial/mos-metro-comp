import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/app/lib/prisma';

export const dynamic = 'force-dynamic';

// Function to get current date in Moscow time as a string
const getCurrentISODateInMoscow = () => {
  const now = new Date(); // Current date and time in UTC
  const moscowOffset = 3 * 60 * 60000; // Moscow is UTC+3
  const moscowTime = new Date(now.getTime() + moscowOffset);
  return moscowTime.toISOString(); // Return as ISO string
};

// Helper function to calculate a precisely 1-hour lunch break within allowed hours
const calculateLunchBreak = (shift: string): string => {
  console.log('shift', shift)
  const [start, end] = shift.split('-');
  const [startHour, startMinute] = start.split(':').map(Number);
  let [endHour, endMinute] = end.split(':').map(Number);

  // Adjust endHour for night shifts that end after midnight
  if (endHour <= startHour) {
    endHour += 24;
  }

  const minLunchStartHour = startHour + 3.5; // lunch not earlier than 3.5 hours into the shift
  const maxLunchStartHour = endHour - 2; // lunch must end at least 1 hour before shift ends

  let lunchStartHour = Math.floor(Math.random() * (maxLunchStartHour - minLunchStartHour) + minLunchStartHour);
  let lunchStartMinute = Math.floor(Math.random() * 60);

  // Ensure the lunch ends within the shift
  let lunchEndHour = lunchStartHour + 1;
  let lunchEndMinute = lunchStartMinute;

  // Format for displaying time, handling crossing over to next day
  lunchStartHour = lunchStartHour % 24;
  lunchEndHour = lunchEndHour % 24;

  const formattedLunchStartHour = String(lunchStartHour).padStart(2, '0');
  const formattedLunchEndHour = String(lunchEndHour).padStart(2, '0');
  const formattedLunchStartMinute = String(lunchStartMinute).padStart(2, '0');
  const formattedLunchEndMinute = String(lunchEndMinute).padStart(2, '0');

  return `${formattedLunchStartHour}:${formattedLunchStartMinute}-${formattedLunchEndHour}:${formattedLunchEndMinute}`;
};

export async function GET(request: NextRequest) {
  try {
    const employees = await prisma.employee.findMany();

    const updates = employees.map(async (employee) => {
      const shift = employee.timeWork;
      if (!shift) {
        console.error(`No shift defined for employee ID: ${employee.id}`);
        return;
      }

      const lunchBreak = calculateLunchBreak(shift);

      await prisma.employee.update({
        where: { id: employee.id },
        data: { lunchBreak },
      });

      console.log(`Updated lunch break for employee ID: ${employee.id}, work time: ${shift}, new lunch break: ${lunchBreak}`);
    });

    await Promise.all(updates);

    return NextResponse.json({ message: 'Employee lunch breaks updated successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error updating employee lunch breaks:', error);
    return NextResponse.json({ message: 'Error updating employee lunch breaks', error: (error as Error).message }, { status: 500 });
  }
}