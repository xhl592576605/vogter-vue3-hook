
import { AsyncHook, AsyncSeriesBailHook, AsyncSeriesLoopHook, AsyncSeriesWaterfallHook, Hook, SyncBailHook, SyncHook, SyncLoopHook, SyncWaterfallHook, UnsetAdditionalOptions } from "tapable";
import { HookFunction, HookOption, HookType } from './hook-option'

export default class HookFactory {

  /**
   * create hook
   * @param option 
   * @param isAsync 
   */
  static createHook(option: HookOption, isAsync: boolean) {
    let hook = null
    let args: string[] = []
    if (!Array.isArray(option.args)) {
      for (let i = 0;i < option.args;i++) {
        args.push(`args${i}`)
      }
    } else {
      args = option.args
    }
    const name = `${option.prefix}-${option.name}-${option.suffix}`
    switch (option.hookType) {
      case HookType.Bail:
        //@ts-ignore
        hook = isAsync ? new AsyncSeriesBailHook(args, name) : new SyncBailHook(args, name)
        break;
      case HookType.Waterfall:
        //@ts-ignore
        hook = isAsync ? new AsyncSeriesWaterfallHook(args, name) : new SyncWaterfallHook(args, name)
        break;
      case HookType.Loop:
        //@ts-ignore
        hook = isAsync ? new AsyncSeriesLoopHook(args, name) : new SyncLoopHook(args, name)
        break;
      default:
        //@ts-ignore
        hook = isAsync ? new AsyncHook(args, name) : new SyncHook(args, name)
        break;
    }
    return hook
  }

  /**
   * new Hook
   * @param option 
   */
  static newHook(option: HookOption) {
    const name = option.name
    const isAsync = name.includes('async.')
    const hook = HookFactory.createHook(option, isAsync)
    const interceptOpt = Object.assign({}, option.interceptOpt || {}, { context: option.context })
    hook.intercept(interceptOpt as Object)
    if (!Array.isArray(option.Hook)) {
      option.Hook = [option.Hook]
    }
    option.Hook.forEach((hookFunc: HookFunction, index: number) => {
      const _hookFunc = Object.assign({}, hookFunc || {}, { context: option.context })
      HookFactory.newTap(isAsync, hook, _hookFunc)
    })
    return hook
  }
  static newTap(isAsync: boolean, hook: Hook<unknown, unknown, UnsetAdditionalOptions>, hookFunc: HookFunction) {
    //@ts-ignore
    isAsync ? hook.tapPromise(hookFunc, hookFunc.fn) : hook.tap(hookFunc, hookFunc.fn)
    return hook
  }
}
