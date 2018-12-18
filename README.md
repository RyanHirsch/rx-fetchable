# rx-fetchable

A cancellable fetch observable. Uses `rxjs` and `isomorphic-fetch`

## Install

```sh
npm i rx-fetchable
```

## Usage

```js
import rxFetchable from "rx-fetchable";
import { mergeMap } from "rxjs/operators";

rxFetchable("http://ifconfig.co/json")
  .pipe(mergeMap(resp => resp.json()))
  .subscribe(ipInfo => console.log(`Your IP is: ${ipInfo.ip}`)))();
```
