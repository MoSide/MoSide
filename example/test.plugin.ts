import { PluginInterface } from '../src/moon'
import { Mood } from '../src/mood/mood'
import { Injectable } from '../src/function-injector'
import { Reason } from '../src/moside/util/reason'
import { Response } from '../src/response-handler'

export class TestPlugin implements PluginInterface {
  @Injectable
  beforeController(mood: Mood) {
    console.log(`receive token`)
  }

  @Injectable
  onControllerError(reason: Reason, response: Response) {
    console.log(reason)
    // response.status(500).body(reason.message)
    return false
  }
}
