import { pagination, shuffle } from "../utils/utils.js";
import Db from "./Db.js";

export default class Goods extends Db {
  constructor(data, colors) {
    super(data);
    this.colors = colors;
    this.goods = [...data];
  }
  
  filter({post: id, params}) {
    console.log(id, params);
    if (id) {
      this.id = id;
      this.find(id)
      return this;
    }

    this.isKeys(params);

    if (this.filterByList()) return this;

    if (this.filterByGender()) return this;

    if (!this.filterByCategory()) {
      this.filterByCategories();
    }
    
    this.filterByColors();

    return this;
  }

  find() {
    this.data = this.data.find(item => item.id === this.id);

    if (!this.data) this.error(404, 'Item Not Found');
  }

  filterByGender() {
    if (!this.params.gender) return null;

    if (this.params.gender === "all") {
      this.paginationCount = +this.params.count || 4;
    } else {
      this.data = this.data.filter((item) => item.gender === this.params.gender);
      this.paginationCount = +this.params.count || 8;
    }

    if (!this.params.category) {
      this.data = this.data.filter((item) => item.top);

      this.shuffle();

      if (this.paginationCount < this.data.length) {
        this.data.length = this.paginationCount;
      }

      return true;
    }
  }

  filterByCategory() {
    if (!this.params.category) return null;

    if (!this.params.gender) {
      this.error(403, "Not gender params");
    }
    
    this.data = this.data.filter((item) => item.category === this.params.category);

    if (this.params.top) {
      this.data = this.data.filter((item) => item.top && item.id !== this.params.exclude);

      this.shuffle();
      this.setLength();
    }

    return true;
  }

  filterByCategories() {
    if (!this.params.categories) return null; 

    const categories = this.params.categories.trim().toLowerCase();

    this.data = this.data.filter((item) => categories.includes(item.category));
  }

  filterByColors() {
    if (!this.params.colors) return null;

    const colors = this.params.colors.trim().toLowerCase();
    const colorsId = this.colors
      .filter(color => colors.includes(color.title)).map(color =>color.id);
    
    this.data = this.data.filter((item) =>
      item.colors.reduce((isFinded, itemColorId) =>
        (isFinded || colorsId.includes(itemColorId) ? true : false), false));
  }
  

  filterByMinPrice() {
    if (!this.params.minprice) return null;

    this.data = this.data.filter((item) => item.price >= +this.params.minprice)
  }

  filterByMaxPrice() {
    if (!this.params.maxprice) return null;

    this.data = this.data.filter((item) => item.price <= +this.params.maxprice)
  }
  filterByType() {
    if (!this.params.type) return null;

    this.data = this.data.filter((item) => item.type === this.params.type);
  }
  filterBySearch() {
    if (!this.params.search) return null;

    const search = this.params.search.replaceAll("+", " ").trim().toLowerCase();
    this.data = this.data.filter((item) => {
      return (
        item.title.toLowerCase().includes(search) ||
        item.description.toLowerCase().includes(search)
      );
    });
  }

  filterByList() {
    if (!this.params.list) return null;

    const list = params.list.trim().toLowerCase();

    this.data = this.goods.filter((item) => list.includes(item.id)).reverse();

    return true;
  }

  shuffle() {
    this.data = shuffle(this.data);
  }

  pagination() {
    const { data, page, pages, totalCount } = pagination(this.data, this.page, this.paginationCount);

    this.data = data;
    this.page = page;
    this.pages = pages;
    this.totalCount = totalCount;
  }

  setLength() {
    if (this.paginationCount < this.data.length) {
      this.data.length = paginationCount;
    }
  }

  get(res) {
    if (this.id) {
      super.get(res);
      this.data = [...this.goods];
      this.id = 0;

      return;
    }

    this.page = +this.params.page || 1;

    if (this.params.count === "all") {
      this.totalCount = this.data.length;
      this.pages = 1;
    } else {
      this.paginationCount = +this.params.count || 12;
      this.pagination();
    }

    res.end(JSON.stringify({list: this.data, page: this.page, pages: this.pages, totalCount: this.totalCount}));
    
    this.data = [...this.goods];
  }

  isKeys(params) {
    const keys = Object.keys(params);
    
    if (keys.length) {
      const isKeys = keys.every((item) => [
        "page",
        "count",
        "gender",
        "category",
        "categories",
        "type",
        "search",
        "list",
        "top",
        "exclude",
        "colors",
        "minprice",
        "maxprice",
        ].includes(item)
      );

      if (!isKeys) {
        this.error(403, "Fail Params");
      }
    }

    this.params = params;
  }
}
