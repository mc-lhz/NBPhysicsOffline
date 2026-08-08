/*!
 * nb-vip-local.js —— vip/v4.2.js 的本地化替代实现
 * ---------------------------------------------------------------------------
 * 为什么要替换掉 v4.2：
 *   1. v4.2 是 Tampermonkey 脚本：依赖 @match 在线域名、@require CDN 的 crypto-js，
 *      离线包里两者都不成立。
 *   2. v4.2 的核心手法是「网络中间人」——覆写 XMLHttpRequest.prototype.send，
 *      把请求转发到真实 NoBook 服务器再改写响应。离线环境没有源站，请求必然挂起；
 *      而且它的 send 覆写会盖掉 nb-offline-shim.js 的同名覆写，
 *      导致点击试剂屏 / 容器时拿不到数据、面板打不开。
 *
 * 本脚本改用「数据层注入」，一行 XHR/fetch 都不碰，因此与 shim 零冲突：
 *   app 判定 VIP 的唯一公式（appModel/updateVipStatus）：
 *       pid   = Config.getGradePid(gradeId)        // 化学：初中 czhx / 高中 gzhx
 *       isVip = loginModel.userInfo.vip_info[pid].vip === 1
 *   器材锁公式：
 *       unlocked = isLock === false || isFreeEq || isVip || isActive
 *
 * 关键在于 loginModel.userInfo 从哪来 —— 它只有一个来源：
 *       initUserToken → LP() → GET passport/v5/login/check
 *                     → if (!(res && res.auth_token)) 判未登录
 *                     → 否则 dispatch setUserInfo(res)
 * 而 LP() 里 vip_info 不取自响应明文，而是取自 encrypt_data 解密后的 JSON。
 *
 * 所以真正要做的是两件事，缺一不可：
 *   §3  nb-offline-shim.js 让 login/check 返回【扁平】且带 auth_token / encrypt_data
 *       的用户对象（早期版本套了 {code,data} 信封，导致 auth_token 读不到，
 *       app 判未登录 → 弹微信扫码框 → 二维码 canvas 未挂载 → getContext 报错）；
 *   §4  本脚本接住解密链末端的 JSON.parse，把 vip_info 送进去。
 *
 * 注意：只改 shim 的假用户对象是不够的 —— 那个对象根本不会进入 loginModel.userInfo。
 *
 * 加载位置：nb-offline-shim.js 之后、umi.js 之前（见 index.html）。
 * 依赖：无。不需要 Tampermonkey，不需要联网，不需要 crypto-js。
 */
(function () {
  'use strict';

  if (window.__nbVip) return;               // 防重复注入

  var DEBUG = true;
  function log() {
    if (!DEBUG) return;
    var a = ['%c[nb-vip]', 'color:#0a7'];
    Array.prototype.push.apply(a, arguments);
    try { console.log.apply(console, a); } catch (e) { }
  }

  /* ---------- 1. 学科 pid 常量 ---------- */
  // 直接摘自 umi.5eade003.js 的 Config 静态字段，改动版本时需要复核。
  var PIDS = {
    czhx: 'CZHXNDZHTa75',      // 初中化学  ← 本离线包主用
    gzhx: 'GZHXXV8IClkO',      // 高中化学  ← 本离线包主用
    czwl: 'CZWlTE4lVgz9',      // 初中物理
    gzwl: 'GZWLcJQXfD9W',      // 高中物理
    czsw: 'JuFhE84jRhEh',      // 初中生物
    gzsw: 'EjEViMk33jNr',      // 高中生物
    wzhx: 'IfKiInEcZu9c',      // 完全校化学
    wzwl: 'NiFEjb83nJL4',      // 完全校物理
    xkpid: 'iwjngieNGEAiEI2'   // 小学科学
  };

  // app 里对到期时间有两种读法：new Date(vip_endtime).getTime() 按毫秒解，
  // 另一处埋点按 +(vip_endtime + "00") 解。给毫秒值可让主判定路径正确。
  var FAR_FUTURE_MS = 4102444800000;         // 2100-01-01

  function vipEntry() {
    return {
      vip: 1,
      is_vip: 1,
      channel_vip: 2,
      app_resource_vip: 1,
      school_vip: 1,
      vip_endtime: FAR_FUTURE_MS,
      endtime: FAR_FUTURE_MS
    };
  }

  function buildVipInfo() {
    var m = {};
    for (var k in PIDS) {
      if (Object.prototype.hasOwnProperty.call(PIDS, k)) m[PIDS[k]] = vipEntry();
    }
    return m;
  }

  var VIP_INFO = buildVipInfo();
  var VIP_PIDS = Object.keys(VIP_INFO);

  /* ---------- 2. 给「像用户对象」的数据补齐 VIP 字段 ---------- */
  function looksLikeUser(o) {
    if (!o || typeof o !== 'object' || Array.isArray(o)) return false;
    return ('user_id' in o) || ('username' in o) ||
           ('vip_info' in o) || ('nickname' in o && 'id' in o);
  }

  function applyVip(user) {
    if (!user || typeof user !== 'object') return user;

    // vip_info 是主判定依据：缺失就整份补，存在就补齐缺的 pid（不覆盖已有真值）
    if (!user.vip_info || typeof user.vip_info !== 'object' || Array.isArray(user.vip_info)) {
      user.vip_info = buildVipInfo();
    } else {
      for (var i = 0; i < VIP_PIDS.length; i++) {
        var pid = VIP_PIDS[i];
        var cur = user.vip_info[pid];
        if (!cur || +cur.vip !== 1) user.vip_info[pid] = vipEntry();
      }
    }

    // 次要路径：formatVipData() 里 `+f.vip == 1` 直接短路返回 isVip
    if (+user.vip !== 1) user.vip = 1;
    if (+user.is_vip !== 1) user.is_vip = 1;
    user.isVip = true;
    if (+user.channel_vip !== 2) user.channel_vip = 2;
    if (+user.app_resource_vip !== 1) user.app_resource_vip = 1;
    if (!user.vip_endtime) user.vip_endtime = FAR_FUTURE_MS;

    return user;
  }

  /* ---------- 3. 主注入点：shim 的假用户 ---------- */
  // nb-offline-shim.js 里 `window.__nb_offline_user = FAKE_USER`，
  // 与 mockFor() 闭包里用的是同一个对象引用，就地改写即可影响所有后续假响应。
  var patchedUser = false;
  function patchShimUser() {
    var u = window.__nb_offline_user;
    if (!u) return false;
    applyVip(u);
    if (!patchedUser) {
      patchedUser = true;
      log('已为 shim 假用户注入 vip_info，覆盖', VIP_PIDS.length, '个 pid');
    }
    return true;
  }

  if (!patchShimUser()) {
    // shim 万一还没跑（加载顺序被改过），轮询短时间补救
    var tries = 0;
    var timer = setInterval(function () {
      if (patchShimUser() || ++tries > 100) clearInterval(timer);
    }, 50);
    log('警告：未找到 window.__nb_offline_user，nb-offline-shim.js 可能未先加载');
  }

  /* ---------- 4. 主注入点：checkLogin 的 encrypt_data 解密链 ----------
   * 这是真正决定 VIP 的一条路径，§3 的假用户只是给其它零散接口兜底。
   *
   * app 侧（umi.5eade003.js 模块 72805 的 LP）：
   *     var de = pw(le.encrypt_data, X);          // X = getUniqueID() = Date.now()
   *     try { le.vip_info = JSON.parse(de).vip_info } catch { le = null }
   *
   * 也就是说：整份 encrypt_data 里 app 只取 vip_info 一个字段。
   * 密钥 MD5(X) 每次都变、X 又只以 RSA 密文形式出现在 sign-v1 里，离线侧算不出，
   * 所以 shim 给的是一个「只有 IV、密文长度为 0」的 blob，pw() 恒定返回 ""（不抛）。
   * 于是这里把那次 JSON.parse("") 接住，直接返回 vip_info —— 效果等同于
   * 服务端下发了一份 VIP 全开的加密数据，且完全不用碰 AES/RSA。
   *
   * 配对信号由 shim 的 loginCheckPayload() 设置：单槽时间戳，用完即清。
   * 之所以不做成计数器：若某次 check 的响应没被消费（请求被取消、重试等），
   * 计数会一直挂着，几秒后可能误伤别处正常的 JSON.parse("")——那里本该抛异常。
   * 单槽 + 3 秒窗口即可：响应体读取到 pw() 再到 JSON.parse 是同一条微任务链，
   * 实际间隔在毫秒级。
   */
  var LOGIN_CHECK_TTL = 3000;

  function consumeLoginCheck() {
    var at = window.__nbLoginCheckAt || 0;
    if (!at || Date.now() - at > LOGIN_CHECK_TTL) return false;
    window.__nbLoginCheckAt = 0;             // 一次性
    return true;
  }

  /* ---------- 4.5 兜底注入点：其余 JSON.parse ---------- */
  // 有些数据不走 shim 的 mockFor（例如从 fixtures 回放的真实响应、
  // 或 localStorage 里反序列化出来的历史登录态）。在这里统一补齐。
  var rawParse = JSON.parse;
  var enrichHits = 0;
  var loginCheckHits = 0;

  function enrich(node, depth) {
    if (depth > 4 || !node || typeof node !== 'object') return node;

    if (Array.isArray(node)) {
      if (node.length > 500) return node;                 // 大数组不遍历，避免拖慢
      for (var i = 0; i < node.length; i++) enrich(node[i], depth + 1);
      return node;
    }

    if (looksLikeUser(node)) { applyVip(node); enrichHits++; }

    // 激活态：activeArr[gradeId-2] 为 true 时同样解锁器材
    if (Array.isArray(node.activeArr) && node.activeArr.length < 8) {
      node.activeArr = [true, true];
    }

    var keys = ['user', 'userInfo', 'info', 'data', 'result', 'payload'];
    for (var j = 0; j < keys.length; j++) {
      if (node[keys[j]]) enrich(node[keys[j]], depth + 1);
    }
    return node;
  }

  JSON.parse = function (text, reviver) {
    // checkLogin 解密链：pw() 返回的空串在这里被换成 VIP 数据（详见 §4）
    if (text === '' && consumeLoginCheck()) {
      loginCheckHits++;
      log('checkLogin 解密链已接管，下发 vip_info（覆盖', VIP_PIDS.length, '个 pid）');
      return { vip_info: buildVipInfo() };
    }
    var out = rawParse.call(JSON, text, reviver);   // 解析失败照常抛出，不改变原语义
    if (typeof text === 'string' &&
        (text.indexOf('vip') >= 0 || text.indexOf('user_id') >= 0 || text.indexOf('activeArr') >= 0)) {
      try { enrich(out, 0); } catch (e) { }
    }
    return out;
  };

  /* ---------- 5. localStorage 标记 ---------- */
  // un_lock_vip 是 app 自带的解锁后门，但门控条件是 `!isLoadZH && un_lock_vip`，
  // 而 isLoadZH = /^zh/.test(lang)——中文界面下恒为 true，所以这个后门在中文下是死的。
  // 仍然写入：切到非中文语言时它能兜底，且无副作用。
  try {
    localStorage.setItem('un_lock_vip', '1');
    if (!localStorage.getItem('current_user_id')) {
      var u0 = window.__nb_offline_user;
      localStorage.setItem('current_user_id', String((u0 && u0.user_id) || 100001));
    }
  } catch (e) { }

  /* ---------- 6. 自检 ---------- */
  window.__nbVip = {
    version: 'local-1.0',
    pids: PIDS,
    vipInfo: VIP_INFO,
    applyVip: applyVip,

    // 复刻 app 的判定公式，用来确认注入是否生效
    check: function (gradeId) {
      var u = window.__nb_offline_user || {};
      var pid = (gradeId === 3) ? PIDS.gzhx : PIDS.czhx;   // 3=高中, 2=初中
      var e = u.vip_info && u.vip_info[pid];
      return {
        pid: pid,
        hasVipInfo: !!(u.vip_info),
        isVip: !!(e && e.vip === 1),
        unlockEquipment: !!(e && e.vip === 1),
        jsonParseEnriched: enrichHits
      };
    },

    // 真正生效与否看这里：读 Redux 里的 loginModel.userInfo / appModel.isVip
    live: function () {
      try { return window.getDvaApp()._store.getState(); }
      catch (e) { return null; }
    },

    status: function () {
      var cz = this.check(2), gz = this.check(3);
      console.table({
        '初中化学': { pid: cz.pid, isVip: cz.isVip },
        '高中化学': { pid: gz.pid, isVip: gz.isVip }
      });
      console.log('[nb-vip] checkLogin 解密链接管次数:', loginCheckHits,
                  '| JSON.parse 补齐次数:', enrichHits,
                  '| shim 假用户已注入:', patchedUser);

      // 以 app 自己的状态为准做二次确认
      try {
        var s = window.getDvaApp()._store.getState();
        var ui = s.loginModel && s.loginModel.userInfo;
        console.log('[nb-vip] Redux 实况 → 已登录:', !!ui,
                    '| userInfo.vip_info:', !!(ui && ui.vip_info),
                    '| appModel.isVip:', s.appModel && s.appModel.isVip,
                    '| gradeId:', s.appModel && s.appModel.gradeId);
      } catch (e) {
        console.log('[nb-vip] Redux 尚未就绪（app 可能还没初始化完）');
      }
      return { cz: cz, gz: gz };
    }
  };

  log('已就绪。控制台执行 __nbVip.status() 查看状态。');
})();
