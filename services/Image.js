import { readFile } from "node:fs";

export default class Image {
  constructor(url, res) {
    this.url = url;
    this.res = res;

    this.read();
  }

  read() {
    this.res.statusCode = 200;
    this.res.setHeader("Content-Type", "image/jpeg");
    readFile(this.url, (err, image) => {
      res.end(image);
    });
  }
}
