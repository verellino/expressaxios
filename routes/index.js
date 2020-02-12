var express = require('express');
var router = express.Router();
var axios = require('axios');
/* GET home page. */
router.get('/', function (req, res) {
  //axios
  axios({
    headers: {
      'Content-Type': 'application/json',
      'token': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiNWQ1ZTgwNmY2NGJhMmU2MWI5OWFjMjM5IiwiaWF0IjoxNTgwMjY2MTU3fQ.jaB-UC4fNpwAXzCp_cPCgDncaYQP6VKKudiAbT2nNaU',
      'user_id': '5d5e806f64ba2e61b99ac239'
    },
    method: 'post',
    url: 'https://api.bukitvista.com:5000/v1/finance-report-by-property',
    data: {
      "property_id": "PR0402",
      "month": "2019-09"
    }
  })
    .then(summary => {
      axios({
        headers: {
          'Content-Type': 'application/json',
          'token': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiNWQ1ZTgwNmY2NGJhMmU2MWI5OWFjMjM5IiwiaWF0IjoxNTgwMjY2MTU3fQ.jaB-UC4fNpwAXzCp_cPCgDncaYQP6VKKudiAbT2nNaU',
          'user_id': '5d5e806f64ba2e61b99ac239'
        },
        method: 'post',
        url: 'https://api.bukitvista.com:5000/v1/getBookingListWithPayouts?page=0&limit=25',
        data: {
          "property_ids": ["PR0402"]
        }
      }).then(booking => {
        // console.log(summary.data);
        // console.log(booking.data);
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

module.exports = router;