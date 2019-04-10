import {Moside} from "../moside/moside";

interface IMiddleware {
  path: string
  method: string
  func: Function
}

export function getExpressMiddlewares(ins: Moside): IMiddleware[] {

  return [{
    path: '',
    method: '',
    func: (req, res, next) => {

    }
  }]
}