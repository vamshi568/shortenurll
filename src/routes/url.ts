import { Request, Response } from 'express';
import { Url } from "../models/url";
const router = require("express").Router();

// const BASE_URL = "http://localhost:3000"; // Use this for local
const BASE_URL = "https://shortenurl-dyht.onrender.com";

// Create shortened URL
router.post("/shorten", async (req: Request, res: Response) => {
  const { originalUrl, expireTimeInHours } = req.body;
  
  function generateId(): string {
    return Date.now().toString(36) + Math.random().toLocaleString().slice(2,4);
}
  if (!originalUrl || !expireTimeInHours) {
    return res.status(400).json({ message: "Invalid input" });
  }

  try {
    
    const shortId = generateId(); // Generate an unique ID
    const expirationDate = new Date();
    expirationDate.setHours(expirationDate.getHours() + expireTimeInHours);

    // Saveing the URL to the database
    const newUrl = new Url({
      originalUrl,
      shortId,
      expirationDate,
    });

    await newUrl.save();

    return res.status(201).json({ shortUrl: `${BASE_URL}/${shortId}` });
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
});

// Redirecting to original URL
router.get("/:shortId", async (req: Request, res: Response) => {
  const { shortId } = req.params;

  try {
    const url = await Url.findOne({ shortId });

    if (!url) {
      return res.status(404).json({ message: "URL not found" });
    }

    if (new Date() > url.expirationDate) {
      return res.status(410).json({ message: "URL expired" });
    }

    url.requestCount += 1;
    await url.save();

    res.redirect(url.originalUrl);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving URL", error });
  }
});

// Sending stats of the  URL
router.get("/:shortId/stats", async (req: Request, res: Response) => {
  const { shortId } = req.params;

  try {
    const url = await Url.findOne({ shortId });

    if (!url) {
      return res.status(404).json({ message: "URL not found" });
    }

    res.json({
      originalUrl: url.originalUrl,
      requestCount: url.requestCount,
      expirationDate: url.expirationDate,
    });
  } catch (error) {
    res.status(500).json({ message: "Error retrieving URL stats", error });
  }
});

export default router;
