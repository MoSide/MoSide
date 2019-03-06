import Mongoose = require('mongoose')
import {IModelOptions} from './base/model-options.interface'

export class MongooseHelper {

  mongoose: Mongoose.Connection
  models: Map<string, Mongoose.Model<Mongoose.Document>> = new Map

  constructor(public uri: string) {
    this.connect()
  }

  connect(): void {
    if (!this.uri)
      return
    Mongoose.Promise = Promise

    this.mongoose = Mongoose.createConnection(this.uri, {
      useNewUrlParser: true
    })
    this.mongoose.once('open', () => {
      console.log(`Connect to ${this.uri}`)
    })
  }

  async dropdatebase() {
    return await this.mongoose.dropDatabase()
  }

  addModels(models: IModelOptions[]) {
    for (let m of models) {
      let result = this.mongoose.model(m.name, m.schema)
      this.models.set(m.name, result)
      m.repository.setModel(m.repository.name, result)
    }
  }
}
