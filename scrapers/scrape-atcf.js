const puppeteer = require('puppeteer');

let scraper = async () => {
    const browser = await puppeteer.launch({headless: "new"});
    const page = await browser.newPage();
    await page.goto(`https://www.nrlmry.navy.mil/tcdat/sectors/atcf_sector_file`);

    let texts = await page.evaluate(() => {
        let data = []
        let elements = document.getElementsByTagName('pre')
        for(let element of elements) {
            data.push(element.textContent)
        }
        let cleanedData = String(data).split(/\r?\n/).filter(a => a)

        return cleanedData
    })
    await browser.close();
    let finalData = texts.map(function(ele){
        return ele + '\n';
    }).reduce(function(prevVal, curVal) {
        return prevVal + curVal;
    });

    return finalData
}

module.exports = {
    scraper,
}