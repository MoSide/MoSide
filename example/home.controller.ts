import {Controller, Http} from '../src/moside'
import {Response} from '../src/response-handler'
import {Inject, Parameter, Require} from '../src/mood'
import {TestReceiver} from './test-receiver'

@Controller({
  path: '/'
})
export class HomeController {

  @Http
  get(test: TestReceiver,
      res: Response) {
    res.body({
      message: 'hello world',
      test
    })
  }
}
