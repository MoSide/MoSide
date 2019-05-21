import { PluginInterface } from '../src/moon'
import { Inject, Parameter, Require } from '../src/mood'
import { Mood } from '../src/mood/mood'
import { Injectable } from '../src/function-injector'

export class TestPlugin implements PluginInterface {
  @Injectable
  beforeController(mood: Mood) {
    console.log(`receive token`)
  }
}
