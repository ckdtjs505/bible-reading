
import { Suspense } from 'react';
import ScheduleContent from './content';

export const dynamic = 'force-dynamic';

export default function SchedulePage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <ScheduleContent />
        </Suspense>
    );
}
