class ApiFeatures {
  constructor(query, queryObj) {
    this.query = query;
    this.queryObj = queryObj;
  }

  search() {
    if (this.queryObj.search) {
      this.query = this.query.find({ name: { $regex: this.queryObj.search } });
    }
    return this;
  }

  paginate() {
    const pageSize = this.queryObj.pageSize || 5;
    const pageNumber = this.queryObj.pageNumber || 1;
    const skip = (pageNumber - 1) * pageSize;
    this.query = this.query.skip(skip).limit(pageSize);
    // console.log(this,'this')
    return this;
  }

  sort() {
    if (this.queryObj.sort) {
      const sortBy = this.queryObj.sort.replace(",", " ");
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort("-createdAt");
    }
    return this;
  }

  filter() {
    const excludedFields = ["sort", "pageNumber", "pageSize"];
    let filteredData = { ...this.queryObj };
    Object.keys(filteredData).forEach((key) => {
      if (excludedFields.includes(key)) {
        delete filteredData[key];
      }
    });
    console.log(filteredData, "filteredData");
    this.query = this.query.find(filteredData);

    return this;
  }
}

module.exports = ApiFeatures;
