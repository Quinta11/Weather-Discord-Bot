const puppeteer = require('puppeteer');
const year = new Date().getUTCFullYear();

let scraper = async (identifier) => {
    const browser = await puppeteer.launch({headless: "new"});
    const page = await browser.newPage();
    await page.goto(`https://tropic.ssec.wisc.edu/real-time/DMINT/${year}/${year}_${identifier.toUpperCase()}_history_MWIR.html`);

    let texts = await page.evaluate(() => {
        let data = []
        let elements = document.getElementsByTagName('td')
        for(let element of elements) {
            data.push(element.textContent)
        }

        return data
    })
    await browser.close();
    let latestData = await cleanArray(texts, identifier);
    
    return latestData
}

let cleanArray = async (rawData, identifier) => {
    let array = [];
    for(let i = 0; i < 7; i++) {
        array[i] = rawData[i+13];
    }
    array[7] = `https://tropic.ssec.wisc.edu/real-time/DMINT/${year}/${year}_${identifier.toUpperCase()}_intensity_plot.png`;

    return array
}

module.exports = {
    scraper,
}