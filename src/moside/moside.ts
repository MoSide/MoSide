import {initController} from './util/controller'
import {MosideProcess} from './util/process'
import {Moon} from '../moon/moon'
import {MoodAdapter} from './util/mood.adapter'
import {Framework} from './framework.interface'
import {ExpressAdapter} from './util/express.adapter'
import {IHttpMethod} from './method.interface'

export class Moside {
  private routerList: any[] = []
  private adapter: Framework
  private methods: IHttpMethod[]

  process: MosideProcess
  plugin: Moon

  protected constructor() {
    this.plugin = new Moon([
      new MoodAdapter
    ])

    this.process = new MosideProcess(
      this.plugin,
      this.postErrorMessage.bind(this)
    )

    this.adapter = new ExpressAdapter()
  }

  static async create(routerList: any[]): Promise<Moside> {
    const ret = new Moside()
    ret.routerList = routerList
    await ret.onInit()
    return ret
  }

  postErrorMessage(e: Error) {

  }

  getRouter() {
    return this.adapter.router(this.methods)
  }

  private async onInit() {
    this.methods = await initController(this.process, this.routerList)
  }
}
