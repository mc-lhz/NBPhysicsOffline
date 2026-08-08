/* ===========================================================
 * NB 化学实验室 — 离线运行垫片 (shim) v1
 * 目标：只保留“做实验”，把 登录/激活/VIP/作业/统计/上报 全部本地假装成功
 * 加载时机：nb-config.js 之后、其余脚本之前
 * =========================================================== */
(function () {
  'use strict';

  var LOG = true;
  var HITS = [];          // 被拦截的请求，window.__nbShimHits 可查
  window.__nbShimHits = HITS;

  function log() {
    if (LOG) console.log.apply(console, ['%c[shim]', 'color:#0a7'].concat([].slice.call(arguments)));
  }

  /* ---------- 1. 把所有远端域名指向本地占位，避免真的发起外网请求 ---------- */
  var LOCAL = location.origin;
  var cfg = window.__nb_config || (window.__nb_config = { api: {} });
  cfg.api = cfg.api || {};

  // 快照：保存每个 key 对应的【真实远端 URL】，供 RECORD/REPLAY 代理还原
  // （下面会把它们压平成 /__nbapi/<key>，不存这份映射就再也拿不到真地址了）
  window.__nb_realapi = {};
  (function snapshot() {
    Object.keys(cfg.api).forEach(function (k) {
      var v = cfg.api[k];
      if (typeof v === 'string' && /^https?:\/\//.test(v)) window.__nb_realapi[k] = v;
    });
    if (cfg.api.u5 && cfg.api.u5.baseUrl) window.__nb_realapi['u5'] = cfg.api.u5.baseUrl;
  })();

  Object.keys(cfg.api).forEach(function (k) {
    if (typeof cfg.api[k] === 'string' && /^https?:\/\//.test(cfg.api[k])) {
      cfg.api[k] = LOCAL + '/__nbapi/' + k;
    }
  });
  if (cfg.api.u5) cfg.api.u5.baseUrl = LOCAL + '/__nbapi/u5';
  window.__nb_domain = {
    userLoginApi: LOCAL + '/__nbapi/login',
    passportUrl: LOCAL + '/__nbapi/passport',
    baseUrl: LOCAL,
    accountUrl: LOCAL + '/__nbapi/account',
    cookieDomain: location.hostname
  };
  // 关掉埋点 / 调研 / sentry
  window.__nb_sensors = { enabled: '', showlog: '', tenantName: 'nobook', project: 'offline' };
  window.__nb_howxm = { appId: '' };
  window.__nb_sentry = { enabled: '' };

  /* ---------- 1.5 注入 auth_key（SDK 缺失时会跳过全部初始化导致点击无反应） ---------- */
  /* 根因: umi.js 中 sdkModel.parseAuthKeyFromURL 在 query.auth_key 缺失时 early return，
     导致整个交互系统(PointerManager等)不初始化 → 点击无反应。
     方案: URL注入 + 延迟Redux dispatch双保险 */
  (function injectAuthKey() {
    // A) URL 层面注入
    var url = location.href;
    if (!/[?&]auth_key=/.test(url)) {
      var sep = url.indexOf('?') >= 0 ? '&' : '?';
      var fakeAuth = '21-offline' + Date.now().toString(36);
      try { history.replaceState(null, '', url + sep + 'auth_key=' + encodeURIComponent(fakeAuth)); } catch(e) {}
      log('URL 注入 auth_key=' + fakeAuth);
    }

    // B) hook location.search（umi 内部可能从这里读 query）
    try {
      var origSearchDesc = Object.getOwnPropertyDescriptor(location, 'search')
        || Object.getOwnPropertyDescriptor(HTMLLocation.prototype, 'search');
      if (origSearchDesc && origSearchDesc.get) {
        var origGet = origSearchDesc.get;
        Object.defineProperty(location, 'search', {
          get: function() { var s = origGet.call(this); return /[?&]auth_key=/.test(s) ? s : s + (s ? '&' : '?') + 'auth_key=21-offline'; },
          configurable: true
        });
      }
    } catch(e) {}

    // C) 延迟直接 dispatch Redux —— 最可靠方案，不依赖路由时序
    // 等待 dva app 初始化后，模拟 parseAuthKeyFromURL 成功后的行为：
    //   bt("21-xxx") → {canDIY:true, canRes:true, gradeId:3} (高中化学)
    //   然后 dispatch sdkModel/updateState + appModel/switchGrade
    setTimeout(function tryDispatch() {
      try {
        var dvaApp = window.getDvaApp && window.getDvaApp();
        if (!dvaApp || !dvaApp._store) {
          log('等待 dva app...'); setTimeout(tryDispatch, 500); return;
        }
        var store = dvaApp._store;
        var state = store.getState();
        // 检查是否已经初始化过（避免重复）
        if (state.sdkModel && state.sdkModel.gradeId) {
          log('sdkModel 已有 gradeId=' + state.sdkModel.gradeId + ', 跳过 dispatch');
          return;
        }
        // 模拟 bt("21-xxxx") 的返回值：高中化学, 可DIY, 可资源
        store.dispatch({ type: 'sdkModel/updateState', payload: {
          canDIY: true, canRes: true, gradeId: 3,
          forceHDVOnMobile: false, noNBSetDataOfURL: false
        }});
        store.dispatch({ type: 'appModel/switchGrade', payload: 3 });
        log('✅ 已直接 dispatch sdkModel 状态 (gradeId=3 高中化学 DIY=Res=true)');
      } catch(e) {
        log('dispatch 待重试: ' + e.message); setTimeout(tryDispatch, 1000);
      }
    }, 2000);  // 等 2s 让 dva app 先初始化
  })();

  /* ---------- 2. 假用户：一个永不过期的本地 VIP ---------- */
  var FAKE_USER = {
    id: 100001,
    uid: 100001,
    user_id: 100001,
    username: 'offline',
    nickname: '本地用户',
    realname: '本地用户',
    avatar: '',
    mobile: '',
    role: 1,
    identity: 1,
    is_vip: 1,
    isVip: true,
    vip: 1,
    vip_level: 9,
    vipLevel: 9,
    vip_end_time: 4102444800,      // 2100-01-01
    expire_time: 4102444800,
    school_id: 1,
    school_name: '本地',
    schoolname: '本地',
    subject: 'chemistry',
    token: 'offline-token',
    is_login: 1,

    // ↓ 以下字段专供 passport/v5/login/check 使用，见 §3.2
    auth_token: 'offline-token',
    phone: '13800000000',
    phone_check: 1,                // ===0 会被拉去绑手机号弹窗
    tenant: 'nb',
    tenant_info: { id: 'nb', name: '本地' },
    customer_account_lock_status: 0
  };
  window.__nb_offline_user = FAKE_USER;

  /* ---------- 3. 通用响应模板 ---------- */
  function ok(data) {
    return { code: 0, status: 0, errcode: 0, success: true, message: 'ok', msg: 'ok', data: data === undefined ? {} : data };
  }

  /* ---------- 3.2 passport/v5/login/check —— 整个登录态的唯一判定源 ----------
   * umi.5eade003.js 里的自动登录函数（模块 72805 的 LP）逻辑是：
   *
   *   B.ZP(Config.checkLogin, ...).then(le => {
   *     var ue = le.encrypt_data;
   *     if (ue) { var de = pw(ue, X);                    // AES-256-CBC 解密
   *               try { le.vip_info = JSON.parse(de).vip_info } catch { le = null } }
   *     else      le = null;                              // ← 没有 encrypt_data 直接判未登录
   *     L(le); if (le?.auth_token) Config.authToken = ...
   *   })
   *
   * 之后 loginModel/initUserToken 只认一件事：`if (!(zt && zt.auth_token)) → 未登录`。
   *
   * 因此这里有三个硬约束，缺一不可：
   *   1) 必须返回【扁平】对象。umi-request 不解包 {code,data}，le 就是响应体本身，
   *      auth_token / encrypt_data 都得在顶层。之前套了 ok() 信封 → le.auth_token
   *      为 undefined → 弹微信扫码登录框 → 二维码 canvas 未挂载 → getContext 报错。
   *   2) 必须带 encrypt_data，否则走 else 分支直接 le = null。
   *   3) encrypt_data 得能被 pw() 解开而不抛异常 —— 抛了的话 .then 回调中断，
   *      外层 Promise 永不 resolve（LP 里的 N() 只是入数组，没有超时兜底），
   *      initUserToken 会永久卡住。
   *
   * 密钥是 MD5(getUniqueID())，而 getUniqueID() = Date.now()，每次请求都不同，
   * 且 sign-v1 是 RSA-2048 加密的，离线侧无法还原 X，所以【造不出真密文】。
   * 绕法：pw() 会先切掉前 16 字节当 IV、余下当密文。给一个正好 16 字节的 blob，
   * 密文长度就是 0 —— Pkcs7 unpad 读到 undefined 按 0 处理，Utf8 stringify 空串直接返回，
   * 全程不抛，稳定返回 ""。（实测 3000 次随机密钥 0 次异常；
   * 若改成 IV+1 个随机密文块，则有 6.4% 概率抛 Malformed UTF-8。）
   * 随后 JSON.parse("") 会抛 —— 由 nb-vip-local.js 的 JSON.parse 钩子接住，
   * 返回 {vip_info:{...}}，于是 le.vip_info 被正确赋值、le 保持非 null。
   */
  var EMPTY_CIPHER = 'AAAAAAAAAAAAAAAAAAAAAA==';   // 16 字节全 0：只有 IV，密文长度为 0

  function loginCheckPayload() {
    var out = {};
    for (var k in FAKE_USER) {
      if (Object.prototype.hasOwnProperty.call(FAKE_USER, k)) out[k] = FAKE_USER[k];
    }
    // 给副本，避免 setUserInfo 里的就地改写（user_id 转字符串等）污染 FAKE_USER
    out.encrypt_data = EMPTY_CIPHER;
    // 通知 nb-vip-local.js：接下来那次 JSON.parse("") 是解密链发出的。
    // 单槽（不累加）——多次 check 只保留最后一次，用完即清，避免遗留信号
    // 在几秒后误伤某处正常的 JSON.parse("")。
    window.__nbLoginCheckAt = Date.now();
    return out;
  }

  // 按 URL 关键字给不同的假数据
  function mockFor(url) {
    var u = String(url);
    if (/passport\/v\d+\/login\/check/i.test(u)) {
      log('login/check → 返回扁平已登录用户 (带 auth_token + encrypt_data)');
      return loginCheckPayload();
    }
    if (/login|passport|checkLogin|userInfo|user_info|getUser|account/i.test(u)) {
      return ok({ user: FAKE_USER, userInfo: FAKE_USER, info: FAKE_USER, isLogin: true, is_login: 1 });
    }
    if (/vip|limit|权限|auth|permission|purchase|order|pay/i.test(u)) {
      return ok({ is_vip: 1, isVip: true, level: 9, limit: 0, expired: false, end_time: 4102444800 });
    }
    if (/activate|active|offline/i.test(u)) {
      return ok({ activated: true, status: 1, expire: 4102444800 });
    }
    if (/serverTime|time/i.test(u)) {
      return ok({ time: Math.floor(Date.now() / 1000), timestamp: Date.now() });
    }
    if (/homework|task|report|record|save|upload|log|track|stat/i.test(u)) {
      return ok({ id: 0, list: [], total: 0 });
    }
    if (/list|templates|resource|catalog|module/i.test(u)) {
      return ok({ list: [], items: [], total: 0, data: [] });
    }
    return ok({});
  }

  /* ---------- 3.5 RECORD/REPLAY 代理（server.py 的 /__nbpx 负责落盘/回放） ---------- */
  // 哪些请求仍走本地假数据（不代理、不录制）：登录 / VIP / 激活 / 上报 / 时间 等会话类。
  // 这样本地假 VIP 态不会被真实（可能非 VIP）响应覆盖，离线壳照常“已登录/已激活”。
  function shouldMock(url) {
    return /login|passport|checkLogin|userInfo|user_info|getUser|account|vip|limit|权限|auth|permission|purchase|order|pay|activate|active|offline|serverTime|time|homework|task|report|record|save|upload|log|track|stat|sensors|howxm/i.test(String(url));
  }

  // 把离线的 /__nbapi/<key><rest> 还原成真实远端 URL。
  // 例：/__nbapi/storageUrl/experiment/v1/Play?x=1
  //     → https://storage-backend.nobook.com/experiment/v1/Play?x=1
  function resolveReal(url) {
    var u = String(url);
    if (u.indexOf('/__nbapi/') < 0) return null;
    var qi = u.indexOf('?');
    var query = qi >= 0 ? u.slice(qi) : '';
    var pathOnly = qi >= 0 ? u.slice(0, qi) : u;
    var keys = Object.keys(window.__nb_realapi || {});
    var best = null, bestLen = -1;
    for (var i = 0; i < keys.length; i++) {
      var k = keys[i], prefix = '/__nbapi/' + k;
      if (pathOnly === prefix || pathOnly.indexOf(prefix + '/') === 0) {
        if (k.length > bestLen) { best = k; bestLen = k.length; }
      }
    }
    if (!best) return null;
    var rest = pathOnly.slice(('/__nbapi/' + best).length);
    return window.__nb_realapi[best] + rest + query;
  }

  function serializeHeaders(h) {
    var out = {};
    if (!h) return out;
    if (typeof h.forEach === 'function') {
      try { h.forEach(function (v, k) { out[k] = v; }); } catch (e) { }
    } else if (typeof h === 'object') {
      Object.keys(h).forEach(function (k) { out[k] = h[k]; });
    }
    return out;
  }

  // 统一通过本地 server.py 的 /__nbpx 代理：
  //   RECORD 模式 → 拉真实源站并落盘；REPLAY 模式（默认离线）→ 回放已录响应。
  function proxyRequest(realUrl, method, body, headers) {
    return fetch('/__nbpx', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        url: realUrl,
        method: method || 'GET',
        body: body == null ? '' : String(body),
        headers: serializeHeaders(headers)
      })
    });
  }

  function isLocalAsset(url) {
    var u = String(url);
    if (u.indexOf('/__nbapi/') >= 0) return false;
    if (/^(blob:|data:)/.test(u)) return true;
    // 相对路径或同源 → 当作静态资源放行
    if (!/^https?:\/\//.test(u)) return true;
    try {
      return new URL(u, location.href).origin === location.origin;
    } catch (e) { return false; }
  }

  /* ---------- 4. 拦 fetch ---------- */
  var rawFetch = window.fetch ? window.fetch.bind(window) : null;
  window.fetch = function (input, init) {
    var url = typeof input === 'string' ? input : (input && input.url) || '';
    if (isLocalAsset(url)) return rawFetch(input, init);
    HITS.push({ via: 'fetch', url: url });
    log('fetch →', url);
    var real = resolveReal(url);
    if (!real && /^https?:\/\//.test(url)) real = url; // 直接代理硬编码的真实 URL
    if (real && !shouldMock(url)) {
      log('proxy →', real);
      return proxyRequest(real, init && init.method, init && init.body, init && init.headers);
    }
    var body = JSON.stringify(mockFor(url));
    return Promise.resolve(new Response(body, {
      status: 200, headers: { 'Content-Type': 'application/json' }
    }));
  };

  /* ---------- 5. 拦 XHR（原型补丁，保留原生对象，不破坏 responseType/事件） ---------- */
  var XP = XMLHttpRequest.prototype;
  var rawOpen = XP.open, rawSend = XP.send;
  var rawSetHeader = XP.setRequestHeader;
  var rawGetAll = XP.getAllResponseHeaders, rawGetOne = XP.getResponseHeader;

  function freeze(obj, k, v) {
    try { Object.defineProperty(obj, k, { value: v, configurable: true, writable: true }); }
    catch (e) { }
  }

  XP.open = function (method, url) {
    this.__nbUrl = url;
    this.__nbMethod = method || 'GET';
    this.__nbHeaders = {};
    this.__nbMock = !isLocalAsset(url);
    if (!this.__nbMock) return rawOpen.apply(this, arguments);
    HITS.push({ via: 'xhr', url: url, method: method });
    log('xhr →', method, url);
  };
  XP.setRequestHeader = function (k, v) {
    if (!this.__nbMock) return rawSetHeader.apply(this, arguments);
    if (this.__nbHeaders) this.__nbHeaders[k] = v;
  };
  XP.getAllResponseHeaders = function () {
    if (!this.__nbMock) return rawGetAll.apply(this, arguments);
    return 'content-type: application/json\r\n';
  };
  XP.getResponseHeader = function (h) {
    if (!this.__nbMock) return rawGetOne.apply(this, arguments);
    return /content-type/i.test(h) ? 'application/json' : null;
  };
  function respondXHR(self, text) {
    self.__nbUrl = self.__nbUrl || '';
    var rt = self.responseType;
    if (rt === 'json') {
      try { freeze(self, 'response', JSON.parse(text)); } catch (e) { freeze(self, 'response', text); }
    } else if (rt === 'arraybuffer') {
      freeze(self, 'response', new TextEncoder().encode(text).buffer);
    } else if (rt === 'blob') {
      freeze(self, 'response', new Blob([text], { type: 'application/json' }));
    } else {
      freeze(self, 'responseText', text);
      freeze(self, 'response', text);
    }
    freeze(self, 'readyState', 4);
    freeze(self, 'status', 200);
    freeze(self, 'statusText', 'OK');
    freeze(self, 'responseURL', self.__nbUrl);
    try { if (self.onreadystatechange) self.onreadystatechange(new Event('readystatechange')); } catch (e) { }
    try { self.dispatchEvent(new Event('readystatechange')); } catch (e) { }
    try { if (self.onload) self.onload(new Event('load')); } catch (e) { }
    try { self.dispatchEvent(new Event('load')); } catch (e) { }
    try { if (self.onloadend) self.onloadend(new Event('loadend')); } catch (e) { }
    try { self.dispatchEvent(new Event('loadend')); } catch (e) { }
  }

  XP.send = function (bodyArg) {
    if (!this.__nbMock) return rawSend.apply(this, arguments);
    var self = this;
    var real = resolveReal(self.__nbUrl);
    if (!real && /^https?:\/\//.test(self.__nbUrl)) real = self.__nbUrl; // 直接代理硬编码真实 URL
    if (real && !shouldMock(self.__nbUrl)) {
      log('proxy →', real);
      proxyRequest(real, self.__nbMethod, bodyArg, self.__nbHeaders)
        .then(function (r) { return r.text(); })
        .then(function (text) { respondXHR(self, text); })
        .catch(function () { respondXHR(self, JSON.stringify(mockFor(self.__nbUrl))); });
      return;
    }
    var text = JSON.stringify(mockFor(self.__nbUrl));
    setTimeout(function () { respondXHR(self, text); }, 0);
  };

  /* ---------- 5.5 保存 shim 的 XHR/fetch 版本，供 restore-shim.js 在 vip 脚本之后还原 ---------- */
  /* 必须放在 XP.send / XP.open 等覆盖之后，这样保存的是 shim 自己的版本，而非原生。 */
  window.__nbShimXHROpen = XP.open;
  window.__nbShimXHRSend = XP.send;
  window.__nbShimXHRSetHeader = XP.setRequestHeader;
  window.__nbShimXHRGetAll = XP.getAllResponseHeaders;
  window.__nbShimXHRGetOne = XP.getResponseHeader;
  window.__nbShimFetch = window.fetch;

  /* ---------- 6. 假登录态：cookie + storage ---------- */
  try {
    document.cookie = 'nb_token=offline-token;path=/';
    document.cookie = 'uid=100001;path=/';
    localStorage.setItem('userInfo', JSON.stringify(FAKE_USER));
    localStorage.setItem('nb_token', 'offline-token');
    localStorage.setItem('token', 'offline-token');
    localStorage.setItem('isLogin', '1');
  } catch (e) { }

  /* ---------- 7. 杂项全局桩 ---------- */
  window.sendToAppMessage = window.sendToAppMessage || function () { };
  window._howxm = window._howxm || function () { };
  window.g_initialProps = window.g_initialProps || {};
  window.sa = window.sa || { init: noop, track: noop, login: noop, quick: noop, registerPage: noop, setProfile: noop };
  function noop() { }
  window.sensors = window.sensors || window.sa;

  /* ---------- 8. 屏蔽 Service Worker（离线壳自己就是本地） ---------- */
  if (navigator.serviceWorker && navigator.serviceWorker.register) {
    navigator.serviceWorker.register = function () { return Promise.resolve({ scope: '/', unregister: function () { return Promise.resolve(true); } }); };
  }

  /* ---------- 9. 静默 WebSocket ---------- */
  var RawWS = window.WebSocket;
  window.WebSocket = function (url) {
    log('websocket blocked →', url);
    var o = { readyState: 3, close: noop, send: noop, addEventListener: noop, removeEventListener: noop };
    return o;
  };
  window.WebSocket.CONNECTING = 0; window.WebSocket.OPEN = 1;
  window.WebSocket.CLOSING = 2; window.WebSocket.CLOSED = 3;

  /* ---------- 10. 音频解码守卫 ----------
   * soundjs 0.6.1 的 WebAudioLoader 会把 xhr 响应再用 new Blob([...]) 包一层，
   * 然后直接把 Blob 传给 decodeAudioData —— 而该 API 只接受 ArrayBuffer，
   * 于是抛 “parameter 1 is not of type 'ArrayBuffer'”（同步 TypeError，未被 soundjs 的
   * error 回调捕获 → 表现为 Uncaught）。这里在边界处把 Blob 转回 ArrayBuffer，
   * 解码失败（离线时音频不存在/是占位数据）则回退为静音 buffer，保证实验室不崩。
   */
  (function patchDecodeAudioData() {
    var Ctor = window.AudioContext || window.webkitAudioContext;
    if (!Ctor) return;
    var Base = window.BaseAudioContext || Ctor;
    var proto = Base.prototype;
    var orig = proto.decodeAudioData;
    if (!orig || orig.__nbPatched) return;

    function silentBuffer(ctx) {
      try {
        var rate = ctx.sampleRate || 44100;
        return ctx.createBuffer(1, 1, rate);
      } catch (e) { return null; }
    }

    proto.decodeAudioData = function (buffer, success, error) {
      var self = this;

      function fail() {
        var sb = silentBuffer(self);
        if (success) { if (sb) success(sb); return undefined; }
        return Promise.resolve(sb || self.createBuffer(1, 1, self.sampleRate || 44100));
      }

      // Blob / 带 arrayBuffer() 的对象 → 先转 ArrayBuffer
      if (buffer && typeof buffer.arrayBuffer === 'function') {
        return buffer.arrayBuffer().then(
          function (ab) {
            try { return orig.call(self, ab, success, error); }
            catch (e) { return fail(); }
          },
          function () { return fail(); }
        );
      }
      if (buffer instanceof ArrayBuffer) {
        try { return orig.call(self, buffer, success, error); }
        catch (e) { return fail(); }
      }
      // 其它类型（字符串 / 占位数据等）→ 静音，不抛
      return fail();
    };
    proto.decodeAudioData.__nbPatched = true;
    log('decodeAudioData 守卫已装');
  })();

  log('offline shim ready. 查看被拦请求: window.__nbShimHits');
})();
