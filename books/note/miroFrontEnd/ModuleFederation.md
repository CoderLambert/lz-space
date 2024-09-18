# 一文彻底搞懂Webpack v5 Module Federation（模块联邦）

## 前言

本篇开始，一起讨论一下，基于Module Federation的微前端架构的架设方案。内容主要涉及到以下几个方面：  
把单体应用，拆分为多个微应用，不可能一拆了之。微前端解决单体应用痛点的同时，也会带来很多挑战。这些挑战主要体现在各个微前端应用之间，如何共享状态和通信？以及什么是最符合微前端架构的工作流程？无论是项目结构、路由管理、数据状态管理、还是git工作流，都发生了巨大的转变。  
我们的工作，主要围绕，探寻拆分和共享之间存在哪些问题？进而找到解决问题的最佳方案而展开。

本篇文章的内容，将围绕相关概念、主要工具、基础项目结构、远程模块集成展开讨论。

## 导读

- 阐述什么是微前端？有哪些微前端的实现方案？以及微前端有优缺点？

- 讨论微前端项目最佳管理方案monorepos，以及monorepos的优缺点。

- 引入pnpm、turborepo等工具，解决monorepos带来的一些痛点

- 安装配置module federation，集成动态模块

## 一、微前端

先来看一下，什么是微前端？只有理解了什么是微前端，了解微前端的价值所在，才有可能搭建出优秀微前端架构。

## 1、什么是微前端？

微前端是一种多个团队，通过独立发布功能的方式，来共同构建现代化 web 应用的技术手段及方法策略。

- 首先，微前端不是新技术，是构建web应用的策略和方法，也就是前端架构管理的一种模式；

- 其次，微前端鼓励团队拆分，各司其职，各个团队负责的模块可独立开发、构建、测试和部署；

- 另外，微前端是将体量大、复杂难以管理的单体应用，拆分成多个微型前端应用，且这些微应用功能上是相互关联的，最终重新聚合成一个统一应用。

![图片](data:image/svg+xml,%3C%3Fxml version='1.0' encoding='UTF-8'%3F%3E%3Csvg width='1px' height='1px' viewBox='0 0 1 1' version='1.1' xmlns='<http://www.w3.org/2000/svg>' xmlns:xlink='<http://www.w3.org/1999/xlink'%3E%3Ctitle%3E%3C/title%3E%3Cg> stroke='none' stroke-width='1' fill='none' fill-rule='evenodd' fill-opacity='0'%3E%3Cg transform='translate(-249.000000, -126.000000)' fill='%23FFFFFF'%3E%3Crect x='249' y='126' width='1' height='1'%3E%3C/rect%3E%3C/g%3E%3C/g%3E%3C/svg%3E)  
总之，微前端架构，借鉴了微服务的架构理念，将Web应用由单一的单体应用，转变为多个小型前端应用聚合为一的一种手段，一种面向垂直划分系统的前端集成。  
可能大家依然心存疑惑，为什么要拆分应用，再重新聚合？这么做的意义在哪里？换句话说，微前端到底能解决应用开发和管理中那些痛点呢？

## 2、微前端有哪些优点？

微前端的优点有很多，大多数都是针对单体巨石应用的痛点。

### A、构建性能效率提升

单体应用，随着代码量、和文件数量日益增加，项目变得越来沉重。无论开发启动、还是修改刷新，速度都会变得越来越缓慢。如果说，单次启动需要花费10多分钟，还可以忍受，每次修改刷新等待10几秒，是无论如何都无法忍受的事情。  
微前端的思路是，把巨石应用拆分成多个微型应用，每个微应用都有自己独立的构建体系。任务并行执行，最大限度的使用线程，以空间换时间，构建速度的问题自然就解决了。

### B、微应用各个应用独立自治

![图片](data:image/svg+xml,%3C%3Fxml version='1.0' encoding='UTF-8'%3F%3E%3Csvg width='1px' height='1px' viewBox='0 0 1 1' version='1.1' xmlns='<http://www.w3.org/2000/svg>' xmlns:xlink='<http://www.w3.org/1999/xlink'%3E%3Ctitle%3E%3C/title%3E%3Cg> stroke='none' stroke-width='1' fill='none' fill-rule='evenodd' fill-opacity='0'%3E%3Cg transform='translate(-249.000000, -126.000000)' fill='%23FFFFFF'%3E%3Crect x='249' y='126' width='1' height='1'%3E%3C/rect%3E%3C/g%3E%3C/g%3E%3C/svg%3E)  
单体应用是一个整体，即使很小的调整，都要整体打包，无法实现增量打包和部署。长年累月堆积了无数技术债，在这种牵一发而动全身的模式下，变的越来越无法管理。  
而微前端模型下的微应用彼此隔离，每个微应用都具备独立的构建体系、测试体系、部署流程、运行服务。所以具备以下优点：

- 每个微应用是独立完备，且彼此隔离，所以可以突破技术栈限制，选择更加灵活；

- 微应用无需每次都构建部署所有应用，可以增量按需独立构建部署；

- 微应用都有自己的运行服务，彼此之间影响较小；

- 微应用隔离特性，有利于应用重构升级；

- 松散耦合的架构体系，更易于维护和扩展；

## 3、微前端有哪些缺点？

把应用拆分成，十数个、甚至数十个彼此独立的微型应用，可以解决巨石应用构建打包效率低效的问题；但随着应用数量的急速增加，相应的也会带来一些问题：

- 重复构建，部署频次增加，增加了生产发布风险

- 每次启动多个开发服务，会带来内存压力

- 重复命令行执行动作，效率低，易出错

- 应用版本升级管理复杂、繁琐

- 生态工具，缺乏对应的支持，比如router和store

但相对比，巨石应用带来的超低开发效率和管理困难问题，这些问题相对来说更容易解决。微应用方案收益也很明显。

## 4、微前端常用的实现方案

前面我们讨论了，微前端的概念和优缺点。下面我们一起看一下，目前流行的几种微前端架构的实现方案。  
我们的重点是module federation，所以这里对实现方案，不做深入讨论，简单了解一下。

- 乾坤(qiankun)：蚂蚁金融科技孵化项目，方案基于 single-spa，采用路由劫持和沙箱隔离，html entry实现方案

- micro-app 是基于 webcomponent + qiankun sandbox 的微前端方案。不同于乾坤，micro-app采用组件的方式加载子应用。

- 无界（wujie）：微前端方案基于 webcomponent 容器 + iframe 沙箱，能够完善的解决适配成本、样式隔离、运行性能、页面白屏、子应用通信、子应用保活、多应用激活、vite 框架支持、应用共享等用户的核心诉求

- module federation：webpack提供的一种拆分和加载远程模块的机制，可用于实现微前端。

我们方案是module federation，我们将借助module federation实现微前端应用集成。下面我们先了解一下module federation，方便后面为后面集成微应用，理清楚思路。

## 二、什么是Module Federation 模块联邦

简单说，module federation（下面简称MF）是一种拆分和加载远程模块的机制。MF出现之前，webpack模块只有本地模块，只区分同步加载和异步加载的模块。但随着微服务、全栈开发、服务端渲染的发展日渐成熟，远程模块的需求愈加迫切。MF便是为了弥补远程模块这一块缺失而产生的。  
![图片](data:image/svg+xml,%3C%3Fxml version='1.0' encoding='UTF-8'%3F%3E%3Csvg width='1px' height='1px' viewBox='0 0 1 1' version='1.1' xmlns='<http://www.w3.org/2000/svg>' xmlns:xlink='<http://www.w3.org/1999/xlink'%3E%3Ctitle%3E%3C/title%3E%3Cg> stroke='none' stroke-width='1' fill='none' fill-rule='evenodd' fill-opacity='0'%3E%3Cg transform='translate(-249.000000, -126.000000)' fill='%23FFFFFF'%3E%3Crect x='249' y='126' width='1' height='1'%3E%3C/rect%3E%3C/g%3E%3C/g%3E%3C/svg%3E)  
事实上，弥补了远程模块这块缺失，也为实现拆分微型应用提供技术支持。MF把模块区分为本地模块和远程模块。本地模块是当前构建的一部分，而远程模块则不然，远程模块属于异步加载操作，是远程构建的一部分。  
MF把每个构建看做容器，每个容器都可以对外暴露本地模块，也可以加载其他容器暴露的远程模块。因此，容器都具备双重角色，即是消费者，也可以是生产者。生产者称之为Host容器，消费者称之为Remote容器。  
MF解决了拆分和加载远程微模块的问题。但是如何组织管理微模块，却是个复杂的问题。按照什么维度拆分应用？如何提取管理共享模块？如何更有效的组织代码库？如何更有效的减少多应用带来的重复流程？  
简而言之，我们首先如何高效的集中管理拆分出来的多个微应用？这些都是接下来我们将要讨论的monorepo功能范畴。

## 三、Monorepo应用架构模型

## 1、monorepo概念

单体应用架构模型叫做monolithic，所有业务代码放在统一的代码库中，共享一个单独的构建部署流程。  
单体应用，搭建简单，易于管理，易于构建、测试、部署。大多数情况下，单体应用架构模型，就是理想的项目架构模型。  
但是单体应用，容易受到规模效应的影响。容易累积成巨石应用，管理效率会越来越低。而且构建部署在同一个应用里面，业务模块耦合度比较高，容易影响到整体应用。难以重构，容易积累技术债。  
一旦积累成巨石应用，最终势必会面临，重新拆解成多个微型的应用。  
管理多个微型应用，比较流行的架构模型主要有两种：multirepo 和 monorepo  
multirepo架构模型也叫polyrepo，这种架构模型下，每个子应用都有独立的git代码库、独立的构建和应用独立部署。项目之间天然隔离，拥有充分的自由度，项目内部高度自治。易于重构，进而享受新技术红利。  
但是这种高度隔离模式也会带来很多缺陷：

- 重复流程、低效率、易出错、维护成本高；

- 共享成本比较高，提取共享模块困难；

- 不能直观反馈项目之间依赖关系，容易出现生产bug；

另外一种架构模型，所有的子应用，共用一个git代码库，但子应用保留独立的构建和部署，这种应用架构模型就叫做monorepo。  
从架构模型的演变过程角度，monorepo 可以看做前面两种架构模型的变体。  
multirepo 汲取 monolithic 的单一代码库的优点，把所有应用代码集中放置，保留独立构建的同时，兼备了易共享的特性，形成了新的应用架构模型monorepo。  
![图片](data:image/svg+xml,%3C%3Fxml version='1.0' encoding='UTF-8'%3F%3E%3Csvg width='1px' height='1px' viewBox='0 0 1 1' version='1.1' xmlns='<http://www.w3.org/2000/svg>' xmlns:xlink='<http://www.w3.org/1999/xlink'%3E%3Ctitle%3E%3C/title%3E%3Cg> stroke='none' stroke-width='1' fill='none' fill-rule='evenodd' fill-opacity='0'%3E%3Cg transform='translate(-249.000000, -126.000000)' fill='%23FFFFFF'%3E%3Crect x='249' y='126' width='1' height='1'%3E%3C/rect%3E%3C/g%3E%3C/g%3E%3C/svg%3E)

## 2、monorepo优点

monorepo架构模型，保留单体应用的易共享的特性；同时还兼顾了multirepo模式下，应用之间高度隔离的特性。  
monorepo兼备两种模型的优点：

- 共享时间线，迫使团队之间积极交流，每个人都得努力跟上变化

- 容易提取共享模块，版本维护简单

- 容易共享配置，统一代码质量标准和代码风格的一致性

- 微应用之间保持隔离性，可以使用不同的技术栈，易于项目重构

- 独立启动服务、独立构建，容易实现增量发布

从特性上来看，multirepo 适合关联度不太紧密的项目拆分，但高度隔离性，使得提取共享模块困难，重复搭建和配置，调整、构建、测试、部署流程几何倍增加；而 monorepo 更适合关联性比较紧密的项目拆分，保留了单体应用的统一管理优势的同时，解决了单体应用体量过大造成的低效问题。monorepo 更适合微应用架构。

## 3、monorepo缺点

微应用背后的设计思路，其实是空间换时间。多个应用并行执行，占用了更大的内存和更多进程，但提高了编译速度，节省了编译时间，解决了巨石应用造成的开发效率问题。  
但微应用数量急速增加同时，也带来了一些问题：

- 依赖包管理，程数量级增加

- task执行，程数量级增加

- 应用版本管理变得更加复杂

- 代码质量和统一代码风格，变得尤为重要

- 整体应用编译时间较长，需要并行编译和编译缓存

- 对开发人员的整体素质要求更高

为了解决上述问题，我们把微应用，统一放置在同一个workspace下。只有集中放置微应用，才能借助适合的worksapce工具，实现统一管理依赖、task和应用版本的目标。只有解决掉这些痛点，monorepo架构模型的价值，才能真正的体现出来。

## 4、创建monorepo workspace

我们简单的按照集成方式，把monorepo中的模块划分为两种：

- 一种是可以在本地打包集成的模块叫做静态模块，静态模块通过npm模式加载

- 另外一种是runtime运行时，远程加载集成的模块叫做动态模块，动态模块通过http server(module federation)模式加载

![图片](data:image/svg+xml,%3C%3Fxml version='1.0' encoding='UTF-8'%3F%3E%3Csvg width='1px' height='1px' viewBox='0 0 1 1' version='1.1' xmlns='<http://www.w3.org/2000/svg>' xmlns:xlink='<http://www.w3.org/1999/xlink'%3E%3Ctitle%3E%3C/title%3E%3Cg> stroke='none' stroke-width='1' fill='none' fill-rule='evenodd' fill-opacity='0'%3E%3Cg transform='translate(-249.000000, -126.000000)' fill='%23FFFFFF'%3E%3Crect x='249' y='126' width='1' height='1'%3E%3C/rect%3E%3C/g%3E%3C/g%3E%3C/svg%3E)  
创建项目microfe

```
<span></span><code>mkdir&nbsp;microfe&nbsp;&amp;&amp;&nbsp;<span>cd</span>&nbsp;microfe<br></code>
```

创建apps和packages文件夹，apps目录下放置应用（动态远程模块），packages下放置共享模块（）。

```
<span></span><code>mkdir&nbsp;apps&nbsp;packages<br></code>
```

创建微应用目录

```
<span></span><code>mkdir&nbsp;apps/main-app&nbsp;apps/book-app&nbsp;apps/movie-app&nbsp;app/tv-app&nbsp;app/music-app<br>mkdir&nbsp;packages/pc-react-ui&nbsp;packages/pc-vue-ui&nbsp;packages/utils<br></code>
```

- main-app 为主应用，集成加载展示其他应用的入口

- apps/main-app apps/book-app apps/movie-app 是react应用

- app/tv-app app/music-app 是vue应用

- packages/pc-react-ui 是react组件库

- packages/pc-vue-ui 是vue组件库

- packages/utils 是通用js工具库

**创建主应用**，目录结构如下

```
<span></span><code><span>#&nbsp;apps/main-app</span><br>|--src<br>&nbsp;&nbsp;&nbsp;&nbsp;|--index.js<br>&nbsp;&nbsp;&nbsp;&nbsp;|--App.js<br>&nbsp;&nbsp;&nbsp;&nbsp;|--subApps<br></code>
```

其他应用，将通过module federation暴露应用入口  
**创建子应用**，目录结构如下基本相同  
react应用

```
<span></span><code><span>#&nbsp;apps/movie-app&nbsp;app/book-app</span><br>|--src<br>&nbsp;&nbsp;&nbsp;&nbsp;|--index.js<br>&nbsp;&nbsp;&nbsp;&nbsp;|--bootstarp.js<br>&nbsp;&nbsp;&nbsp;&nbsp;|--App.vue<br></code>
```

Vue应用

```
<span></span><code><span>#&nbsp;app/music-app&nbsp;app/tv-app</span><br>|--src<br>&nbsp;&nbsp;&nbsp;&nbsp;|--index.js<br>&nbsp;&nbsp;&nbsp;&nbsp;|--bootstarp.js<br>&nbsp;&nbsp;&nbsp;&nbsp;|--App.vue<br></code>
```

目录结构  
![图片](data:image/svg+xml,%3C%3Fxml version='1.0' encoding='UTF-8'%3F%3E%3Csvg width='1px' height='1px' viewBox='0 0 1 1' version='1.1' xmlns='<http://www.w3.org/2000/svg>' xmlns:xlink='<http://www.w3.org/1999/xlink'%3E%3Ctitle%3E%3C/title%3E%3Cg> stroke='none' stroke-width='1' fill='none' fill-rule='evenodd' fill-opacity='0'%3E%3Cg transform='translate(-249.000000, -126.000000)' fill='%23FFFFFF'%3E%3Crect x='249' y='126' width='1' height='1'%3E%3C/rect%3E%3C/g%3E%3C/g%3E%3C/svg%3E)  
在实现应用代码之前，我们还需要解决一个棘手的问题。那就是批量安装和卸载依赖，以及批量执行task的问题。  
管理十几个甚至数十个微应用、微模块。手动安装和卸载或者升级依赖，几乎是一个不可能完成的任务。我们需要支持workspace的包管理器，来解决这个问题。

## 四、选择合适的包管理工具

目前流行的前端包管理工具npm、yarn、pnpm都支持workspace。综合对比后，我们选择pnpm，作为包管理工具。  
那么pnpm相对npm和yarn有哪些优势呢？

## 1、为什么选择pnpm?

- **安装速度提升**，pnpm安装速度至少是npm、yarn的2倍；

- **大幅度节省磁盘空间**，pnpm包安装在一个地方，并通过链接的方式实现共享，不会在每个依赖的地方重复安装，这相对npm和yarn每个应用都要安装组件的依赖，安装大幅度节省了磁盘空间；

- **解决了幽灵依赖问题**，npm和yarn依赖包扁平化，造成了一个问题，未在package.json里显性声明的，依赖包B，由于被A依赖，扁平化依赖结构时，B被提升到了node\_modules的根目录下。因此可以在项目中import或者require到B。但是一旦A被移除或者升级，就会造成B可能被移除，这时候就会报错。pnpm的依赖结构是嵌套式的，不存在这个问题；

- **支持monorepos**，pnpm内置更加完善的monorepo支持；

## 2、安装和使用pnpm

### A、pnpm是什么？

pnpm全称是 “Performant NPM”，即高性能的 npm。它结合软硬链接与新的依赖组织方式，大大提升了包管理的效率，也同时解决了 “幻影依赖” 的问题，让包管理更加规范，减少潜在风险发生的可能性。

### B、安装pnpm

```
<span></span><code>npm&nbsp;install&nbsp;-g&nbsp;pnpm<br></code>
```

或者

```
<span></span><code>npm&nbsp;install&nbsp;-g&nbsp;@pnpm/exe<br></code>
```

如果安装了包管理器HomeBrew，则可以使用以下命令安装 pnpm：

```
<span></span><code>brew&nbsp;install&nbsp;pnpm<br></code>
```

### C、配置pnpm workspace

根目录下创建pnpm-workspace.yaml文件

```
<span></span><code>touch&nbsp;pnpm-workspace.yaml<br></code>
```

输入配置

```
<span></span><code>packages:<br>&nbsp;&nbsp;<span>#&nbsp;放置共用模块与应用</span><br>&nbsp;&nbsp;-&nbsp;<span>'packages/*'</span><br>&nbsp;&nbsp;<span>#&nbsp;放置微应用</span><br>&nbsp;&nbsp;-&nbsp;<span>'apps/*'</span><br><br>&nbsp;&nbsp;<span>#&nbsp;忽略目录</span><br>&nbsp;&nbsp;-&nbsp;<span>'!**/test/**'</span><br>&nbsp;&nbsp;-&nbsp;<span>'!**/__test__/**'</span><br></code>
```

切换到根目录，初始化package.json

```
<span></span><code>pnpm&nbsp;init<br></code>
```

调整配置如下，private是为了防止误发布

```
<span></span><code>{<br>&nbsp;&nbsp;<span>"name"</span>:&nbsp;<span>"microfe"</span>,<br>&nbsp;&nbsp;<span>"version"</span>:&nbsp;<span>"1.0.0"</span>,<br>&nbsp;&nbsp;<span>"private"</span>:&nbsp;<span>true</span>,<br>&nbsp;&nbsp;<span>"description"</span>:&nbsp;<span>"micro&nbsp;front&nbsp;end&nbsp;apps"</span>,<br>&nbsp;&nbsp;<span>"main"</span>:&nbsp;<span>"index.js"</span>,<br>&nbsp;&nbsp;<span>"scripts"</span>:&nbsp;{<br>&nbsp;&nbsp;&nbsp;&nbsp;<span>"test"</span>:&nbsp;<span>"echo&nbsp;\"Error:&nbsp;no&nbsp;test&nbsp;specified\"&nbsp;&amp;&amp;&nbsp;exit&nbsp;1"</span><br>&nbsp;&nbsp;},<br>&nbsp;&nbsp;<span>"keywords"</span>:&nbsp;[<br>&nbsp;&nbsp;&nbsp;&nbsp;<span>"micro&nbsp;front&nbsp;end"</span>,<br>&nbsp;&nbsp;&nbsp;&nbsp;<span>"monorepo"</span><br>&nbsp;&nbsp;],<br>&nbsp;&nbsp;<span>"author"</span>:&nbsp;<span>"yangguangzaifei"</span>,<br>&nbsp;&nbsp;<span>"license"</span>:&nbsp;<span>"MIT"</span><br>}<br></code>
```

**初始化子应用**，分别在上述创建的目录中执行命令，创建package.json

```
<span></span><code><span>cd</span>&nbsp;apps/main-app<br>pnpm&nbsp;init<br></code>
```

并调整name为@microfe/main-app，其他调整如下：

```
<span></span><code>{<br>&nbsp;&nbsp;<span>"name"</span>:&nbsp;<span>"@microfe/main-app"</span>,<br>&nbsp;&nbsp;<span>"version"</span>:&nbsp;<span>"0.0.0"</span>,<br>&nbsp;&nbsp;<span>"private"</span>:&nbsp;<span>true</span>,<br>&nbsp;&nbsp;<span>"sideEffects"</span>:&nbsp;<span>false</span>,<br>&nbsp;&nbsp;<span>"description"</span>:&nbsp;<span>"book&nbsp;app"</span>,<br>&nbsp;&nbsp;<span>"main"</span>:&nbsp;<span>"index.js"</span>,<br>&nbsp;&nbsp;<span>"scripts"</span>:&nbsp;{<br>&nbsp;&nbsp;&nbsp;&nbsp;<span>"test"</span>:&nbsp;<span>"echo&nbsp;\"Error:&nbsp;no&nbsp;test&nbsp;specified\"&nbsp;&amp;&amp;&nbsp;exit&nbsp;1"</span><br>&nbsp;&nbsp;},<br>&nbsp;&nbsp;<span>"keywords"</span>:&nbsp;[],<br>&nbsp;&nbsp;<span>"author"</span>:&nbsp;<span>"yangguangzaifei"</span>,<br>&nbsp;&nbsp;<span>"license"</span>:&nbsp;<span>"ISC"</span><br>}<br></code>
```

其他目录 apps/book-app、apps/music-app、apps/book-app、apps/tv-app、packages/p-react-ui、packages/pc-vue-uipackages/utils 重复上述动作  
这里我们把应用名称，统一设置为类似 @microfe/\* 格式，方便后面批量执行命令。

### D、锁定pnpm

为了统一，我们锁定 pnpm 为唯一包管理工具  
安装only-allow，并package.json添加 preinstall hook

```
<span></span><code>pnpm&nbsp;add&nbsp;only-allow&nbsp;-wD<br></code>
```

```
<span></span><code>{<br>&nbsp;&nbsp;&nbsp;&nbsp;scripts:{<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span>"preinstall"</span>:&nbsp;<span>"npx&nbsp;only-allow&nbsp;pnpm"</span>,<br>&nbsp;&nbsp;&nbsp;&nbsp;}<br>}<br></code>
```

如果尝试使用yarn安装依赖，将提示下述内容：

```
<span></span><code>yarn&nbsp;add&nbsp;lodash<br></code>
```

```
<span></span><code>Use&nbsp;<span>"pnpm&nbsp;install"</span>&nbsp;<span>for</span>&nbsp;installation&nbsp;<span>in</span>&nbsp;this&nbsp;project.&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<br>If&nbsp;you&nbsp;don<span>'t&nbsp;have&nbsp;pnpm,&nbsp;install&nbsp;it&nbsp;via&nbsp;"npm&nbsp;i&nbsp;-g&nbsp;pnpm".&nbsp;<br>For&nbsp;more&nbsp;details,&nbsp;go&nbsp;to&nbsp;https://pnpm.js.org/<br></span></code>
```

### E、使用pnpm

由于我们定义了 pnpm 的workspace，安装时，需要遵循workspace规范。必须明确指明，安装依赖的位置目录，否则会出现异常警告：

```
<span></span><code>ERR_PNPM_ADDING_TO_ROOT&nbsp;&nbsp;Running&nbsp;this&nbsp;<span>command</span>&nbsp;will&nbsp;add&nbsp;the&nbsp;dependency&nbsp;to&nbsp;the&nbsp;<br>workspace&nbsp;root,&nbsp;<span>which</span>&nbsp;might&nbsp;not&nbsp;be&nbsp;what&nbsp;you&nbsp;want&nbsp;-&nbsp;<span>if</span>&nbsp;you&nbsp;really&nbsp;meant&nbsp;it,&nbsp;<br>make&nbsp;it&nbsp;explicit&nbsp;by&nbsp;running&nbsp;this&nbsp;<span>command</span>&nbsp;again&nbsp;with&nbsp;the&nbsp;-w&nbsp;flag&nbsp;(or&nbsp;--workspace-root).&nbsp;<br>If&nbsp;you&nbsp;don<span>'t&nbsp;want&nbsp;to&nbsp;see&nbsp;this&nbsp;warning&nbsp;anymore,&nbsp;you&nbsp;may&nbsp;set&nbsp;the&nbsp;ignore-workspace-root-check&nbsp;setting&nbsp;to&nbsp;true.<br></span></code>
```

这意味着，安装、卸载、升级依赖，必须带有workspace相关参数。pnpm 有关workspace的命令参数最主要是以下几个：

```
<span></span><code>--recursive(-r):&nbsp;所有应用目录执行，不包括根目录<br>--workspace-root(-w):&nbsp;根目录执行<br>--filter(-F):&nbsp;匹配目录执行<br></code>
```

根目录下管理依赖

```
<span></span><code>pnpm&nbsp;add&nbsp;xxx&nbsp;-w<br>pnpm&nbsp;update&nbsp;xxx&nbsp;-w<br>pnpm&nbsp;remove&nbsp;xxx&nbsp;-w<br></code>
```

workspace中定义的子应用下管理依赖

```
<span></span><code>pnpm&nbsp;add&nbsp;xxx&nbsp;-r<br>pnpm&nbsp;update&nbsp;xxx&nbsp;-r<br>pnpm&nbsp;remove&nbsp;xxx&nbsp;-r<br></code>
```

仅仅apps目录下面的应用管理依赖

```
<span></span><code>pnpm&nbsp;add&nbsp;xxx&nbsp;-F&nbsp;./apps<br>pnpm&nbsp;update&nbsp;xxx&nbsp;-F&nbsp;./apps<br>pnpm&nbsp;remove&nbsp;xxx&nbsp;-F&nbsp;./apps<br></code>
```

也支持glob模糊匹配应用名称

```
<span></span><code>pnpm&nbsp;add&nbsp;xxx&nbsp;-F&nbsp;@microfe/*<br>pnpm&nbsp;update&nbsp;xxx&nbsp;-F&nbsp;@microfe/*<br>pnpm&nbsp;remove&nbsp;xxx&nbsp;-F&nbsp;@microfe/*<br></code>
```

需要注意的是，上述的参数不仅仅支持依赖管理，同样支持pnpm的其他命令。比如run，可以批量执行workspace下匹配的应用下相同的命令

```
<span></span><code>pnpm&nbsp;run&nbsp;dev&nbsp;-r<br>pnpm&nbsp;-F&nbsp;@microfe/*&nbsp;rum&nbsp;lint<br></code>
```

这样我们就可以很方便的管理多个应用的安装、启动、打包、测试等等。否则手动管理，如此繁琐的命令操作，会大大降低工作效率。

## 五、集成远程模块（module federation）

安装配置完pnpm，我们就可以尝试集成module federation，把momorepo中的模块整合起来，跑一下整体应用了。

## 1、安装依赖

首先安装webpack及其相关插件，由于属于公用依赖，我们安装在根目录

```
<span></span><code>pnpm&nbsp;add&nbsp;webpack&nbsp;webpack-cli&nbsp;&nbsp;-wD<br><br>pnpm&nbsp;add&nbsp;webpack-manifest-plugin&nbsp;webpack-dev-server&nbsp;webpack-merge&nbsp;html-webpack-plugin&nbsp;-wD<br><br>pnpm&nbsp;add&nbsp;css-loader&nbsp;babel-loader&nbsp;style-loader&nbsp;sass-loader&nbsp;-wD<br></code>
```

安装babel相关配置，同样安装在根目录

```
<span></span><code>pnpm&nbsp;add&nbsp;@babel/core&nbsp;@babel/preset-env&nbsp;@babel/preset-react&nbsp;@babel/plugin-transform-runtime&nbsp;-wD<br></code>
```

安装react

```
<span></span><code>pnpm&nbsp;-F=<span>'./apps/{main,movie,book}-app'</span>&nbsp;-F=<span>'./packages/{pc-react-ui,utils}'</span>&nbsp;add&nbsp;react&nbsp;react-dom&nbsp;-D<br></code>
```

安装vue

```
<span></span><code>pnpm&nbsp;-F=<span>'./apps/{tv,music}-app'</span>&nbsp;-F=<span>'./packages/{utils,pc-vue-ui}'</span>&nbsp;add&nbsp;vue<br><br>pnpm&nbsp;-F=<span>'./apps/{tv,music}-app'</span>&nbsp;-F=<span>'./packages/{utils,pc-vue-ui}'</span>&nbsp;add&nbsp;@vue/compiler-sfc&nbsp;-D<br></code>
```

## 2、使用 module federation集成远程模块

以 book-app子应用为例：

### A、完善子应用

App应用入口，声明跟普通应用一致。  
App.js

```
<span></span><code>import&nbsp;React&nbsp;from&nbsp;<span>'react'</span><br><br><span>function</span>&nbsp;<span><span>BookApp</span></span>()&nbsp;{<br>&nbsp;&nbsp;<span>return</span>&nbsp;(<br>&nbsp;&nbsp;&nbsp;&nbsp;&lt;div&gt;<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&lt;h1&gt;Welcome&nbsp;to&nbsp;book&nbsp;app&lt;/h1&gt;<br>&nbsp;&nbsp;&nbsp;&nbsp;&lt;/div&gt;<br>&nbsp;&nbsp;)<br>}<br><br><span>export</span>&nbsp;default&nbsp;BookApp<br></code>
```

App.vue

```
<span></span><code>&lt;template&gt;<br>&nbsp;&nbsp;&lt;div&gt;<br>&nbsp;&nbsp;&nbsp;&nbsp;&lt;h1&gt;{{&nbsp;message&nbsp;}}&lt;/h1&gt;<br>&nbsp;&nbsp;&lt;/div&gt;<br>&lt;/template&gt;<br><br>&lt;script&nbsp;<span>type</span>=<span>"module"</span>&gt;<br>import&nbsp;{&nbsp;ref,&nbsp;defineComponent&nbsp;}&nbsp;from&nbsp;<span>'vue'</span><br><br><span>export</span>&nbsp;default&nbsp;defineComponent({<br>&nbsp;&nbsp;<span><span>setup</span></span>()&nbsp;{<br>&nbsp;&nbsp;&nbsp;&nbsp;const&nbsp;message&nbsp;=&nbsp;ref(<span>'Welcome&nbsp;to&nbsp;music&nbsp;app'</span>)<br>&nbsp;&nbsp;&nbsp;&nbsp;<span>return</span>&nbsp;{<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;message<br>&nbsp;&nbsp;&nbsp;&nbsp;}<br>&nbsp;&nbsp;}<br>})<br>&lt;/script&gt;<br></code>
```

bootstrap是应用挂载动作，不同的是挂载的目标dom，是作为参数动态传入的，由使用场景决定。bootstrap会暴露给远程应用，用于挂载启动App应用。  
react bootstrap.js

```
<span></span><code>import&nbsp;React&nbsp;from&nbsp;<span>'react'</span><br>import&nbsp;{&nbsp;createRoot&nbsp;}&nbsp;from&nbsp;<span>'react-dom/client'</span><br>import&nbsp;BookApp&nbsp;from&nbsp;<span>'./App'</span><br><br><span>export</span>&nbsp;const&nbsp;mount&nbsp;=&nbsp;({&nbsp;rootDom&nbsp;})&nbsp;=&gt;&nbsp;{<br>&nbsp;&nbsp;const&nbsp;root&nbsp;=&nbsp;createRoot(rootDom)<br>&nbsp;&nbsp;root.render(&lt;BookApp&nbsp;/&gt;)<br>&nbsp;&nbsp;<span>return</span>&nbsp;()&nbsp;=&gt;&nbsp;queueMicrotask(()&nbsp;=&gt;&nbsp;root.unmount())<br>}<br></code>
```

vue bootstrap.js

```
<span></span><code>import&nbsp;{&nbsp;createApp&nbsp;}&nbsp;from&nbsp;<span>'vue'</span><br>import&nbsp;MusicApp&nbsp;from&nbsp;<span>'./App.vue'</span><br><br><span>export</span>&nbsp;const&nbsp;mount&nbsp;=&nbsp;({&nbsp;rootDom&nbsp;})&nbsp;=&gt;&nbsp;{<br>&nbsp;&nbsp;const&nbsp;root&nbsp;=&nbsp;createApp(MusicApp)<br>&nbsp;&nbsp;root.mount(rootDom)<br>&nbsp;&nbsp;<span>return</span>&nbsp;()&nbsp;=&gt;&nbsp;queueMicrotask(()&nbsp;=&gt;&nbsp;root.unmount())<br>}<br><br><span>export</span>&nbsp;default&nbsp;mount<br></code>
```

### B、对外暴露远程模块

book-app目录下创建build目录，并创建webpack.config.js文件  
启动4002本地服务，并通过ModuleFederationPlugin插件，对外暴露本地模块microfe\_book\_app的bootstrap

```
<span></span><code>{<br>&nbsp;&nbsp;&nbsp;&nbsp;//....<br>&nbsp;&nbsp;output:&nbsp;{<br>&nbsp;&nbsp;&nbsp;&nbsp;publicPath:&nbsp;<span>'http://localhost:4002/'</span><br>&nbsp;&nbsp;},<br>&nbsp;&nbsp;devServer:&nbsp;{<br>&nbsp;&nbsp;&nbsp;&nbsp;port:&nbsp;4002<br>&nbsp;&nbsp;},<br>&nbsp;&nbsp;plugins:&nbsp;[<br>&nbsp;&nbsp;&nbsp;&nbsp;new&nbsp;ModuleFederationPlugin({<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;name:&nbsp;<span>'microfe_book_app'</span>,<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;filename:&nbsp;<span>'remoteEntry.js'</span>,<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;exposes:&nbsp;{<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span>'./bootstrap'</span>:&nbsp;<span>'./src/bootstrap'</span><br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;}<br>&nbsp;&nbsp;&nbsp;&nbsp;})<br>&nbsp;&nbsp;]<br>&nbsp;&nbsp;//...<br>}<br></code>
```

### C、加载远程模块

main-app中同样创建build/webpack.config.js  
启动4001本地服务，并通过ModuleFederationPlugin插件，microfe\_book\_app为bookApp

```
<span></span><code>{<br>//....<br>entry:&nbsp;<span>'./src/index.js'</span>,<br>&nbsp;&nbsp;output:&nbsp;{<br>&nbsp;&nbsp;&nbsp;&nbsp;publicPath:&nbsp;<span>'http://localhost:4001/'</span><br>&nbsp;&nbsp;},<br>&nbsp;&nbsp;devServer:&nbsp;{<br>&nbsp;&nbsp;&nbsp;&nbsp;open:&nbsp;<span>true</span>,<br>&nbsp;&nbsp;&nbsp;&nbsp;port:&nbsp;4001<br>&nbsp;&nbsp;},<br>&nbsp;&nbsp;plugins:&nbsp;[<br>&nbsp;&nbsp;&nbsp;&nbsp;new&nbsp;ModuleFederationPlugin({<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;name:&nbsp;<span>'microfe_main_app'</span>,<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;remotes:&nbsp;{<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;bookApp:&nbsp;<span>'microfe_book_app@http://localhost:4002/remoteEntry.js'</span>,<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;}<br>&nbsp;&nbsp;&nbsp;&nbsp;})<br>&nbsp;&nbsp;]<br>&nbsp;&nbsp;//...<br>}<br></code>
```

### D、使用远程模块

在main-app/src/subApps/bookApp.js文件中，通过bookApp/bootstrap，访问到microfe\_book\_app暴露的bootstrap。  
然后，通过ref挂载到main-app

```
<span></span><code>import&nbsp;React,&nbsp;{&nbsp;useRef,&nbsp;useEffect&nbsp;}&nbsp;from&nbsp;<span>'react'</span><br>import&nbsp;{&nbsp;mount&nbsp;}&nbsp;from&nbsp;<span>'bookApp/bootstrap'</span><br><br><span>export</span>&nbsp;default&nbsp;()&nbsp;=&gt;&nbsp;{<br>&nbsp;&nbsp;const&nbsp;wrapperRef&nbsp;=&nbsp;useRef(null)<br>&nbsp;&nbsp;const&nbsp;isFirstRunRef&nbsp;=&nbsp;useRef(<span>true</span>)<br>&nbsp;&nbsp;const&nbsp;isFirstRef&nbsp;=&nbsp;useRef(<span>true</span>)<br>&nbsp;&nbsp;const&nbsp;unmountRef&nbsp;=&nbsp;useRef(()&nbsp;=&gt;&nbsp;{})<br><br>&nbsp;&nbsp;//&nbsp;Mount&nbsp;book&nbsp;MFE<br>&nbsp;&nbsp;useEffect(()&nbsp;=&gt;&nbsp;{<br>&nbsp;&nbsp;&nbsp;&nbsp;<span>if</span>&nbsp;(isFirstRunRef.current)&nbsp;{<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;isFirstRunRef.current&nbsp;=&nbsp;<span>false</span><br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;unmountRef.current&nbsp;=&nbsp;mount({<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;rootDom:&nbsp;wrapperRef.current<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;})<br>&nbsp;&nbsp;&nbsp;&nbsp;}<br>&nbsp;&nbsp;},&nbsp;[])<br><br>&nbsp;&nbsp;useEffect(()&nbsp;=&gt;&nbsp;{<br>&nbsp;&nbsp;&nbsp;&nbsp;<span>if</span>&nbsp;(isFirstRef.current)&nbsp;{<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;isFirstRef.current&nbsp;=&nbsp;<span>false</span><br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span>return</span>&nbsp;unmountRef.current<br>&nbsp;&nbsp;&nbsp;&nbsp;}<br>&nbsp;&nbsp;},&nbsp;[])<br><br>&nbsp;&nbsp;<span>return</span>&nbsp;&lt;div&nbsp;ref={wrapperRef}&nbsp;id=<span>"book-sub-app"</span>&nbsp;/&gt;<br>}<br></code>
```

其他子应用，暴露加载模块过程，基本跟上述一致，这里就不一一展示了

### E、定义scripts任务

根目录，package.json中配置scripts task  
\--parallel忽略并发性和拓扑排序，dev server 默认启动 watch 命令，是会长时间运行监听文件变更，进程不会自动退出（除了报错或者手动退出），因此需要加上 **\--parallel 告诉 pnpm 运行该脚本时完全忽略并发和拓扑排序**。  
另外，可能会出现启动服务数量将受cpu限制。

```
<span></span><code>&nbsp;&nbsp;<span>"scripts"</span>:&nbsp;{<br>&nbsp;&nbsp;&nbsp;&nbsp;//&nbsp;....<br>&nbsp;&nbsp;&nbsp;&nbsp;<span>"dev"</span>:&nbsp;<span>"pnpm&nbsp;--parallel&nbsp;-r&nbsp;run&nbsp;dev"</span>,<br>&nbsp;&nbsp;&nbsp;&nbsp;<span>"build"</span>:&nbsp;<span>"pnpm&nbsp;--parallel&nbsp;-r&nbsp;run&nbsp;build"</span><br>&nbsp;&nbsp;}<br></code>
```

apps子应用，package.json中配置scripts task

```
<span></span><code><span>"scripts"</span>:&nbsp;{<br>&nbsp;&nbsp;&nbsp;&nbsp;<span>"dev"</span>:&nbsp;<span>"npx&nbsp;webpack&nbsp;serve&nbsp;--mode&nbsp;development&nbsp;--config&nbsp;./build/webpack.config.js"</span>,<br>&nbsp;&nbsp;&nbsp;&nbsp;<span>"build"</span>:&nbsp;<span>"npx&nbsp;webpack&nbsp;--mode&nbsp;production&nbsp;--config&nbsp;./build/webpack.config.js"</span><br>}<br></code>
```

执行下面命令，启动开发服务

```
<span></span><code>pnpm&nbsp;dev<br></code>
```

打开本地服务：<http://localhost:4001>  
![图片](data:image/svg+xml,%3C%3Fxml version='1.0' encoding='UTF-8'%3F%3E%3Csvg width='1px' height='1px' viewBox='0 0 1 1' version='1.1' xmlns='<http://www.w3.org/2000/svg>' xmlns:xlink='<http://www.w3.org/1999/xlink'%3E%3Ctitle%3E%3C/title%3E%3Cg> stroke='none' stroke-width='1' fill='none' fill-rule='evenodd' fill-opacity='0'%3E%3Cg transform='translate(-249.000000, -126.000000)' fill='%23FFFFFF'%3E%3Crect x='249' y='126' width='1' height='1'%3E%3C/rect%3E%3C/g%3E%3C/g%3E%3C/svg%3E)![图片](data:image/svg+xml,%3C%3Fxml version='1.0' encoding='UTF-8'%3F%3E%3Csvg width='1px' height='1px' viewBox='0 0 1 1' version='1.1' xmlns='<http://www.w3.org/2000/svg>' xmlns:xlink='<http://www.w3.org/1999/xlink'%3E%3Ctitle%3E%3C/title%3E%3Cg> stroke='none' stroke-width='1' fill='none' fill-rule='evenodd' fill-opacity='0'%3E%3Cg transform='translate(-249.000000, -126.000000)' fill='%23FFFFFF'%3E%3Crect x='249' y='126' width='1' height='1'%3E%3C/rect%3E%3C/g%3E%3C/g%3E%3C/svg%3E)  
![图片](data:image/svg+xml,%3C%3Fxml version='1.0' encoding='UTF-8'%3F%3E%3Csvg width='1px' height='1px' viewBox='0 0 1 1' version='1.1' xmlns='<http://www.w3.org/2000/svg>' xmlns:xlink='<http://www.w3.org/1999/xlink'%3E%3Ctitle%3E%3C/title%3E%3Cg> stroke='none' stroke-width='1' fill='none' fill-rule='evenodd' fill-opacity='0'%3E%3Cg transform='translate(-249.000000, -126.000000)' fill='%23FFFFFF'%3E%3Crect x='249' y='126' width='1' height='1'%3E%3C/rect%3E%3C/g%3E%3C/g%3E%3C/svg%3E)

## 六、选择更合适的任务管理器

虽然，pnpm支持批量任务管理，解决了手动执行任务的低效问题。但是同时启动多个开发服务和文件实时监听编译，带来内存和线程管理压力问题，需要借助合适的monorepo工具，才能解决。  
目前最流行的Monorepo工具是Lerna、Turborepo和Rush，其中lerna重新更新版本后，需要配合Nx使用。

## 1、对比选择

- **性能**：turborepo和Rush相当，Lerna+Nx是最好的，大概相当于前面两者的5倍；

- **功能**：Rush功能最完备齐全，其次是Lerna+Nx，但是turborepo发展趋势最迅速，赶超前面两个是迟早的事情

- **设置**：turborepo设置最简单，其次是Lerna+Nx，Rush最复杂

- **缓存**：Rush缓存功能处于实验性阶段，Lerna+Nx远程云缓存收费，turborepo远程云缓存免费，且支持开源搭建自己的远程缓存

- **学习成本**：Rush和Lerna+Nx学习曲线相对陡峭，turborepo上手比较简单

虽然turborepo不是性能最好，也不是功能最完备的monorepo工具。但是turborepo 通过「智能缓存」与「任务调度」，极大的提升了构建速度，节省了计算资源。并且 turbo 配置非常简单，侵入性小，可以渐进式的采用。可以很容易和已有的项目整合。  
另外，turborepo已经被Vercel收购，而且从1.7版本开始，从go向rust迁移，其发展潜力是巨大的。功能会逐渐完备，性能也会进一步提升，再加上其无与伦比的生态优势。turborepo迟早会成为monorepo领域，最优异的选择。

## 2、turborepo优点

**工欲善其事必先利其器**。下面一起看一下，turborepo都有哪些优点。在此基础上，我们可以更加清晰直观的理解turborepo的设计思路，进而理清楚我们集成和使用turborepo的思路。

## 3、安装turborepo

全局安装

```
<span></span><code>{<br>&nbsp;&nbsp;<span>"<span>$schema</span>"</span>:&nbsp;<span>"https://turbo.build/schema.json"</span>,<br>&nbsp;&nbsp;&nbsp;<span>"pipeline"</span>:&nbsp;{<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span>"topo"</span>:&nbsp;{<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span>"dependsOn"</span>:&nbsp;[<span>"^topo"</span>]<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;},<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span>"your-task"</span>:&nbsp;{<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span>"dependsOn"</span>:&nbsp;[<span>"topo"</span>]<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;}<br>&nbsp;&nbsp;&nbsp;}<br>&nbsp;}<br></code>
```

```
<span></span><code>pnpm&nbsp;install&nbsp;turbo&nbsp;--global<br></code>
```

本地根目录安装

```
<span></span><code>pnpm&nbsp;add&nbsp;turbo&nbsp;-wD<br></code>
```

## 4、配置turborepo

根目录下创建turbo.json，输入以下内容，pipeline..outputs中指定缓存目录。不同于pnpm，task依赖关系是在dependsOn中显式指定的，如果dependsOn为空，表明任何时候都可以执行。turbo依照依赖关系，最大限度的利用cpu，调度执行task。

```
<span></span><code>{<br>&nbsp;&nbsp;<span>"<span>$schema</span>"</span>:&nbsp;<span>"https://turbo.build/schema.json"</span>,<br>&nbsp;&nbsp;<span>"pipeline"</span>:&nbsp;{<br>&nbsp;&nbsp;&nbsp;&nbsp;<span>"build"</span>:&nbsp;{<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span>"dependsOn"</span>:&nbsp;[<span>"^build"</span>],<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span>"outputs"</span>:&nbsp;[<span>"dist/**"</span>]<br>&nbsp;&nbsp;&nbsp;&nbsp;},<br>&nbsp;&nbsp;&nbsp;&nbsp;<span>"deploy"</span>:&nbsp;{<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span>"dependsOn"</span>:&nbsp;[<span>"build"</span>,&nbsp;<span>"test"</span>,&nbsp;<span>"lint"</span>]<br>&nbsp;&nbsp;&nbsp;&nbsp;},<br>&nbsp;&nbsp;&nbsp;&nbsp;<span>"test"</span>:&nbsp;{<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span>"dependsOn"</span>:&nbsp;[<span>"build"</span>],<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span>"inputs"</span>:&nbsp;[<span>"src/**/*.jsx"</span>,&nbsp;<span>"src/**/*.js"</span>,&nbsp;<span>"test/**/*.js"</span>,&nbsp;<span>"test/**/*.jsx"</span>]<br>&nbsp;&nbsp;&nbsp;&nbsp;},<br>&nbsp;&nbsp;&nbsp;&nbsp;<span>"lint"</span>:&nbsp;{},<br>&nbsp;&nbsp;&nbsp;&nbsp;<span>"dev"</span>:&nbsp;{<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span>"cache"</span>:&nbsp;<span>false</span>,<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span>"persistent"</span>:&nbsp;<span>true</span><br>&nbsp;&nbsp;&nbsp;&nbsp;}<br>&nbsp;&nbsp;}<br>}<br></code>
```

## 5、调整scripts命令

调整根目录package.json中scripts命令

```
<span></span><code>{<br>&nbsp;&nbsp;&nbsp;&nbsp;<span>"dev"</span>:&nbsp;<span>"npx&nbsp;turbo&nbsp;run&nbsp;dev"</span>,<br>&nbsp;&nbsp;&nbsp;&nbsp;<span>"build"</span>:&nbsp;<span>"npx&nbsp;turbo&nbsp;run&nbsp;build"</span><br>}<br></code>
```

启动开发服务

```
<span></span><code>pnpm&nbsp;dev<br></code>
```

打开本地服务：<http://localhost:4001>  
![图片](data:image/svg+xml,%3C%3Fxml version='1.0' encoding='UTF-8'%3F%3E%3Csvg width='1px' height='1px' viewBox='0 0 1 1' version='1.1' xmlns='<http://www.w3.org/2000/svg>' xmlns:xlink='<http://www.w3.org/1999/xlink'%3E%3Ctitle%3E%3C/title%3E%3Cg> stroke='none' stroke-width='1' fill='none' fill-rule='evenodd' fill-opacity='0'%3E%3Cg transform='translate(-249.000000, -126.000000)' fill='%23FFFFFF'%3E%3Crect x='249' y='126' width='1' height='1'%3E%3C/rect%3E%3C/g%3E%3C/g%3E%3C/svg%3E)![图片](data:image/svg+xml,%3C%3Fxml version='1.0' encoding='UTF-8'%3F%3E%3Csvg width='1px' height='1px' viewBox='0 0 1 1' version='1.1' xmlns='<http://www.w3.org/2000/svg>' xmlns:xlink='<http://www.w3.org/1999/xlink'%3E%3Ctitle%3E%3C/title%3E%3Cg> stroke='none' stroke-width='1' fill='none' fill-rule='evenodd' fill-opacity='0'%3E%3Cg transform='translate(-249.000000, -126.000000)' fill='%23FFFFFF'%3E%3Crect x='249' y='126' width='1' height='1'%3E%3C/rect%3E%3C/g%3E%3C/g%3E%3C/svg%3E)  
![图片](data:image/svg+xml,%3C%3Fxml version='1.0' encoding='UTF-8'%3F%3E%3Csvg width='1px' height='1px' viewBox='0 0 1 1' version='1.1' xmlns='<http://www.w3.org/2000/svg>' xmlns:xlink='<http://www.w3.org/1999/xlink'%3E%3Ctitle%3E%3C/title%3E%3Cg> stroke='none' stroke-width='1' fill='none' fill-rule='evenodd' fill-opacity='0'%3E%3Cg transform='translate(-249.000000, -126.000000)' fill='%23FFFFFF'%3E%3Crect x='249' y='126' width='1' height='1'%3E%3C/rect%3E%3C/g%3E%3C/g%3E%3C/svg%3E)  
初次编译

```
<span></span><code>@microfe/music-app:dev:&nbsp;webpack&nbsp;5.88.1&nbsp;compiled&nbsp;successfully&nbsp;<span>in</span>&nbsp;10567&nbsp;ms<br></code>
```

二次编译

```
<span></span><code>@microfe/music-app:dev:&nbsp;webpack&nbsp;5.88.1&nbsp;compiled&nbsp;successfully&nbsp;<span>in</span>&nbsp;520&nbsp;ms<br></code>
```

## 七、总结

上面我们一起阐述了微前端的概念和优势；进而讨论了微前端项目管理的架构模式，最终选择了monorepo。并且探讨了monorepo的最佳实践，着手搭建了monorepo基础架构。我们把monorepo的微模块，分成远程模块和静态模块。静态模块，本地安装打包；远程模块本身具备独立服务，需要远程加载，异步集成。我们选择module federation实现远程模块的集成。我们还讨论了monorepo本身的痛点，并且集成安装了pnpm和turborepo解决了部分痛点。

> 作者：你看那儿有阳光在飞  
> 链接：<https://juejin.cn/post/7265524106817503295>
