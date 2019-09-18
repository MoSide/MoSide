import {Body, Model, Query, Require} from '../src/mood'

@Model
export class TestReceiver {
  @Require @Query test: number
}
