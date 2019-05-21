import { Controller, Http } from '../src/moside'
import { Response } from '../src/response-handler'
import { Inject, Parameter } from '../src/mood'

@Controller({
  path: '/'
})
export class HomeController {

  @Http
  '/hello/:world'(@Inject(Parameter.path, 'world') world,
                  @Inject(Parameter.query, 'test') test: number,
                  res: Response) {
    res.body({
      message: 'hello world',
      world,
      test
    })
  }
}
