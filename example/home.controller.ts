import {Get} from "../src/moside/decorators/HttpMethod";
import {Controller} from "../src/moside/decorators/Controller";
import {MoResponse} from "../src/response-handler/moResponse";

@Controller({
  path: '/'
})
export class HomeController {

  @Get('/')
  index(res: MoResponse) {
    res.body('hello world')
  }

}
