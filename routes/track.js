const express = require('express');
const net = require('net');
const geoip = require('geoip-lite');
const router = express.Router();
const logger = require('../services/logger');

const TRANSPARENT_GIF_BUFFER = Buffer.from('R0lGODlhAQABAIAAAP///wAAACwAAAAAAQABAAACAkQBADs=', 'base64');


// http://localhost:3000/track?evt=imp&st=3&sid=e3f117adaf4abdb2dae4a08ba40e4c3a
router.get('/', (req, res) => {

  const event = req.query.evt;
  const value = req.query.val;
  const sessionId = req.query.sid;
  const supplyTagId = Number(req.query.st) || null;
  const demandTagId = Number(req.query.dt) || null;

  // Demand tag value
  const cpm = req.query.cpm;
  const floor = req.query.floor;

  // Targeting
  let countryCode = req.query.cc || 'N/A';
  const visibility = req.query.v || 1;
  const device = req.query.dev || req.useragent.isMobile ? 'Mobile' : 'Desktop';
  const domain = req.query.dom || '';
  const browser = req.query.bw || req.useragent.browser;
  const os = req.query.os || req.useragent.os;

  // IP
  let ip = req.headers['x-forwarded-for'] || req.ip;
  if(req.query.ip && net.isIP(req.query.ip)) {
    ip = req.query.ip;
  }

  // Geo, Country
  const geo = geoip.lookup(ip); // '87.70.14.10'
  if(geo) {
    countryCode = geo.country;
    console.log('geo', geo);
  }

  // Log structure
  const log = {
    session_id: sessionId,
    event, // err, imp, alo
    value,
    supply_tag_id: supplyTagId,
    demand_tag_id: demandTagId,
    cpm,
    floor,
    country_code: countryCode, // Targeting group
    ip,
    visibility,
    device,
    domain,
    browser,
    os,
    timestamp: new Date(req.requestTime).toISOString(),
    request_time: req.requestTime
  };

  console.log('track >', log);
  // Logger
  logger.info('log', log);

  res.writeHead(200, { 'Content-Type': 'image/gif' });
  res.end(TRANSPARENT_GIF_BUFFER, 'binary');
});

module.exports = router;
