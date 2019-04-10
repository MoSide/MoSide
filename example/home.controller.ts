import {ResponseHandler} from '../src/response-handler/response.handler'
import {Get} from "../src/moside/decorators/HttpMethod";
import {Controller} from "../src/moside/decorators/Controller";

@Controller({
  path: '/'
})
export class HomeController {

  @Get('/')
  index(res: ResponseHandler) {
    res.status(10000).message('Hello World').body({})
  }

}
