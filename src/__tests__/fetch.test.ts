import abortController from "abort-controller";
import isomorphicFetch from "isomorphic-fetch";

import fetch from "../fetch";

jest.mock("isomorphic-fetch");
(isomorphicFetch as jest.Mock).mockImplementation(() =>
  Promise.resolve({ ok: true, json: () => Promise.resolve({}) })
);

const abort = jest.fn();
jest.mock("abort-controller", () => {
  return jest.fn().mockImplementation(() => {
    return { abort, signal: {} };
  });
});

describe("Observable Fetch", () => {
  beforeEach(() => abort.mockClear());
  it("returns an empty object", async () => {
    const result = await fetch("lies").toPromise();
    const json = await result.json();
    expect(json).toEqual({});
    expect(abort).toHaveBeenCalledTimes(0);
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
    expect(abort).toHaveBeenCalledTimes(1);
  });
});
