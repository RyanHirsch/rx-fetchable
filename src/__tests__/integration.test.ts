import fetch from "../fetch";

describe("Functional fetch", () => {
  it("handles a 500 level response", async () => {
    const result = await fetch("https://httpstat.us/500").toPromise();
    expect(result).toHaveProperty("status", 500);
  });

  it("handles a 200 json response", async () => {
    const result = await fetch("https://httpbin.org/json").toPromise();
    expect(result).toHaveProperty("status", 200);
    expect(result.headers.get("content-type")).toEqual("application/json");

    const json = await result.json();
    expect(json.slideshow).toHaveProperty("title", "Sample Slide Show");
  });

  it("handles a 200 xml response", async () => {
    const result = await fetch("https://httpbin.org/xml").toPromise();
    expect(result).toHaveProperty("status", 200);
    expect(result.headers.get("content-type")).toEqual("application/xml");

    const xml = await result.text();
    expect(xml).toMatch(/^<\?xml /);
  });

  it("handles a 200 text (html) response", async () => {
    const result = await fetch("https://httpbin.org/html").toPromise();
    expect(result).toHaveProperty("status", 200);
    expect(result.headers.get("content-type")).toEqual("text/html; charset=utf-8");

    const xml = await result.text();
    expect(xml).toMatch(/<\/html>$/);
  });
});
