export abstract class AbstractFactory<T> {
  abstract create(model: any): T
  abstract empty(): T
}
