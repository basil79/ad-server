const DemandTag = require('../models/demand-tag');

class DemandTags {
  constructor(elasticClient) {
    this.elasticClient = elasticClient
  }
  get(id, supplyTagId, country, hostname, visibility, device) {
    return new Promise((res, rej) => {

      let query = {
        match: {
          supply_tag_id: supplyTagId
        }
      }

      this.elasticClient.search({
        index: 'demand-tags',
        body: {
          query: query
        }
      }, (err, result) => {
        if(err) {
          rej(err)
        } else {
          // Result
          // TODO:
          const demandTag = new DemandTag({});
          console.log(demandTag);
          // Resolve
          res({});
        }
      });
    });
  }
  getMany(supplyTagId) {
    return new Promise((res, rej) => {

    })
  }
}

module.exports = DemandTags
