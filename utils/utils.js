export const drainJson = async (req) =>
  await new Promise((resolve) => {
    let data = "";
    req.on("data", (chunk) => {
      data += chunk;
    });
    req.on("end", () => {
      resolve(JSON.parse(data));
    });
  });

export const shuffle = (array) => {
  const shuffleArray = [...array];
  for (let i = shuffleArray.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    [shuffleArray[i], shuffleArray[j]] = [shuffleArray[j], shuffleArray[i]];
  }

  return shuffleArray;
};

export const pagination = (data, page, count) => {
  const end = count * page;
  const start = page === 1 ? 0 : end - count;
  const totalCount = data.length;

  const pages = Math.ceil(data.length / count);

  return {
    data: data.slice(start, end),
    page,
    pages,
    totalCount,
  };
};

export const getParams = (url, prefix) => {
  const params = {};
  // убираем из запроса префикс URI, разбиваем его на путь и параметры
  const [post, query] = url.substring(prefix.length).split("?");

  // параметры могут отсутствовать вообще или иметь вид a=b&b=c
  // во втором случае наполняем объект queryParams { a: 'b', b: 'c' }
  if (query) {
    for (const piece of query.split("&")) {
      const [key, value] = piece.split("=");
      params[key] = value ? decodeURIComponent(value) : "";
    }
  }

  return {post: post.substring(1), params};
}
