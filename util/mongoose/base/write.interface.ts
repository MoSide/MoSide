export interface IWrite<T> {
  create(item: T): Promise<T>;

  update(_id: string, item: T): Promise<T>;

  del(_id: string): Promise<T>;
}

