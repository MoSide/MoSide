import {Method} from '../util/moside/method'
import {ResponseHandler} from '../util/moside/response.handler'
import {Controller} from '../util/moside/controller'
import {ResMsg} from '../util/moside/express'

@Controller({
  providers: [],
  path: '/'
})
export class HomeController {
  @Method('get', '/')
  @ResMsg([{
    status: 10000,
    message: 'Hello World'
  }])
  index(res: ResponseHandler) {
    res.status(10000).message('Hello World').body({})
  }
}
