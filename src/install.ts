import { App } from 'vue'
import mixins from './mixins'
const install = (app: App) => {
  app.mixin(new mixins(app))
}
export default install