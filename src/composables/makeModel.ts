import { ref } from 'vue'
import { useStore } from 'vuex'
import { Model } from '@vuex-orm/core'
import { showsErrors } from './showsErrors'
import { Constructor } from '@vuex-orm/core/dist/src/types'

export function makeModel<T extends Model>(model: Constructor<T>) {
  const modelData = ref<Record<string, string | number | boolean | null>>()
  const store = useStore()
  const repo = store.$repo<T>(model)

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
