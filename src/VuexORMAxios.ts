import { Orion } from '@tailflow/laravel-orion/lib/orion'
import { AuthDriver } from '@tailflow/laravel-orion/lib/drivers/default/enums/authDriver'
import { VuexORMPlugin } from '@vuex-orm/core'
import { mixin as repositoryMixin } from './mixins/Repository'

export interface Options {
  host: string
  prefix?: string
  authDriver?: AuthDriver
  token?: string
}

export const VuexORMAxios: VuexORMPlugin = {
  install(_store, components, options: Options) {
    Orion.init(options.host)
    repositoryMixin(components.Repository)
  }
}
