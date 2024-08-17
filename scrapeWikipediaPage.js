const { Builder, By, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const mongoose = require('mongoose');
require('dotenv').config({ path: '.env.local' });

const mongoUri = process.env.MONGODB_URI;

const paragraphSchema = new mongoose.Schema({
    url: String,
    text: String
});

const Paragraph = mongoose.models.Paragraph || mongoose.model('Paragraph', paragraphSchema);

function removeBracketsAndContents(text) {
    return text.replace(/\[.*?\]/g, ''); 
}


async function scrapeWikipediaPage(url) {
    const options = new chrome.Options().addArguments('--headless');
    const driver = new Builder().forBrowser('chrome').setChromeOptions(options).build();

    try {
        await mongoose.connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true });

        await driver.get(url);
        await driver.wait(until.elementLocated(By.tagName('p')), 10000);
        const paragraphs = await driver.findElements(By.tagName('p'));

        // Scrape and store data in MongoDB
        for (const paragraph of paragraphs) {
            let text = await paragraph.getText();
            text = removeBracketsAndContents(text);
            console.log(text); 

            // Store each paragraph in MongoDB
            await Paragraph.create({ url, text });
        }
    } catch (error) {
        console.error('An error occurred:', error);
    } finally {
        await driver.quit();
        await mongoose.disconnect();
    }
}

module.exports = scrapeWikipediaPage;