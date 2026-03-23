import { NextResponse } from "next/server";
import { getHamonDB } from "@/lib/server-utils";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userName = searchParams.get("userName");

    if (!userName) {
      return NextResponse.json(
        { error: "userName 파라미터가 필요합니다." },
        { status: 400 }
      );
    }

    const db = await getHamonDB();
    
    // 유저의 이름과 일치하는 데이터만 가져옴
    // myMessage가 존재하는 항목만 추출
    const userWords = db
      .filter((entry) => entry.name === userName && entry.myMessage)
      .map((entry) => ({
        daycnt: entry.daycnt,
        Timestamp: entry.Timestamp,
        myMessage: entry.myMessage,
      }))
      // daycnt 기준으로 내림차순 정렬 (최신순)
      .sort((a, b) => Number(b.daycnt) - Number(a.daycnt));

    return NextResponse.json({ success: true, data: userWords });
  } catch (error) {
    console.error("Failed to fetch my words:", error);
    return NextResponse.json(
      { error: "데이터를 불러오는 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
