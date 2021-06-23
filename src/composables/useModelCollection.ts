import { ref, computed } from 'vue'
import { useStore } from 'vuex'
import {
  Model,
  Repository,
  WherePrimaryClosure,
  WhereSecondaryClosure
} from '@vuex-orm/core'
import { Constructor } from '@vuex-orm/core/dist/src/types'
import { showsErrors } from './showsErrors'

interface iQueryFilter {
  field: string | WherePrimaryClosure
  value: string | WhereSecondaryClosure
}

export function useModelCollection<T extends Model>(
  model: Constructor<T>
): Record<string, unknown> {
  // export function useModelCollection<T extends Repository>(
  //   repo: Constructor<T>
  // ): Record<string, unknown>
  // export function useModelCollection<T extends Model | Repository>(
  //   model: Constructor<T>
  // )
  const store = useStore()
  const repo = store.$repo<T>(model)

  const filters = ref<iQueryFilter[] | number[]>()

  const collection = computed(() => {
    const query = repo.query()
    const pk = repo.getModel().$primaryKey()
    if (filters.value !== undefined && filters.value.length > 0) {
      if ((filters.value as number[]).every((e) => typeof e === 'number')) {
        if (typeof pk === 'string') {
          query.whereIn(pk, filters.value as number[])
        } else {
        }
      } else {
        ;(filters.value as iQueryFilter[]).forEach(({ field, value }) => {
          query.where(field, value)
        })
      }
    }
    if (relationships.value.length > 0) {
      relationships.value.forEach((relation) => {
        query.with(relation)
      })
    }
    return query.get()
  })

  const relationships = ref<string[]>([])

  const collectionIds = computed(() => {
    return collection.value.map((m) => m.$getAttributes().id as string | number)
  })

  const {
    validationErrors,
    errors,
    hasErrors,
    hasValidationErrors
  } = showsErrors()

  return {
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
