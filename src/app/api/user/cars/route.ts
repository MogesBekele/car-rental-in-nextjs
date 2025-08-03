import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Car from '@/models/Car';

export async function GET() {
  await connectDB();

  try {
    const cars = await Car.find({ isAvailable: true });
    return NextResponse.json({ success: true, cars });
  } catch (error) {
    console.error('Error fetching cars:', error);
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 });
  }
}
