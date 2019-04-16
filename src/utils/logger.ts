import {configure, getLogger} from 'log4js'

configure({
  appenders: {
    console: {
      type: 'console'
    },
  },
  categories: {
    default: {
      appenders: ['console'],
      level: 'trace'
    }
  },
  pm2: true
})

export const logger = getLogger('MoSide')
logger.level = process.env.NODE_ENV === 'production' ? 'info' : 'debug'