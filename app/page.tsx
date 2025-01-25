import Calender from "@/components/Calendar";
import PlayerJournal from "@/components/PrayerJournal";
import ScrollButton from "@/components/ScrollUpButton";
import SummeryImg from "@/components/summeryImg";
import Verses from "@/components/Verses";
import { YoutubeVideo } from "@/components/YoutubeVideo";

export default function Home() {
  return (
    <>
      <div id="title" className="text-center text-3xl mt-4 font-bold">
        함 온 성
      </div>
      <Calender></Calender>

      <YoutubeVideo />

      <SummeryImg />

      <Verses />

      <PlayerJournal />

      <ScrollButton />
    </>
  );
}
