import {configure, getLogger} from 'log4js'

configure({
  appenders: {
    console: {
      type: 'console'
    },
    app: {
      type: 'dateFile',
      filename: 'log/app',
      pattern: '-yyyy-MM-dd.log',
      alwaysIncludePattern: true
    }
  },
  categories: {
    default: {
      appenders: ['console', 'app'],
      level: 'trace'
    }
  },
  pm2: true
})

export const logger = getLogger('KINGMAY')
logger.level = process.env.NODE_ENV === 'production' ? 'info' : 'debug'