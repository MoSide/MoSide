import { MosideProcess } from './process'
import { IHttpMethod } from '../method.interface'

export declare function initController(process: MosideProcess, routerList: any[]): Promise<IHttpMethod[]>;

export declare function runCycleLife(hook: string, context: any): Promise<any>;
