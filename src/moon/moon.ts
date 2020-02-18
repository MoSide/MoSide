import { PluginInterface } from './plugin.interface'
import { CtrFunc, FunctionInjector } from '../function-injector'
import { Mood } from '../mood/mood'

export class Moon {

  constructor(private plugins: PluginInterface[] = []) {
  }

  async run(stage: 'before' | 'after' | 'error', injector: FunctionInjector, extraPlugins: PluginInterface[]): Promise<{ status: boolean, index?: number, result?: string }> {
    const mood: Mood = injector.get(Mood)

    const target = {
      before: 'beforeController',
      after: 'afterController',
      error: 'onControllerError'
    }[stage]

    const processPlugin: CtrFunc[] = [
      ...this.plugins.filter(plugin => plugin[target]),
      ...extraPlugins.filter(plugin => plugin[target])
    ].map(plugin => new CtrFunc(plugin, target))
    const [status] = await injector.resolveAndApply(processPlugin, mood, false)
    if (status.status === false) {
      status.result = `${processPlugin[status.index].context.constructor.name}(stage: ${stage}) has wrong process`
    }
    return status
  }

  add(plugin: PluginInterface) {
    this.plugins.push(plugin)
  }

  remove(plugin: PluginInterface) {
    const result = this.plugins.indexOf(plugin)
    if (result > -1) {
      this.plugins.splice(result, 1)
    }
  }
}
