import {Framework, RequestAdapter, ResponseAdapter} from "../framework.interface";
import * as e from "express";

export class ExpressAdapter implements Framework {
  request(request: any): RequestAdapter {
    return request
  }

  response([request, response, next]: [e.Request, e.Response, e.NextFunction]): ResponseAdapter {
    return {
      next,
      status(code: number) {
        return response.status(code)
      },
      setHeader(name: string, value: any) {
        return response.setHeader(name, value)
      },
      removeHeader(name: string) {
        return response.removeHeader(name)
      },
      send(data?: any) {
        return response.send(data)
      }
    }
  }

  router(routerList: any[]) {

  }
}
