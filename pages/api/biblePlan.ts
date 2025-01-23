import { plan } from "@/constants/plan";
import { Plan } from "@/type/biblePlan";
import { NextApiRequest, NextApiResponse } from "next";

// const GOOGLE_DOMAIN = "https://script.google.com";
// const GOOGLE_KEY = `AKfycbx59b6woS9-hkh8jkk93zrBUOSwbiI6JvBQT0-wdP-zxD_dNFrnL_t5WNvuulvzNtOq`;

// type Response = {
//   result: string;
//   row: object;
//   data: BiblePlan;
// };

export const getBiblePlan = (): Plan[] => {
  try {
    // const queryParam = new URLSearchParams({
    //   type: "admin",
    //   userName: "오창선",
    // });

    /*
    const response = await fetch(
      `${GOOGLE_DOMAIN}/macros/s/${GOOGLE_KEY}/exec?${queryParam}`,
      {
        headers: {
          "content-Type": "text/plain;charset=utf-8",
        },
      },
    );

    if (!response.ok) {
      throw new Error("HTTP ERROR! ");
    }

    const res: Response = await response.json();
  */  

    return plan;
  } catch (e) {
    throw e;
  }
};

export default (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const BiblePlans = getBiblePlan();
    res.status(200).json(BiblePlans);
  } catch (error) {
    res.status(500).json({ message: "error fetching" + error });
  }
};
