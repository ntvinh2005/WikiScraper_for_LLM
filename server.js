const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const scrapeWikipediaPage = require('./scrapeWikipediaPage');
require('dotenv').config({ path: '.env.local' });

const app = express();
const port = 3000;

const mongoUri = process.env.MONGODB_URI;

const paragraphSchema = new mongoose.Schema({
    url: String,
    text: String
});

const linkSchema = new mongoose.Schema({
    originalUrl: String,
    foundLinks: [String]
});

const Paragraph = mongoose.models.Paragraph || mongoose.model('Paragraph', paragraphSchema);
const Link = mongoose.models.Link || mongoose.model('Link', linkSchema);

mongoose.connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log('MongoDB connected');
        app.listen(port, () => {
            console.log(`Server running on http://localhost:${port}`);
        });
    })
    .catch(err => {
        console.error('MongoDB connection error:', err);
    });

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, 'public')));

app.post('/scrape', async (req, res) => {
    const url = req.body.url;

    if (!url) {
        return res.status(400).send('URL is required');
    }

    try {
        // Check if the URL is already in the database
        const existingParagraphs = await Paragraph.find({ url });
        const existingLinks = await Link.findOne({ originalUrl: url });

        if (existingParagraphs.length > 0) {
            return res.json({
                message: 'Data already exists',
                paragraphs: existingParagraphs,
                links: existingLinks ? existingLinks.foundLinks : []
            });
        }

        // Perform the scrape if URL is not in the database
        await scrapeWikipediaPage(url);

        // Fetch the newly scraped data
        const newParagraphs = await Paragraph.find({ url });
        const newLinks = await Link.findOne({ originalUrl: url });

        res.json({
            message: 'Data scraped and stored successfully',
            paragraphs: newParagraphs,
            links: newLinks ? newLinks.foundLinks : []
        });
    } catch (error) {
        console.error('Error during scraping:', error);
        res.status(500).send({ message: 'An error occurred while scraping data' });
    }
});


app.get('/data', async (req, res) => {
    const { url } = req.query;

    if (!url) {
        return res.status(400).json({ message: 'URL is required' });
    }

    try {
        const paragraphs = await Paragraph.find({ url });
        res.json(paragraphs);
    } catch (error) {
        console.error('Error fetching paragraphs:', error);
        res.status(500).json({ message: 'An error occurred while fetching paragraphs.' });
    }
});

app.get('/links', async (req, res) => {
    const { url } = req.query;

    if (!url) {
        return res.status(400).json({ message: 'URL is required' });
    }

    try {
        const linkData = await Link.findOne({ originalUrl: url });
        if (!linkData) {
            return res.status(404).json({ message: 'No links found for this URL' });
        }
        res.json(linkData.foundLinks);
    } catch (error) {
        console.error('Error fetching links:', error);
        res.status(500).json({ message: 'An error occurred while fetching links.' });
    }
});

app.get('/download', async (req, res) => {
    const { url, format } = req.query;

    if (!url || !format) {
        return res.status(400).send('URL and format are required');
    }

    try {
        const paragraphs = await Paragraph.find({ url });
        const links = await Link.findOne({ originalUrl: url });

        let data;
        switch (format) {
            case 'json':
                data = JSON.stringify({ paragraphs, links: links ? links.foundLinks : [] }, null, 2);
                res.setHeader('Content-Disposition', 'attachment; filename=data.json');
                res.setHeader('Content-Type', 'application/json');
                break;
            case 'csv':
                data = convertParagraphsToCSV(paragraphs);
                res.setHeader('Content-Disposition', 'attachment; filename=data.csv');
                res.setHeader('Content-Type', 'text/csv');
                break;
            default:
                return res.status(400).send('Unsupported format');
        }

        res.send(data);
    } catch (error) {
        console.error('Error fetching data:', error);
        res.status(500).send('An error occurred while preparing the download');
    }
});

function convertParagraphsToCSV(paragraphs) {
    const header = 'paragraph_text\n';
    // Convert each paragraph to a CSV row
    const rows = paragraphs.map(p => {
        const escapedText = p.text.replace(/"/g, '""').replace(/\n/g, '\\n');
        return `"${escapedText}"`;
    }).join('\n');
    return header + rows;
}

