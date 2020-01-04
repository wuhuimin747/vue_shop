module.exports = {
  root: true,
  env: {
    node: true
  },
  'extends': [
    'plugin:vue/essential',
    '@vue/standard'
  ],
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'comma-spacing': 0,// 逗号前后的空格
    'comma-dangle': 0,// 对象字面量项尾不能有逗号
    'indent': 0,// 缩进风格
    'key-spacing': 0,// 对象字面量中冒号的前后空格
    'semi': 0,// 语句强制分号结尾
    'no-irregular-whitespace': 0, // 这禁止掉 空格报错检查
    'no-mixed-spaces-and-tabs': 0, // 关闭禁止混用tab和空格
    'no-multi-spaces': 0,// 不能用多余的空格
    'space-before-function-paren': 0,// 函数定义时括号前面要不要有空格
    'padded-blocks': 0,// 块语句内行首行尾是否要空行
    'no-trailing-spaces': 0,// 一行结束后面不要有空格
  },
  parserOptions: {
    parser: 'babel-eslint'
  }
};
