import * as puppeteer from "puppeteer";

export function createQueryString(filter?: object): string {
  if (!filter) {
    return "";
  }
  let queryString = "";
  for (let [name, value] of Object.entries(filter)) {
    if (value === null || value === undefined || value === "") {
      continue;
    }

    switch (name) {
      case "query":
        queryString += `query=${encodeURIComponent(value)}`;
        break;
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
  return;
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(url, {
    waitUntil: "networkidle0",
  });
  let elements = await page.$$("a.post-title");
  console.log(elements.length);
  for await (let e of elements) {
    yield await (await e.getProperty("href")).jsonValue();
  }
  browser.close();
}
