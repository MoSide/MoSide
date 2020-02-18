export class Reason {
  readonly isError: boolean = false

  constructor(public err: any) {
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
