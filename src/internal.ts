import * as puppeteer from "puppeteer";

const zipRegex = /^\d{5}$/;

const rewriteMap = new Map<
  string,
  (val: string | number | boolean) => string
>();
rewriteMap.set("purveyor", (val) => `purveyor=${val}`);
rewriteMap.set("query", (val) => `query=${encodeURIComponent(val)}`);
rewriteMap.set("searchTitlesOnly", (val) => (val ? "srchType=T" : ""));
rewriteMap.set("hasImage", (val) => (val ? "hasPic=1" : ""));
rewriteMap.set("postedToday", (val) => (val ? "postedToday=1" : ""));
rewriteMap.set("hideDuplicates", (val) => (val ? "bundleDuplicates=1" : ""));
rewriteMap.set("milesFromLocation", (val) => `searchDistance=${val}`);
rewriteMap.set("zipCode", (val) =>
  `${val}`.match(zipRegex) ? `postal=${val}` : ""
);
rewriteMap.set("minPrice", (val) => `min_price=${val}`);
rewriteMap.set("maxPrice", (val) => `max_price=${val}`);
rewriteMap.set(
  "makeAndModel",
  (val) => `make_and_model=${encodeURIComponent(val)}`
);

export function createQueryString(filter?: object): string {
  if (!filter) {
    return "";
  }
  let queryString = "";
  for (let [name, value] of Object.entries(filter)) {
    if (value === null || value === undefined || value === "") {
      continue;
    }
    const rewriter = rewriteMap.get(name);
    if (rewriter) {
      queryString += rewriter(value);
    }
  }
  return queryString;
}

export async function* getAsyncIterator(
  site: string,
  category: string,
  queryString: string
): AsyncIterableIterator<string> {
  const url = `https://${site}.craigslist.org/search/${category}?${queryString}`;
  console.log(url);
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(url, {
    waitUntil: "networkidle0",
  });
  let elements = await page.$$("a.post-title");
  console.log(elements.length);
  try {
    for await (let e of elements) {
      yield await (await e.getProperty("href")).jsonValue();
    }
  } finally {
    browser.close();
  }
}
