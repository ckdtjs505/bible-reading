
import mongoose, { Schema, Document } from 'mongoose';

export interface ISchedule extends Document {
    year: string;
    index: string;
    daycount: string;
    date: string;
    lang: string;
    book: string;
    start: string;
    end: string;
    img: string;
    videoId: string;
}

const ScheduleSchema = new Schema<ISchedule>(
    {
        year: { type: String, required: true, index: true },
        index: { type: String, required: true },
        daycount: { type: String, required: true },
        date: { type: String, required: true, index: true },
        lang: { type: String, default: 'kor' },
        book: { type: String, required: true },
        start: { type: String, default: '' },
        end: { type: String, default: '' },
        img: { type: String, default: '' },
        videoId: { type: String, default: '' },
    },
    {
        timestamps: true,
    }
);

// Prevent overwriting the model if it already compiles
const Schedule = mongoose.models.Schedule || mongoose.model<ISchedule>('Schedule', ScheduleSchema);

export default Schedule;
