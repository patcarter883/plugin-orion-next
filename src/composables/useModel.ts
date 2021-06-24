import { ref, computed, watch, onMounted } from 'vue'
import { Repository, Model } from '@vuex-orm/core'
import { showsErrors } from './showsErrors'

export function useModel<
  M extends Model,
  R extends Repository<M> = Repository<M>
>(repo: R) {
  const model = computed(() => {
    resetErrors()
    const query = repo.query()
    if (id.value) {
      if (relationships.value.length > 0) {
        relationships.value.forEach((relation) => {
          query.with(relation)
        })
      }
      return query.find(id.value)
    } else {
      errors.value = [{ name: 'Model ID', message: 'No model ID provided' }]
      return undefined
    }
  })

  const clone = ref<Record<string, string | number | boolean | null>>()

  const {
    validationErrors,
    errors,
    hasErrors,
    hasValidationErrors
  } = showsErrors()

  onMounted(() => {
    watch(model, (val) => {
      if (val) {
        clone.value = { ...val.$getAttributes() }
      } else {
        clone.value = undefined
      }
    })
  })

  const id = ref<number | string>()

  const resetErrors = () => {
    errors.value = []
  }

  const handleError = (error: unknown) => {
    console.log(error)
    debugger
  }

  const save = async () => {
    resetErrors()
    if (!id.value || !model.value || !clone.value) {
      errors.value = [{ name: 'Model', message: 'No model to save' }]
    } else {
      await repo.$update(clone.value).catch((error) => {
        handleError(error)
      })
    }
  }

  const destroy = async () => {
    resetErrors()
    if (id.value) {
      await repo.$destroy(id.value).catch((error) => {
        handleError(error)
      })
      id.value = undefined
    } else {
      errors.value = [{ name: 'Model', message: 'No model to delete' }]
    }
  }

  const relationships = ref<string[]>([])

  return {
    save,
    destroy,
    id,
    model,
    clone,
    relationships,
    errors,
    hasErrors,
    validationErrors,
    hasValidationErrors
  }
}
