class DemandTagsResult {
  constructor(list, total) {
    this.list = list;
    this.total = total
  }
  getList() {
    return this.list;
  }
  getTotal() {
    return this.total;
  }
}

module.exports = DemandTagsResult;
