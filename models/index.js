const { Client } = require('@elastic/elasticsearch');
const config = require('../config.json');
const DemandTags = require('../services/demand-tags');

class AdServe {
  constructor(config) {
    this.config = config;
    this.elasticClient = new Client(this.getElasticClientConfig(this.config))
  }
  demandTags() {
    return new DemandTags(this.elasticClient);
  }
  getElasticDefaultClientConfig() {
    return {
      node: 'http://localhost:9200'
    }
  }
  getElasticClientConfig(config) {
    const elasticConfig = config.elastic;
    if(elasticConfig) {
      return this.getElasticDefaultClientConfig()
    }
    return elasticConfig;
  }
  toString() {
    return JSON.stringify(this.config);
  }
}

const adserve = new AdServe(config);

module.exports = adserve

