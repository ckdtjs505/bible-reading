import Calendar from "@/components/Calendar";
import LoginDialog from "@/components/LoginDialog";
import PrayerJournal from "@/components/PrayerJournal";
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
      <Calendar></Calendar>

      <YoutubeVideo />

      <SummeryImg />

      <Verses />

      <PrayerJournal />

      <LoginDialog />

      <ScrollButton />
    </>
  );
}
