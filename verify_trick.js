// 用物理站真实依赖 crypto-js 忠实复现 wuli_v6.20.12 的 pw()，
// 验证 "空密文 trick" 在该版本上仍成立（Node 内置 crypto 对空密文会抛异常，
// 但 crypto-js 的 Pkcs7 unpad 读到空按 0 处理返回空串 —— 这是 trick 成立的真实依据）。
const CryptoJS = require("crypto-js");

// 与 umi.575bfdda.js 中的 Vt/pw 一一对应（$e/Re 即 crypto-js）
function pw(ctB64, seed) {
  const Ve = CryptoJS.enc.Base64.parse(ctB64);
  const ut = CryptoJS.lib.WordArray.create(Ve.words.slice(0, 4)); // 前16字节 = IV
  const dt = CryptoJS.lib.WordArray.create(Ve.words.slice(4));   // 余下 = 密文
  const Dt = CryptoJS.AES.decrypt(
    { ciphertext: dt },
    CryptoJS.enc.Utf8.parse(CryptoJS.MD5(seed).toString()),      // key = MD5(seed) 的 utf8 字节(32B→AES-256)
    { iv: ut, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7 }
  );
  return Dt.toString(CryptoJS.enc.Utf8);
}

const EMPTY_CIPHER = "AAAAAAAAAAAAAAAAAAAAAA=="; // 16字节全0：仅IV，密文长度=0

// 1) 空密文必须稳定返回 "" 且不抛异常
let emptyResult, emptyThrew = false;
try {
  emptyResult = pw(EMPTY_CIPHER, "1700000000000");
} catch (e) {
  emptyThrew = true;
  console.log("空密文 pw() 抛异常:", e.message);
}
console.log("=== 空密文 AAAAAAAAAAAAAAAAAAAAAA== (crypto-js) ===");
console.log("  pw() 返回:", JSON.stringify(emptyResult), "| 是否抛异常:", emptyThrew);
console.log("  结论:", (!emptyThrew && emptyResult === "") ? "PASS — 恒返回空串，解密链不中断" : "FAIL");

// 2) 随机密文(IV+1块) 抽样，验证“会抛异常”的设计依据（对照化学报告 ~6.4%）
let throws = 0, N = 3000;
for (let i = 0; i < N; i++) {
  const rnd = CryptoJS.lib.WordArray.random(32); // IV(16)+密文(16)
  try { pw(CryptoJS.enc.Base64.stringify(rnd), String(Date.now() + i)); }
  catch (e) { throws++; }
}
console.log("\n=== 随机密文(IV+1块) 抽样 " + N + " 次 (crypto-js) ===");
console.log("  抛异常次数:", throws, "(" + (throws / N * 100).toFixed(1) + "%)");
console.log("  结论:", throws > 0 ? "随机密文会抛 → 必须用零长度密文而非随机块" : "未观测到抛异常");

// 3) 用随机 seed 多次跑空密文，确认“稳定不抛”（对照化学报告 3000 次 0 异常）
let stableThrows = 0;
for (let i = 0; i < 3000; i++) {
  try { if (pw(EMPTY_CIPHER, String(Date.now() + i)) !== "") stableThrows++; }
  catch (e) { stableThrows++; }
}
console.log("\n=== 空密文 × 3000 随机 seed ===");
console.log("  异常或非空次数:", stableThrows, "/ 3000");
console.log("  结论:", stableThrows === 0 ? "PASS — 零长度密文 3000 次稳定返回空串" : "FAIL");

// 4) LP() 结构结论（来自 umi.575bfdda.js grep）
console.log("\n=== LP() 解密链结构（umi.575bfdda.js grep 实锤）===");
console.log('  if(de){ var se=(0,B.pw)(de,ne); try{ var le=JSON.parse(se); fe.vip_info=le.vip_info }catch(he){ fe=null }');
console.log("  → pw() 在 try 之外；空密文 trick 让其返回 \"\"，JSON.parse(\"\") 在 try 内被 nb-vip-local hook 接管");
