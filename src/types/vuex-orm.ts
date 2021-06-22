/* eslint-disable @typescript-eslint/no-namespace */
import { Model, Element, Item, Collection } from '@vuex-orm/core'
import { FilterOperator } from '@tailflow/laravel-orion/lib/drivers/default/enums/filterOperator'

interface iFilter {
  field: string
  operator: FilterOperator
  value: string
}
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
    $lookFor(string: string): Promise<Item<M> | Collection<M>>
    $scope(
      scope: string,
      parameters?: unknown[]
    ): Promise<Item<M> | Collection<M>>
    $filter(filters: iFilter[]): Promise<Item<M> | Collection<M>>
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
