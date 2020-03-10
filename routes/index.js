var express = require('express');
var router = express.Router();
var axios = require('axios');
const puppeteer = require('puppeteer');
const http = require('http');


/* GET Specific property with year-month */
router.get('/:property_id/:yearMonth/:user_id/:token', function (req, res) {
  
  var property_id = req.params.property_id;
  var yearMonth = req.params.yearMonth;
  var user_id = req.params.user_id;
  var token = req.params.token;
  
  //axios
  axios({
    headers: {
      'Content-Type': 'application/json',
      'token': token,
      'user_id': user_id
    },
    method: 'get',
    url: process.env.API_SERVER + '/v1/finance-report/' + property_id + '/' + yearMonth,
  })
    .then(summary => {
      // console.log(summary.data);
      res.render('index', { 
        res: summary.data
      });
    }).catch(err => {
      console.log(err);
    });
});

router.get('/print/:property_id/:yearMonth/:user_id/:token', async function printPDF(req, res) {
    
  var property_id = req.params.property_id;
  var yearMonth = req.params.yearMonth;
  var user_id = req.params.user_id;
  var token = req.params.token;

  try{
      const browser = await puppeteer.launch({ headless: true});
      const page = await browser.newPage();
      // 
      await  page.goto('http://localhost:' + process.env.PORT + '/' + property_id + '/' + yearMonth + '/' + user_id + '/' + token , { waitUntil: 'networkidle0' } );
  
      // await page.screenshot({path: 'example.png'});
      const pdf = await page.pdf({
          path: property_id + '_' + yearMonth + '.pdf',
          format: 'A4',
          margin:{
              top: "1.5cm",
              right: "1cm",
              left: "1cm",
              bottom: "1.5cm"
          },
          printBackground: true
      });

      console.log('PDF file created');
      await browser.close();
      return pdf;
      // process.exit();

      // Response this call with the path of the file

  }

  catch (e) {
      console.log('our error', e);
  }
}

);


module.exports = router;