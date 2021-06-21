import { AxiosInstance } from 'axios'
import { Repository, Model, Element, Item, Collection } from '@vuex-orm/core'
import { Model as OrionModel } from '@tailflow/laravel-orion/lib/model'

declare module '@vuex-orm/core/dist/src/repository/Repository' {
  export interface Repository<M extends Model = Model> {
    /**
     * The axios instance.
     */
    axios: AxiosInstance
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
  interface Model {
    orionModel: OrionModel
  }
}
