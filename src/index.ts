import * as puppeteer from "puppeteer";

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(
    "https://seattle.craigslist.org/search/cta?query=blazer%20k5",
    {
      waitUntil: "networkidle0",
    }
  );
  let elements = await page.$$("a.post-title");
  console.log(elements.length);
  await Promise.all(
    elements.map(async (e) => {
      let href = await e.getProperty("href");
      console.log(await href.jsonValue());
    })
  );
  await browser.close();
})();
