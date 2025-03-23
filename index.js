import express from "express";
import puppeteer from "puppeteer";

const app = express();
const PORT = 8000;

let browser; // Global browser instance

// Start Puppeteer Browser (Keep it open for fast search)
const startBrowser = async () => {
    if (!browser) {
        browser = await puppeteer.launch({
            executablePath: "/usr/bin/chromium-browser", // Use system Chromium
            headless: true,
            args: ["--no-sandbox", "--disable-setuid-sandbox"]
        });
    }
};

// Search Endpoint
app.get("/search", async (req, res) => {
    const { name, tier } = req.query;
    if (!name || !tier) {
        return res.status(400).json({ error: "Missing name or tier" });
    }

    try {
        await startBrowser(); // Ensure browser is running
        const page = await browser.newPage();
        await page.goto(`https://shoob.gg/cards?page=1&query=${encodeURIComponent(name)}`);

        let cardData = null;

        for (let i = 1; i <= 2090; i++) {
            await page.goto(`https://shoob.gg/cards?page=${i}&query=${encodeURIComponent(name)}`, { waitUntil: "load" });
            const cards = await page.evaluate(() => {
                return Array.from(document.querySelectorAll(".card-item")).map(card => ({
                    name: card.querySelector(".card-title")?.innerText || "",
                    tier: card.querySelector(".tier")?.innerText.replace("Tier ", "") || "",
                    image: card.querySelector("img")?.src || "",
                    link: card.querySelector("a")?.href || ""
                }));
            });

            cardData = cards.find(c => c.name.toLowerCase() === name.toLowerCase() && c.tier === tier);
            if (cardData) break;
        }

        await page.close();

        if (!cardData) {
            return res.status(404).json({ error: "Card not found" });
        }

        res.json(cardData);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Start Server
app.listen(PORT, async () => {
    console.log(`Server running on port ${PORT}`);
    await startBrowser(); // Start browser when server starts
});
