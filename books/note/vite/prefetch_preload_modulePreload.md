
# prefetch 定义 [mdn]([https://](https://developer.mozilla.org/zh-CN/docs/Glossary/Prefetch))  preload定义 [mdn](https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/rel/preload)

1. 在资讯星球中使用时发现，prefetch 与 modulepreload 加载同一个资源，会重复加载，影响性能。
2. preload 在火狐中也会重复加载，但preload不会重复
3. [modulePreload]([https://](https://cn.vitejs.dev/config/build-options)) 浏览器 esm 模块预加载机制，仅对 js 文件有效

## preload预加载 和 prefetch预提取

二者应用场景：
preload:预加载，比如图片资源、字体元素等需要提前加载，比如 强制将字体请求放到css资源请求之前

```html
<head>
    ...
    <link rel="prefetch" href="static/img/ticket_bg.a5bb7c33.png">
    ...
</head>

```

prefetch预提取： 比如页面缓存，在生命周期或者页面加载完成之后去加载大概率会访问到的资源，比如 loading 图片

```html
<head>
    ...
    <link rel="preload" as="font" href="<%= require('/assets/fonts/AvenirNextLTPro-Demi.otf') %>" crossorigin>
    <link rel="preload" as="font" href="<%= require('/assets/fonts/AvenirNextLTPro-Regular.otf') %>" crossorigin>
    ...
</head>
```

## 参考文档

[瞒不住了！Prefetch 是一个大忽悠]([https://](https://juejin.cn/post/7217750941853171770))
[vite 打包中 <link rel="modulepreload">的深入理解](https://juejin.cn/post/6961609946832044045)
