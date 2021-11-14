const PORT = process.env.port || 8000;
const express = require('express');
const puppeteer = require("puppeteer");

const app = express();

const getData = async (url, DOMQuery) => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(url, {
        waitUntil: 'domcontentloaded',
        timeout: 0
    });
    const urls = await page.evaluate(() => {
        return Array.from(document.querySelectorAll("a")).map(x => x.href);
    });
    const DOMQueryResult = await page.evaluate((DOMQuery) => {
        return Array.from(document.querySelectorAll(DOMQuery)).map(el => el.textContent);
    }, DOMQuery);
    await browser.close();
    return { urls, DOMQueryResult };
};

app.get('/', async (request, response) => {
    const { url, DOMQuery } = request.query;
    const data = await getData(url, DOMQuery);
    response.json(data);
});

app.listen(PORT, () => console.log(`server running on port: ${PORT}`));
