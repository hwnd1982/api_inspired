import { writeFile } from "node:fs/promises";
import { readFileSync } from "node:fs";
import Db from "./Db.js";

export default class Cart extends Db {
  constructor(path, goods) {
    super(JSON.parse(readFileSync(path)) || []);
    
    this.path = path;
    this.goods = goods;
  }

  setTotal() {
    const { totalPrice, totalCount } = this.data.list.reduce(
      ({ totalPrice, totalCount }, { id, count }) => ({
        totalPrice: totalPrice + this.data.products[id].price * count,
        totalCount: totalCount + count,
      }),
      { totalPrice: 0, totalCount: 0 },
    );

    this.data.totalPrice = totalPrice;
    this.data.totalCount = totalCount;
  }

  async del (data, res) {
    const itemIndex = this.data.list.findIndex(
      item =>
        item.id === data.id &&
        item.color === data.color &&
        item.size === data.size,
    );

    if (itemIndex !== -1) {
      const newProducts = {};
      
      this.data.list.splice(itemIndex, 1);

      if (!this.data.list.find(item => item.id === data.id)) {
        for (const key in this.data.products) {
          if (key !== data.id) {
            newProducts[key] = this.data.products[key];
          }
        }

        this.data.products = newProducts;
      }
    }

    await this.write();
    res.statusCode = 204;
    res.end();
  }

  async add(data, res) {
    const item =
      this.data.list.find(
        item =>
          item.id === data.id &&
          item.color === data.color &&
          item.size === data.size,
      ) || null;
    const prodict = this.data.products[data.id];

    if (!prodict) {
      const { id, title, price, pic } = this.goods.find(item => item.id === data.id);

      this.data.products[id] = { title, price, pic };
    }

    if (!item) {
      const { id, color, count, size } = data;

      this.data.list.push({ id, color, count, size });
    } else {
      item.count = data.count;
    }

    await this.write();
    this.get(res);
  }

  async write() {
    this.setTotal();

    try {
      await writeFile(this.path, JSON.stringify(this.data));
      
      console.log("Cart has been saved!");
    } catch (err) {
      this.error(500, 'Server Error')
    }
  }
}
