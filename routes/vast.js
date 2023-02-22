const net = require('net');
const express = require('express');
const xml = require('xml');
const geoip = require('geoip-lite');
const adserve = require('../models');
const router = express.Router();

router.get('/:supplyTagId', (req, res) => {

  const supplyTagId = req.params.supplyTagId;

  const host = req.protocol + '://' + req.get('host');
  //const host = req.headers['host'];
  const origin = req.headers['origin'];
  let hostname = req.hostname;
  if(origin) {
    try {
      hostname = new URL(origin).hostname;
    } catch (e) {}
  }

  console.log('hostname', hostname);

  // Queries
  const width = req.query.w || 300; // Width
  const height = req.query.h || 250; // Height
  const visibility = req.query.v || 1; // Visibility
  const url = req.query.url; // Page URL
  const domain = req.query.dom; // Domain

  const gdpr = req.query.gdpr || 0; // GDPR
  const gdprConsent = req.query.gdpr_consent || ''; // GDPR Consent
  const usp = req.query.usp || ''; // US Privacy
  const schain = req.query.schain || ''; // Supply Chain


  let ip = req.headers['x-forwarded-for'] || req.ip;
  if(req.query.ip && net.isIP(req.query.ip)) {
    ip = req.query.ip;
  }

  let countryCode = 'N/A';
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

  const device = req.useragent.isMobile ? 'Mobile' : 'Desktop';

  console.log('is mobile or tablet', req.useragent.browser, req.useragent.isMobile, req.useragent.isDesktop);

  console.log('vast >', req.requestTime, supplyTagId, ip, countryCode, hostname, device, req.useragent.source);
  console.log(width, height, visibility, url, domain, gdpr, gdprConsent, usp, schain);

  const EMPTY_VAST = {
    VAST: [{
      _attr: {
        version: '2.0'
      }
    }]
  }

  adserve
    .supplyTags()
    .get(supplyTagId)
    .then((supplyTag) => {

      //console.log(supplyTag);
      if(supplyTag != null) {

        adserve
          .demandTags()
          .getMany(null, null, null, supplyTagId)
          .then((demandTags) => {

            console.log(demandTags);
            console.log(demandTags.total);
            if(demandTags.total != 0) {

              const VAST = {
                VAST: [
                  {_attr: {version: '2.0'}},
                  {
                    Ad: [
                      {_attr: {id: supplyTag.id}},
                      {
                        InLine: [
                          {AdSystem: [{_attr: {version: '1'}}, 'AdServe']},
                          {Error: {_cdata: host + '/track?evt=err&st=' + supplyTagId + '&val=[ERRORCODE]&sid=' + req.hash}},
                          {Impression: {_cdata: host + '/track?evt=imp&st=' + supplyTagId + '&sid=' + req.hash}},
                          {
                            Creatives: [
                              {
                                Creative: [
                                  {_attr: {sequence: '1', AdID: supplyTagId}},
                                  {
                                    Linear: [
                                      {Duration: '00:00:30'},
                                      {
                                        AdParameters: {
                                          _cdata: JSON.stringify({
                                            sid: req.hash,
                                            st: supplyTag.id,
                                            tags: demandTags.list,
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
                                      {
                                        MediaFiles: [
                                          {
                                            MediaFile: {
                                              _attr: {
                                                delivery: 'progressive',
                                                type: 'application/javascript',
                                                width: width,
                                                height: height,
                                                apiFramework: 'VPAID'
                                              },
                                              _cdata: ''
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
