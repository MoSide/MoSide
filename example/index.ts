import 'reflect-metadata'
import {server} from './server'
import {app} from './express'
import {Moside} from '../src/moside/moside'
import {HomeController} from "./home.controller";

Moside.create([
  HomeController
]).then(moside => {
  app.use(moside.getRouter())
  server.on('request', app)
})


