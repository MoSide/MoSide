import { TypeProvider } from '../function-injector/type-provider.interface';
import { IParameter } from '../function-injector/parameter.interface';
export declare class Mood {
    protected source: Map<string, any>;
    protected constructor();
    static create(source: [string, any][]): Mood;
    resolve(parameters: IParameter[]): {
        result: boolean;
        body?: TypeProvider[];
    };
    handleModel(Model: any): any;
    handleParameter({ target, require, type }: IParameter): any;
}
