import {Framework, RequestAdapter, ResponseAdapter} from "../framework.interface";
import * as e from "express";
import {IHttpMethod} from "../method.interface";
import {logger} from "../../utils/logger";

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

  router(methods: IHttpMethod[]) {
    const router = e.Router()
    methods.forEach(({method, path, target}) => {
      logger.info(`creating router`, method, path, target.context.constructor.name, target.prop)
      const targetApply = target.apply.bind(target)
      switch (method) {
        case 'get':
          router.get(path, targetApply)
          break
        case 'post':
          router.post(path, targetApply)
          break
        case 'del':
          router.delete(path, targetApply)
          break
        case 'put':
          router.put(path, targetApply)
          break
        default:
          if (router[method]) {
            router[method](path, targetApply)
          } else {
            console.log(`something wrong`, method, path, target)
          }
      }
    })
    return router
  }
}
