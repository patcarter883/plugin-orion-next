import { ref } from 'vue'
import { Repository, Model } from '@vuex-orm/core'
import { showsErrors } from './showsErrors'

export function makeModel<
  M extends Model,
  R extends Repository<M> = Repository<M>
>(repo: R) {
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

  // const handleError = (error: unknown) => {
  //   console.log(error)
  //   debugger
  // }

  const save = async () => {
    resetErrors()
    if (!modelData.value) {
      errors.value = [{ name: 'Model', message: 'No data to insert' }]
    } else {
      const response = await repo.$save(modelData.value)
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
    return
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
