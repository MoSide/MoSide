export interface IRead<T> {
  retrieve(): Promise<T[]>;

  findById(id: string): Promise<T>;
} 

