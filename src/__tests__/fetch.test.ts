import fetch from "../fetch";
import isomorphicFetch from "isomorphic-fetch";

jest.mock("isomorphic-fetch");

(isomorphicFetch as jest.Mock).mockImplementation(() =>
  Promise.resolve({ ok: true, json: () => Promise.resolve({}) })
);

describe("Observable Fetch", () => {
  it("returns an empty object", async () => {
    const result = await fetch("lies").toPromise();
    const json = await result.json();
    expect(json).toEqual({});
  });

  it("unsubscribes as expected", () => {
    const jsonPromise = jest.fn().mockReturnValue(Promise.resolve());
    (isomorphicFetch as jest.Mock).mockImplementationOnce(() =>
      Promise.resolve({ json: jsonPromise })
    );
    const fetchSub = fetch("arbitrary").subscribe(() => {
      expect("never get here").toEqual(null);
    });
    fetchSub.unsubscribe();
    expect(jsonPromise).toHaveBeenCalledTimes(0);
  });
});
