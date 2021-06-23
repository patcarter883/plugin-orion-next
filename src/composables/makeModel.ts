import { ref } from 'vue'
import { Repository } from '@vuex-orm/core'
import { showsErrors } from './showsErrors'

export function makeModel<T extends Repository>(repo: T) {
  const modelData = ref<Record<string, string | number | boolean | null>>()

  const {
    validationErrors,
    errors,
    hasErrors,
    hasValidationErrors
  } = showsErrors()
  const resetErrors = () => {
    errors.value = []
  }

  const handleError = (error: unknown) => {
    console.log(error)
    debugger
  }

  const save = async () => {
    resetErrors()
    if (!modelData.value) {
      errors.value = [{ name: 'Model', message: 'No data to insert' }]
    } else if (modelData.value) {
      const response = await repo.$save(modelData.value)
      if (response) {
        const responseModel = response
        if (responseModel) {
          const pk = repo.getModel().$primaryKey()
          if (Array.isArray(pk)) {
            const pkValue = [] as (number | string)[]
            pk.forEach((key) => {
              pkValue.push(responseModel[key])
            })
            return pkValue
          } else {
            return responseModel[pk] as string | number
          }
        }
      }
    }
  }

  return {
    save,
    modelData,
    errors,
    hasErrors,
    validationErrors,
    hasValidationErrors
  }
}
