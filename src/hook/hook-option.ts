import { Tap } from "tapable";

export enum HookType {
  Default,
  Bail, // 返回undefined 不再执行
  Waterfall, // 返回的值会带入到下个回调
  Loop // 返回非 undefined 时继续再次执行当前的回调。
}

/**
 * HookOption
 */
export interface HookOption extends BaseHookOption {

  hookType: HookType,
  Hook: HookFunction | Array<HookFunction>,
  interceptOpt?: Object | undefined, // 用于拦截器
  args: Array<string> | Number, // 用于实例化参数个数
  context: boolean //用于启用上下文，优先级比HookFunction的context大，是直接配置在拦截器上，若是需要设置上下文的值，请在拦截器的拦截方法声明

}

/**
 * HookFunction
 */
export interface HookFunction extends Tap {
  name: string,
  fn: Function,
}

export interface BaseHookOption {
  prefix?: string,
  suffix?: string,
  name: string
  group?: string,
  matchObject?: Object | {}
}


