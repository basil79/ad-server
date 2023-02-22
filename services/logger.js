const winstonElasticsearch = require('winston-elasticsearch');
const winston = require('winston');
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

module.exports = logger
