module.exports = {
  root: true,
  env: {
    node: true
  },
  extends: [
    'plugin:vue/essential',
    '@vue/standard'
  ],
  parserOptions: {
    parser: 'babel-eslint'
  },
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',

    // 箭头函数中，在需要的时候，在参数外使用小括号（只有一个参数时，可以不适用括号，其它情况下都需要使用括号）
    'arrow-parens': [
      2,
      'as-needed'
    ],
    // 箭头函数中的箭头前后需要留空格
    'arrow-spacing': [
      2,
      {
        before: true,
        after: true
      }
    ],
    // 在写逗号时，逗号前面不需要加空格，而逗号后面需要添加空格
    'comma-spacing': [
      2,
      {
        before: false,
        after: true
      }
    ],
    // 如果逗号可以放在行首或行尾时，那么请放在行尾
    'comma-style': [
      2,
      'last'
    ],
    // 使用=== !== 代替== != .
    eqeqeq: [
      2,
      'allow-null'
    ],
    // 这个就是关于用什么来缩进了，4个空格=两个tab .
    indent: [
      1,
      2
    ],
    // keyword 前后需要空格
    'keyword-spacing': [
      2,
      {
        before: true,
        after: true,
        overrides: {}
      }
    ],
    // 该规则规定了在对象字面量语法中，key和value之间的空白，冒号前不要空格，冒号后面需要一个空格
    'key-spacing': [
      2,
      {
        beforeColon: false,
        afterColon: true
      }
    ],
    // 代码块前面需要加空格
    'space-before-blocks': [
      2,
      'always'
    ],
    // 函数圆括号前面需要加空格
    'space-before-function-paren': [
      2,
      'never'
    ],
    // 圆括号内部不需要加空格
    'space-in-parens': [
      2,
      'never'
    ],
    // 操作符前后需要加空格
    'space-infix-ops': 2,
    'array-bracket-spacing': [ 'error', 'always' ],
    'object-curly-spacing': [ 'error', 'always' ],
    'max-len': [ 0, 80, 2 ]// 字符串最大长度
  }
}
