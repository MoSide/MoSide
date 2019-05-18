import { Ctx } from '../moside/ctx'
import { ResponseAdapter } from '../moside/framework.interface'

export class Response {

  private _httpStatus: number = -1
  private _body: any
  private _error: any


  constructor(private responseAdapter: ResponseAdapter, public ctx: Ctx) {
  }

  header(name: string, value: any) {
    this.responseAdapter.setHeader(name, value)
    return this
  }

  removeHeader(name: string) {
    this.responseAdapter.removeHeader(name)
    return this
  }

  status(status: number): Response {
    this._httpStatus = status
    return this
  }

  body(body: any): Response {
    this._body = body
    return this
  }

  error(error: any): Response {
    this._error = error
    return this
  }

  end(): void {
    return
  }

  response(): void {
    if (this._error) {
      return this.responseAdapter.next(this._error)
    }

    if (this._httpStatus !== -1) {
      this.responseAdapter.status(this._httpStatus)
    }

    if (this._body !== undefined) {
      this.responseAdapter.send(this._body)
    } else {
      this.responseAdapter.send()
    }
  }
}

/**
 * Created by yskun on 2017/4/18.
 */
