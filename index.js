const express = require('express');
const puppeteer = require("puppeteer");
const app = express();
const getData = async (url, DOMQuery) => {
    try {
        const browser = await puppeteer.launch({
            headless: true,
            args: [
                '--no-sandbox',
                '--disable-setuid-sandbox',
                '--disable-dev-shm-usage',
                '--single-process'
            ],
        });
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
    } catch (error) {
        console.log(error);
        return error.toString();
    }

};
app.get('/', async (request, response) => {
    const { url, DOMQuery } = request.query;
    const data = await getData(url, DOMQuery);
    response.json(data);
});
const server = app.listen(process.env.PORT || 24732, () => {
    let port = server.address().port;
    console.log(`server running on port: ${port}`)
});