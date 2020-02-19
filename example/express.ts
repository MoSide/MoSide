import * as e from 'express'

import { json } from 'body-parser'

export const app: e.Express = e()
app.use(json())
