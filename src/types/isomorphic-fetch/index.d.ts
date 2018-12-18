import { RequestInit } from "isomorphic-fetch";

declare module "isomorphic-fetch" {
  // tslint:disable-next-line:interface-name
  interface RequestInit {
    signal?: AbortSignal;
  }
}
