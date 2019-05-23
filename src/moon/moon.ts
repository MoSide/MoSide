import { PluginInterface } from './plugin.interface'
import { FunctionInjector } from '../function-injector/function-injector'
import { CtrFunc } from '../function-injector/ctr-func'
import { Mood } from '../mood/mood'

export class Moon {

  constructor(private plugins: PluginInterface[] = []) {
  }

  async run(stage: 'before' | 'after', injector: FunctionInjector, extraPlugins: PluginInterface[]): Promise<{ status: boolean, index?: number, result?: string }> {
    const mood: Mood = injector.get(Mood)

    const processPlugin: CtrFunc[] = [
      ...this.plugins.filter(plugin => plugin[stage + 'Controller']),
      ...extraPlugins.filter(plugin => plugin[stage + 'Controller'])
    ].map(plugin => new CtrFunc(plugin, stage + 'Controller'))
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
