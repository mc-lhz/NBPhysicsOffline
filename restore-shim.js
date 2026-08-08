/* ===========================================================
 * restore-shim.js — 在 vip 脚本（v4.2 等）之后加载
 * 作用：把 XMLHttpRequest.prototype 的 open/send/setRequestHeader
 *       以及 window.fetch 还原为 nb-offline-shim.js 保存的版本，
 *       从而压制 v4.2 的 XMLHttpRequest.prototype.send 中间人覆盖。
 * 说明：v4.2 仍在内存中、可被分析，只是它的 XHR 钩子被压在下面，
 *       页面请求改走 shim 的本地假数据，不再转发到线上服务器。
 * 加载位置：必须在 vip/v4.2.js 之后、umi.js（App）之前。
 * =========================================================== */
(function () {
  'use strict';
  function restore(name, target, key) {
    var saved = window[name];
    if (!saved) {
      if (window.console) window.console.warn('[restore] 未找到 ' + name + '（shim 是否先加载？）');
      return;
    }
    if (target) target[key] = saved;
    else window[key] = saved;
    if (window.console) window.console.log('%c[restore] ' + name + ' → 已还原', 'color:#07a');
  }

  restore('__nbShimXHROpen', XMLHttpRequest.prototype, 'open');
  restore('__nbShimXHRSend', XMLHttpRequest.prototype, 'send');
  restore('__nbShimXHRSetHeader', XMLHttpRequest.prototype, 'setRequestHeader');
  restore('__nbShimXHRGetAll', XMLHttpRequest.prototype, 'getAllResponseHeaders');
  restore('__nbShimXHRGetOne', XMLHttpRequest.prototype, 'getResponseHeader');
  restore('__nbShimFetch', null, 'fetch');

  if (window.console) window.console.log('%c[restore] XHR/fetch 钩子已还原为 shim 版本', 'color:#07a');
})();
