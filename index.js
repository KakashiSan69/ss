const express = require('express')
const puppeteer = require('puppeteer')

const app = express()
const PORT = 8000

app.get('/search', async (req, res) => {
    const { query, page = 1 } = req.query
    if (!query) return res.status(400).json({ error: 'Provide a search query' })

    try {
        const browser = await puppeteer.launch({
            headless: true,
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        })
        const pageObj = await browser.newPage()
        const searchUrl = `https://shoob.gg/cards?page=${page}&query=${encodeURIComponent(query)}`

        await pageObj.goto(searchUrl, { waitUntil: 'networkidle2', timeout: 60000 })

        const cards = await pageObj.evaluate(() => {
            return Array.from(document.querySelectorAll('.card-container')).map(card => ({
                name: card.querySelector('.card-title')?.innerText || 'Unknown',
                image: card.querySelector('img')?.src || '',
                link: card.querySelector('a')?.href || ''
            }))
        })

        await browser.close()
        res.json({ query, page, results: cards })
    } catch (error) {
        console.error('Scraping Error:', error)
        res.status(500).json({ error: 'Failed to scrape Shoob.gg' })
    }
})

app.listen(PORT, () => console.log(`API running on http://localhost:${PORT}`))
