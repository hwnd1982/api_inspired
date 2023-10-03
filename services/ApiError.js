export default class ApiError extends Error {
  constructor(statusCode, data) {
    super();
    this.statusCode = statusCode;
    this.data = data;
  }

  static error(err, res) {
    console.log("err: ", err);
    if (err instanceof ApiError) {
      // обрабатываем сгенерированную нами же ошибку
      res.writeHead(err.statusCode);
      res.end(JSON.stringify(err.data));
    } else {
      // если что-то пошло не так - пишем об этом в консоль и возвращаем 500 ошибку сервера
      res.statusCode = 500;
      res.end(JSON.stringify({ message: "Server Error" }));
    }
  };
}
