/* eslint-disable @typescript-eslint/no-namespace */
import { Model, Element, Item, Collection } from '@vuex-orm/core'

declare module '@vuex-orm/core/dist/src/repository/Repository' {
  export interface Repository<M extends Model = Model> {
    $save(records: Element | Element[]): Promise<M | M[]>
    // $save(records: Element[]): Promise<M[]>
    // $save(record: Element): Promise<M>
    // $update(records: Element[]): Promise<M[]>
    // $update(record: Element): Promise<M>
    $update(records: Element | Element[]): Promise<M | M[]>
    // $find(id: string | number): Promise<Item<M>>
    // $find(ids: (string | number)[]): Promise<Collection<M>>
    $find(
      ids: (string | number) | (string | number)[]
    ): Promise<Item<M> | Collection<M>>
    $all(): Promise<Collection<M>>
    // $destroy(ids: (string | number)[]): Promise<Collection<M>>
    // $destroy(id: string | number): Promise<Item<M>>
    $destroy(
      ids: (string | number) | (string | number)[]
    ): Promise<Item<M> | Collection<M>>
  }
}

declare module '@vuex-orm/core/dist/src/model/Model' {
  namespace Model {
    export let orionModel: unknown
  }

  interface Model {
    orionModel: unknown
  }
}
