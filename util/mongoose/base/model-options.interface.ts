import * as Mongoose from 'mongoose'

export interface IModelOptions {
  name: string,
  schema: Mongoose.Schema,
  repository?: any
}