import express from "express";
import puppeteer from "puppeteer";

const app = express();
const PORT = 8000;

app.get("/", async (req, res) => {
  try {
    const browser = await puppeteer.launch({
      headless: "new",  // Force headless mode
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
      executablePath: "/usr/bin/chromium-browser", // Manually specify Chromium path
    });

    const page = await browser.newPage();
    await page.goto("https://shoob.gg/cards?page=1&query=Kakashi%20hatake");

    const title = await page.title();
    await browser.close();

    res.json({ message: "Puppeteer Loaded Successfully", title });
  } catch (error) {
    console.error("Puppeteer Error:", error);
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
