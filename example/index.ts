import 'reflect-metadata'
import e = require('express')
import {server} from './server'
import {app} from './express'
import {Moside} from '../util/moside/moside'
import {routerList} from './router-list'


(async () => {
  let moside = Moside.create(routerList, e)
  server.on('request', app)
  app.use(moside.getRouter())
})()

