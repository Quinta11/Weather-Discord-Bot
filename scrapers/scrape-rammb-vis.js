const puppeteer = require('puppeteer');
const year = new Date().getUTCFullYear();

// Grabs the latest best track information for specified disturbance.
// Used in the following command: /btk
let scraper = async (identifier) => {
    const browser = await puppeteer.launch({headless: "new"});
    const page = await browser.newPage();
    
    await page.goto(`https://rammb-data.cira.colostate.edu/tc_realtime/archive.asp?product=1kmsrvis&storm_identifier=${identifier}${year}`);

    let texts = await page.evaluate(() => {
        let elements = document.getElementsByTagName('td')
        let lastElement = elements[elements.length-1].lastChild
        
        return lastElement.getAttribute("href");
    })
    await browser.close();
    console.log(texts);
    return texts
}

module.exports = {
    scraper,
}