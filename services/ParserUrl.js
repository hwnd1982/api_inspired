const {
  URL_IMG_PREFIX,
  URL_CART_PREFIX,
  URL_GOODS_PREFIX,
  URL_COLORS_PREFIX,
  URL_ORDERS_PREFIX,
  URL_CATEGORIES_PREFIX
} = process.env;

export default class ParserUrl {
  constructor(req) {
    this.url = req.url;
    this.method = req.method;
  };

  get isImg() {
    // req - объект с информацией о запросе, res - объект для управления отправляемым ответом
    // чтобы не отклонять uri с img
    return this.url.substring(1, 4) === URL_IMG_PREFIX;
  }

  get isCategories() {
    return this.url.includes(URL_CATEGORIES_PREFIX);
  }

  get isColors() {
    return this.url.includes(URL_COLORS_PREFIX);
  }

  get isOrders() {
    return this.url.includes(URL_ORDERS_PREFIX);
  }

  get isGoods() {
    return this.url.includes(URL_GOODS_PREFIX);
  }

  get isCart() {
    return this.url.includes(URL_CART_PREFIX);
  }

  get isGet() {
    return this.method === "GET";
  }
  
  get isPost() {
    return this.method === "POST";
  }

  get isPatch() {
    return this.method === "PATCH";
  }

  get isDel() {
    return this.method === "DELETE";
  }

  get isOptions() {
    // запрос с методом OPTIONS может отправлять браузер автоматически для проверки CORS заголовков
    // в этом случае достаточно ответить с пустым телом и этими заголовками
    // end = закончить формировать ответ и отправить его клиенту
    return this.method === "OPTIONS";
  }
}