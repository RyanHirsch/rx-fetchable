import AbortController from "abort-controller";
import isomorphicFetch from "isomorphic-fetch";
import { Observable } from "rxjs";

export default function fetch(
  stringOrRequest: string | Request,
  init: RequestInit = {}
): Observable<Response> {
  // tslint:disable-next-line variable-name
  const ACtrl =
    typeof window !== "undefined" && "AbortController" in window
      ? (window as any).AbortController
      : AbortController;
  const controller = new ACtrl();

  return new Observable(subscriber => {
    isomorphicFetch(stringOrRequest, { ...init, signal: controller.signal })
      .then(async fetchResponse => {
        subscriber.next(fetchResponse);
        subscriber.complete();
      })
      .catch((err: any) => {
        if (err.name === "AbortError") {
          return;
        }
        subscriber.error(err);
      });

    return () => {
      controller.abort();
    };
  });
}
