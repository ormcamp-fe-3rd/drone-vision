import { NextApiRequest, NextApiResponse } from "next";
import { fetchCollection } from "@/lib/dbService";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { collection } = req.query;

  if (req.method === "GET") {
    if (typeof collection !== "string") {
      return res.status(400).json({ error: "Invalid collection name" });
    }
    try {
      const data = await fetchCollection(collection);
      res.status(200).json(data);
    } catch (error) {
      console.error("API Error:", error);
      res.status(500).json({ error: "Database connection failed" });
    }
  } else {
    res.setHeader("Allow", ["GET"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
