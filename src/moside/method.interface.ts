import {CtrFunc} from "../function-injector/ctr-func";

export interface IHttpMethod {
  path: string
  method: string
  target: CtrFunc
}