import { BiblePlan } from "@/type/biblePlan";
import { NextApiRequest, NextApiResponse } from "next";

const GOOGLE_DOMAIN = "https://script.google.com";
const GOOGLE_KEY = `AKfycbx59b6woS9-hkh8jkk93zrBUOSwbiI6JvBQT0-wdP-zxD_dNFrnL_t5WNvuulvzNtOq`;

export const getBiblePlan = async (): Promise<BiblePlan> => {
  const queryParam = new URLSearchParams({
    type: "admin",
    userName: "오창선",
  });

  return await fetch(
    `${GOOGLE_DOMAIN}/macros/s/${GOOGLE_KEY}/exec?${queryParam}`,
    {
      headers: {
        "content-Type": "text/plain;charset=utf-8",
      },
    },
  )
    .then((response) => {
      const res = response.json();
      return res;
    })
    .catch((e) => {
      console.log(e);
    });
};

export default async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const BiblePlans = await getBiblePlan();
    res.status(200).json(BiblePlans);
  } catch (error) {
    res.status(500).json({ message: "error fetching" });
  }
};
