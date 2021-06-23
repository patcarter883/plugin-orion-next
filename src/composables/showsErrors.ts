import { ref, computed } from 'vue'

export interface iError {
  name: string
  message: string
}

export function showsErrors() {
  const validationErrors = ref<Record<string, string[]>>({})
  const errors = ref<iError[]>([])

  const hasErrors = computed(() => errors.value.length > 0)
  const hasValidationErrors = computed(
    () => Object.keys(validationErrors.value).length > 0
  )

  return {
    validationErrors,
    errors,
    hasErrors,
    hasValidationErrors
  }
}
