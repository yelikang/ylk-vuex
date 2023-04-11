/*
 * @Description: 
 * @Autor: lizi
 * @Date: 2022-05-25 16:28:14
 * @LastEditors: lizi
 * @LastEditTime: 2022-06-29 09:29:13
 * @FilePath: \ylk-vuex\src\mixin.js
 */
export default function (Vue) {
  const version = Number(Vue.version.split('.')[0])

  if (version >= 2) {
    // 所有组件都混入beforeCreate钩子函数
    Vue.mixin({ beforeCreate: vuexInit })
  } else {
    // override init and inject vuex init procedure
    // for 1.x backwards compatibility.
    const _init = Vue.prototype._init
    Vue.prototype._init = function (options = {}) {
      options.init = options.init
        ? [vuexInit].concat(options.init)
        : vuexInit
      _init.call(this, options)
    }
  }

  /**
   * Vuex init hook, injected into each instances init hooks list.
   */

  function vuexInit () {
    const options = this.$options
    // store injection
    if (options.store) {
      // 根组件赋值$store；this.$options.store是在 new Vue({el:'#app', store})时传入的
      this.$store = typeof options.store === 'function'
        ? options.store()
        : options.store
    } else if (options.parent && options.parent.$store) {
      // 子组件的$store指向父组件的$store，保证子组件都能访问到$store属性
      this.$store = options.parent.$store
    }
  }
}
