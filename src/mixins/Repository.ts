import { Repository, Model, Element, Item, Collection } from '@vuex-orm/core'
import { FilterOperator } from '@tailflow/laravel-orion/lib/drivers/default/enums/filterOperator'
// import { QueryBuilder } from '@tailflow/laravel-orion/lib/drivers/default/builders/queryBuilder'
import { Model as OrionModel } from '@tailflow/laravel-orion/lib/model'

export function mixin(repository: typeof Repository): void {
  const repo = repository.prototype as Repository<Model>

  repo.$search = async function(search) {
    const model = this.getModel()
    const orion = model.$self().orionModel as OrionModel
    const query = orion.$query()

    if (search.scopes) {
      search.scopes.forEach((scope) => {
        if (scope.parameters) {
          query.scope(scope.name, scope.parameters)
        } else {
          query.scope(scope.name)
        }
      })
    }

    if (search.filters) {
      search.filters.forEach((filter) => {
        if (filter.type) {
          query.filter(filter.field, filter.operator, filter.value, filter.type)
        } else {
          query.filter(filter.field, filter.operator, filter.value)
        }
      })
    }

    if (search.search) {
      query.lookFor(search.search.value)
    }

    if (search.sort) {
      search.sort.forEach((sort) => {
        query.sortBy(sort.field, sort.direction)
      })
    }

    const orionResponse = await query.search()

    return this.save(orionResponse.map((m) => m.$attributes))
  }

  repo.$lookFor = async function(string) {
    const model = this.getModel()
    const orion = model.$self().orionModel as OrionModel

    const orionResponse = await orion
      .$query()
      .lookFor(string)
      .search()

    return this.save(orionResponse.map((m) => m.$attributes))
  }

  repo.$scope = async function(scope, parameters = undefined) {
    const model = this.getModel()
    const orion = model.$self().orionModel as OrionModel

    const orionResponse = await orion
      .$query()
      .scope(scope, parameters)
      .search()

    return this.save(orionResponse.map((m) => m.$attributes))
  }

  repo.$filter = async function(filters) {
    const model = this.getModel()
    const orion = model.$self().orionModel as OrionModel
    const query = orion.$query()

    for (const { field, operator, value } of filters) {
      query.filter(field, operator, value)
    }

    const orionResponse = await query.search()
    return this.save(orionResponse.map((m) => m.$attributes))
  }

  // repo.$runQuery = async function(query: QueryBuilder<OrionModel>) {
  //   const orionResponse = await query.search()
  //   return this.save(orionResponse.map((m) => m.$attributes))
  // }

  // repo.$query = function() {
  //   const model = this.getModel()
  //   const orion = model.$self().orionModel as OrionModel
  //   return orion.$query()
  // }

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

  repo.$destroy = async function(ids) {
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
