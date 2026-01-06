
import dbConnect from '@/lib/db';
import Schedule from '@/models/Schedule';

export const getCurrentDaycount = async (): Promise<number> => {
    // KST (UTC+9) 사용
    const now = new Date();
    const utc = now.getTime() + (now.getTimezoneOffset() * 60000);
    const kstGap = 9 * 60 * 60 * 1000;
    const today = new Date(utc + kstGap);

    const formattedDate = `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`;

    await dbConnect();
    const currentPlan = await Schedule.findOne({ date: formattedDate });

    return currentPlan ? Number(currentPlan.daycount) : -1;
};

const OPENSHEET = "https://opensheet.elk.sh";
const KEY = "1LrUC8zEKsmAgi7pIeWUIQR8ufOd0F0nGI65ix7UMXr8";
const param = "%ED%95%A8%EC%98%A8%EC%84%B1DB";

export type ReadingStatus = {
    Timestamp: string;
    name: string;
    daycnt: string;
    myMessage: string;
    pray: string;
}[];

export const getHamonDB = async (): Promise<ReadingStatus> => {
    const response = await fetch(`${OPENSHEET}/${KEY}/${param}`, {
        cache: 'no-store', // 항상 최신 데이터 가져오기
        headers: {
            "Content-Type": "text/plain;charset=utf-8",
        },
    });

    if (!response.ok) {
        throw Error("response error");
    }

    return await response.json();
};
