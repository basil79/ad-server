const express = require('express');
const cors = require('cors');
const useragent = require('express-useragent');
const trackRouter = require('./routes/track');
const vastRouter = require('./routes/vast');
const net = require('net');
const crypto = require('crypto');

const app = express();
const port = normalizePort(process.env.PORT || '3000');

function normalizePort(val) {
  const _port = parseInt(val, 10);

  if(isNaN(_port)) {
    return val;
  }

  if(_port >= 0) {
    return _port;
  }

  return false;
}

app.use(cors({
  origin: function(origin, callback) {
    return callback(null, true);
  },
  optionsSuccessStatus: 200,
  credentials: true
}));

const requestTime = function (req, res, next) {
  req.requestTime = Date.now();
  next();
};

const generateHash = function(req, res, next) {
  let ip = req.headers['x-forwarded-for'] || req.ip;
  if(req.query.ip && net.isIP(req.query.ip)) {
    ip = req.query.ip;
  }

  const hash = crypto.createHash('md5').update(ip + req.useragent.source + req.requestTime).digest('hex');

  //console.log('hash', hash, req.useragent.source);
  //console.log('is mobile or tablet', req.useragent.browser, req.useragent.isMobile, req.useragent.isDesktop);
  //console.log('ua', ua);
  //console.log('ip', ip);
  //const device = req.useragent.isMobile ? 'Mobile' : 'Desktop';
  //console.log('device', device);
  //console.log('ua full', req.useragent);
  //console.log('hash', hash, device, req.useragent.browser);

  req.hash = hash;

  next();
}

app.use(requestTime);
app.use(useragent.express());
app.use(generateHash)

app.use('/track', trackRouter);
app.use('/vast', vastRouter);

app.listen(port, () => {
  console.log(`listening on port ${port}!`)
});
