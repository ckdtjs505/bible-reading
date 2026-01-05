import { NextApiRequest, NextApiResponse } from "next";

const GOOGLE_API = `https://script.google.com`;
const GOOGLE_KEY = `AKfycbz7h7vGZO3wuvURMKqwqBJHSMbQxJ_8t4ZTC0icDb1BOEF-Gi1SqyCEBMLXXqeGbogF`;

export const getUserProgressInfo = async (userName: string) => {
  const queryParams = new URLSearchParams({
    type: "userProgress",
    userName,
  });

  const response = await fetch(
    `${GOOGLE_API}/macros/s/${GOOGLE_KEY}/exec?${queryParams}`,
    {
      redirect: "follow",
      headers: {
        "Content-Type": "text/plain;charset=utf-8",
      },
    },
  );

  if (!response.ok) {
    throw Error("response error");
  }

  return await response.json();
};

export const setReadBible = ({
  prayForUser,
  name,
  myMessage,
  daycnt,
  index,
  pray,
}: {
  prayForUser: string;
  name: string;
  myMessage: string;
  daycnt: number;
  index: string;
  pray: string;
}) => {
  const queryParams = new URLSearchParams({
    name: name,
    daycnt: String(daycnt),
    index: index,
    myMessage: myMessage,
    pray: pray,
    prayForUser: prayForUser,
  });

  return fetch(`${GOOGLE_API}/macros/s/${GOOGLE_KEY}/exec?${queryParams}`, {
    method: "POST",
    mode: "no-cors",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: queryParams,
  });
};


const handler = (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const userProgressInfo = getUserProgressInfo("오창선");
    res.status(200).json(userProgressInfo);
  } catch (error) {
    res.status(500).json({ message: "error fetching" + error });
  }
};

export default handler;
