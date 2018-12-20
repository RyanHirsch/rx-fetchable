import AbortController from "abort-controller";
import isomorphicFetch from "isomorphic-fetch";
import { Observable, Subscriber } from "rxjs";

export default function fetch(
  stringOrRequest: string | Request,
  init: RequestInit = {}
): Observable<Response> {
  return Observable.create((subscriber: Subscriber<Response>) => {
    // tslint:disable-next-line variable-name
    const ACtrl =
      typeof window !== "undefined" && "AbortController" in window
        ? (window as any).AbortController
        : AbortController;

    const controller = new ACtrl();
    let complete = false;

    function successfulFetch(fetchResponse: Response) {
      complete = true;
      subscriber.next(fetchResponse);
      subscriber.complete();
    }

    function failedFetch(err: any) {
      complete = true;
      if (err.name === "AbortError") {
        return;
      }
      console.error(`${err.name}`, err);
      subscriber.error(err);
    }

    function unsubscribe() {
      if (!complete) {
        controller.abort();
      }
    }

    isomorphicFetch(stringOrRequest, {
      ...init,
      signal: controller.signal,
    }).then(successfulFetch, failedFetch);

    return unsubscribe;
  });
}
