# miniprogram-ci-action

基于 [`miniprogram-ci`](https://www.npmjs.com/package/miniprogram-ci) 的 GitHub Action，用于预览和上传微信小程序项目。

官方文档：
[miniprogram-ci](https://developers.weixin.qq.com/miniprogram/dev/devtools/ci.html)

## 使用要求

- GitHub Actions Runner 支持 `node24`
- 小程序项目目录存在有效的 `project.config.json`
- 已配置微信小程序 CI 上传密钥

使用前，请用小程序管理员账号登录微信公众平台，进入“开发” -> “开发设置” -> “小程序代码上传”，生成并下载代码上传密钥，然后配置 IP 白名单，或在确认风险后关闭 IP 白名单。

密钥通过以下环境变量之一传入：

| 名称 | 说明 |
| --- | --- |
| `PRIVATE_KEY` | 私钥文件内容，推荐通过 GitHub Secrets 配置。 |
| `PRIVATE_KEY_PATH` | 私钥文件路径，适合本地调试使用。 |

## 使用方式

### 上传

```yaml
name: Upload MiniProgram

on:
  push:
    tags:
      - "v*"

jobs:
  upload:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - uses: gexin1/miniprogram-ci-action@v1
        with:
          action_type: upload
          project_path: .
          version: ${{ github.ref_name }}
          description: ${{ github.event.head_commit.message }}
          ci: "24"
        env:
          PRIVATE_KEY: ${{ secrets.PRIVATE_KEY }}
```

### 预览

```yaml
name: Preview MiniProgram

on:
  pull_request:
  workflow_dispatch:

jobs:
  preview:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - id: preview
        uses: gexin1/miniprogram-ci-action@v1
        with:
          action_type: preview
          project_path: .
          page_path: pages/index/index
          page_query: from=github
          scene: "1011"
          ci: "24"
        env:
          PRIVATE_KEY: ${{ secrets.PRIVATE_KEY }}

      - run: echo "${{ steps.preview.outputs.preview_qrcode_path }}"
```

## 输入参数

| 名称 | 是否必填 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `action_type` | 否 | `upload` | 执行类型，可选 `preview` 或 `upload`。 |
| `project_path` | 否 | `.` | 小程序项目目录，即 `project.config.json` 所在目录。 |
| `version` | 否 | `1.0.0` | 上传版本号。 |
| `description` | 否 | `通过 MiniProgram GitHub Action 上传` | 上传或预览备注。 |
| `ci` | 否 | `24` | CI 机器人编号，`miniprogram-ci` 支持 `1` 到 `30`。 |
| `use_cos` | 否 | | 是否传入 `useCOS`。上传时大于 5MB 的代码包默认会使用异步上传。 |
| `setting_json` | 否 | `{"useProjectConfig":true}` | 额外编译设置 JSON，会覆盖默认设置中的同名字段。 |
| `page_path` | 否 | | 预览页面路径，例如 `pages/index/index`。 |
| `page_query` | 否 | | 预览页面启动参数，例如 `a=1&b=2`。 |
| `scene` | 否 | `1011` | 预览场景值。 |
| `qrcode_format` | 否 | `base64` | 预览二维码格式，可选 `base64`、`image` 或 `terminal`。 |
| `qrcode_output_dest` | 否 | 临时目录 | 预览二维码保存路径。 |
| `big_package_size_support` | 否 | | 预览时是否启用主包、分包 4M 体积上限支持。 |

`setting_json` 示例：

```yaml
with:
  action_type: upload
  setting_json: '{"useProjectConfig":true,"es6":true}'
```

## 输出参数

| 名称 | 说明 |
| --- | --- |
| `result_json` | `ci.upload` 或 `ci.preview` 返回值的 JSON 字符串。 |
| `preview_qrcode` | 预览二维码 base64 内容，仅 `qrcode_format=base64` 时输出。 |
| `preview_qrcode_path` | 预览二维码本地文件路径。 |

## 项目配置说明

本 Action 默认向 `miniprogram-ci` 传入 `setting.useProjectConfig: true`，因此上传和预览相关的构建设置会优先按项目的 `project.config.json` 执行。需要覆盖时使用 `setting_json`。

`miniprogram-ci` 已废弃旧的 `allowIgnoreUnusedFiles` 上传/预览配置。如需过滤无依赖文件，请在 `project.config.json` 中配置。

本 Action 不会自动执行 `npm install` 或 `ci.packNpm`。如果项目需要“构建 npm”，请在调用本 Action 前用工作流步骤自行处理。

## 开发

```bash
npm install
npm run check
```

`npm run check` 会执行 TypeScript 类型检查和 Node.js 内置测试。
