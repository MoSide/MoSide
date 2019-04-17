import {IHttpMethod} from "./method.interface";

export interface Framework {
  request(params: any[]): RequestAdapter

  response(params: any[]): ResponseAdapter

  router(methods: IHttpMethod[])
}

export interface ResponseAdapter {
  next(err?: any)

  status(code: number)

  setHeader(name: string, value: string | number | string[])

  removeHeader(name: string)

  send(data?: any)
}

export interface RequestAdapter {
}