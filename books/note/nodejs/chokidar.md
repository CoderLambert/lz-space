# chokidar - 监控文件系统变动的Node.js库

Chokidar是一个用于监控文件和目录变动的Node.js库。它提供了一个简单易用的API，让你能够轻松地监听文件和目录的变化，并在发生变化时执行相应的操作。

## 使用场景

Chokidar可以用于各种[不同的](https://so.csdn.net/so/search?q=%E4%B8%8D%E5%90%8C%E7%9A%84&spm=1001.2101.3001.7020)应用场景。例如：

- 实现实时编译器或预处理器，当源代码发生变化时自动重新编译或处理文件。
- 在开发环境中实现实时刷新浏览器，当页面中的资源发生变化时自动刷新页面。
- 搭建自动化测试工具，在代码发生变化时自动运行测试以确保代码质量。

### 特点

- 支持多种操作系统，包括macOS、Windows和Linux。
- 能够检测到文件和目录的添加、删除和更改事件。
- 可以忽略特定的文件或目录，避免不必要的通知。
- 提供了多个事件，如`add`、`change`、`unlink`等，可以根据需要选择合适的事件来触发相应的操作。
- 具有良好的性能，即使在大量文件或目录的情况下也能保持较高的效率。

### 如何使用

要开始使用Chokidar，请首先安装它：

```sql
npm install chokidar
```

然后，在你的程序中导入并使用它：

```javascript
const chokidar = require('chokidar'); // 监听指定目录下的所有文件和子目录
const watcher = chokidar.watch(
    '/path/to/directory',
    { 
        ignored: /(^|[\/\\])\../,// 忽略以 . 开头的文件和目录 
        persistent: true  // 长期运行
    }
); 

 
  watcher.on('add', path => console.log(`File ${path} has been added`));
  watcher.on('change', path => console.log(`File ${path} has been changed`));
  watcher.on('unlink', path => console.log(`File ${path} has been removed`));
```

这只是最基本的用法，你可以查看Chokidar的文档以了解更多的选项和功能。

### 总结

如果你正在寻找一个简单易用且高效的文件系统监控库，那么Chokidar绝对值得尝试。它提供了丰富的事件和选项，可以帮助你在开发过程中更加高效地管理你的文件和目录。试一试吧！

[项目地址](https://gitcode.com/gh_mirrors/ch/chokidar/?utm_source=artical_gitcode&index=bottom&type=card&webUrl "chokidar")
