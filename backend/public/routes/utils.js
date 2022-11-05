const fs = require('fs');
const path = require('path');

function validate_obj(obj) {
    if (typeof obj.url !== 'string')
        return false;
    if (typeof obj.selector !== 'string')
        return false;
    if (typeof obj.alias !== 'string')
        return false;
    if (typeof obj.scroll !== 'number')
        return false;
    if (typeof obj.headless !== 'boolean')
        return false;
    if (typeof obj.bypass !== 'boolean')
        return false;
    
    return true;
}

async function scrapeLinks(browser, scroll, url, queryLink, queryName) {
    const page = await browser.newPage();
    try {
        await page.goto(url);
    } catch (err) {
        return;
    }

    const links = await page.evaluate(
        ({delay, limit, size}, queryLink, queryName) => {
            return new Promise((resolve, reject) => {
                let count = 0;
                const interval = setInterval(() => {
                    scrollBy(0, size);
                    count++;
                    if (count >= limit) {
                        const links = Array.from(
                            document.querySelectorAll(queryLink),
                            ({href, src}) => href ? href : src
                        )

                        const names = Array.from(
                            document.querySelectorAll(queryName),
                            ({innerText}) => innerText
                        )
                        
                        const length = links.length;
                        if (links.length === names.length) {
                            const result = [...new Array(length)]

                            for (let i = 0; i < length; i++)
                                result[i] = {url: links[i], name: names[i]};
                                
                            resolve(result);
                        } else {
                            reject(false)
                        }


                        // resolve(links);
                        clearInterval(interval);
                    }
                }, delay)
            })
        }
    , scroll, queryLink, queryName)

    await page.close();

    return links
}

module.exports = {
    scrapeLinks,
    validate_obj
}