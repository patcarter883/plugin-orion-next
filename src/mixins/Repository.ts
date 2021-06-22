import { Repository, Model, Element, Item, Collection } from '@vuex-orm/core'
import { FilterOperator } from '@tailflow/laravel-orion/lib/drivers/default/enums/filterOperator'
import { Model as OrionModel } from '@tailflow/laravel-orion/lib/model'

export interface iQueryFunctions<M extends Model> {
  lookFor(string: string): Promise<Item<M> | Collection<M>>
  scope(scope: string)
}

export function mixin(repository: typeof Repository): void {
  const repo = repository.prototype as Repository<Model>

  repo.$save = async function(
    records: Element | Element[]
  ): Promise<Model | Model[]> {
    const model = this.getModel()
    const orion = model.$self().orionModel as OrionModel
    const orionPromises = []
    let orionResponse
    if (Array.isArray(records)) {
      for (const record of records) {
        orionPromises.push(orion.$query().store(record))
      }
      orionResponse = await Promise.all(orionPromises)

      return this.save(orionResponse.map((m) => m.$attributes))
    } else {
      orionResponse = await orion.$query().store(records)

      return this.save(orionResponse.$attributes)
    }
  }

  repo.$update = async function(
    records: Element | Element[]
  ): Promise<Model | Model[]> {
    const model = this.getModel()
    const orion = model.$self().orionModel as OrionModel
    const orionPromises = []
    let orionResponse
    if (Array.isArray(records)) {
      for (const record of records) {
        orionPromises.push(orion.$query().store(record))
      }
      orionResponse = await Promise.all(orionPromises)

      return this.save(orionResponse.map((m) => m.$attributes))
    } else {
      orionResponse = await orion.$query().store(records)

      return this.save(orionResponse.$attributes)
    }
  }

  repo.$find = async function(
    ids: (string | number) | (string | number)[]
  ): Promise<Item<Model> | Collection<Model>> {
    const model = this.getModel()
    const orion = model.$self().orionModel as OrionModel
    let orionResponse
    if (Array.isArray(ids)) {
      const pk = model.$primaryKey() as string[]
      const query = orion.$query()

      pk.forEach((value, index) => {
        query.filter(value, FilterOperator.Equal, ids[index])
      })

      orionResponse = await query.search()
      this.save(orionResponse.map((m) => m.$attributes))
      return this.query().find(ids)
    } else {
      orionResponse = await orion.$query().find(ids)
      this.save(orionResponse.$attributes)
      return this.query().find(ids)
    }
  }

  repo.$all = async function(): Promise<Collection<Model>> {
    const model = this.getModel()
    const orion = model.$self().orionModel as OrionModel
    const orionResponse = await orion.$query().get()
    this.save(orionResponse.map((m) => m.$attributes))
    return this.query().get()
  }

  repo.$destroy = async function(
    ids: (string | number) | (string | number)[]
  ): Promise<Item<Model> | Collection<Model>> {
    const model = this.getModel()
    const orion = model.$self().orionModel as OrionModel
    let orionResponse
    const orionPromises = []
    if (Array.isArray(ids)) {
      for (const id of ids) {
        orionPromises.push(orion.$query().destroy(id))
      }
      orionResponse = await Promise.all(orionPromises)

      return this.query().destroy(
        orionResponse.map((m) => m.$attributes.id as string | number)
      )
    } else {
      orionResponse = await orion.$query().destroy(ids)

      return this.query().destroy(
        orionResponse.$attributes.id as string | number
      )
    }
  }
}
