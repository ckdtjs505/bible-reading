
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Schedule from '@/models/Schedule';

export async function GET(request: Request) {
    try {
        await dbConnect();
        const { searchParams } = new URL(request.url);
        const date = searchParams.get('date');
        const year = searchParams.get('year');
        const daycount = searchParams.get('daycount');

        let query: any = {};

        if (date) {
            query.date = date;
        }
        if (year) {
            query.year = year;
        }
        if (daycount) {
            query.daycount = daycount;
        }

        // Sort by year and index
        const schedules = await Schedule.find(query).sort({ year: 1, index: 1 }).lean();

        return NextResponse.json(schedules);

    } catch (error) {
        console.error('Error fetching schedule:', error);
        return NextResponse.json({ error: 'Failed to fetch schedule' }, { status: 500 });
    }
}
