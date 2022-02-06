const express = require('express');
const cors = require('cors');

// Routes
const vastRouter = require('./routes/vast');

const app = express();
const port = normalizePort(process.env.PORT || '3000');

function normalizePort(val) {
  const port = parseInt(val, 10);

  if(isNaN(port)) {
    return val;
  }

  if(port >= 0) {
    return port;
  }

  return false;
}

// Cors
app.use(cors({
  origin: function(origin, callback) {
    return callback(null, true);
  },
  optionsSuccessStatus: 200,
  credentials: true
}));

app.use('/vast', vastRouter);

app.get('/', (req, res) => {
  console.log(req.ip);
  res.send('Hello World!')
});

app.listen(port, () => {
  console.log(`listening on port ${port}!`)
});
