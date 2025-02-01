import { NextApiRequest, NextApiResponse } from "next";

// const GOOGLE_DOMAIN = "https://script.google.com";
// const GOOGLE_KEY = `AKfycbx59b6woS9-hkh8jkk93zrBUOSwbiI6JvBQT0-wdP-zxD_dNFrnL_t5WNvuulvzNtOq`;

// type Response = {
//   result: string;
//   row: object;
//   data: BiblePlan;
// };


export default (req: NextApiRequest, res: NextApiResponse) => {
  try {
    res.status(200).json('test');
  } catch (error) {
    res.status(500).json({ message: "error fetching" + error });
  }
};
