import {MoResponse} from '../src/response-handler/moResponse'
import {Get} from "../src/moside/decorators/HttpMethod";
import {Controller} from "../src/moside/decorators/Controller";
import {Inject} from "../src/mood/Inject.decorator";
import {Parameter} from "../src/mood/parameter.enum";

@Controller({
  path: '/'
})
export class HomeController {

  @Get('/:test')
  index(@Inject(Parameter.path, 'test') res: MoResponse) {
  }

}
