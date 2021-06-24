import { ref, watch } from 'vue'
import {
  Repository,
  Collection,
  WherePrimaryClosure,
  WhereSecondaryClosure,
  Model
} from '@vuex-orm/core'
import { showsErrors } from './showsErrors'

interface iQueryFilter {
  field: string | WherePrimaryClosure
  value: string | WhereSecondaryClosure
}

export function useModelCollection<
  M extends Model,
  R extends Repository<M> = Repository<M>
>(repo: R) {
  const filters = ref<iQueryFilter[]>()
  const idList = ref<(string | number | (string | number)[])[]>()
  const collection = ref<Collection<M>>()

  const collect = () => {
    const query = repo.query()
    const pk = repo.getModel().$primaryKey()
    if (idList.value) {
      if (typeof pk === 'string' || typeof pk === 'number') {
        query.whereIn(pk, idList.value)
      }
    }

    if (filters.value) {
      filters.value.forEach(({ field, value }) => {
        query.where(field, value)
      })
    }

    if (relationships.value.length > 0) {
      relationships.value.forEach((relation) => {
        query.with(relation)
      })
    }
    collection.value = query.get()
    collectionIds.value = collection.value.map(
      (m) => m.$getAttributes().id as string | number
    )
  }

  const relationships = ref<string[]>([])

  const collectionIds = ref<(string | number)[]>()

  watch([idList, filters, relationships], () => {
    collect()
  })

  const {
    validationErrors,
    errors,
    hasErrors,
    hasValidationErrors
  } = showsErrors()

  return {
    idList,
    relationships,
    filters,
    collection,
    collectionIds,
    errors,
    hasErrors,
    validationErrors,
    hasValidationErrors
  }
}
