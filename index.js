import express from "express";
import puppeteer from "puppeteer";

const app = express();
const PORT = 8000;

let browser;

// Function to launch browser once and keep it open
async function launchBrowser() {
    if (!browser) {
        browser = await puppeteer.launch({
            executablePath: "/usr/bin/chromium-browser",
            args: ['--no-sandbox', '--disable-setuid-sandbox'],
            headless: "new"
        });
    }
}

// Function to scrape all pages
async function findCard(name, tier) {
    const page = await browser.newPage();
    let foundCard = null;

    try {
        for (let i = 1; i <= 2090; i++) {
            const url = `https://shoob.gg/cards?page=${i}&query=${encodeURIComponent(name)}`;
            await page.goto(url, { waitUntil: "domcontentloaded" });

            const card = await page.evaluate((searchName, searchTier) => {
                searchName = searchName.toLowerCase();
                searchTier = searchTier.toLowerCase();

                const allCards = document.querySelectorAll(".card-container");
                for (let card of allCards) {
                    const cardName = card.querySelector(".card-title")?.innerText.trim().toLowerCase();
                    const cardTier = card.querySelector(".card-tier")?.innerText.trim().toLowerCase();
                    const img = card.querySelector("img")?.src;
                    const description = card.querySelector(".card-description")?.innerText.trim();

                    if (cardName === searchName && cardTier.includes(searchTier)) {
                        return { name: cardName, tier: cardTier, img, description };
                    }
                }
                return null;
            }, name, tier);

            if (card) {
                foundCard = card;
                break; // Stop searching if found
            }
        }
    } catch (err) {
        console.error("Error while scraping:", err);
    } finally {
        await page.close();
    }
    return foundCard;
}

// API Route to Search Card
app.get("/search", async (req, res) => {
    const { name, tier } = req.query;
    if (!name || !tier) {
        return res.status(400).json({ error: "Missing 'name' or 'tier' parameter" });
    }

    try {
        const card = await findCard(name, tier);
        if (!card) {
            return res.status(404).json({ error: "Card not found in 2090 pages." });
        }
        res.json(card);
    } catch (err) {
        res.status(500).json({ error: "Error during search", details: err.message });
    }
});

// Start Server and Browser
app.listen(PORT, async () => {
    await launchBrowser();
    console.log(`Server running at http://localhost:${PORT}`);
});
