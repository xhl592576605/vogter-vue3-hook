import { EventObject } from "./hook/hook-option";
import HookService from "./hook/hook-service";
import DataCheck from "./util/data-check";

declare module '@vue/runtime-core' {
  export interface ComponentCustomOptions {
  }
  export interface ComponentCustomProperties {
    $dataCheck: DataCheck
    $initEvent: (eventDefinite: EventObject, matchObject?: Object) => void
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
