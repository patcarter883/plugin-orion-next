/* eslint-disable @typescript-eslint/no-namespace */
import { Model, Element, Item, Collection } from '@vuex-orm/core'
import { FilterOperator } from '@tailflow/laravel-orion/lib/drivers/default/enums/filterOperator'
import { iSearchObject } from 'src/composables/searchModel'
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
    ): Promise<Item<Model> | Collection<Model>>
    $all(): Promise<M[]>
    $destroy(
      ids: (string | number) | (string | number)[]
    ): Promise<Item<Model> | Collection<Model>>
    $lookFor(string: string): Promise<M | M[]>
    $scope(scope: string, parameters?: unknown[]): Promise<M | M[]>
    $filter(filters: iFilter[]): Promise<M | M[]>
    $search(searchParameters: iSearchObject): Promise<M[] | undefined>
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
