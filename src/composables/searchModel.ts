import { ref } from 'vue'
import { Repository, Model } from '@vuex-orm/core'
import { showsErrors } from './showsErrors'
import { FilterOperator } from '@tailflow/laravel-orion/lib/drivers/default/enums/filterOperator'
import { FilterType } from '@tailflow/laravel-orion/lib/drivers/default/enums/filterType'
import { SortDirection } from '@tailflow/laravel-orion/lib/drivers/default/enums/sortDirection'

export function searchModel<T extends Repository>(repo: T) {
  const {
    validationErrors,
    errors,
    hasErrors,
    hasValidationErrors
  } = showsErrors()

  const resetErrors = () => {
    errors.value = []
  }

  const foundIds = ref<Array<string | number | (string | number)[]>>()

  const searchObject = ref<iSearchObject>()

  const getPk = (model: Model) => {
    const pk = repo.getModel().$primaryKey()
    if (Array.isArray(pk)) {
      const pkValue = [] as (number | string)[]
      pk.forEach((key) => {
        pkValue.push(model[key])
      })
      return pkValue
    } else {
      return model[pk] as string | number
    }
  }

  const search = async () => {
    resetErrors()
    if (searchObject.value) {
      const response = await repo.$search(searchObject.value)
      let res
      if (response) {
        res = response
        foundIds.value = res.map((m) => getPk(m))
      }
    } else {
      errors.value = [{ name: 'Search', message: 'No search parameters set.' }]
    }
  }

  return {
    search,
    searchObject,
    foundIds,
    errors,
    hasErrors,
    validationErrors,
    hasValidationErrors,
    FilterOperator,
    FilterType,
    SortDirection
  }
}

export type iSearchObject = {
  scopes?: { name: string; parameters?: string[] }[]

  filters?: Array<{
    field: string
    operator: FilterOperator
    value: string | Array<string | number>
    type?: FilterType
  }>

  search?: { value: string }

  sort?: Array<{ field: string; direction?: SortDirection }>
}
