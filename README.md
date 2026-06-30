# miniprogram-ci-action

GitHub Action for previewing and uploading WeChat MiniProgram projects with
[`miniprogram-ci`](https://www.npmjs.com/package/miniprogram-ci).

This project is modified from
[`crazyurus/miniprogram-action`](https://github.com/crazyurus/miniprogram-action).

## Requirements

- GitHub Actions runner with `node24`
- A valid MiniProgram `project.config.json`
- A WeChat MiniProgram CI private key

Before using this action, log in to the WeChat public platform as a MiniProgram
administrator, open "开发" -> "开发设置" -> "小程序代码上传", generate and download
the code upload private key, then configure the IP whitelist or disable the
whitelist after understanding the risk.

Official documentation:
[miniprogram-ci](https://developers.weixin.qq.com/miniprogram/dev/devtools/ci.html)

## Usage

### Preview

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

      - name: Print QR code path
        run: echo "${{ steps.preview.outputs.preview_qrcode_path }}"
```

### Upload

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

## Inputs

| Name | Required | Default | Description |
| --- | --- | --- | --- |
| `action_type` | no | `upload` | `preview` or `upload`. |
| `project_path` | no | `.` | Directory containing `project.config.json`. |
| `page_path` | no | | Preview page path, for example `pages/index/index`. |
| `page_query` | no | | Preview page query string, for example `a=1&b=2`. |
| `scene` | no | `1011` | Preview scene value. |
| `version` | no | `1.0.0` | Upload version. |
| `description` | no | `通过 MiniProgram GitHub Action 上传` | Upload or preview description. |
| `ci` | no | `24` | CI robot number. `miniprogram-ci` supports `1` to `30`. |

## Outputs

| Name | Description |
| --- | --- |
| `preview_qrcode` | Base64 content of the preview QR code. Only set for `preview`. |
| `preview_qrcode_path` | Local path of the preview QR code image. Only set for `preview`. |

## Secrets

Set one of the following environment variables:

| Name | Description |
| --- | --- |
| `PRIVATE_KEY` | Private key file content. Recommended for GitHub Secrets. |
| `PRIVATE_KEY_PATH` | Private key file path. Useful for local debugging. |

`PRIVATE_KEY` example:

```yaml
env:
  PRIVATE_KEY: ${{ secrets.PRIVATE_KEY }}
```

## Project Configuration

This action passes `setting.useProjectConfig: true` to `miniprogram-ci`, so build
settings are read from your `project.config.json`.

`miniprogram-ci` has deprecated the old `allowIgnoreUnusedFiles` upload/preview
option. Configure unused-file filtering in `project.config.json` instead.

If `package.json` exists under `project_path`, this action runs `npm install`
inside the project and then calls `ci.packNpm`, matching the WeChat Developer
Tools "构建 npm" behavior.

## Development

```bash
npm install
npm run check
```

`npm run check` runs TypeScript type checking and Node's built-in test runner.
