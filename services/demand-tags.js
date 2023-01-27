const {JDBCRepository, SqlParam} = require('../models/jdbc');
const DemandTag = require('../models/demand-tag');
const DemandTagsResult = require('../models/demand-tags-result');

/*
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
*/

class DemandTags extends JDBCRepository {
  constructor(jdbcClient, elasticClient) {
    super(jdbcClient);
    this.elasticClient = elasticClient;

    this.ID = '$id';
    this.NAME = '$name';
    this.DEMAND_ACCOUNT_ID = '$demand_account_id';
    this.ADVERTISER_ID = '$advertiser_id';
    this.SUPPLY_TAG_ID = '$supply_tag_id';
    this.ACCOUNT_ID = '$account_id';
    this.VAST_URL = '$vast_url';
    this.BIDDER = '$bidder';
    this.TIER = '$tier';
    this.PRIORITY = '$priority';
    this.CPM = '$cpm';
    this.FLOOR = '$floor';
    this.FREQUENCY = '$frequency';
    this.TRACKING_EVENTS = '$tracking_events';
    this.TIMEOUT = '$timeout';
    this.IS_ACTIVE = '$is_active';
    this.FROM = '$from';
    this.SIZE = '$size';
    this.SORT_COLUMN = '$sort_column';
    this.SORT_ORDER = '$sort_order';

  }
  get(id, demandAccountId, advertiserId, supplyTagId, accountId) {
    return new Promise((res, rej) => {
      this.procedureQuery('get_demand_tags', [
        new SqlParam(this.ID, id),
        new SqlParam(this.DEMAND_ACCOUNT_ID, demandAccountId),
        new SqlParam(this.ADVERTISER_ID, advertiserId),
        new SqlParam(this.SUPPLY_TAG_ID, supplyTagId),
        new SqlParam(this.ACCOUNT_ID, accountId),
        new SqlParam(this.FROM, null),
        new SqlParam(this.SIZE, null),
        new SqlParam(this.SORT_COLUMN, null),
        new SqlParam(this.SORT_ORDER, null)
      ], function(err, rows) {
        if(err) {
          rej(err);
        } else {
          if(rows[0].length != 0) {
            res(new DemandTag(rows[0][0]));
          } else {
            res(null);
          }
        }
      });
    });
  }
  getMany(id, demandAccountId, advertiserId, supplyTagId, accountId, from, size, sortColumn, sortOrder) {
    return new Promise((res, rej) => {
      this.procedureQuery('get_demand_tags', [
        new SqlParam(this.ID, id),
        new SqlParam(this.DEMAND_ACCOUNT_ID, demandAccountId),
        new SqlParam(this.ADVERTISER_ID, advertiserId),
        new SqlParam(this.SUPPLY_TAG_ID, supplyTagId),
        new SqlParam(this.ACCOUNT_ID, accountId),
        new SqlParam(this.FROM, from),
        new SqlParam(this.SIZE, size),
        new SqlParam(this.SORT_COLUMN, sortColumn),
        new SqlParam(this.SORT_ORDER, sortOrder)
      ], function (err, rows) {
        if(err) {
          rej(err);
        } else {
          if(rows.length == 3) {
            res(new DemandTagsResult(rows[0].map((row) => new DemandTag(row)), rows[1][0]['@row_num']));
          } else {
            res(null);
          }
        }
      });
    });
  }
}

module.exports = DemandTags
