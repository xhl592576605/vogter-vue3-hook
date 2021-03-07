import _ from 'lodash'
import HookFactory from './hook-factory'
import { HookOption, HookType, HookFunction, BaseHookOption } from './hook-option'
import DataCheck from '../util/data-check'
export default class HookService {
  static defaultGroup = 'default'
  static defaultFix = '@vogterHookFix'
  static defaultFuncName = '@vogterHookFix'
  static createBaseHookOption(name: string, prefix?: string, suffix?: string) {
    let baseHookOption: BaseHookOption = {
      prefix: prefix || HookService.defaultFix,
      suffix: suffix || HookService.defaultFix,
      name,
      group: HookService.defaultGroup,
    }
    return baseHookOption
  }
  $dataCheck = new DataCheck()
  /**
   * hookStore
   */
  hookStore = {}

  /**
   * register hook
   * @param option 
   * @param fn 
   */
  $on(option: HookOption | string, fn?: Function | Array<Function>) {
    let _option: HookOption
    if (this.$dataCheck.$isString(option)) {
      if (!fn) {
        console.warn(`[@vogter/vue3-hook] $on: if key-func must has function`)
        return
      }
      let Hook: Array<HookFunction>
      if (this.$dataCheck.$isFunction(fn)) {
        fn = [fn as Function]
      }
      Hook = (fn as Array<Function>).map((f: Function, i: Number) => {
        const hf: HookFunction = {
          name: `${HookService.defaultFuncName}${i}`,
          fn: f
        }
        return hf as HookFunction
      })
      _option = Object.assign({}, HookService.createBaseHookOption(option as string), {
        hookType: HookType.Default,
        args: 10,
        context: false,
        Hook
      })
    } else {
      _option = option as HookOption
      !_option.group && (_option.group = HookService.defaultGroup)
      !_option.prefix && (_option.prefix = HookService.defaultFix)
      !_option.suffix && (_option.suffix = HookService.defaultFix)
    }
    let hook = this.$getHook(_option)
    if (!hook || hook.length > 0) {
      console.warn(`[@vogter/vue3-hook] already register Hook in 
                  ${_option.group} Group [name:${_option.prefix}-${_option.name}-${_option.suffix}] `)
      return
    }
    hook = HookFactory.newHook(_option)
    this.$defineHook(_option, hook)
  }

  /**
   * emit hook
   * @param option 
   * @param params 
   */
  async $emit(option: BaseHookOption | string, ...params: any[]) {
    let _option: BaseHookOption
    if (this.$dataCheck.$isString(option)) {
      _option = HookService.createBaseHookOption(option as string)
    } else {
      _option = option as BaseHookOption
    }
    const hooks = this.$getHook(_option)
    const hoolCalls: any[] = []
    // 为什么这个是数组形式呢 是因为你带入进去的 查出来的钩子不一定是唯一的 因为可能是前缀一样或者匹配条件一样
    if (hooks && hooks.length > 0) {
      (hooks as any[]).forEach((h: any) => {
        const isAsync = h.name.includes('async.')
        hoolCalls.push(!isAsync ? h.hook.call(...params) : h.hook.promise(...params))
      })
    }
    if (hoolCalls.length > 0) {
      return Promise.all(hoolCalls)
    }
    return
  }

  /**
   * remove hook
   * @param option 
   */
  $remove(option: BaseHookOption | string) {
    let _option: BaseHookOption
    if (this.$dataCheck.$isString(option)) {
      _option = HookService.createBaseHookOption(option as string)
    } else {
      _option = option as BaseHookOption
    }
    const hook = this.$getHook(_option)
    if (!hook) {
      console.warn(`[@vogter/vue3-hook] already register Hook in 
                  ${_option.group} Group [name:${_option.prefix}-${_option.name}-${_option.suffix}] `)
      return
    }
    const group = this.$getHookGroup(_option.group as string)
    let proxyHook = this.$getHookProxy(group, _option.name);
    (hook as []).forEach((h: any) => {
      proxyHook = _.remove(proxyHook, function (i) {
        return i === h
      })
    })
  }

  /**
   *  remove ProxyHook
   * @param name 
   * @param groupName 
   */
  $removeProxyHook(name: string, groupName: string = 'default') {
    const group = this.$getHookGroup(groupName)
    if (group) {
      return Reflect.deleteProperty(group, name)
    }
    return false
  }

  /**
   * remove one group hook
   * @param groupName 
   */
  $removeGroupHook(groupName: string): boolean {
    if (groupName) {
      return Reflect.deleteProperty(this.hookStore, groupName)
    }
    return false
  }

  /**
   * clear all hook
   */
  $clear() {
    this.hookStore = {}
  }

  /**
   * get hook
   * @param option 
   */
  $getHook(option: BaseHookOption): any {
    const groupName = option.group || HookService.defaultGroup
    const group = this.$getHookGroup(groupName)
    const name = option.name
    const proxyHook = this.$getHookProxy(group, name)
    return _.filter(proxyHook, (h => {
      let flag = true
      const matchObject = Object.assign({}, {
        ..._.pick(option, ['prefix', 'suffix', 'name'])
      }, { ...(option.matchObject || {}) })
      const sourceObj = Object.assign({}, {
        ..._.pick(h, ['prefix', 'suffix', 'name'])
      }, { ...(h.matchObject || {}) })
      for (const mKey in matchObject) {
        let match = matchObject[mKey]
        if (this.$dataCheck.$isString(match)) {
          match = match.split(',')
          const sValue = (sourceObj[mKey] || '').split(',')
          const idx = match.findIndex((m: any) => {
            return sValue.indexOf(m) > -1
          })
          flag = flag && idx > -1
        } else {
          flag = flag && sourceObj[mKey] === match
        }
      }
      return flag
    })) || []
  }

  /**
   *  get proxy hook
   * @param group 
   * @param name 
   */
  $getHookProxy(group: any, name: string) {
    const proxyHook = Reflect.get(group, name)
    if (!proxyHook) {
      console.warn(`[@vogter/vue3-hook] hookStore no exist [${name}] proxyHook`)
      return {}
    }
    return proxyHook
  }

  /**
   * get group hook
   * @param groupName 
   */
  $getHookGroup(groupName: string) {
    const group = Reflect.get(this.hookStore, groupName)
    if (!group) {
      console.warn(`[@vogter/vue3-hook] hookStore no exist [${groupName}] group`)
      return {}
    }
    return group
  }

  /**
   * define hook
   * @param option 
   * @param hook 
   */
  $defineHook(option: HookOption, hook: any) {
    const groupName = option.group as string
    if (!Reflect.has(this.hookStore, groupName)) {
      Reflect.defineProperty(this.hookStore, groupName, { value: {}, configurable: true })
    }
    const group = Reflect.get(this.hookStore, groupName)
    if (!group) {
      Reflect.defineProperty(this.hookStore, groupName, { value: {}, configurable: true })
    }
    let proxyHook = Reflect.get(group, option.name)
    if (!proxyHook) {
      Reflect.defineProperty(group, option.name, { value: [], configurable: true })
      proxyHook = Reflect.get(group, option.name)
    }
    if (!_.find(proxyHook, (h: any) => {
      return h.name === option.name &&
        h.prefix === option.prefix &&
        h.suffix === option.suffix
    })) {
      (proxyHook as any[]).push(Object.assign({}, { hook }, { ...option }))
    }

  }
}