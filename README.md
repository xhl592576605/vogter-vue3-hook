## @vogter/vue3-hook (守卫者[事件总线（钩子）框架])

### 框架特点
1. 使用webpack的[tapable](https://github.com/webpack/tapable)为基础，扩展vue3的事件总线，可以自定义全局事件，异步或同步事件 ，自定义生命周期
2. 多种事件类型可以选择，Bail，Waterfall，Loop
3. 集成vue3插件，安装既可以使用
4. 可以单独服务使用，也可以vue全局使用（混入了对象）

### 版本变化
- 0.0.3 修改dts定义
- 0.0.2 修改dts定义
- 0.0.1 初始化
### 使用方法

- 使用示例
``` js
// in main.js(.ts)
import VogterVueHook from '@vogter/vue3-hook'
createApp(App).use(VogterVueHook).mount('#app')
```

- 实例方法
> 组件内部实例this调用

| 名称  | 描述 | 参数 | 例子 |
| --- | --- | --- | --- |
| $dataCheck | 类型检查 ，提供字符串，对象，数组等类型检查|
| $initEvent | 初始化事件 | eventDefinite:事件定义对象, matchObject: 而外代入的信息，方便触发匹配 |

- 全局对象
> 组件内部实例this调用

| 名称  | 描述 | 参数 | 例子 |
| --- | --- | --- | --- |
| $eventBus | 事件总线实例|

- computed

| 名称  | 描述 | 参数 | 例子 |
| --- | --- | --- | --- |
| eventStore| 全局事件仓库，保存事件的定义|

- $eventBus 方法

| 名称  | 描述 | 参数 | 例子 |
| --- | --- | --- | --- |
| $on | 注册事件，一般不会调用，使用`$initEvent`注册 | option:注册参数，fn:回调函数|
| $emit | 触发事件 | option:触发参数，其余是带入参数 |
| $emit | 触发事件 | option:触发参数，其余是带入参数 |
| $remove| 移除事件 | option:移除参数 |
| $clear | 清除所有事件 |

### 具体使用说明

1. $initEvent
> 初始化事件，一般在created生命周期调用
  - 参数eventDefinite(`EventObject | Array<HookOption>`)   
    -  `EventObject`:是一个对象值，键值对，键是事件key值，值是事件的回调函数名称
    ``` js
    {
      'beforeAdd':'beforeAdd',
      'async.afterAdd':'afterAdd'
    }
    methods:{
      beforeAdd(){},
      async afterAdd(){}
    }
    ```
    -  `Array<HookOption>`是一组注册对象的集合
    ``` js
    export interface HookOption{
        prefix?: string,// 事件的前缀
        suffix?: string, // 事件的后缀
        name: string // 事件名称，若是异步请用`async.`修饰，例:`async.addData`
        group?: string,// 事件分组
        matchObject?: Object | {},// 而外代入匹配的对象
        hookType: HookType, // 事件类型
        Hook: HookFunction | Array<HookFunction>,// 事件回调函数定义
        interceptOpt?: Object | undefined, // 用于拦截器，与tapable一致
        args: Array<string> | Number, // 用于实例化参数个数，与tapable一致
        context: boolean //用于启用上下文，优先级比HookFunction的context大，是直接配置在拦截器上，若是需要设置上下文的值，请在拦截器的拦截方法声明
    }

    export enum HookType {
      Default,
      Bail, // 返回undefined 不再执行
      Waterfall, // 返回的值会带入到下个回调
      Loop // 返回非 undefined 时继续再次执行当前的回调。
    }

    export interface HookFunction{ 
      name: string, // 默认自动生成，可以自个配置
      fn: Function, // 回调函数
      stage: number,// 权重 权重越高，越早回调
      context: boolean, //用于启用上下文
      before?: string | Array // 在那个回调函数之前调用
    }
    ```

2. $eventBus  

    1. $on(option: HookOption | string, fn?: Function | Array<Function>)
    > $on为注册事件的方法，可以传入一个key值，加上一组回调单数，但是钩子类型为默认类型
    > 当然也可以传入HookOption，参数规范如上描述    
    
    2. $emit(option: BaseHookOption | string, ...params: any[]) 
    > $emit为触发事件的方法，第一个参数为匹配事件的参数，其余参数为传入回调函数的参数
    > option:可以直接传入一个key，也可以传入一个匹配对象
    > 该方法是异步的方法，回调函数的返回值会以数组（触发多个的时候，所以已数组传递）的形式resolve传递
     ``` js
      export interface BaseHookOption {
        prefix?: string, // 前缀
        suffix?: string, // 后缀
        name: string, // 事件名称，也就是key值
        group?: string, // 事件分组
        matchObject?: Object | {}  // 而外代入匹配的参数
      }
    ```

    3. $remove(option: BaseHookOption | string) {
    > 参数与$emit方法的第一个参数一致

    4. $clear 
    > 全局的事件仓库



