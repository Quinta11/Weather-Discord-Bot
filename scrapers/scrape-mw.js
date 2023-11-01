const puppeteer = require('puppeteer');
const year = new Date().getUTCFullYear();
const func = require('../functions')

// Grabs the latest microwave information for specified disturbance.
// Used in the following command: /mw
let scraper = async (identifier, satellite) => {
    const imageURL = `https://www.nrlmry.navy.mil/tcdat/tc${year}/AL/${identifier.toUpperCase()}${year}/png/89H/${satellite.toUpperCase()}/`;
    /*const imageUrls = [
        `https://www.nrlmry.navy.mil/tcdat/tc${year}/AL/${identifier.toUpperCase()}${year}/png/89H/${satellite.toUpperCase()}/${data}`,
        `https://www.nrlmry.navy.mil/tcdat/tc${year}/AL/${identifier.toUpperCase()}${year}/png/color89/${satellite.toUpperCase()}/${data}`
    ]*/
    
    let doesUrlExist = await func.checkUrlExists(imageURL);

    //let doesUrlExist = true;
    /*for(const imageUrl of imageUrls) {
        doesUrlExist = await func.checkUrlExists(imageUrl);
        if(!doesUrlExist) {
            break;
        }
    }*/

    if(doesUrlExist) {
        const browser = await puppeteer.launch({headless: "new"});
        const page = await browser.newPage();
        await page.goto(imageURL);

        let texts = await page.evaluate(() => {
            let elements = document.getElementsByTagName('a')
            let lastElement = elements[elements.length-2]
            return lastElement.getAttribute("href");
        })

        await browser.close();
        console.log(`Image URL received: ${texts}`);
        return texts
    } else {
        console.log('Image URL does not exist.');
        return false
    }
}

module.exports = {
    scraper,
}