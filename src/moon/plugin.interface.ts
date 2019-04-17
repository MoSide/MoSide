export interface PluginInterface {
  beforeController?(...any): Promise<boolean> | Promise<void> | boolean | void

  afterController?(...any): Promise<boolean> | Promise<void> | boolean | void
}
