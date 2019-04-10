import 'reflect-metadata'
import {server} from './server'
import {app} from './express'
import {Moside} from '../src/moside/moside'
import {HomeController} from "./home.controller";
import e = require('express');


(async () => {
  let moside = Moside.create([
    HomeController
  ], e)
  server.on('request', app)
  app.use(moside.getRouter())
})()

