var express = require('express');
var router = express.Router();
const puppeteer = require('puppeteer');
const http = require('http');


(async function printPDF() {
    
    try{
        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        await  page.goto('http://localhost:3000');
        // await page.screenshot({path: 'example.png'});
        await page.pdf({
            path:'monthlyreport.pdf',
            format: 'A4',
            margin:{
                top: "5px",
                right: "10px",
                left: "10px",
                bottom: "5px"
            },
            printBackground: true
        });

        console.log('done');
        await browser.close();
        process.exit();

    }

    catch (e) {
        console.log('our error', e);
    }
});

module.exports = router;