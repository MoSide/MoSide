'use strict'
Object.defineProperty(exports, '__esModule', {value: true})

class Reason {
  constructor(err) {
    this.err = err
    this.isError = false
    this.isError = err instanceof Error
  }

  get message() {
    if (this.isError) {
      return this.err.message
    }
    return this.err
    }
    get stack() {
      return this.isError ? this.err.stack : ''
    }
}

exports.Reason = Reason
