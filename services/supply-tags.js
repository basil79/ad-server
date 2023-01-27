const { JDBCRepository, SqlParam } = require('../models/jdbc');
const SupplyTag = require('../models/supply-tag');

class SupplyTags extends JDBCRepository {
  constructor(jdbcClient, elasticClient) {
    super(jdbcClient);
    this.elasticClient = elasticClient;

    this.ID = '$id';
    this.NAME = '$name';
    this.SUPPLY_ACCOUNT_ID = '$supply_account_id';
    this.SITE_ID = '$site_id';
    this.DEMAND_TAG_ID = '$demand_tag_id';
    this.ACCOUNT_ID = '$account_id';
    this.IS_ACTIVE = '$is_active';
    this.FROM = '$from';
    this.SIZE = '$size';
    this.SORT_COLUMN = '$sort_column';
    this.SORT_ORDER = '$sort_order';

  }
  get(id, supplyAccountId, siteId, demandTagId, accountId) {
    return new Promise((res, rej) => {
      this.procedureQuery('get_supply_tags', [
        new SqlParam(this.ID, id),
        new SqlParam(this.SUPPLY_ACCOUNT_ID, supplyAccountId),
        new SqlParam(this.SITE_ID, siteId),
        new SqlParam(this.DEMAND_TAG_ID, demandTagId),
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
            res(new SupplyTag(rows[0][0]));
          } else {
            res(null);
          }
        }
      });
    });
  }
}

module.exports = SupplyTags;
