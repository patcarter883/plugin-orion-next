# Configurations

Vuex ORM Axios plugin comes with various options to control request behavior. These options can be configured in three common places:

- **Globally** - options can defined during installation
- **Model** - options can be defined on a per-model basis
- **Request** - options can be defined on a per-request basis

Any axios options are permitted alongside any plugin options. Options are inherited in the same order, i.e. Global configuration is merged and preceded by Model configuration which is then merged and preceded by any Request configuration.

### Global Configuration

Options can be defined during plugin installation by passing an object as the second argument of the Vuex ORM `use()` method. At minimum, the axios instance is required while any other option is entirely optional.

The following example configures the plugin with an axios instance (required), the `baseURL` option, and some common `headers` that all requests will inherit:

```js
import axios from 'axios'
import VuexORM from '@vuex-orm/core'
import VuexORMOrion from '@vuex-orm/plugin-axios'

VuexORM.use(VuexORMOrion, {
  axios,
  headers: { 'X-Requested-With': 'XMLHttpRequest' },
  baseURL: 'https://example.com/api/'
})
```

### Model Configuration

Options can be defined on models by setting the static `apiConfig` property. This is an object where you may configure model-level request configuration.

The following example configures a model with common `headers` and `baseURL` options:

```js
import { Model } from '@vuex-orm/core'

class User extends Model {
  static entity = 'users'

  static fields () {
    return {
      id: this.attr(null),
      name: this.attr('')
    }
  }

  static apiConfig = {
    headers: { 'X-Requested-With': 'XMLHttpRequest' },
    baseURL: 'https://example.com/api/'
  }
}
```

### Request Configuration

Options can be defined on a per-request basis. These options will inherit any global and model configurations which are subsequently passed on to the request.

The following example configures a request with common `headers` and `baseURL` options:

```js
User.api().get('/api/users', {
  headers: { 'X-Requested-With': 'XMLHttpRequest' },
  baseURL: 'https://example.com/api/'
})
```

Request configurations vary depending on the type of request being made. Please refer to the [Usage Guide](usage) to read more.


## Available Options

In addition to [axios request options](https://github.com/axios/axios#request-config), the plugin can be configured with the following options:

### `dataKey`

- **Type**: `string`
- **Default**: `undefined`

  This option will inform the plugin of the resource key your elements may be nested under in the response body.

  For example, your response body may be nested under a resource key called `data`:

  ```js
  {
    ok: true,
    data: {
      id: 1,
      name: 'John Doe'
    }
  }
  ```
  
  The following example sets the `dataKey` to `data` as this is the resource key which contains the required data for the model schema.

  ```js
  User.api().get('/api/users', {
    dataKey: 'data'
  })
  ```

  The plugin will pass all the data within the data object to Vuex ORM which can then be successfully persisted to the store.

  ::: warning
  This option is ignored when using the `dataTransformer` option.
  :::

### `dataTransformer`

- **Type**: `(response: AxiosResponse) => Array | Object`
- **Default**: `undefined`

  This option will let you intercept and transform the response before persisting it to the store.
  
  The method will receive a [Response](usage.md#handling-responses) object allowing you to access response properties such as response headers, as well as manipulate the data as you see fit.

  Any method defined must return data to pass on to Vuex ORM.

  You can also use object destructuring to get specific properties from the response object.

  ```js
  User.api().get('/api/users', {
    dataTransformer: ({ data, headers }) => {
      // Do stuff with headers...
      // Do stuff with data...

      return data
    }
  })
  ```

  ::: warning
  Using the `dataTransformer` option will ignore any `dataKey` option.
  :::

- **See also**: [Transforming Data](usage.md#transforming-data)

### `save`

- **Type**: `boolean`
- **Default**: `true`

  This option will determine whether Vuex ORM should persist the response data to the store or not.
  
  By setting this option to `false`, the response data will not be persisted and you will have to handle persistence alternatively. The `entities` property in the [Response](usage.md#handling-responses) object will also be `null` since it will no longer be persisting data automatically.

- **See also**: [Deferring Persistence](usage.md#deferring-persistence)

### `delete`

- **Type**: `string | number | (model: Model) => boolean`
- **Default**: `undefined`

  This option is primarily used with delete requests. It's argument signature is identical to the [Vuex ORM delete](https://vuex-orm.org/guide/data/deleting) method by which a primary key can be set as the value, or passing a predicate function. The corresponding record will be removed from the store after the request is made.

  Setting this option will ignore any `save` options you may have set and therefore persistence is not possible when using this option. 

- **See also**: [Delete Requests](usage.md#delete-requests)

### `actions`

- **Type**: `Object`
- **Default**: `{}`

  This option allows for your own predefined api methods.

  Please refer to the [Custom Actions](custom-actions) documentation to learn more.
