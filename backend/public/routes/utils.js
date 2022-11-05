const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

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

function validate_obj_2(obj) {
    if (typeof obj.queryImage !== 'string')
        return false;
    if (typeof obj.path !== 'string')
        return false;
    if (typeof obj.convertTo !== 'string')
        return false;
    if (typeof obj.headless !== 'boolean')
        return false;
    if (typeof obj.bypass !== 'boolean')
        return false;
    if (typeof obj.maxQueue !== 'number')
        return false;
    if (typeof obj.waitQueue !== 'number')
        return false;
    if (typeof obj.imageSize !== 'number')
        return false;
    if (typeof obj.imgTypes !== 'object')
        return false;
    if (typeof obj.links !== 'object')
        return false;

    const supportType = ['png', 'jpeg', 'jpg', 'default'];
    if (!supportType.includes(obj.convertTo))
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

async function scrapeImages(browser, links, queue, queryImage, folder, imageSize, imgTypes, convertTo) {
    processPath(folder);

    // Grouped all urls from the index page to 2D array
    // E.g [[link1, link2], [link3, link4], ...]
    const {segments, size} = getSegments(links, queue.maxQueue);

    // Run synchronous for all segments
    for (let segIdx = 0; segIdx < size; segIdx++) {
        const segment = segments[segIdx]

        // Implement Wait Queue
        const next = async () => {
            return new Promise((res)=> {
                setTimeout(async () => {
                    // Run asynchronous for a single segment
                    await Promise.allSettled(
                        // Asynchronously download images in a segment
                        segment.map( async link => {
                            return new Promise(async resolve => {
                                // Open new tab for a single link
                                const page = await browser.newPage();
                                const allImgResponses = await getResponseImages(page, imgTypes);
                                
                                // Replace invalid window character when create file, folder.
                                let name = link.name.replace(/[\/\\:*?"><|]*/g, '');
                                let subFolder = path.normalize(`${folder}/${name}`);
                                fs.mkdirSync(subFolder, {recursive: true});

                                // Get all images url from a page
                                let imageLinks = await getImagesLinks(link.url, page, queryImage)
                                // Wait for downloading images
                                await downloadImages(allImgResponses, imageLinks, subFolder, convertTo, imgTypes)
                                
                                // Make sure to close the tab
                                await page.close();
                                resolve(true)
                            })
                        })
                    )
                    res(true)
                }, queue.waitQueue * 1000) // wait after n seconds
            })
        }
        await next();
    }
}




async function downloadImages(allImgResponses, imageLinks, path, convertTo, imgTypes) {
    let length = imageLinks.length

    for (let j = 0; j < length; j++) {
        let link = imageLinks[j];
        if (!isExists(allImgResponses, link))
            reject(false) 

        for (let i = 0; i < imgTypes.length; i++) {
            if (link.includes(imgTypes[i])) {
                let {data, ext} = await allImgResponses[link];
                data = await data.buffer();
                
                if (data.length > 0) {
                    if (convertTo === 'default')
                        convertTo = ext
                    await passBuffer(sharp, data, j, path, convertTo)
                }
            }
        }
    }
}

function getSegments(links, maxQueue) {
    let size = 1;

    if (links.length > maxQueue) {
        size = Math.ceil(links.length / maxQueue)
    }

    let segments = [...new Array(size)].map((_, i) => i)

    for (let i = 0; i < size; i++) {
        const start = i * maxQueue;
        segments[i] = links.slice(start, start + maxQueue)
    }

    return {segments, size}
}

function processPath(folder) {
    const correctPath = path.normalize(folder)
    fs.mkdirSync(correctPath, {recursive: true});    
}

async function getImagesLinks(url, page, query) {
    await page.goto(url)

    const imageLinks = await page.evaluate((query) =>
        Array.from(
            document.querySelectorAll(query),
            ({src}) => src
        )
    , query)

    return imageLinks
}

async function passBuffer(sharp, buffer, j, fullPath, toType) {
    await sharp(buffer).toFormat(toType).toFile(`${fullPath}/${j}.${toType}`)
    return true
}

async function getResponseImages(page, imgTypes) {
    const allImgResponses = {}
    page.on('response', (response) => {
        if (response.request().resourceType() === 'image') {
            for (let i = 0; i < imgTypes.length; i++) {
                if (response.url().includes(imgTypes[i])) {
                    allImgResponses[response.url()] = {data: response, ext: imgTypes[i]};
                }
            }
        }
    });
    return allImgResponses
}

function isExists(allImgResponses, imgURL) {
    let link = imgURL;
    if (allImgResponses[link].data === undefined) {
        link = imgURL.replace('http', 'https')
        if (allImgResponses[link].data === undefined) {
            link = imgURL.replace('https', 'http')
            if (allImgResponses[link].data === undefined) {
                console.log("Broken link")
                return false
            }
        }
    }
    return true
}



module.exports = {
    scrapeLinks,
    scrapeImages,
    validate_obj,
    validate_obj_2
}