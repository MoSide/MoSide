export interface PluginInterface {
    beforeController?(...any: any[]): Promise<boolean> | Promise<void> | boolean | void;
    afterController?(...any: any[]): Promise<boolean> | Promise<void> | boolean | void;
}
