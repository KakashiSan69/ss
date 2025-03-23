const express = require("express");
const puppeteer = require("puppeteer");

const app = express();
const PORT = 8000;
let browser; 

// Browser Open Rakho for Fast Work
(async () => {
    browser = await puppeteer.launch({ headless: true, args: ["--no-sandbox"] });
})();

// Search Endpoint
app.get("/search", async (req, res) => {
    const { name, tier } = req.query;
    if (!name || !tier) return res.status(400).json({ error: "Missing parameters" });

    try {
        const page = await browser.newPage();
        await page.goto(`https://shoob.gg/cards?page=1&query=${encodeURIComponent(name)}`, { waitUntil: "domcontentloaded" });

        let foundCard = null;

        for (let i = 1; i <= 2090; i++) {
            await page.goto(`https://shoob.gg/cards?page=${i}&query=${encodeURIComponent(name)}`, { waitUntil: "domcontentloaded" });

            const cards = await page.evaluate(() => {
                return [...document.querySelectorAll(".card")].map(card => ({
                    name: card.querySelector(".card-name")?.innerText.trim(),
                    tier: card.querySelector(".card-tier")?.innerText.replace("Tier ", "").trim(),
                    image: card.querySelector("img")?.src,
                    description: card.querySelector(".card-description")?.innerText.trim(),
                }));
            });

            foundCard = cards.find(c => c.name?.toLowerCase() === name.toLowerCase() && c.tier === tier);

            if (foundCard) break;
        }

        await page.close();

        if (foundCard) {
            res.json(foundCard);
        } else {
            res.status(404).json({ error: "Card not found" });
        }
    } catch (error) {
        res.status(500).json({ error: "Scraping error", details: error.message });
    }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
