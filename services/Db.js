import ApiError from "./ApiError.js";

export default class Db {
  constructor(data) {
    this.data = data;
  }

  get(res) {
    res.end(JSON.stringify(this.data));
  }

  error(status, message) {
    throw new ApiError(status, { message });
  }
}
