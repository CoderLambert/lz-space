# vitePress 搭建项目

1. 初始化项目

```bash
npm i -D vitepress
mkdir docs
cd docs
npx vitepress init
```

2. 启动项目

```bash
npm run docs:dev
```

3. 打包项目

```bash
npm run docs:build
```

4. 初始化首页配置

```bash
# 初始化导航栏
mkdir topNav 
# 初始化侧边栏
mkdir sideBar
# 初始化主题
mkdir theme
```

- topNav 目录下创建 `index.ts` 文件
  
<<< @/.vitepress/topNav/index.ts

- sideBar 目录下创建 `index.ts` 文件

<<< @/.vitepress/sideBar/index.ts

<<< @/.vitepress/sideBar/note/vitePress.ts
