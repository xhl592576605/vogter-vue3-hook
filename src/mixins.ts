import { defineComponent } from 'vue'
import { EventObject, HookFunction, HookOption, HookType } from './hook/hook-option'
import HookService from './hook/hook-service'
export default defineComponent({
  computed: {
    eventStore: {
      get() {
        return this.$eventBus.hookStore
      },
      set() {

      }
    }
  },
  methods: {
    /**
     *  init event
     * @param eventDefinite  事件对象
     * @param matchObject  需要带入而外触发事件匹配的对象
     */
    $initEvent(eventDefinite: EventObject | Array<HookOption>, matchObject?: Object) {
      let hookOptions = this.$switchEventDefinite(eventDefinite, matchObject) || []
      hookOptions.forEach(option => {
        this.$eventBus.$on(option)
      })
    },
    /**
     * 
     * @param eventDefinite  事件对象
     * @param matchObject  需要带入而外触发事件匹配的对象
     */
    $switchEventDefinite(eventDefinite: EventObject | Array<HookOption>, matchObject?: Object) {
      let events: Array<HookOption> = []
      if (this.$dataCheck.$isObject(eventDefinite)) {
        events = Object.entries(eventDefinite).map(([key, value]) => {
          let Hook: Array<HookFunction>
          if (this.$dataCheck.$isString(value) && this.$dataCheck.$isFunction(this[value])) {
            value = [this[value]]
          } else if (this.$dataCheck.$isFunction(value)) {
            value = [value as Function]
          }
          Hook = (value as Array<Function>).map((f: Function, i: Number) => {
            const hf: HookFunction = {
              name: `${HookService.defaultFuncName}${i}`,
              fn: f
            }
            return hf as HookFunction
          })
          const hookOption: HookOption = Object.assign({}, {
            hookType: HookType.Default,
            args: 10,
            context: false,
            Hook,
          }, HookService.createBaseHookOption(key))
          return hookOption
        })
      } else {
        events = eventDefinite as Array<HookOption>
      }
      events.forEach(event => {
        !event.group && (event.group = HookService.defaultGroup)
        !event.prefix && (event.prefix = HookService.defaultFix)
        !event.suffix && (event.suffix = HookService.defaultFix)
        event.matchObject = Object.assign({}, event.matchObject || {}, matchObject || {})
      })
      return events;
    }
  }
})
