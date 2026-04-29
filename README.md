# Car App

豪华车载乘客端 Web App 原型，使用 React、Vite 与 lucide-react 构建。

## Commands

```bash
pnpm install
pnpm dev
pnpm build
pnpm start
```

本地环境如果遇到 Rollup 原生包签名限制，项目已通过 `pnpm.overrides` 使用 `@rollup/wasm-node` 来保证构建稳定。

## Runtime

- 乘客端开发地址：`http://127.0.0.1:5173/`
- 司机端开发地址：`http://127.0.0.1:5173/driver`
- API 服务默认地址：`http://127.0.0.1:5174`

Gemini 接入由后端代理完成，启动前设置：

```bash
export GEMINI_API_KEY="your-key"
```

餐厅推荐使用浏览器 GPS + OpenStreetMap Overpass API；音乐使用 iTunes Preview API；资讯使用 GDELT；视频使用公开视频源。
