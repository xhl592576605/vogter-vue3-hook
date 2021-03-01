export default class DataCheck {
  // 是否是Object对象
  static $isObject(obj: any) {
    return Object.prototype.toString.call(obj) === '[object Object]'
  }
  // 是否是Array对象
  static $isArray(obj: any) {
    return Array.isArray(obj)
  }
  // 是否是字符串
  static $isString(str: any) {
    const typeStr = str instanceof String || (typeof str).toLowerCase()
    return typeStr === 'string'
  }
  // 是否是函数
  static $isFunction(fun: any) {
    return typeof fun === 'function'
  }

  /**
   * new uuid
   * @param len 
   * @param radix 
   */
  static $newUUID(len: number, radix: number) {
    let chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('')
    let uuid = [], i
    radix = radix || chars.length
    if (len) {
      for (i = 0;i < len;i++) uuid[i] = chars[0 | Math.random() * radix]
    } else {
      let r
      uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-'
      uuid[14] = '4'
      for (let i = 0;i < 36;i++) {
        if (!uuid[i]) {
          r = 0 | Math.random() * 16
          uuid[i] = chars[(i == 19) ? (r & 0x3) | 0x8 : r]
        }
      }
    }
    return uuid.join('')
  }
}