const express = require('express')
const web = require('puppeteer-extra');
const plugin = require('puppeteer-extra-plugin-stealth');
const { executablePath } = require('puppeteer')


const {
    scrapeLinks,
    validate_obj
} = require('./utils')


const router = express.Router();

router.post('/downloadLinks', (req, res) => {
    const keys = Object.keys(req.body);
    const keyLength = keys.length;

    if (keyLength !== 6)
        return res.sendStatus(400)
    
    if (validate_obj(req.body))
        return res.sendStatus(400);

    console.log(req.body)

    const {url, selector, alias, scroll, bypass, headless} = req.body
    const options = {
        headless,
        executablePath: executablePath()
    }

    // Bypass bot detection
    if (bypass)
        web.use(plugin());

    web.launch(options).then(async browser => {
        let links;
        try {
            links = await scrapeLinks(browser, scroll, url, selector, alias)
        } catch (err) {
            return res.sendStatus(400);
        }

        await browser.close();

        res.status(200).json(links);
    })
})


router.post('/downloadImages', (req, res) => {
    console.log(req.body);
    res.sendStatus(200);
})

module.exports = router