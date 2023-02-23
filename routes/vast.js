const net = require('net');
const express = require('express');
const xml = require('xml');
const geoip = require('geoip-lite');
const { version } = require('../package.json');
const adserve = require('../models');
const router = express.Router();
const config = require('../config.json');
const logger = require('../services/logger');

router.get('/:supplyTagId', (req, res) => {

  const supplyTagId = Number(req.params.supplyTagId);
  const sessionId = req.hash;

  const host = req.protocol + '://' + req.get('host');
  const origin = req.headers['origin'];
  let hostname = req.hostname;
  if(origin) {
    try {
      hostname = new URL(origin).hostname;
    } catch (e) {}
  }

  console.log('hostname', hostname);

  // Queries
  const width = Number(req.query.w) || 300; // Width
  const height = Number(req.query.h) || 250; // Height
  let countryCode = 'N/A';
  const visibility = Number(req.query.v) || 1; // Visibility
  const url = req.query.url; // Page URL
  const domain = req.query.dom; // Domain
  const device = req.query.dev || req.useragent.isMobile ? 'Mobile' : 'Desktop';
  const browser = req.query.bw || req.useragent.browser;
  const os = req.query.os || req.useragent.os;

  const gdpr = Number(req.query.gdpr) || 0; // GDPR
  const gdprConsent = req.query.gdpr_consent || ''; // GDPR Consent
  const usp = req.query.usp || ''; // US Privacy
  const schain = req.query.schain || ''; // Supply Chain

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

  console.log('vast >', req.requestTime, supplyTagId, os, browser, device, ip, countryCode, hostname, req.useragent.source);
  console.log(width, height, visibility, url, domain, gdpr, gdprConsent, usp, schain);

  const EMPTY_VAST = {
    VAST: [{
      _attr: {
        version: '2.0'
      }
    }]
  }

  // TODO: filter by ip, countryCode, device, os, browser
  adserve
    .supplyTags()
    .get(supplyTagId)
    .then((supplyTag) => {

      if(supplyTag != null) {

        // Log structure
        const log = {
          session_id: sessionId,
          event: 'arq', // err, imp, alo
          value: null,
          supply_tag_id: supplyTagId,
          demand_tag_id: null,
          cpm: null,
          floor: null,
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

        adserve
          .demandTags()
          .getMany(null, null, null, supplyTagId)
          .then((demandTags) => {

            console.log(demandTags);

            if(demandTags.total != 0) {

              const VAST = {
                VAST: [
                  { _attr: { version: '2.0' }},
                  { Ad: [
                      { _attr: { id: supplyTag.id }},
                      { InLine: [
                          { AdSystem: [{ _attr: { version: version }}, 'AdServe.TV']},
                          { Error: { _cdata: host + '/track?evt=err&st=' + supplyTagId + '&val=[ERRORCODE]&sid=' + sessionId }},
                          { Impression: { _cdata: host + '/track?evt=imp&st=' + supplyTagId + '&sid=' + sessionId }},
                          { Creatives: [
                              { Creative: [
                                  { _attr: { sequence: '1', AdID: supplyTagId } },
                                  { Linear: [
                                      { Duration: '00:00:30' },
                                      { AdParameters: {
                                          _cdata: JSON.stringify({
                                            sessionId,
                                            supplyTagId: supplyTag.id,
                                            demandTags: demandTags.list,
                                            width,
                                            height,
                                            visibility,
                                            url,
                                            gdpr,
                                            gdprConsent,
                                            usp,
                                            schain
                                          })
                                        }
                                      },
                                      /*{ TrackingEvents: [
                                          { Tracking: { _attr: { event: 'start'}, _cdata: ''}}
                                        ]
                                      },*/
                                      { MediaFiles: [
                                          { MediaFile: {
                                              _attr: {
                                                delivery: 'progressive',
                                                type: 'application/javascript',
                                                width: width,
                                                height: height,
                                                apiFramework: 'VPAID'
                                              },
                                              _cdata: config.vpaid ? config.vpaid.url : ''
                                            }
                                          }
                                        ]
                                      }
                                    ]
                                  }
                                ]
                              }
                            ]
                          }
                        ]
                      }
                    ]
                  }
                ]
              };
              // VAST
              res
                .set('Content-Type', 'text/xml')
                .send(xml(VAST, { indent: true, declaration: true }));
            } else {
              // Empty VAST
              res
                .set('Content-Type', 'text/xml')
                .send(xml(EMPTY_VAST, { indent: true, declaration: true }));
            }

          })
          .catch((err) => {
            console.log(err);
            // Empty VAST
            res
              .set('Content-Type', 'text/xml')
              .send(xml(EMPTY_VAST, { indent: true, declaration: true }));
          });

      } else {
        console.log('supply tag id', supplyTagId, 'not found');
        res.status(404).send('Not found');
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send(err.message);
    });

  // .header('Access-Control-Allow-Credentials', true)

});

module.exports = router;
