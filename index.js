const express = require('express');
const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');

puppeteer.use(StealthPlugin());

const app = express();
const PORT = 8000;

app.get('/search', async (req, res) => {
    const query = req.query.q;
    if (!query) return res.status(400).json({ error: 'Query parameter "q" is required' });

    const url = `https://shoob.gg/cards?page=1&query=${encodeURIComponent(query)}`;
    let browser;

    try {
        browser = await puppeteer.launch({
            headless: 'new',
            args: ['--no-sandbox', '--disable-setuid-sandbox'],
        });

        const page = await browser.newPage();
        await page.goto(url, { waitUntil: 'domcontentloaded' });

        const cards = await page.evaluate(() => {
            return Array.from(document.querySelectorAll('.card-list img'))
                .map(img => ({ image: img.src, name: img.alt || 'Unknown' }));
        });

        if (!cards.length) throw new Error('No cards found');

        res.json({ success: true, cards });
    } catch (error) {
        res.status(500).json({ error: 'Failed to scrape Shoob.gg', details: error.message });
    } finally {
        if (browser) await browser.close();
    }
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
