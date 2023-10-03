import 'dotenv/config';
import * as url from "url";
import { readFileSync } from "node:fs";
import { createServer } from "node:http";
import ApiError from "./services/ApiError.js";
import Categories from "./services/Categories.js";
import Colors from "./services/Colors.js";
import FileURLToPath from './services/FileURLToPath.js';
import Goods from "./services/Goods.js";
import Image from "./services/Image.js";
import Orders from "./services/Orders.js";
import ParserUrl from "./services/ParserUrl.js";
import Cart from './services/Cart.js';
import { drainJson, getParams } from './utils/utils.js';
import { printInstructions } from './utils/printInstructions.js';

const PORT = process.env.PORT || 8024;
const URL_GOODS_PREFIX = process.env.URL_GOODS_PREFIX;
const dbPath = new FileURLToPath(url.fileURLToPath(new URL(".", import.meta.url)));
const {colors, categories, goods} = JSON.parse(readFileSync(dbPath.db)) || [];

const dbCategories = new Categories(categories);
const dbColors = new  Colors(colors);
const dbGoods  = new Goods(goods, colors);
const dbCart  = new Cart(dbPath.cart, goods);
const dbOrders  = new Orders(dbPath.orders);

createServer(async (req, res) => {
  const {
    isImg,
    isCart,
    isGoods,
    isColors,
    isOrders,
    isCategories,
    isGet,
    isDel,
    isPost,
    isPatch,
    isOptions,
  } = new ParserUrl(req);

  // CORS заголовки ответа для поддержки кросс-доменных запросов из браузера
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (isImg) {
    return new Image(dbPath, res);
  }

  // этот заголовок ответа указывает, что тело ответа будет в JSON формате
  res.setHeader("Content-Type", "application/json");

  if (isOptions) {
    return res.end();
  }

  try {
    if (isCategories) {
      return dbCategories.get(res);
    }

    if (isColors) {
      return dbColors.get(res);
    } 

    if (isOrders) {
      if (isPost) {
        return dbOrders.create(await drainJson(req), res);
      }
      
      return dbOrders.get(res);
    }

    if (isGoods && isGet) {
      return dbGoods.filter(getParams(req.url, URL_GOODS_PREFIX)).get(res);
    }

    if (isCart) {
      if(isPost || isPatch) {
        dbCart.add(await drainJson(req));
      }

      if(isDel) {
        dbCart.del(await drainJson(req));
      }

      return dbCart.get(res);
    }

    // если URI не начинается с нужного префикса - можем сразу отдать 404
    res.statusCode = 404;
    res.end(JSON.stringify({ message: "Not Found" }));
  } catch (err) {
    ApiError.error(err, res);
  }
})
  // выводим инструкцию, как только сервер запустился...
  .on("listening", () => printInstructions(PORT))
  .listen(PORT);
