const { Builder, By, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const mongoose = require('mongoose');
require('dotenv').config({ path: '.env.local' });

const paragraphSchema = new mongoose.Schema({
    url: String,
    text: String
});

const linkSchema = new mongoose.Schema({
    originalUrl: String,
    foundLinks: [String]
});

const mongoUri = process.env.MONGODB_URI;

const Paragraph = mongoose.model('Paragraph', paragraphSchema);
const Link = mongoose.model('Link', linkSchema);

async function scrapeWikipediaPage(url) {
    const options = new chrome.Options().addArguments('--headless');
    const driver = new Builder().forBrowser('chrome').setChromeOptions(options).build();

    try {
        // Connect to MongoDB
        await mongoose.connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true });

        // Navigate to the Wikipedia page
        await driver.get(url);
        await driver.wait(until.elementLocated(By.tagName('p')), 10000);

        // Extract and store paragraphs
        const paragraphs = await driver.findElements(By.tagName('p'));

        for (const paragraph of paragraphs) {
            let paragraphText = await paragraph.getText();

            // Remove any content within square brackets (links, references, etc.)
            paragraphText = paragraphText.replace(/\[[^\]]*\]/g, '').trim();

            if (paragraphText !== "") {
                await Paragraph.create({ url, text: paragraphText });
            }
        }

        // Extract and store links
        const linkElements = await driver.findElements(By.css('a[href^="/wiki/"]:not([href*=":"])'));
        const linksSet = new Set();

        for (const linkElement of linkElements) {
            const href = await linkElement.getAttribute('href');
            if (href) {
                const fullLink = new URL(href, url).href;
                linksSet.add(fullLink);
            }
        }

        const linksArray = Array.from(linksSet);
        const selectedLinks = linksArray.slice(1, linksArray.length - 5)

        // Store links in MongoDB
        if (linksArray.length > 0) {
            await Link.create({ originalUrl: url, foundLinks: selectedLinks });
        }
    } catch (error) {
        console.error('An error occurred:', error);
    } finally {
        await driver.quit();
        await mongoose.disconnect();
    }
}

module.exports = scrapeWikipediaPage;