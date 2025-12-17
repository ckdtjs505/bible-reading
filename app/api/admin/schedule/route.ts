
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Schedule from '@/models/Schedule';

export async function GET(request: Request) {
    try {
        await dbConnect();
        const { searchParams } = new URL(request.url);

        // Default to current year or 2025
        const year = searchParams.get('year') || '2025';

        // Fetch data from MongoDB
        const schedules = await Schedule.find({ year }).sort({ index: 1 }).lean();

        return NextResponse.json(schedules);

    } catch (error) {
        console.error('Error reading schedule:', error);
        return NextResponse.json([], { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        await dbConnect();
        const body = await request.json();
        const { year, data } = body;

        if (!year || !/^\d{4}$/.test(year)) {
            return NextResponse.json({ success: false, message: 'Invalid or missing year' }, { status: 400 });
        }

        // Bulk write validation
        if (!Array.isArray(data)) {
            return NextResponse.json({ success: false, message: 'Invalid data format' }, { status: 400 });
        }

        // Transaction or just Delete-Insert strategy? 
        // For simplicity and since we are saving the "whole" year's plan from the UI:
        // 1. Delete all for that year
        // 2. Insert all new data
        // This mirrors the file overwrite behavior.

        // Start session is ideal but for simple app, sequential await is fine.
        await Schedule.deleteMany({ year });

        // Add year to each item just in case
        const docs = data.map((item: any) => ({
            ...item,
            year
        }));

        await Schedule.insertMany(docs);

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Failed to save plan:', error);
        return NextResponse.json(
            { success: false, message: 'Failed to save plan' },
            { status: 500 }
        );
    }
}
