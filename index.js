import express from "express";
import puppeteer from "puppeteer-extra";
import StealthPlugin from "puppeteer-extra-plugin-stealth";

puppeteer.use(StealthPlugin());

const app = express();
const PORT = 8000;

let browser;

async function getBrowser() {
  if (!browser) {
    browser = await puppeteer.launch({
      headless: "new",
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
      executablePath: "/usr/bin/chromium-browser",
    });
  }
  return browser;
}

app.get("/search", async (req, res) => {
  const { name, tier } = req.query;

  if (!name || !tier) {
    return res.status(400).json({ error: "Please provide name and tier" });
  }

  try {
    const browser = await getBrowser();
    const page = await browser.newPage();
    
    // Fake user-agent to avoid bot detection
    await page.setUserAgent("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/113.0.0.0 Safari/537.36");

    const searchURL = `https://shoob.gg/cards?page=1&query=${encodeURIComponent(name)}`;
    await page.goto(searchURL, { waitUntil: "networkidle2", timeout: 60000 });

    // Manual waiting if Cloudflare challenge appears
    await new Promise((resolve) => setTimeout(resolve, 5000));

    // Ensure the page has loaded
    await page.waitForSelector(".card-container", { timeout: 20000 });

    const cards = await page.evaluate((tier) => {
      const cardElements = document.querySelectorAll(".card-container");
      const results = [];

      cardElements.forEach((card) => {
        const cardName = card.querySelector(".card-title")?.innerText.trim();
        const cardTier = card.querySelector(".card-tier")?.innerText.trim();
        const imageUrl = card.querySelector("img")?.src;

        if (cardName && cardTier && cardTier.includes(`Tier ${tier}`)) {
          results.push({ name: cardName, tier: cardTier, image: imageUrl });
        }
      });

      return results;
    }, tier);

    await page.close();

    if (cards.length === 0) {
      return res.status(404).json({ message: "No cards found for the given name and tier" });
    }

    res.json({ results: cards });
  } catch (error) {
    console.error("Puppeteer Error:", error);
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
