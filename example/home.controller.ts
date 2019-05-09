import {Http} from '../src/moside/decorators/HttpMethod'
import {Controller} from '../src/moside/decorators/Controller'
import {MoResponse} from '../src/response-handler/moResponse'

@Controller({
  path: '/'
})
export class HomeController {

  @Http
  '/hello'(res: MoResponse) {
    res.body({
      message: 'hello world'
    })
  }
}
