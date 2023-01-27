const { Client } = require('@elastic/elasticsearch');
const config = require('../config.json');
const {JDBCClient} = require('./jdbc');
const SupplyTags = require('../services/supply-tags');
const DemandTags = require('../services/demand-tags');

class AdServe {
  constructor(config) {
    this.config = config;
    // Clients
    this.jdbcClient = new JDBCClient();
    this.elasticClient = new Client(this.getElasticClientConfig(this.config));
    this.elasticClient.info().then(console.log, console.log);
    // Services
    this.supplyTagsService = new SupplyTags(this.jdbcClient.createShared(this.getJDBCClientConfig(this.config)), this.elasticClient);
    this.demandTagsService = new DemandTags(this.jdbcClient.createShared(this.getJDBCClientConfig(this.config)), this.elasticClient);
  }
  supplyTags() {
    return this.supplyTagsService;
  }
  demandTags() {
    return this.demandTagsService;
  }
  getJDBCDefaultClientConfig() {
    return {
      host : 'localhost',
      user : 'root',
      password : '',
      database : 'adserve',
      multipleStatements : true
    }
  }
  getJDBCClientConfig(config) {
    const jdbcConfig = config.jdbc;
    if(!jdbcConfig) {
      return this.getJDBCDefaultClientConfig()
    }
    return jdbcConfig;
  }
  getElasticDefaultClientConfig() {
    return {
      node: 'http://localhost:9200'
    }
  }
  getElasticClientConfig(config) {
    const elasticConfig = config.elastic;
    if(!elasticConfig) {
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

