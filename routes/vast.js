const net = require('net');
const express = require('express');
const xml = require('xml');
const geoip = require('geoip-lite');
const router = express.Router();

router.get('/:supplyTagId', (req, res, next) => {

  // Params
  const ua = req.headers['user-agent'];

  const host = req.headers['host'];
  const origin = req.headers['origin'];
  let hostname = req.hostname;
  if(origin) {
    try {
      hostname = new URL(origin).hostname;
    } catch (e) {}
  }

  console.log('hostname', hostname);

  const supplyTagId = req.params.supplyTagId;

  let ip = req.headers['x-forwarded-for'] || req.ip;
  if(req.query.ip && net.isIP(req.query.ip)) {
    ip = req.query.ip;
  }

  // Queries
  const width = req.query.w; // Width
  const height = req.query.h; // Height
  const visibility = req.query.v; // Visibility
  const url = req.query.url; // Page URL
  const domain = req.query.domain; // Domain
  const gdpr = req.query.gdpr; // GDPR
  const consent = req.query.consent; // GDPR Consent
  const usp = req.query.usp; // US Privacy
  const schain = req.query.schain; // Supply Chain

  let country = 'N/A';
  // Geo, Country
  const geo = geoip.lookup(ip);
  if(geo) {
    country = geo.country;
  }

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

  console.log('is mobile or tablet', req.useragent.browser, req.useragent.isMobile, req.useragent.isDesktop);

  console.log('vast >', req.requestTime, supplyTagId, ip, country, hostname, ua);
  console.log(width, height, visibility, url, domain, gdpr, consent, usp, schain);

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
