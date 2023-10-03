import chalk from "chalk";

export const printInstructions = (port) => {
  console.log(`${chalk.cyan('Сервер Inspired запущен. Вы можете использовать его по адресу: ')}${chalk.yellow(`http://localhost:${port}`)}`);
}

//     if (process.env.NODE_ENV !== "test") {
//       console.log(
//         `Сервер Inspired запущен. Вы можете использовать его по адресу http://localhost:${PORT}`
//       );
//       console.log("Нажмите CTRL+C, чтобы остановить сервер");
//       console.log("Доступные методы:");
//       console.log(
//         `GET ${URI_PREFIX} - получить список всех товаров с пагинацией`
//       );
//       console.log(`GET ${URI_PREFIX}/{id} - получить товар по его ID`);
//       console.log(`GET /api/categories - получить список категорий`);
//       console.log(`GET /api/colors - получить список цветов`);
//       console.log(
//         `GET ${URI_PREFIX}?[param]
// Параметры:
//         gender
//         category&gender
//         search = поиск
//         count = количество товаров (12)
//         page = страница (1)
//         list={id},{id} - получить список товаров по id
//         exclude=id - исключить id
//         top=true - топ товары
//         `
//       );
//       console.log(
//         `POST /api/order - оформить заказ (
//           {
//             fio: str,
//             address?: str,
//             phone: str,
//             email: str,
//             delivery: bool,
//             goods: [{id, count}]
//           })
//           no validate`
//       );
//       console.log("Update 15/07/2023 add preload fetch image");
//       console.log(`Happy Coding 🎉`);
//     }