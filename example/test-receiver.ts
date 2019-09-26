import {Model, Query} from '../src/mood'

@Model
export class TestReceiver {
  @Query test: number
}
