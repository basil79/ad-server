const express = require('express');
const cors = require('cors');
const useragent = require('express-useragent');
const vastRouter = require('./routes/vast');

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

app.use(requestTime);
app.use(useragent.express());
app.use('/vast', vastRouter);

app.listen(port, () => {
  console.log(`listening on port ${port}!`)
});
