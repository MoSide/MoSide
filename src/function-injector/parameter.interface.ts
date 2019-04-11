export interface IParameter {
  token: any
  type: any
  index: number
  require?: boolean

  [param: string]: any
}