import { Controller, Http } from '../src/moside'
import { Response } from '../src/response-handler'
import { Inject, Parameter } from '../src/mood'

@Controller({
  path: '/'
})
export class HomeController {

  @Http
  'post::/'(
    @Inject(Parameter.all, 'id') test: string,
    res: Response
  ) {
    throw Error('110011:TEST ERROR')
    // res.body({
    //   message: 'hello world',
    //   test
    // })
  }
}
