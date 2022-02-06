const net = require('net');
const express = require('express');
const xml = require('xml');
const geoip = require('geoip-lite');
const router = express.Router();


router.get('/:supplyTagId', function (req, res, next) {

  // Params
  let ip = req.headers['x-forwarded-for'] || req.ip;
  const supplyTagId = req.params.supplyTagId;

  // Queries
  if(req.query.ip && net.isIP(req.query.ip)) {
    ip = req.query.ip;
  }

  const width = req.query.w; // Width
  const height = req.query.h; // Height
  const visibility = req.query.v; // Visibility
  const url = req.query.url; // Page URL
  const domain = req.query.dom; // Domain
  const gdpr = req.query.gdpr; // GDPR
  const consent = req.query.consent; // GDPR Consent
  const usp = req.query.usp; // US Privacy
  const schain = req.query.schain; // Supply Chain

  // Geo, Country
  const geo = geoip.lookup(ip);

  console.log('vast > supply tag id >', supplyTagId, ip, geo);
  console.log(width, height, visibility, url, domain, gdpr, consent, usp, schain);

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
