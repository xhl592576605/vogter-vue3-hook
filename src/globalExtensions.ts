import HookService from "./hook/hook-service";

declare module '@vue/runtime-core' {
  export interface ComponentCustomOptions {
  }
  export interface ComponentCustomProperties {

    $isObject: (obj: any) => boolean
    $isArray: (obj: any) => boolean
    $isString: (obj: any) => boolean
    $isFunction: (obj: any) => boolean
    $newUUID: (len: number, radix: number) => string
    $initEvent: (eventDefinite: Object) => void
    $eventBus: HookService
    eventHandler: Object
  }
}
declare global {
  interface Window {
    $vogter: {
      $eventBus?: HookService
    }
  }
}
