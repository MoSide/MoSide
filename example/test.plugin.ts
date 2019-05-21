import { PluginInterface } from '../src/moon'
import { Inject, Parameter, Require } from '../src/mood'
import { Mood } from '../src/mood/mood'
import { Injectable } from '../src/function-injector'

export class TestPlugin implements PluginInterface {
  @Injectable
  beforeController(@Require @Inject(Parameter.query, 'token')token: string, mood: Mood) {
    console.log(`receive token`, token)
  }
}
