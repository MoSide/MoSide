import 'reflect-metadata'
import { server } from './server'
import { app } from './express'
import { Moside } from '../src/moside/moside'
import { HomeController } from './home.controller'
import { TestPlugin } from './test.plugin'

Moside.create([
  HomeController
]).then(moside => {
  moside.plugin.add(
    new TestPlugin()
  )
  app.use(moside.getRouter())
  server.on('request', app)
})


