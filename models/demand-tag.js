class DemandTag {
  constructor(id, supplyTagId, vastUrl) {
    this.id = id;
    this.supplyTagId = supplyTagId;
    this.vastUrl = vastUrl;
  }
  getId() {
    return this.id
  }
  getSupplyTagId() {
    return this.supplyTagId
  }
  getVastUrl() {
    return this.vastUrl
  }
}

module.exports = DemandTag
