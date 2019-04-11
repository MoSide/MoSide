import {ResponseHandler} from '../src/response-handler/response.handler'
import {Get} from "../src/moside/decorators/HttpMethod";
import {Controller} from "../src/moside/decorators/Controller";
import {Inject, Parameter} from "../src/mood/Inject.decorator";

@Controller({
  path: '/'
})
export class HomeController {

  @Get('/:test')
  index(@Inject(Parameter.path, 'test') res: ResponseHandler) {
    res.status(10000).message('Hello World').body({})
  }

}
