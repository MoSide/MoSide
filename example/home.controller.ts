import { Controller, Http } from '../src/moside'
import { Response } from '../src/response-handler'
import { Inject, Parameter } from '../src/mood'

@Controller({
  path: '/'
})
export class HomeController {

  @Http
  get(@Inject(Parameter.query, 'id', 0) test: number,
      res: Response) {
    res.body({
      message: 'hello world',
      test
    })
  }
}
