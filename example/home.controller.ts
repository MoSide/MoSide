import { Controller, Http } from '../src/moside'
import { Response } from '../src/response-handler'

@Controller({
  path: '/'
})
export class HomeController {

  @Http
  '/hello'(res: Response) {
    res.body({
      message: 'hello world'
    })
  }
}
