const puppeteer = require('puppeteer');

// Grabs the latest best track information for specified disturbance.
// Used in the following command: /btk
let scraper = async (identifier) => {
    const browser = await puppeteer.launch({headless: "new"});
    const page = await browser.newPage();
    if((identifier.substr(0,2).toLowerCase() == 'al') || (identifier.substr(0,2).toLowerCase() == 'ep')) {
        await page.goto(`https://ftp.nhc.noaa.gov/atcf/btk/b${identifier}2023.dat`);
    } else {
        await page.goto(`https://www.ssd.noaa.gov/PS/TROP/DATA/ATCF/JTWC/b${identifier}2023.dat`);
    }

    let texts = await page.evaluate(() => {
        let data = []
        let elements = document.getElementsByTagName('pre')
        for(let element of elements) {
            data.push(element.textContent)
        }
        let cleanedData = String(data).split(/\r?\n/)

        return cleanedData
    })
    await browser.close();
    let bestTrackLength = (texts.length) - 2;
    let finalBtk = await beautifiedBtk(texts[bestTrackLength]);
    
    return finalBtk
}

// Beautifies best track data from btk()
let beautifiedBtk = async (rawData) => {
    let sectionedArray = rawData.split(', ');
    return sectionedArray.map(s => s.trim());
}

module.exports = {
    scraper,
}