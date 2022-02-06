const net = require('net');
const express = require('express');
const xml = require('xml');
const geoip = require('geoip-lite');
const router = express.Router();


router.get('/:supplyTagId', function (req, res, next) {

  // Params
  let ip = req.headers['x-forwarded-for'] || req.ip; //"207.97.227.239";
  const supplyTagId = req.params.supplyTagId;

  // Queries
  if(req.query.ip && net.isIP(req.query.ip)) {
    ip = req.query.ip;
  }

  const geo = geoip.lookup(ip);

  console.log('vast > supply tag id >', supplyTagId, ip, geo);

  // geo
  /*
  {
    range: [ 2967774208, 2967774719 ],
    country: 'IL',
    region: 'M',
    eu: '0',
    timezone: 'Asia/Jerusalem',
    city: 'Kefar Vitqin',
    ll: [ 32.3813, 34.8774 ],
    metro: 0,
    area: 5
  }
   */

  const data = {
    VAST: [{
      _attr: {
        version: '2.0'
      }
    }]
  }

  res
    .set('Content-Type', 'text/xml')
    .send(xml(data, { indent: true, declaration: true }));

});

module.exports = router;
