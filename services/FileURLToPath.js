import path from "path";

const {
  DB_PATH,
  DB_CART_PATH,
  DB_GOODS_PATH,
  DB_COLORS_PATH,
  DB_ORDERS_PATH,
  DB_CATEGORIES_PATH,
} = process.env;

export default class FileURLToPath {
  constructor(path) {
    this.__dirname = path;
  }

  get db () {
    return path.resolve(this.__dirname, DB_PATH);
  }

  get cart () {
    return path.resolve(this.__dirname, DB_CART_PATH);
  }

  get goods () {
    return path.resolve(this.__dirname, DB_GOODS_PATH);
  }

  get colors () {
    return path.resolve(this.__dirname, DB_COLORS_PATH);
  }
  
  get orders () {
    return path.resolve(this.__dirname, DB_ORDERS_PATH);
  }

  get categories () {
    return path.resolve(this.__dirname, DB_CATEGORIES_PATH);
  }
}


