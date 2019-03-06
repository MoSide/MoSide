import * as Mongoose from 'mongoose'
import {IWrite} from './write.interface'
import {IRead} from './read.interface'

export class BaseRepository<T extends Mongoose.Document> implements IWrite<T>, IRead<T> {

  private static _model: Map<string, Mongoose.Model<Mongoose.Document>> = new Map()

  get model(): Mongoose.Model<Mongoose.Document> {
    let m = BaseRepository._model.get(this.constructor.name)
    if (!m)
      throw new Error('the model has not init')
    return m

  }

  static setModel(repository: string, model: Mongoose.Model<Mongoose.Document>) {
    BaseRepository._model.set(repository, model)
  }

  retrieve(): Promise<T[]> {
    return this.model.find({}).exec() as Promise<T[]>
  };

  findById(id: Object | string | number): Promise<T> {
    return this.model.findById(id).exec() as Promise<T>
  };

  create(item: Object): Promise<T> {
    return this.model.create(item) as Promise<T>
  };

  update(id: Object | string | number, item: Object): Promise<T> {
    return this.model
      .findByIdAndUpdate(
        id,
        {$set: item},
        {upsert: true}).exec() as Promise<T>
  };


  del(id: Object | string | number): Promise<any> {
    return this.model.remove({_id: id}).exec() as Promise<any>
  };
}