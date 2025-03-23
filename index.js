const express = require('express');
const puppeteer = require('puppeteer');

const app = express();
const PORT = 8000;

app.get('/search', async (req, res) => {
    const query = req.query.q;
    if (!query) {
        return res.status(400).json({ error: "Missing query parameter 'q'" });
    }

    const url = `https://shoob.gg/cards?page=1&query=${encodeURIComponent(query)}`;

    try {
        const browser = await puppeteer.launch({
            args: ['--no-sandbox', '--disable-setuid-sandbox'],
            headless: "new"
        });

        const page = await browser.newPage();
        await page.goto(url, { waitUntil: 'networkidle2', timeout: 60000 });

        const cardData = await page.evaluate(() => {
            const cards = [];
            document.querySelectorAll('.card-grid-item').forEach(card => {
                const name = card.querySelector('.card-name')?.innerText || 'Unknown';
                const image = card.querySelector('img')?.src || null;
                const description = card.querySelector('.card-description')?.innerText || 'No description available';
                const tier = card.querySelector('.card-tier')?.innerText || 'Unknown';
                cards.push({ name, image, description, tier });
            });
            return cards;
        });

        await browser.close();

        if (cardData.length === 0) {
            return res.status(404).json({ error: "No cards found for this query" });
        }

        res.json({ results: cardData });

    } catch (error) {
        console.error("Scraping Error:", error);
        res.status(500).json({ error: "Failed to scrape Shoob.gg", details: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});
