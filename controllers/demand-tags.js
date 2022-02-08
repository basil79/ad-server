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

      // Search
      this.elasticClient.search({
        index: 'demand-tags',
        body: {
          query: query
        }
      }, (err, result) => {
        if(err) {
          // Reject
          rej(err)
        }

        // Result
        // TODO:
        // Resolve
        res({});

      })

    });
  }
  getMany(supplyTagId) {
    return new Promise((res, rej) => {

    })
  }
}

module.exports = DemandTags
