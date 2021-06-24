import Vue from 'vue'
import Vuex, { Store } from 'vuex'
import VuexORM, { Model } from '@vuex-orm/core'
import VuexORMOrion from '@/index'

Vue.use(Vuex)
VuexORM.use(VuexORMOrion)

describe('unit/VuexORMOrion', () => {
  class User extends Model {
    static entity = 'users'
  }

  it('can install the plugin without axios option', () => {
    const store = new Store({
      plugins: [VuexORM.install()],
      strict: true
    })

    expect(store.$axios).toBe(undefined)

    const userRepo = store.$repo(User)

    expect(userRepo.axios).toBe(undefined)
  })
})
