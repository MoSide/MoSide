import e = require('express');

export class ResponseHandler {

  private _status: number = 0
  private _message: string = ''
  private _body: any
  private _file: string = ''
  private _mark: boolean = false

  constructor(private res: e.Response,
              private _next: e.NextFunction) {
  }

  status(status: number): ResponseHandler {
    this._status = status
    return this
  }

  message(message: string): ResponseHandler {
    this._message = message
    return this
  }

  body(body: any): ResponseHandler {
    this._body = body
    return this
  }

  // sendFile(file: string): ResponseHandler {
  //     if (!this.rootPath)
  //         throw new Error('根目录没有设置，请检查是否为RouterHandler设置了根目录');
  //
  //     if (this.rootPath.lastIndexOf('/') === 0) {
  //         this.rootPath.pop();
  //     }
  //     if (file.indexOf('/') === 0)
  //         this._file = this.rootPath + file;
  //     else
  //         this._file = this.rootPath + '/' + file;
  //     return this;
  // }

  end(): void {
    return
  }

  next(err?: any): ResponseHandler {
    this._next(err)
    this._mark = true
    return this
  }

  response(): void {
    let p = this
    if (this._mark) {
      return
    }

    if (this._file) {
      // getFileCache(this._file, function (err, data) {
      //   if (data) {
      //     p.res.writeHead(200, {
      //       'content-type': mime.lookup(path.basename(p._file))
      //     })
      //
      //     p.res.end(data)
      //   } else {
      //     p.res.status(404)
      //   }
      // })
      // this.res.sendFile(this._file);
    }
    else {

      if (this._status !== 0 && this._message === '') {
        throw new Error('返回状态不为0，但消息为空')
      }
      //
      // if (this.responseModel) {
      //     let resKey = _.keys(this.responseModel);
      //     this._body = _.pick(this._body, resKey);
      // }

      let resMessage = {
        status: this._status,
        message: this._message,
      }

      if (this._body !== undefined) {
        resMessage['body'] = this._body
      }
      this.res.json(resMessage)
    }
  }
}

/**
 * Created by yskun on 2017/4/18.
 */
