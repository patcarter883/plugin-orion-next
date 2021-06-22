/* eslint-disable @typescript-eslint/no-namespace */
import { Model, Element, Item, Collection } from '@vuex-orm/core'
import { iQueryFunctions } from 'src/mixins/Repository'

declare module '@vuex-orm/core/dist/src/repository/Repository' {
  export interface Repository<M extends Model = Model> {
    $save(records: Element | Element[]): Promise<M | M[]>
    $update(records: Element | Element[]): Promise<M | M[]>
    $find(
      ids: (string | number) | (string | number)[]
    ): Promise<Item<M> | Collection<M>>
    $all(): Promise<Collection<M>>
    $destroy(
      ids: (string | number) | (string | number)[]
    ): Promise<Item<M> | Collection<M>>
    $query: iQueryFunctions<M>
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
