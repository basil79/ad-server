class SupplyTag {
  constructor(json) {
    this.id = json.id;
    this.name = json.name;
    this.demandTagCount = json.demand_tag_count;
    this.supplyAccountId = json.supply_account_id;
    this.siteId = json.site_id;
    this.accountId = json.account_id;
    // Stats
    this.mediaCost = json.media_cost; // Calculated based on tag definition
    this.cpm = json.cpm; // Calculated (media_cost / impressions)*1000
    //
    this.requests = json.requests; // ad request
    this.opportunities = json.opportunities; // ad loaded
    this.impressions = json.impressions; // ad impression
    this.requestFillRate = json.request_fill_rate; // Calculated round((impressions / requests) * 100), 2)
    this.opportunityFillRate = json.opportunity_fill_rate; // Calculated round((impressions / opportunities) * 100), 2)
    this.rate = json.rate;
    this.revenue = json.revenue; // Calculated based on revenue model
    this.grossRevenue = json.gross_revenue;
    this.rpm = json.rpm; // Calculated (revenue / impressions) * 1000 -     (RPM) Ad revenue per thousand impressions
    this.eRpm = json.e_rpm; // Calculated (revenue / opportunities) * 1000 - (eRPM) - effective revenue per thousand impressions
    // End of stats
    this.insertDate = json.insert_date;
    this.modifyDate = json.modify_date;
    this.isActive = Boolean(json.is_active)
  }
  getId() {
    return this.id;
  }
  getName() {
    return this.name;
  }
  getDemandTagCount() {
    return this.demandTagCount;
  }
  getSupplyAccountId() {
    return this.supplyAccountId;
  }
  getSiteId() {
    return this.siteId;
  }
  getAccountId() {
    return this.accountId;
  }
  getMediaCost() {
    return this.mediaCost;
  }
  getCpm() {
    return this.cpm;
  }
  getRequests() {
    return this.requests;
  }
  getOpportunities() {
    return this.opportunities
  }
  getImpressions() {
    return this.impressions;
  }
  getRequestFillRate() {
    return this.requestFillRate;
  }
  getOpportunityFillRate() {
    return this.opportunityFillRate;
  }
  getRate() {
    return this.rate;
  }
  getRevenue() {
    return this.revenue;
  }
  getGrossRevenue() {
    return this.grossRevenue;
  }
  getRpm() {
    return this.rpm;
  }
  getERpm() {
    return this.eRpm;
  }
  getInsertDate() {
    return this.insertDate;
  }
  getModifyDate() {
    return this.modifyDate;
  }
  getIsActive() {
    return this.isActive
  }
}

module.exports = SupplyTag;
