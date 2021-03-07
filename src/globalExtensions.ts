import { HookOption } from "./hook/hook-option";
import HookService from "./hook/hook-service";
import DataCheck from "./util/data-check";
declare module '@vue/runtime-core' {
  /**
   * EventObject
   */
  export interface EventObject {
    [key: string]: Function | Array<Function> | string
  }
  export interface ComponentCustomOptions {
  }
  export interface ComponentCustomProperties {
    $dataCheck: DataCheck
    $initEvent: (eventDefinite: EventObject | Array<HookOption>, matchObject?: Object) => void
    $eventBus: HookService
  }
}
declare global {
  interface Window {
    $vogter: {
      $eventBus?: HookService
    }
  }
}
