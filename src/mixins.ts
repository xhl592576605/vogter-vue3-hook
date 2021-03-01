
import { App } from 'vue'
import HookService from './hook/hook-service'
import * as dataMatch from './util/data-check'
let __$app__: App
export default class mixins {
  constructor($app: App) {
    __$app__ = $app
    __$app__.config.globalProperties.$eventBus = new HookService()
    Object.entries(dataMatch).forEach(([key, value]) => {
      __$app__.config.globalProperties[key] = value
    })
    if (!window.$vogter) {
      window.$vogter = {}
    }
    window.$vogter.$eventBus = new HookService()
  }
  data() {
    return {
      eventHandler: {}
    }
  }
}