const PORT = process.env.PORT || 8000
const express = require('express')
const axios = require('axios')
const cheerio = require('cheerio')
const app = express()

// Configure axios with User-Agent to avoid blocking
const axiosInstance = axios.create({
    headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
    },
    timeout: 10000
})

// List of newspapers to scrape
const newspapers = [
    {
        name: 'cityam',
        address: 'https://www.cityam.com/london-must-become-a-world-leader-on-climate-change-action/',
        base: ''
    },
    {
        name: 'thetimes',
        address: 'https://www.thetimes.co.uk/environment/climate-change',
        base: 'https://www.thetimes.com/'
    },
    {
        name: 'guardian',
        address: 'https://www.theguardian.com/environment/climate-crisis',
        base: 'https://www.theguardian.com/',
    },
    {
        name: 'telegraph',
        address: 'https://www.telegraph.co.uk/climate-change',
        base: 'https://www.telegraph.co.uk',
    },
    {
        name: 'nyt',
        address: 'https://www.nytimes.com/international/section/climate',
        base: '',
    },
    {
        name: 'latimes',
        address: 'https://www.latimes.com/environment',
        base: '',
    },
    {
        name: 'smh',
        address: 'https://www.smh.com.au/environment/climate-change',
        base: 'https://www.smh.com.au',
    },
    {
        name: 'un',
        address: 'https://www.un.org/climatechange',
        base: '',
    },
    {
        name: 'bbc',
        address: 'https://www.bbc.co.uk/news/science_and_environment',
        base: 'https://www.bbc.co.uk',
    },
    {
        name: 'es',
        address: 'https://www.standard.co.uk/topic/climate-change',
        base: 'https://www.standard.co.uk'
    },
    {
        name: 'sun',
        address: 'https://www.thesun.co.uk/topic/climate-change-environment/',
        base: ''
    },
    {
        name: 'dm',
        address: 'https://www.dailymail.co.uk/news/climate_change_global_warming/index.html',
        base: ''
    },
    {
        name: 'nyp',
        address: 'https://nypost.com/tag/climate-change/',
        base: ''
    }
]

// Array to hold all articles
const articles = []

// Function to fetch articles from a newspaper
async function fetchArticles(newspaper) {
    try {
        const response = await axiosInstance.get(newspaper.address)
        const html = response.data
        const $ = cheerio.load(html)
        const fetchedArticles = []

        $('a:contains("climate")', html).each(function () {
            const title = $(this).text()
            const url = $(this).attr('href')

            if (title && url) {
                fetchedArticles.push({
                    title: title.trim(),
                    url: newspaper.base + url,
                    source: newspaper.name
                })
            }
        })

        return fetchedArticles
    } catch (error) {
        console.error(`Error fetching from ${newspaper.name}:`, error.message)
        return []
    }
}

// Fetch all articles on startup
async function initializeArticles() {
    console.log('Fetching articles from all sources...')

    const promises = newspapers.map(newspaper => fetchArticles(newspaper))
    const results = await Promise.allSettled(promises)

    results.forEach(result => {
        if (result.status === 'fulfilled') {
            articles.push(...result.value)
        }
    })

// Log the number of articles fetched
    console.log(`Fetched ${articles.length} articles from ${newspapers.length} sources`)
}

// Start server after fetching initial articles
async function startServer() {
    await initializeArticles()
    app.listen(PORT, () => console.log(`Server running on PORT ${PORT}`))
}

// Define routes
app.get('/', (req, res) => {
    res.json('Welcome to my Climate Change News API')
})

// Endpoint to get all news articles
app.get('/news', (req, res) => {
    res.json(articles)
})

// Endpoint to get news articles from a specific newspaper
app.get('/news/:newspaperId', async (req, res) => {
    const newspaperId = req.params.newspaperId

    const newspaper = newspapers.find(n => n.name === newspaperId)

    if (!newspaper) {
        return res.status(404).json({
            error: 'Newspaper not found',
            message: `No newspaper with id '${newspaperId}' exists`,
            availableSources: newspapers.map(n => n.name)
        })
    }

    try {
        const specificArticles = await fetchArticles(newspaper)
        res.json(specificArticles)
    } catch (error) {
        res.status(500).json({
            error: 'Failed to fetch articles',
            message: error.message
        })
    }
})

// Start the server
startServer()