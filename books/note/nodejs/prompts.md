# prompts nodejs环境下的输入交互工具

1. 安装
    npm install --save prompts

[npm 主页](https://www.npmjs.com/package/prompts)

[中文文档](https://chinabigpan.github.io/prompts_docs_cn/routes/examples.html)

[输入类型](https://chinabigpan.github.io/prompts_docs_cn/routes/types.html)
Types
文本 (text)
密码 (password)
隐藏 (invisible)
数字 (number)
是非 (confirm)
清单 (list)
切换 (toggle)
选择 (select)
多选 (multiselect)
自动填充 (autoComplete)
日期 (data)

::: code-group

```js [单个问题]
(async () => {
  const response = await prompts({
    type: 'number',
    name: 'value',
    message: 'How old are you?',
    validate: value => value < 18 ? `Nightclub is 18+ only` : true
  });

  console.log(response); // => { value: 24 }
})();
```

```js [问题链]
const questions = [
  {
    type: 'text',
    name: 'username',
    message: 'What is your GitHub username?'
  },
  {
    type: 'number',
    name: 'age',
    message: 'How old are you?'
  },
  {
    type: 'text',
    name: 'about',
    message: 'Tell something about yourself',
    initial: 'Why should I?'
  }
];

(async () => {
  const response = await prompts(questions);
  console.log(response)
  // => response => { username, age, about }
})();
```

```js [动态问题]

const questions = [
  {
    type: 'text',
    name: 'dish',
    message: 'Do you like pizza?'
  },
  {
    type: prev => prev == 'pizza' ? 'text' : null,
    name: 'topping',
    message: 'Name a topping'
  }
];

(async () => {
  const response = await prompts(questions);
  console.log(response)
})();


:::
