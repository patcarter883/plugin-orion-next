import { ref } from 'vue'
import { Repository } from '@vuex-orm/core'
import { showsErrors } from './showsErrors'

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

  const foundIds = ref<Array<string | number>>()

  const searchObject = ref<iSearchObject>()

  const search = () => {
    resetErrors()
    if (searchObject.value) {
      const response = repo.$search(searchObject.value)
      foundIds.value = (response.response.data as Array<
        Record<string, unknown>
      >).map((m) => m.id as number)
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
    hasValidationErrors
  }
}

export type iSearchObject = {
  scopes?: Array<{ name: string } | { name: string; parameters: Array<string> }>

  filters?: Array<
    | {
        field: string
        operator: string
        value: string | Array<string | number>
      }
    | {
        type: string
        field: string
        operator: string
        value: string | Array<string | number>
      }
  >

  search?: { value: string }

  sort?: Array<{ field: string; direction: string }>
}
