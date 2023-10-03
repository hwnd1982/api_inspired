import { writeFile } from "node:fs/promises";
import { readFileSync } from "node:fs";
import Db from "./Db.js";

const { URL_ORDERS_PREFIX } = process.env;

export default class Orders extends Db {
  constructor(path) {
    super(JSON.parse(readFileSync(path)) || []);
    
    this.path = path;
  }
  
  read() {
    return JSON.parse(readFileSync(this.path)) || [];
  }

  async create(data, res) {
    if (!data.order.length) {
      return this.error(403, 'Order is empty');
    }

    data.id = Math.random().toString(10).substring(2, 5);
    data.createdAt = new Date().toGMTString();

    this.data.push(data);
    await this.write();

    res.statusCode = 201;
    res.setHeader("Access-Control-Expose-Headers", "Location");
    res.setHeader("Location", `${URL_ORDERS_PREFIX}/${data.id}`);
    res.end(JSON.stringify(this.data));
  }

  async write() {
    try {
      await writeFile(this.path, JSON.stringify(this.data));
    } catch (err) {
      this.error(500, 'Server Error')
    }
  }
}


