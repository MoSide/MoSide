export interface IParameter {
    token: any;
    type: any;
    index: number;
    require?: boolean;
    defaultValue?: any;

    [param: string]: any;
}
