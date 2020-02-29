var express = require('express');
var router = express.Router();
var axios = require('axios');
const puppeteer = require('puppeteer');
const http = require('http');


/* GET Specific property with year-month */
// /:property_id/:yearMonth/:user_id/:token
router.get('/', function (req, res) {
  
  var property_id = req.params.property_id;
  var yearMonth = req.params.yearMonth;
  var user_id = req.params.user_id;
  var token = req.params.token;
  
  //axios
  axios({
    headers: {
      'Content-Type': 'application/json',
      // 'token': token,
      // 'user_id': user_id
    },
    method: 'post',
    url: process.env.API_SERVER,
    data: {
      // "property_id": property_id,
      // "month": yearMonth
    }
  })
    .then(summary => {
      console.log(summary.data);
      res.render('index', { 
        
        res: summary.data
      });
    }).catch(err => {
      console.log(err);
    });
});

router.get('/print/', async function printPDF(req, res) {
    
  var property_id = req.params.property_id;
  var yearMonth = req.params.yearMonth;
  var user_id = req.params.user_id;
  var token = req.params.token;

  try{
      const browser = await puppeteer.launch({ headless: true});
      const page = await browser.newPage();
      // + property_id + '/' + yearMonth + '/' + user_id + '/' + token
      await  page.goto('http://localhost:' + process.env.PORT , { waitUntil: 'networkidle0' } );
  
      // await page.screenshot({path: 'example.png'});
      const pdf = await page.pdf({
          path: property_id + '_' + yearMonth + '.pdf',
          format: 'A4',
          margin:{
              top: "1.5cm",
              right: "1.5cm",
              left: "1.5cm",
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