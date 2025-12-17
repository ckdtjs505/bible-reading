import { ScheduleItem } from "@/type/biblePlan";
import { useQuery } from "@tanstack/react-query";

const fetchSchedules = async (year: string): Promise<ScheduleItem[]> => {
    const res = await fetch(`/api/schedule?year=${year}`);
    if (!res.ok) {
        throw new Error("Failed to fetch schedule");
    }
    return res.json();
};

export const useSchedules = (year: string) => {
    return useQuery({
        queryKey: ["schedules", year],
        queryFn: () => fetchSchedules(year),
        enabled: !!year,
        staleTime: 5 * 60 * 1000, // 5 minutes
        gcTime: 10 * 60 * 1000, // 10 minutes cache
    });
};
