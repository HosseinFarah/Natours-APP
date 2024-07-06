class APIFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  filter() {
    const queryObj = { ...this.queryString };
    const excludeFields = ['page', 'limit', 'sort', 'fields', 'search'];
    excludeFields.forEach((el) => delete queryObj[el]);
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
    this.query = this.query.find(JSON.parse(queryStr));
    return this;
  }

  sort() {
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(',').join(' ');
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort('-createdAt');
    }
    return this;
  }

  fields() {
    if (this.queryString.fields) {
      const fieldsBy = this.queryString.fields.split(',').join(' ');
      this.query = this.query.select(fieldsBy);
    } else {
      this.query = this.query.select('-__v');
    }
    return this;
  }

  search() {
    if (this.queryString.search) {
      const searchBy = this.queryString.search;
      const searchItems = {
        $or: [
          { name: { $regex: searchBy, $options: 'i' } },
          { description: { $regex: searchBy, $options: 'i' } },
          { summary: { $regex: searchBy, $options: 'i' } },
          { 'startLocation.description': { $regex: searchBy, $options: 'i' } },
          {
            locations: {
              $elemMatch: { description: { $regex: searchBy, $options: 'i' } },
            },
          }
        ],
      };
      this.query = this.query.find(searchItems);
    }
    return this;
  }
  paginate() {
    const page = this.queryString.page * 1 || 1;
    const limit = this.queryString.limit * 1 || 10;
    const skip = (page - 1) * limit;
    this.query = this.query.skip(skip).limit(limit);
    return (page,limit,this);
  }
}
module.exports = APIFeatures;
