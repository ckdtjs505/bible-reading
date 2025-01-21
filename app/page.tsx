import Calender from "@/client/components/ClientCalender";
import { getBiblePlan } from "@/app/api/api";

export default async function Home() {
  const { data } = await getBiblePlan();
  return (
    <>
      <div id="title" className="text-center text-2xl mt-4">
        함 온 성
      </div>
      <Calender planInfo={data}></Calender>
      <br />
    </>
  );
}
