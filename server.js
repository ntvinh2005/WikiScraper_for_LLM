const express = require('express');
const mongoose = require('mongoose');
const scrapeWikipediaPage = require('./scrapeWikipediaPage');
require('dotenv').config({ path: '.env.local' });

const app = express();
const port = 3000;

const mongoUri = process.env.MONGODB_URI;

const paragraphSchema = new mongoose.Schema({
    url: String,
    text: String
});

const Paragraph = mongoose.models.Paragraph || mongoose.model('Paragraph', paragraphSchema);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post('/scrape', async (req, res) => {
    const url = req.body.url;

    if (!url) {
        return res.status(400).send('URL is required');
    }

    try {
        await scrapeWikipediaPage(url);
        res.send('Data scraped and stored successfully');
    } catch (error) {
        res.status(500).send('An error occurred while scraping data');
    }
});

app.get('/data', async (req, res) => {
    const url = req.query.url;

    if (!url) {
        return res.status(400).send('URL is required');
    }

    try {
        const data = await Paragraph.find({ url });
        if (data.length === 0) {
            return res.status(404).send('No data found for the provided URL');
        }
        res.json(data);
    } catch (error) {
        res.status(500).send('An error occurred while fetching data');
    }
});

mongoose.connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        app.listen(port, () => {
            console.log(`Server running on http://localhost:${port}`);
        });
    })
    .catch(error => {
        console.error('Error connecting to MongoDB:', error);
    });