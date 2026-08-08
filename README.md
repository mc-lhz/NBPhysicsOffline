# NBPhysicsOffline —— 物理站（wl.nobook.com）离线包（小范围验证版）

> 由化学离线包 `NBChemistryOffline` 移植，验证 VIP 离线化解密链 trick 在 `wuli_v6.20.12` 上仍成立。
> 本目录 = 已镜像的物理站打包产物 + 复用的注入层 + 本地服务器。

## 一、目录内容

```
nbphysics-offline/
├── index.html              # 物理版入口（引用 umi.575bfdda.js / phy.ico / 注释掉 CDN 脚本）
├── nb-offline-shim.js      # 离线垫片（从化学包复制，零改动）
├── nb-vip-local.js         # VIP 数据注入（从化学包复制，零改动，PIDs 已含 czwl/gzwl）
├── server.py               # Flask 本地服务器（ORIGIN=wl.nobook.com；含 chunk.css/dependJS 占位）
├── restore-shim.js         # 还原脚本（备用品）
├── umi.575bfdda.js         # 物理站主包 6.29MB
├── umi.96f4e3ed.css         # 主样式 5.53MB
├── physics-libs.min.js      # 物理引擎库（根目录，physics serial 加载）
├── physics-libs-chunk/       # 物理引擎内部 2528 chunk（独立 webpack runtime 懒加载）
├── assets/physics-libs-vandor.min.js  # 物理引擎 vendor 库（含 PIXI/TweenMax/mousewheel）
├── assets/nb-config.js     # 物理站配置（originUrl=wl）
├── assets/ js/             # 本地依赖（jquery/lodash/tinymce/... 已镜像）
├── *.async.js (123)        # 动态 chunk（118 常规 + 5 external_*）
├── *.chunk.css (28)        # 真实存在的 chunk CSS（已镜像，源站 200）
├── nb-3d-demo/             # Babylon 3D 引擎（earcut/babylon/cannon/TweenMax/NB3DDemo-*）
├── assets/index-04b904d7.min.js  # Web Worker（subscriptions）
├── assets/dependJS/        # 版本捆绑产物占位（源站也404，引擎已并入 physics-libs）
├── phy.ico
├── fixtures/               # 实验数据录制目录（当前空，需 --record 填充）
├── mirror.py / mirror_static.py / re_mirror_external.py / re_mirror_css.py / _extract.py  # 镜像脚本
├── mirror_physics_libs_chunks.py  # 第三论新增：提取并全量镜像 physics-libs 内部 2528 chunk
└── verify_trick.js         # Node 验证空密文 trick（见下文）
```

## 二、运行

```bash
cd nbphysics-offline
python server.py            # 纯离线（默认 REPLAY）
# 或联网录制实验数据： python server.py --record
# 浏览器打开： http://127.0.0.1:8010/physics/new?moduleId=9
```

## 三、验证解密链 trick（已在 Node 实锤，无需浏览器）

```bash
NODE_PATH=<node_workspace>/node_modules node verify_trick.js
```

输出应显示：
- 空密文 `AAAAAAAAAAAAAAAAAAAAAA==` → `pw()` 返回 `""` 且不抛异常（crypto-js 实跑，3000 次随机 seed 全 PASS）
- 随机密文（IV+1块）有 ~5.6% 概率抛异常 → 印证"必须用零长度密文"
- 这证明 shim 的空密文 + nb-vip-local 的 `JSON.parse` hook 在 6.20.12 上成立

## 四、浏览器实跑确认（用户侧最终验证）

1. 启动 `server.py`，打开 `http://127.0.0.1:8010/physics/new?moduleId=9`
2. 控制台执行 `window.__nbVip.status()`，应看到：
   - `checkLogin 解密链接管次数 > 0`
   - `JSON.parse 补齐次数 > 0`
   - Redux 实况：`userInfo.vip_info` 存在、`appModel.isVip` 为 true、`gradeId` 已设置
3. 进入任一实验，确认器材/实验可加载且不被 VIP 弹窗拦截

## 五、控制台报错诊断与修复（2026-08-08 第二轮）

用户首跑在浏览器控制台报出一批 404 / 报错，逐一定位并修复：

| 报错 | 根因 | 处理 |
|------|------|------|
| `physics-libs.min.js` 404（根目录） | `Wi.phy.serial` 加载的 2 个物理引擎库未镜像 | 已从源站下载到包根 |
| `assets/physics-libs-vandor.min.js` 404 | 同上（vendor 库） | 已从源站下载到 `assets/` |
| `3050.eb0ae490.chunk.css` / `5259.e328c8c6.chunk.css` 404 | chunk CSS 与 JS 用**不同 contenthash**，镜像只抓了 `.async.js` | `re_mirror_css.py` 从 umi.js 提取 CSS 映射，下载 28 个源站 200 的真实 chunk.css |
| `chunkId is not defined` ReferenceError | umi.js 里 CSS chunk 加载 `<link>.onerror` 引用了作用域外的 `chunkId`；**仅当 chunk.css 404 时**触发 | 真实 chunk.css 落地 + 源站 404 的 100 个 chunk.css 由 `server.py` 返回空 `text/css`(200)，onerror 不再触发 |
| `js/iscroll.min.js` / `nb-3d-demo/*` / `assets/index-04b904d7.min.js` 404 | 首跑在 physics-libs 404 处中止，未触及这些更晚加载的脚本 | 已全部镜像（Babylon 3D 引擎、iScroll、Worker） |
| `assets/dependJS/*.js` 404（nb-phy/TweenMax/soundjs/mousewheel） | **源站本身也 404**：wuli_v6.20.12 把这些引擎并入了 `physics-libs*.min.js`，`loadParallel` 非阻塞加载 | `server.py` 对 `assets/dependJS/*.js` 返回空 `application/javascript`(200)，与源站行为一致 |
| `nb_version.json` 404 | 版本检查，源站也 404；app 自己 `try 默认版本` 兜底 | 无需处理（日志仅记 missing.log） |
| `imgs/appIcons/phy-144.png` 404 | PWA 图标，源站也可能缺 | `server.py` 图片占位（透明 PNG）兜底 |

修复后，上述路径本地全部返回 200（或源站一致的 404 占位），控制台噪音与 `chunkId` 报错消除。
**VIP 解密链 trick 在本轮已确认生效**（控制台曾出现 `checkLogin 解密链已接管，下发 vip_info（覆盖 9 个 pid）`），`gradeId` 由 app 自身正确设置（日志 `sdkModel 已有 gradeId=2, 跳过 dispatch`），注入层无需改动。

### 第三轮（2026-08-08 续）：进实验室后的报错

用户第二跑已能进 `moduleId=9` 实验页，但控制台新增两类报错，逐一修复：

| 报错 | 根因 | 处理 |
|------|------|------|
| `ChunkLoadError: Loading chunk 59941 failed` → `physics-libs-chunk/5d44d673.min.js` 404 | `physics-libs.min.js` 是**第二个独立 webpack runtime**（`ne.u = L => "physics-libs-chunk/"+{chunkId:hash,...}[L]+".min.js"`），内含 **2528 个内部 chunk**，每个仪器/场景懒加载；前两论只镜像了 umi 主包，未镜像这些 | 写 `mirror_physics_libs_chunks.py`：从 physics-libs.min.js 提取 2528 个 `{chunkId:hash}`，去重，多线程(16 worker)下载全部 `physics-libs-chunk/<hash>.min.js` → 2528 文件 / 22.44MB / 0 失败 / 25s |
| `get_scene_tool*.json` / `howler_sound*.json` / `dependclasses*.json` / `glowconfig*.json` / `bground*.json` 404（无限重试循环） | 物理引擎场景配置基础资源，content-hash 指纹名、**运行时动态加载**，静态不可枚举；前两论因 physics-libs 404 中止未触及 | 从源站下载 5 个 JSON 到 `assets/`（纯配置、无嵌套资源路径），重试循环消除；剩余运行时指纹资源（贴图/音效）由 `server.py --record` 自愈 |
| `nb_version.json` 404（非致命，app 兜底） | 版本检查 | 顺手从源站下载 43B 文件消除 404 噪音 |
| `imgs/appIcons/phy-144.png` manifest 图标 404（透明占位兜底） | PWA 图标 | 从源站下载 25KB PNG 消除 404 噪音 |
| `server.py` RECORD 模式自愈取源站时 Referer 错写为 `/chemistry/new` | 移植时 Referer 未改物理路径 | `server.py` 两处 Referer 改为 `/physics/new`，保证物理资源自愈 fetch 带正确 referer |

修复后第三轮在 `--record` 模式重启，12 个此前 404 端点全部本地 200。关键：`ChunkLoadError` 根因（2528 物理引擎内部 chunk 缺失）已消除，`moduleId=9`（电路实验：DengBan→ElecWire/ElecAmpereMeter/BatteryHolder/RedNeedle/BlackNeedle）进入链路打通。

## 六、已知缺口（"全量镜像"待补）

| 缺口 | 影响 | 处理 |
|------|------|------|
| 100 个 chunk.css 源站也 404（样式并入 umi.css） | 仅个别组件缺独立样式 | 已用空 CSS 占位兜底，umi.css 覆盖主样式 |
| 3 个常规 async.js（1704/4517/6164）源站 404 | 极个别特性缺失 | 暂忽略 |
| 3D 模型走 `model3DDomain`（noteach CDN），shim 未重定向 | 3D 模型离线缺失（UI 不崩） | 需镜像模型资源并补 shim 快照 |
| 实验数据 fixtures 录制中 | 实验数据随用户浏览自动录制 | 已 `--record` 模式运行，待确认浏览后已落盘 |
| shim 内 `subject:'chemistry'` / `gradeId:3` 为化学硬编码 | 仅 fallback dispatch 用；app 自设 gradeId=2 时已跳过 | 如需强制兜底物理学段可改，当前不影响 |

## 七、镜像脚本说明

- `_extract.py`：从 `umi.575bfdda.js` 提取 webpack chunk 映射（126 个），生成 `_download_plan.txt`
- `mirror.py`：下载 umi + 全部 `<id>.<hash>.async.js`（JS chunk）
- `mirror_static.py`：下载 `js/`、`assets/` 本地依赖（jquery/lodash/tinymce…）
- `re_mirror_external.py`：补下 `external_*` 命名的特殊 chunk（LoginPanel/OffLineActive/HlsJsPlayer…）
- `re_mirror_css.py`：补下真实存在的 `<id>.<hash>.chunk.css`（与 JS 不同 hash）
- `mirror_physics_libs_chunks.py`：第三轮新增，从 `physics-libs.min.js` 提取 2528 个 `{chunkId:hash}` 映射，多线程下载全部 `physics-libs-chunk/<hash>.min.js`（独立 webpack runtime 内部 chunk）
- `verify_trick.js`：用真实 crypto-js 复现 `pw()` 验证空密文 trick
