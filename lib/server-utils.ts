
import dbConnect from '@/lib/db';
import Schedule from '@/models/Schedule';

export const getCurrentDaycount = async (): Promise<number> => {
    // Use KST (UTC+9)
    const now = new Date();
    const utc = now.getTime() + (now.getTimezoneOffset() * 60000);
    const kstGap = 9 * 60 * 60 * 1000;
    const today = new Date(utc + kstGap);

    const formattedDate = `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`;

    await dbConnect();
    const currentPlan = await Schedule.findOne({ date: formattedDate });

    return currentPlan ? Number(currentPlan.daycount) : -1;
};
