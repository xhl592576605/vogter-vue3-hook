import { App } from 'vue'
import HookService from './hook/hook-service'
import mixins from './mixins'
import dataMatch from './util/data-check'
const install = (app: App) => {
  app.config.globalProperties.$eventBus = new HookService()
  app.config.globalProperties.$dataCheck = new dataMatch()
  if (!window.$vogter) {
    window.$vogter = {}
  }
  window.$vogter.$eventBus = new HookService()
  app.mixin(mixins)
}
export default install