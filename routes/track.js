const express = require('express');
const router = express.Router();
const winston = require('winston');
const winstonElasticsearch = require('winston-elasticsearch');
const net = require('net');
const geoip = require('geoip-lite');

const esTransportOpts = {
  level: 'info',
  indexPrefix: 'log',
  indexSuffixPattern: 'YYYY-MM-DD',
  clientOpts : {
    node: 'http://localhost:9200', //process.env.ES_ADDON_URI, // TODO
    maxRetries: 5,
    requestTimeout: 10000,
    sniffOnStart: false,
    /*auth: {
      username: process.env.ES_ADDON_USER,
      password: process.env.ES_ADDON_PASSWORD
    }*/
  },
  source: process.env.LOG_SOURCE || 'api'
};

const esTransport = new winstonElasticsearch.ElasticsearchTransport(esTransportOpts);

const logger = winston.createLogger({
  transports: [
    new winston.transports.Console({
      level: 'info',
      json: true
    }),
    esTransport //Add es transport
  ]
});

const TRANSPARENT_GIF_BUFFER = Buffer.from('R0lGODlhAQABAIAAAP///wAAACwAAAAAAQABAAACAkQBADs=', 'base64');


// http://localhost:3000/track?evt=imp&st=3&sid=e3f117adaf4abdb2dae4a08ba40e4c3a
router.get('/', (req, res) => {

  const event = req.query.evt;
  const value = req.query.val;
  const sessionId = req.query.sid;
  const supplyTagId = req.query.st;
  const demandTagId = req.query.dt;

  const cpm = req.query.cpm;
  const floor = req.query.floor;

  // Targeting
  let countryCode = req.query.cc || 'N/A';
  const visibility = req.query.v || 1;
  const device = req.query.dev;
  const domain = req.query.dom || '';
  const browser = req.query.bw || req.useragent.browser;
  const os = req.query.os || req.useragent.os;

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
    event, // req, imp, alo
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
  logger.info('log', log);


  res.writeHead(200, { 'Content-Type': 'image/gif' });
  res.end(TRANSPARENT_GIF_BUFFER, 'binary');
});

module.exports = router;
