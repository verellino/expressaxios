var express = require('express');
var router = express.Router();
var axios = require('axios');
const puppeteer = require('puppeteer');
const http = require('http');


/* GET Specific property with year-month */

router.get('/:property_id/:yearMonth', function (req, res) {
  
  var property_id = req.params.property_id;
  var yearMonth = req.params.yearMonth;
  
  //axios
  axios({
    headers: {
      'Content-Type': 'application/json',
      'token': process.env.API_TOKEN,
      'user_id': process.env.API_USER_ID
    },
    method: 'post',
    url: process.env.API_SERVER + '/v1/finance-report-by-property',
    data: {
      "property_id": property_id,
      "month": yearMonth
    }
  })
    .then(summary => {
      axios({
        headers: {
          'Content-Type': 'application/json',
          'token': process.env.API_TOKEN,
          'user_id': process.env.API_USER_ID
        },
        method: 'post',
        url: process.env.API_SERVER + '/v1/getBookingListWithPayouts?page=0&limit=25',
        data: {
          "property_ids": [ property_id ]
        }
      }).then(booking => {
        // console.log(summary.data);
        // console.log(booking.data);
        console.log(req.params)
        res.render('index', { 
          res: summary.data,
          res2: booking.data 
        });
      }).catch(err => {
        console.log(err);
      });
    }).catch(err => {
      console.log(err);
    });
});

router.get('/print/:property_id/:yearMonth', async function printPDF(req) {
    
  var property_id = req.params.property_id;
  var yearMonth = req.params.yearMonth;

  try{
      const browser = await puppeteer.launch({ headless: true});
      const page = await browser.newPage();
      await  page.goto('http://localhost:' + process.env.PORT + '/' + property_id + '/' + yearMonth, { waitUntil: 'networkidle0' } );
  
      // await page.screenshot({path: 'example.png'});
      //await page.pdf({
      //    path:'monthlyreport.pdf',
      //    format: 'A4',
      //    margin:{
      //        top: "5px",
      //        right: "10px",
      //        left: "10px",
      //        bottom: "5px"
      //    },
      //    printBackground: true
      //});

      const printPdf = await page.pdf({ format: 'A4' });

      console.log('PDF file created');
      await browser.close();
      return printPDF
      // process.exit();

  }

  catch (e) {
      console.log('our error', e);
  }
}

)


module.exports = router;