# git action 使用

1. ssh 上传文件步骤

```yml
name: GitHub Actions Build and Deploy to Tencent

on:
  # Runs on pushes targeting the `main` branch. Change this to `master` if you're
  # using the `master` branch as the default branch.
  push:
    branches:
      - tencent

permissions:
  contents: write

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest #指定服务器的运行环境：最新版本ubuntu
    steps:
      # 使用actions/checkout@v4 库拉取代码到 ubuntu 上
      - name: Checkout
        uses: actions/checkout@v4
        with:
          # 根据网上资料查询此处可以设置为 false。https://github.com/actions/checkout
          persist-credentials: false

      # 安装 pnpm
      - name: Install pnpm
        uses: pnpm/action-setup@v2
        with:
          version: 8

      # 设置node的版本
      - name: Use Node.js
        # 使用 actions/setup-node@v3 库安装 nodejs，with 提供了一个参数 node-version 表示要安装的 nodejs 版本
        uses: actions/setup-node@v3
        with:
          node-version: "18.x"
          cache: "pnpm"

      # 打包成静态文件
      - name: Build
        run: pnpm install && pnpm run docs:build

      - name: upload file
        uses: kostyaten/ssh-server-deploy@v4
        with:
          host: ${{ secrets.HOST }}
          username: ${{ secrets.USERNAME }}
          password: ${{ secrets.PASSWORD }}
          port: 22
          scp_source: "books/.vitepress/dist/*"
          scp_target: ${{ secrets.TARGET }}
```

注意 scp 上传时会有权限问题，需要在服务器上配置一下

```bash
ls -ld secrets.TARGET

drwxr-xr-x 2 
root root   

# 如果用户不是root 需要将当前用户添加到文件夹所属组，此外还需给当前用户添加目录写权限

sudo chown root:ubuntu .
sudo usermod -aG ubuntu ubuntu
sudo chmod -R 775 index/
# 最后检查下文件夹权限
ls -ld secrets.TARGET
drwxrwxr-x 5 root ubuntu 4096 Sep 25 17:58 index/
```
