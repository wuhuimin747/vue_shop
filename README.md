## Vue实战
### 项目概述
+ 项目功能目录
    - 电商系统一般提供了PC、移动web、移动app、微信小程序等多端访问方式
    ![avatar](./image/电商项目多端服务.png)
    ![avatar](./image/项目功能目录.png)
    ![avatar](./image/电商后台管理功能.png)
+ 开发模式和技术选型
    - 前后端分离：前端基于Vue技术栈的SPA项目
    ![avatar](./image/开发模式.png)
    - 技术选型

    ![avatar](./image/技术选型.png)
### 项目初始化
+ 前端项目初始化步骤
    1. 安装vue-cli脚手架
    2. 使用脚手架创建vue项目模板
    3. 配置vue路由、element-ui组件库插件（选择按需导入）、axios库依赖(别选按需导入)
    4. 初始化git远程仓库
    5. 将本地项目托管到github远程仓库
+ 后端项目环境配置
    1. 安装mysql数据库
        - mysql脚本在后端项目vue_api_server的db文件夹下
        - 修改提供的vue_api_server下的config中的default.json中的数据密码（密码为自己数据库的密码
    2. 安装nodeJS环境
    3. 启动后端项目
        - 先npm i 把依赖的包下下来
        - 后端项目vue_api_server里的app.js是入口文件node app.js就可以了
    4. 使用postman测试接口
        - 接口在后端项目vue_api_server里有md接口文档
        - 注意在填写参数的时候选对破损有传参的格式x-www-form-urlencoded
### 登录与退出功能
+ 登录业务流程
    - 用户在登录页面输入用户名和密码
    - 调用后台接口进行匹配
    - 通过后台验证结果，失败给个错误提示，成功跳转到项目主页
+ 技术点
    - http请求是无状态的
    - cookie在客户端记录状态
    - session在服务端记录状态
    - token维持状态
        - 前端项目服务器存在跨域问题则需要使用token，前面都不好使
        - 调用登录接口之后将信息传递给后端，后端MD5得到加密token并返回前端
        ```javascript
        // 1. 将登录成功之后的 token，保存到客户端的 sessionStorage 中
        //   1.1 项目中除了登录之外的其他API接口，必须在登录之后才能访问
        //   1.2 token 只应在当前网站打开期间生效，sessionStorage是一个浏览器会话期间生效的，所以将 token 保存在 sessionStorage 中
        window.sessionStorage.setItem('token', res.data.token)
        // 2. 通过编程式导航跳转到后台主页，路由地址是 /home
        this.$router.push('/home')
        ```
        ![avatar](./image/token原理分析.png)
+ 登录页面的布局
    ![avatar](./image/登录页面的布局.png)
+ before coding
    - 默认在master分支上
    - 要新开一个功能，推荐新打一个分支login在该分支上开发
    - 完毕之后在合并到master上去
    - git st git branch login git checkout login / git st git checkout -b login
+ cli创建的项目模板进行自定义配置，并删掉一些不必要的写好的内容
+ 登录组件的代码实现步骤
    1. 创建一个vue单文件组件Login.vue
        * 注意template标签内组件要被一个跟标签包裹
        * 暴露私有成员的语法一定是export default{} 大括号别和.config.js里面的module.exports = {}搞混了
        * `<style lang="less" scoped>`lang表示语言支持less语言
        * 默认的cli创建的项目模板没有安装less加载器，需要去GUI面板下载less less-loader依赖项,记得是安装到【开发依赖】中
    2. 在根组件App中写好路由占位符
        * `<router-view></router-view>`
    3. 在router路由文件中配置路由规则和根路径重定向
        * router.js文件需要配置路径和组件的映射关系，就要用到组件对象
        * 所以要把用到的组件导入进来import安排
    ```javascript
        import Login from '../components/Login.vue'
        Vue.use(VueRouter)
        const router = new VueRouter({
        routes: [
            { path: '/', redirect: '/login' },
            { path: '/login', component: Login }
        ]
        })
    ```
+ 样式show time
    - 设置全局样式
    ```css
        html, body, #app{
            height: 100%;
            margin: 0;
            padding: 0;
        }
    ```
    - 盒子水平垂直居中
    ```css
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
    ```
    - 盒子加图片圆角边框位置居中偏上
    ```css
        .avater_box{
            width: 130px;
            height: 130px;
            position: absolute;
            left: 50%;
            transform: translate(-50%, -50%);
            border: 1px solid white;
            border-radius: 50%;
            box-shadow: 0 0 10px #ddd;
            background-color: #fff;
            padding: 10px;
            img{
                width: 100%;
                height: 100%;
                border-radius: 50%;
                background-color: #eee;
            }
        }
    ```
    - 按钮组的居右对齐
    ```css
        .btns {
            display: flex;
            justify-content: flex-end;
        }
    ```

+ element-ui的按需导入
    - 由于GUI安装插件的时候选择的是按需导入所以在src/plugin底下会有一个element.js
    - 需要用到form button input所以得手动导入一下
        * label="xxx"是输入域的label form里的label-width限制label宽度
    ```javascript
        //element.js
        import Vue from 'vue'
        import { Button, Form, FormItem, Input } from 'element-ui'
        // vue全局注册，这样所有的vue单文件组件都能用这些模块的标签了
        Vue.use(Button)
        Vue.use(Form)
        Vue.use(FormItem)
        Vue.use(Input)

        //Login.vue
        <el-form label-width="80px">
           <el-form-item label="活动名称">
               <el-input v-model="form.name"></el-input>
           </el-form-item>
        </el-form>
    ```
+ element-ui使用注意
    - 带icon的小图标
        * 可以通过 prefix-icon 和 suffix-icon 属性在 input 组件首部和尾部增加显示图标，也可以通过 slot 来放置图标。
        * element有自己icon库，看官网
        * 可以用第三方的图标库例如阿里库，使用方法简单，导入css样式表，在标签中相应属性加入`iconfont icon-user`类名即可。资源在assets/fonts路径下，使用方式和字体选择具体可看demo_fontclass.html
        ```html
             <el-input
                suffix-icon="el-icon-date"
                v-model="input1">
            </el-input>
        ```
    - 表单的数据绑定和验证规则
        * 在 Form 组件中，每一个表单域由一个 Form-Item 组件构成，表单域中可以放置各种类型的表单控件，包括 Input、Select、Checkbox、Radio、Switch、DatePicker、TimePicker
        * form标签得有一个属性:model="form" 对应模型数据里的表单对象，每个输入域单独绑定的数据得写成v-model="form.name"
        * Form 组件提供了表单验证的功能，只需要通过 rules 属性传入约定的验证规则，并将 Form-Item 的 prop 属性设置为需校验的字段名即可。
    ```javascript
        <!-- 登录表单 -->
        <el-form v-bind:model="loginForm"   v-bind:rules="loginFormRules" label-width="0"class="login_form">
            <el-form-item prop="username">
                <el-input v-model="loginForm.username" prefix-icon="iconfont icon-user"></el-input>
            </el-form-item>
        </el-form>
        export default {
          data () {
              return {
                loginForm: {
                    username: '',
                    password: ''
                },
                loginFormRules: {
                    username: [
                    { required: true, message: '请输入用户名称', trigger:'blur' },
                    ],
                    password: [
                    { required: true, message: '请输入密码', trigger:'blur' },
                ]
              }
              }
          }
        }
    ```
    - 表单方法
        * 使用方法是`表单实例.方法名`例如`this.$refs.loginForm.resetFields()`
        * resetFields：表单重置。对整个表单进行重置，将所有字段值重置为初始值并移除校验结果
        * validate：表单校验。对整个表单进行校验的方法，参数为一个回调函数。该回调函数会在校验结束后被调用，并传入两个参数：是否校验成功和未通过校验的字段。若不传入回调函数，则会返回一个 promise
    - message消息提示模块
        * 导入:`import { Message } from 'element-ui'`
        * 注册：`Vue.prototype.$message = Message`和别人不一样
        * 使用：`vm.$message.error('错了哦，这是一条错误消息');  success`
+ 将数据保存到sessionStorage里
    - `window.sessionStorage.setItem('token', data.token);`
    ![avatar](./image/sessionStorage.png)
+ 路由导航守卫控制访问权限
    - 意思就是说除了login登录页面，其他页面都要求在登录情况下才允许访问
    - 需求：如果用户没有登录，通过url访问了除/login以外的其他页面，需要重定向到/login页面
    - 在router.js里面做一个路由导航守卫
    ```javascript
        // 挂载路由导航守卫
        router.beforeEach((to, from, next) => {
            // to 将要访问的路由 from 从哪个路径跳转而来 next函数 next()表示放行 next('/login')表示强制跳转
            if (to.path === '/login') return next();
            // 获取token
            const token = window.sessionStorage.getItem('token');
            if (!token) return next('/login');
                next();
            });
    ```
+ 退出登录
    - 原理就是把浏览器本地的token干掉。这样后续的请求就不会携带token了，必须重新生成一个token才行
    ```javascript
      // 清空token
      window.sessionStorage.clear();
      // 强制跳转到登录页
      this.$router.push('/login');
    ```
+ 格式化文件的配置
    - 根目录下添加.prettierrc
    - 配置的含义是格式化的时候不用自动补充分号，格式化的时候使用单引号
    ```json
    {
        "semi": false,
        "singleQuote": true
    }
    ```
+ eslintrc.js rules
    - 学会看打包报错文件，是触犯了eslint的那条天规
    - 然后就找到这条规则，给她关闭成0。查看打包输出，找error
    - padded-blocks `error: Block must not be padded by blank lines (padded-blocks) at src\components\Home.vue:16:5:`
    ```javascript
    rules = {
        "no-alert": 0,//禁止使用alert confirm prompt
        "no-array-constructor": 2,//禁止使用数组构造器
        "no-bitwise": 0,//禁止使用按位运算符
        "no-caller": 1,//禁止使用arguments.caller或arguments.callee
        "no-catch-shadow": 2,//禁止catch子句参数与外部作用域变量同名
        "no-class-assign": 2,//禁止给类赋值
        "no-cond-assign": 2,//禁止在条件表达式中使用赋值语句
        "no-console": 2,//禁止使用console
        "no-const-assign": 2,//禁止修改const声明的变量
        "no-constant-condition": 2,//禁止在条件中使用常量表达式 if(true) if(1)
        "no-continue": 0,//禁止使用continue
        "no-control-regex": 2,//禁止在正则表达式中使用控制字符
        "no-debugger": 2,//禁止使用debugger
        "no-delete-var": 2,//不能对var声明的变量使用delete操作符
        "no-div-regex": 1,//不能使用看起来像除法的正则表达式/=foo/
        "no-dupe-keys": 2,//在创建对象字面量时不允许键重复 {a:1,a:1}
        "no-dupe-args": 2,//函数参数不能重复
        "no-duplicate-case": 2,//switch中的case标签不能重复
        "no-else-return": 2,//如果if语句里面有return,后面不能跟else语句
        "no-empty": 2,//块语句中的内容不能为空
        "no-empty-character-class": 2,//正则表达式中的[]内容不能为空
        "no-empty-label": 2,//禁止使用空label
        "no-eq-null": 2,//禁止对null使用==或!=运算符
        "no-eval": 1,//禁止使用eval
        "no-ex-assign": 2,//禁止给catch语句中的异常参数赋值
        "no-extend-native": 2,//禁止扩展native对象
        "no-extra-bind": 2,//禁止不必要的函数绑定
        "no-extra-boolean-cast": 2,//禁止不必要的bool转换
        "no-extra-parens": 2,//禁止非必要的括号
        "no-extra-semi": 2,//禁止多余的冒号
        "no-fallthrough": 1,//禁止switch穿透
        "no-floating-decimal": 2,//禁止省略浮点数中的0 .5 3.
        "no-func-assign": 2,//禁止重复的函数声明
        "no-implicit-coercion": 1,//禁止隐式转换
        "no-implied-eval": 2,//禁止使用隐式eval
        "no-inline-comments": 0,//禁止行内备注
        "no-inner-declarations": [2, "functions"],//禁止在块语句中使用声明（变量或函数）
        "no-invalid-regexp": 2,//禁止无效的正则表达式
        "no-invalid-this": 2,//禁止无效的this，只能用在构造器，类，对象字面量
        "no-irregular-whitespace": 2,//不能有不规则的空格
        "no-iterator": 2,//禁止使用__iterator__ 属性
        "no-label-var": 2,//label名不能与var声明的变量名相同
        "no-labels": 2,//禁止标签声明
        "no-lone-blocks": 2,//禁止不必要的嵌套块
        "no-lonely-if": 2,//禁止else语句内只有if语句
        "no-loop-func": 1,//禁止在循环中使用函数（如果没有引用外部变量不形成闭包就可以）
        "no-mixed-requires": [0, false],//声明时不能混用声明类型
        "no-mixed-spaces-and-tabs": [2, false],//禁止混用tab和空格
        "linebreak-style": [0, "windows"],//换行风格
        "no-multi-spaces": 1,//不能用多余的空格
        "no-multi-str": 2,//字符串不能用\换行
        "no-multiple-empty-lines": [1, {"max": 2}],//空行最多不能超过2行
        "no-native-reassign": 2,//不能重写native对象
        "no-negated-in-lhs": 2,//in 操作符的左边不能有!
        "no-nested-ternary": 0,//禁止使用嵌套的三目运算
        "no-new": 1,//禁止在使用new构造一个实例后不赋值
        "no-new-func": 1,//禁止使用new Function
        "no-new-object": 2,//禁止使用new Object()
        "no-new-require": 2,//禁止使用new require
        "no-new-wrappers": 2,//禁止使用new创建包装实例，new String new Boolean new Number
        "no-obj-calls": 2,//不能调用内置的全局对象，比如Math() JSON()
        "no-octal": 2,//禁止使用八进制数字
        "no-octal-escape": 2,//禁止使用八进制转义序列
        "no-param-reassign": 2,//禁止给参数重新赋值
        "no-path-concat": 0,//node中不能使用__dirname或__filename做路径拼接
        "no-plusplus": 0,//禁止使用++，--
        "no-process-env": 0,//禁止使用process.env
        "no-process-exit": 0,//禁止使用process.exit()
        "no-proto": 2,//禁止使用__proto__属性
        "no-redeclare": 2,//禁止重复声明变量
        "no-regex-spaces": 2,//禁止在正则表达式字面量中使用多个空格 /foo bar/
        "no-restricted-modules": 0,//如果禁用了指定模块，使用就会报错
        "no-return-assign": 1,//return 语句中不能有赋值表达式
        "no-script-url": 0,//禁止使用javascript:void(0)
        "no-self-compare": 2,//不能比较自身
        "no-sequences": 0,//禁止使用逗号运算符
        "no-shadow": 2,//外部作用域中的变量不能与它所包含的作用域中的变量或参数同名
        "no-shadow-restricted-names": 2,//严格模式中规定的限制标识符不能作为声明时的变量名使用
        "no-spaced-func": 2,//函数调用时 函数名与()之间不能有空格
        "no-sparse-arrays": 2,//禁止稀疏数组， [1,,2]
        "no-sync": 0,//nodejs 禁止同步方法
        "no-ternary": 0,//禁止使用三目运算符
        "no-trailing-spaces": 1,//一行结束后面不要有空格
        "no-this-before-super": 0,//在调用super()之前不能使用this或super
        "no-throw-literal": 2,//禁止抛出字面量错误 throw "error";
        "no-undef": 1,//不能有未定义的变量
        "no-undef-init": 2,//变量初始化时不能直接给它赋值为undefined
        "no-undefined": 2,//不能使用undefined
        "no-unexpected-multiline": 2,//避免多行表达式
        "no-underscore-dangle": 1,//标识符不能以_开头或结尾
        "no-unneeded-ternary": 2,//禁止不必要的嵌套 var isYes = answer === 1 ? true : false;
        "no-unreachable": 2,//不能有无法执行的代码
        "no-unused-expressions": 2,//禁止无用的表达式
        "no-unused-vars": [2, {"vars": "all", "args": "after-used"}],//不能有声明后未被使用的变量或参数
        "no-use-before-define": 2,//未定义前不能使用
        "no-useless-call": 2,//禁止不必要的call和apply
        "no-void": 2,//禁用void操作符
        "no-var": 0,//禁用var，用let和const代替
        "no-warning-comments": [1, { "terms": ["todo", "fixme", "xxx"], "location": "start" }],//不能有警告备注
        "no-with": 2,//禁用with

        "array-bracket-spacing": [2, "never"],//是否允许非空数组里面有多余的空格
        "arrow-parens": 0,//箭头函数用小括号括起来
        "arrow-spacing": 0,//=>的前/后括号
        "accessor-pairs": 0,//在对象中使用getter/setter
        "block-scoped-var": 0,//块语句中使用var
        "brace-style": [1, "1tbs"],//大括号风格
        "callback-return": 1,//避免多次调用回调什么的
        "camelcase": 2,//强制驼峰法命名
        "comma-dangle": [2, "never"],//对象字面量项尾不能有逗号
        "comma-spacing": 0,//逗号前后的空格
        "comma-style": [2, "last"],//逗号风格，换行时在行首还是行尾
        "complexity": [0, 11],//循环复杂度
        "computed-property-spacing": [0, "never"],//是否允许计算后的键名什么的
        "consistent-return": 0,//return 后面是否允许省略
        "consistent-this": [2, "that"],//this别名
        "constructor-super": 0,//非派生类不能调用super，派生类必须调用super
        "curly": [2, "all"],//必须使用 if(){} 中的{}
        "default-case": 2,//switch语句最后必须有default
        "dot-location": 0,//对象访问符的位置，换行的时候在行首还是行尾
        "dot-notation": [0, { "allowKeywords": true }],//避免不必要的方括号
        "eol-last": 0,//文件以单一的换行符结束
        "eqeqeq": 2,//必须使用全等
        "func-names": 0,//函数表达式必须有名字
        "func-style": [0, "declaration"],//函数风格，规定只能使用函数声明/函数表达式
        "generator-star-spacing": 0,//生成器函数*的前后空格
        "guard-for-in": 0,//for in循环要用if语句过滤
        "handle-callback-err": 0,//nodejs 处理错误
        "id-length": 0,//变量名长度
        "indent": [2, 4],//缩进风格
        "init-declarations": 0,//声明时必须赋初值
        "key-spacing": [0, { "beforeColon": false, "afterColon": true }],//对象字面量中冒号的前后空格
        "lines-around-comment": 0,//行前/行后备注
        "max-depth": [0, 4],//嵌套块深度
        "max-len": [0, 80, 4],//字符串最大长度
        "max-nested-callbacks": [0, 2],//回调嵌套深度
        "max-params": [0, 3],//函数最多只能有3个参数
        "max-statements": [0, 10],//函数内最多有几个声明
        "new-cap": 2,//函数名首行大写必须使用new方式调用，首行小写必须用不带new方式调用
        "new-parens": 2,//new时必须加小括号
        "newline-after-var": 2,//变量声明后是否需要空一行
        "object-curly-spacing": [0, "never"],//大括号内是否允许不必要的空格
        "object-shorthand": 0,//强制对象字面量缩写语法
        "one-var": 1,//连续声明
        "operator-assignment": [0, "always"],//赋值运算符 += -=什么的
        "operator-linebreak": [2, "after"],//换行时运算符在行尾还是行首
        "padded-blocks": 0,//块语句内行首行尾是否要空行
        "prefer-const": 0,//首选const
        "prefer-spread": 0,//首选展开运算
        "prefer-reflect": 0,//首选Reflect的方法
        "quotes": [1, "single"],//引号类型 `` "" ''
        "quote-props":[2, "always"],//对象字面量中的属性名是否强制双引号
        "radix": 2,//parseInt必须指定第二个参数
        "id-match": 0,//命名检测
        "require-yield": 0,//生成器函数必须有yield
        "semi": [2, "always"],//语句强制分号结尾
        "semi-spacing": [0, {"before": false, "after": true}],//分号前后空格
        "sort-vars": 0,//变量声明时排序
        "space-after-keywords": [0, "always"],//关键字后面是否要空一格
        "space-before-blocks": [0, "always"],//不以新行开始的块{前面要不要有空格
        "space-before-function-paren": [0, "always"],//函数定义时括号前面要不要有空格
        "space-in-parens": [0, "never"],//小括号里面要不要有空格
        "space-infix-ops": 0,//中缀操作符周围要不要有空格
        "space-return-throw-case": 2,//return throw case后面要不要加空格
        "space-unary-ops": [0, { "words": true, "nonwords": false }],//一元运算符的前/后要不要加空格
        "spaced-comment": 0,//注释风格要不要有空格什么的
        "strict": 2,//使用严格模式
        "use-isnan": 2,//禁止比较时使用NaN，只能用isNaN()
        "valid-jsdoc": 0,//jsdoc规则
        "valid-typeof": 2,//必须使用合法的typeof的值
        "vars-on-top": 2,//var必须放在作用域顶部
        "wrap-iife": [2, "inside"],//立即执行函数表达式的小括号风格
        "wrap-regex": 0,//正则表达式字面量用小括号包起来
        "yoda": [2, "never"]//禁止尤达条件
    }
    ```
+ Git操作
    - 将login分支merge到master  `git checkout master`  `git merge login`
    - 把master分支推动到Github `git push`
    - 把login分支推到github `git checkout login`  `git push vue_shop login`
### 主页布局
+ 主页布局
    - 去el官网找container容器布局
    ![avatar](./image/整体布局.png)
+ elementui注意
    - 每一个标签名都同时是类名相当于`<el-container class="el-container">`  
+ 主页header布局
    ```css
        .el-header {
            background-color: #373d41;
            display: flex;
            justify-content: space-between;
            padding-left: 0;
            align-items: center;
            color: #fff;
            font-size: 20px;
            > div {
                display: flex;
                align-items: center;
                span {
                margin-left: 15px;
                }
            }
        }
    ```
+ 左侧菜单布局
    - 看官网的导航菜单组件
    - 学会梳理出结构，删掉自己不需要的代码，整理出想要的结构
    - text-color 是字体默认颜色
    - active-text-color 是active点击时的颜色设置
    ```html
        <el-menu
          background-color="#333744"
          text-color="#fff"
          active-text-color="#ffd04b"
        >
          <!-- 一级导航 -->
          <el-submenu index="1">
            <!-- 一级导航的模板 -->
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>导航一</span>
            </template>
            <!-- 二级导航 -->
            <el-menu-item index="1-4-1">
              <template slot="title">
                <i class="el-icon-location"></i>
                <span>导航2</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
    ```
+ 通过接口获取菜单数据
    - 除了登录接口，其他都是授权接口
    - 需要授权的 API ，必须在请求头中使用 `Authorization` 字段提供 `token` 令牌
    - 这时候就需要做一个axios的请求拦截，给加上token令牌
    ```javascript
    // axios挂载请求拦截器
    axios.interceptors.request.use(config => {
        // 在请求头上加上Authorization
        config.headers.Authorization = window.sessionStorage.getItem('token');
        console.log(config.headers);
        return config;
    });
    ```
    - 在生命周期函数created中加载菜单列表数据
    - 获取数据
        * 注意axios api返回的是一promise实例 可以使用await来接收结果
        * `const {data : ret}`是对axios返回对象的结构赋值，取出其中的data属性赋值给ret变量
        * `return ...`操作是为了能在一行之内执行抛错并且结束if分支
    ```javascript
    async getMenuList() {
      const { data : ret } = await this.axios.get('menus');
      if (ret.meta.status !== 200) return this.$message.error(ret.meta.msg);
      this.menuList = ret.data;
    }
    ```
+ 渲染菜单数据
    - 注意`<el-submenu index="1">`标签的index属性得是唯一的string类型，不然就认为都一样了，点一个下拉所有的一级菜单一起动
    - menu的属性 unique-opened	是否只保持一个子菜单的展开
+ home重定向到welcome
    - home组件的main区域想展示一个welcome欢迎页面
    - 确定welcome组件是嵌套在home组件内部的一个组件，出现在main区域的一个占位符的位置
    - 所以/welcome是/home的子路由，并且/home要重定向到/welcome
+ 菜单改造为路由链接
    - el-menu标签有属性router:表示是否使用 vue-router 的模式，启用该模式会在激活导航时以 index 作为 path 进行路由跳转
    - el-menu标签有属性default-active：把它的值设置为当前触发菜单的 index就会高亮
### 用户列表
+ 面包屑导航
+ 栅格系统
    ```html
    <el-row :gutter="20">
        <el-col :span="7"></el-col>
        <el-col :span="4"></el-col>
      </el-row>
    ```
+ 表格的使用
    - 属性dat绑定的是表格的数据源，每一列column的prop是数据源中的列名，label是显示的表头
    - 可根据俄需要加样式 border stripe
    ```html
    <el-table
      :data="tableData"
      style="width: 100%">
      <el-table-column
        prop="date"
        label="日期"
        width="180">
      </el-table-column>
    </el-table>

    索引列
    <el-table-column type="index"></el-table-column>
    ```
+ 使用作用域插槽实现表格列给子组件传递switch开关模板内容
    - 父组件通过slot-scope属性接收到的来自子组件的对象可以.出一个row，里面有该行的所有数据
    - 父组件通过传递一个temple模板的方式给子组件的占位符slot实现开关
    - 此时可以去掉column的prop属性
    - switch的v-model甚至可以和row中的数据双向绑定
    ```html
        <el-table-column label="状态">
          <template slot-scope="data">
            <el-switch v-model="data.row.mg_state">
            </el-switch>
          </template>
        </el-table-column>


        <el-table-column label="操作" width="180px">
          <el-button type="primary" icon="el-icon-edit" circle></el-button>
          <el-button type="danger" icon="el-icon-delete" circle></el-button>
          <el-tooltip :enterable="false" effect="light" content="分配角色" placement="top-start">
            <el-button type="warning" icon="el-icon-setting" circle></el-button>
          </el-tooltip>
        </el-table-column>
    ```
    - 使用button组件的图标按钮，指定圆角按钮，指定size
    - 使用tootip提示，指定显示方式，指定内容
    - 指定主题色effect默认提供的主题	String	dark/light
    - 指定enterable	鼠标是否可进入到 tooltip 中
    - 注意:enterable="false"是布尔值而不是普通string，需要做属性绑定v-bind
+ 数据分页显示
    - 使用了pagination组件
    - 使用了size-change和current-change事件来处理页码大小和当前页变动时候触发的事件。page-sizes接受一个整型数组，数组元素为展示的选择每页显示个数的选项，[100, 200, 300, 400]表示四个选项，每页显示 100 个，200 个，300 个或者 400 个。
    - :current-page绑定当前的pagenum页数， :page-size绑定pagesize当前条数,:page-sizes绑定可选条数数组
    - layout决定要展示的组件元素块儿，:total绑定总数据条数total
    ```javascript
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
        :current-page="queryParam.pagenum" :page-sizes="[1, 2, 5, 10]" :page-size="queryParam.pagesize"
        layout="total, sizes, prev, pager, next, jumper" :total="total">
        </el-pagination>
        // 查询参数
        queryParam: {
            query: '',
            pagenum: 1,
            pagesize: 2
        },
        // 用户数据总数
        total: 0

        // size变化时的监听函数
        handleSizeChange(newSize) {
            // console.log(newSize);
            this.queryParam.pagesize = newSize;
            this.getUserList();
        },
        // pagenum变化时的监听函数
        handleCurrentChange(newNum) {
            // console.log(newNum);
            this.queryParam.pagenum = newNum;
            this.getUserList();
        }
    ```
+ 更新用户状态
    - 小技巧，vscode一个文件向右拆分编辑器，左边看dom,右边看js，方便操作
    - 页面上的用户状态切换了，但是没传到数据库里
    - 监听switch主键的change事件，监听函数传递的是整行row是因为下面
    - change
    ```javascript
        <el-switch v-model="data.row.mg_state" @change="mgstateChange(data.row)">
        </el-switch>

        // 监听用户状态mg_state的变化，并更新到数据库中
        async mgstateChange(info) {
            const { data : res } = await this.axios.put(`users/${info.id}/state/${info.mg_state}`);
            if (res.meta.status !== 200) {
                info.mg_state = !info.mg_state;
                return this.$message.error('更新用户状态失败！');
            }
            this.$message.success('更新用户状态成功');
        }
    ```
+ 实现用户搜索
    - input双向绑定到查询参数的query上，在做一个点击事件监听
    - 输入框右边的小叉叉优化：input 组件使用clearable属性即可得到一个可清空的输入框
    - 优化：点小叉叉之后重新搜索全部数据。基于input组件的clear事件完成
+ 添加用户对话框
    - 使用dialog组件
    - 需要设置visible属性，它接收Boolean，当为true时显示 Dialog。Dialog 分为两个部分：body和footer，footer需要具名为footer的slot。title属性用于定义标题，它是可选的，默认值为空。
    ```html
    <el-dialog title="添加用户" :visible.sync="dialogVisible" width="30%">
      <span>这是一段信息</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogVisible = false"
          >确 定</el-button
        >
      </span>
    </el-dialog>
    ```
+ 添加用户表单
    - 自定义校验规则，校验变量定义在data() {} 里面不在return里面
    ```javascript
        <!-- 添加用户表单 -->
        <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="70px">
            <el-form-item label="用户名" prop="username">
            <el-input v-model="addForm.username"></el-input>
            </el-form-item>
            <el-form-item label="密码" prop="password">
            <el-input v-model="addForm.password"></el-input>
            </el-form-item>
            <el-form-item label="邮箱" prop="email">
            <el-input v-model="addForm.email"></el-input>
            </el-form-item>
            <el-form-item label="手机" prop="mobile">
            <el-input v-model="addForm.mobile"></el-input>
            </el-form-item>
        </el-form>

        data() {
        // 验证邮箱的规则
        var checkEmail = (rule, value, cb) => {
            // 验证邮箱的正则表达式
            const regEmail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/
            if (regEmail.test(value)) {
                // 合法的邮箱
                return cb()
            }
            cb(new Error('请输入合法的邮箱'))
        }
        // 验证手机号的规则
        var checkMobile = (rule, value, cb) => {
            // 验证手机号的正则表达式
            const regMobile = /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/
            if (regMobile.test(value)) {
                return cb()
            }
            cb(new Error('请输入合法的手机号'))
        }
        return {
        // 添加用户表单数据
        addForm : {
            username : '',
            password : '',
            email: '',
            mobile: ''
        },
        // 添加用户表单验证规则
        addFormRules: {
            username: [
                { required: true, message: '请输入用户名称', trigger: 'blur' },
                { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
            ],
            password: [
                { required: true, message: '请输入密码', trigger: 'blur' },
                { min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur' }
            ],
            email: [
                { required: true, message: '请输入邮箱', trigger: 'blur' },
                { validator: checkEmail, trigger: 'blur' }
            ],
            mobile: [
                { required: true, message: '请输入手机号', trigger: 'blur' },
                { validator: checkMobile, trigger: 'blur' }
            ],
            
        }
        }
    },
    ```
+ 修改操作
    - 想要在一个组件里面使用slot-scope作用域插槽获取子组件的数据，就得用template包裹起来
    ```html
    <el-table-column label="操作" width="180px">
          <template slot-scope="data">
            <el-button type="primary" icon="el-icon-edit" circle size="small" @click="showEditDialog(data.row.id)">
            </el-button>
            <el-button type="danger" icon="el-icon-delete" circle size="small"></el-button>
            <el-tooltip :enterable="false" effect="light" content="分配角色" placement="top-start">
              <el-button type="warning" icon="el-icon-setting" circle size="small"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
    ```
+ 删除用户
    - 使用this.$confirm方法，返回一个promise，可以使用官网的.then 。catch来进行后续的操作，也可以通过async await来接收promise的结果，然后根据结果来做响应的判断
    ```javascript
    // 根据Id删除对应的用户信息
    async removeUserById(id) {
      // 弹框询问用户是否删除数据
      const confirmResult = await this.$confirm(
        '此操作将永久删除该用户, 是否继续?', '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).catch(err => err)
      // 如果用户确认删除，则返回值为字符串 confirm
      // 如果用户取消了删除，则返回值为字符串 cancel
      // console.log(confirmResult)
      if (confirmResult !== 'confirm') {
        return this.$message.info('已取消删除')
      }
      const { data: res } = await this.axios.delete('users/' + id)
      if (res.meta.status !== 200) {
        return this.$message.error('删除用户失败！')
      }
      this.$message.success('删除用户成功！')
      this.getUserList()
    },
    ```
### 权限列表
+ 角色和权限的关系
    ![avatar](./image/用户角色和权限的关系.png)
+ 角色列表的展开列
    - `<el-table-column type="expand"></el-table-column>`将table-column 的type属性设置为expand即可
    - 展开列的布局思路：
        * 使用el-row el-col布局，首先有一行row
        * row里面有两个col,第一个是一级权限，第二个col是二级权限
        * 一级权限里面的模板是tag + icon
        * 耳机权限col里面又有一行row
        * row里面分两个col,第一个是二级权限tag，第二个是三级权限
    - 展开列的优化：
        * 加上小箭头的border分割线
        * 加上tag尾部的小叉叉
        * 一级，二级tag垂直居中
        * tag之间有空隙margin
    ```html
    <!-- 展开列 -->
        <el-table-column type="expand">
          <template slot-scope="data">
            <el-row v-for="(item1, index1) in data.row.children" :key="item1.id"
              :class="['bdbottom', index1 === 0 ? 'bdtop' : '', 'vertical_center']">
              <!-- 一级权限 -->
              <el-col :span="5">
                <el-tag closable @close="removeRightsByRole(data.row, item1.id)">{{item1.authName}}</el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <el-col :span="19">
                <el-row v-for="(item2, index2) in item1.children" :key="item2.id"
                  :class="[index2 === 0 ? '' : 'bdtop', 'vertical_center']">
                  <!-- 二级权限 -->
                  <el-col :span="6">
                    <el-tag type="success" closable @close="removeRightsByRole(data.row, item2.id)">{{item2.authName}}
                    </el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <el-col :span="18">
                    <el-tag type="warning" v-for="(item3) in item2.children" :key="item3.id" closable
                      @close="removeRightsByRole(data.row, item3.id)">{{item3.authName}}
                    </el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
    ```
+ 分配权限的树结构
    - tree树形控件
    - data属性绑定树的数据， node-key接受string指定每个节点的唯一标识，props定义子节点属性和text文本属性
    - show-checkbox复选框 :default-expand-all默认展开全部节点 default-checked-keys默认选中的节点key接受数组
    - 很多api要学会看组件的属性和事件和方法
    ```html
    <!-- 分配权限对话框 -->
    <el-dialog title="分配权限" :visible.sync="setRightdialogVisible" width="30%" @close="closeSetRightsDialog">
      <!-- 树形控件 -->
      <el-tree ref="treeRef" :data="treeData" node-key="id" :props="treeProps" show-checkbox :default-expand-all="true" :default-checked-keys="checkedRights">
      </el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="setRightdialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="setRights">确 定</el-button>
      </span>
    </el-dialog>
    ```
### 商品管理
+ 树形表格插件-vue-table-with-tree-grid  api https://github.com/MisterTaki/vue-table-with-tree-grid
+ 级联选择器cascader
### 订单管理
+ 物流时间线组件Timeline, 2.6.0+
### 数据报表
+ 下载echarts依赖
### 项目优化
+ 项目优化策略
    - 生成打包报告
        * npm run build --report
        * or 打开vue GUI面板运行build指令，查看控制台和分析部分的报告
        * 查看哪些依赖项的体积大
        * vue-cli 3.x生成的项目默认隐藏了所有webpack配置项
        * 如果想修改webpack的默认配置，可以创建根目录下vue.config.js中修改，具体配置看官方文档，最重要的就是得module.exports = {}
    - 为开发模式和生产模式指定不同打包入口vue.config.js
        * 开发src/main-dev.js
        * 生产src/main-prod.js
        * 通过chainWebpack自定义打包入口
        ```javascript
        module.exports = {
            chainWebpack: config => {
                // 发布模式
                config.when(process.env.NODE_ENV === 'production', config => {
                    config.entry('app').clear().add('./src/main-prod.js')
                })

                // 开发模式
                config.when(process.env.NODE_ENV === 'development', config => {
                    config.entry('app').clear().add('./src/main-dev.js')
                })
            }
        }
        ```
    - 第三方库使用CDN
        * 通过external加载外部CDN资源
        * 通过import导入的第三方依赖包，打包后会被合并到一个文件中，导致单文件过大的问题
        * 在webpack的external节点配置的第三方包都不会被打包，而是会CDN加载
            1. 在vue.config.js里面添加external节点配置
            ```javascript
            // 发布模式
            config.when(process.env.NODE_ENV === 'production', config => {
                config.entry('app').clear().add('./src/main-prod.js')
                
                config.set('externals', {
                    vue: 'Vue',
                    'vue-router': 'VueRouter',
                    axios: 'axios',
                    lodash: '_',
                    echarts: 'echarts',
                    nprogress: 'NProgress',
                    'vue-quill-editor': 'VueQuillEditor'
                })
            })
            ```
            2. 在public/index.html头部添加CDN引用
            ```html
            <% if(htmlWebpackPlugin.options.isProd){ %>
                <!-- nprogress 的样式表文件 -->
                <link rel="stylesheet" href="https://cdn.staticfile.org/nprogress/0.2.0/nprogress.min.css" />
                <!-- 富文本编辑器 的样式表文件 -->
                <link rel="stylesheet" href="https://cdn.staticfile.org/quill/1.3.4/quill.core.min.css" />
                <link rel="stylesheet" href="https://cdn.staticfile.org/quill/1.3.4/quill.snow.min.css" />
                <link rel="stylesheet" href="https://cdn.staticfile.org/quill/1.3.4/quill.bubble.min.css" />
                <!-- element-ui 的样式表文件 -->
                <link rel="stylesheet" href="https://cdn.staticfile.org/element-ui/2.8.2/theme-chalk/index.css" />

                <script src="https://cdn.staticfile.org/vue/2.5.22/vue.min.js"></script>
                <script src="https://cdn.staticfile.org/vue-router/3.0.1/vue-router.min.js"></script>
                <script src="https://cdn.staticfile.org/axios/0.18.0/axios.min.js"></script>
                <script src="https://cdn.staticfile.org/lodash.js/4.17.11/lodash.min.js"></script>
                <script src="https://cdn.staticfile.org/echarts/4.1.0/echarts.min.js"></script>
                <script src="https://cdn.staticfile.org/nprogress/0.2.0/nprogress.min.js"></script>
                <!-- 富文本编辑器的 js 文件 -->
                <script src="https://cdn.staticfile.org/quill/1.3.4/quill.min.js"></script>
                <script src="https://cdn.jsdelivr.net/npm/vue-quill-editor@3.0.4/dist/vue-quill-editor.js"></script>

                <!-- element-ui 的 js 文件 -->
                <script src="https://cdn.staticfile.org/element-ui/2.8.2/index.js"></script>
            <% } %>
            ```
            * css文件放在上面js文件放在下面
    - Element-ui组件按需加载
        * 在main-prod.js里面注释掉element.js的按需导入
            `// import './plugins/element.js';`
        * 这样一来js/chunk-vendors.85ce9847.js就变得很小了
        * 在public/index.html头部添加element-ui的CDN引用
    - 路由懒加载
        * js打包后体积很大，影响页面加载，可以根据不同的路由将组件分成不同代码块
        * 当路由被访问到的时候才加载对应的组件
        * 改造后打包出来的app.js vender.js体积进一步减小
        * 文档`https://router.vuejs.org/zh/guide/advanced/lazy-loading.html`
        1. 安装`@babel/plugin-syntax-dynamic-import`包
        2. 在babel.config.js声明该插件
        ```javascript
        module.exports = {
            plugins: [
                '@babel/plugin-syntax-dynamic-import'
            ]
        }
        ```
        3. 将路由改为：
            - 其中组件Foo和Bar是一个group,代码块放在一起，访问任意一个对应路由都会将两个组件的代码一起加载下来
        ```javascript
        // 例如：
        const Foo = () => import(/* webpackChunkName: "group-foo" */ './Foo.vue')
        const Bar = () => import(/* webpackChunkName: "group-foo" */ './Bar.vue')
        const Baz = () => import(/* webpackChunkName: "group-foo" */ './Baz.vue')

        // import Login from '../components/Login.vue'
        const Login = () => import(/* webpackChunkName: "login_home_welcome" */ '../components/Login.vue')
        // import Home from '../components/Home.vue'
        const Home = () => import(/* webpackChunkName: "login_home_welcome" */ '../components/Home.vue')
        // import Welcome from '../components/Welcome.vue'
        const Welcome = () => import(/* webpackChunkName: "login_home_welcome" */ '../components/Welcome.vue')

        // import Users from '../components/user/Users.vue'
        const Users = () => import(/* webpackChunkName: "Users_Rights_Roles" */ '../components/user/Users.vue')
        // import Rights from '../components/power/Rights.vue'
        const Rights = () => import(/* webpackChunkName: "Users_Rights_Roles" */ '../components/power/Rights.vue')
        // import Roles from '../components/power/Roles.vue'
        const Roles = () => import(/* webpackChunkName: "Users_Rights_Roles" */ '../components/power/Roles.vue')
        ```
        ![avatar](./image/路由懒加载.png)
    - 首页内容定制
        * 根据不同的打包环境渲染不同的首页资源，例如想要在开发环境下页面title加上dev前缀
        * 需要在vue.config.js中配置参数isProd,在public/index.html可以获取并使用
        ```javascript
        module.exports = {
            chainWebpack: config => {
                // 发布模式
                config.when(process.env.NODE_ENV === 'production', config => {
                    config.plugin('html').tap(args => {
                        args[0].isProd = true
                        return args
                    })
                })

                // 开发模式
                config.when(process.env.NODE_ENV === 'development', config => {
                    config.plugin('html').tap(args => {
                        args[0].isProd = false
                        return args
                    })
                })
            }
        }
        // 按需渲染页面标题
        <title><%= htmlWebpackPlugin.options.isProd ? '' : 'dev - ' %>电商后台管理系统</title>
        // 按需加载CDN资源
        <% if(htmlWebpackPlugin.options.isProd){ %>
        // external节点加载的外部CDN资源
        <% } %>
        ```
+ 异步请求的进度条
    - nprogress插件加载进度条
    ```javascript
    // axios挂载请求拦截器
    axios.interceptors.request.use(config => {
        NProgress.start();
        return config;
    });
    axios.interceptors.response.use(ret => {
        NProgress.done();
        return ret;
    });
    ```
+ 解决server命令仪表盘的所有warning
+ 执行build命令生成dist
    - 发现有很多warning都在讲生产代码不应该有console.log但开发时期又需要输出
    - 需要插件`babel-plugin-transform-remove-console`
    - 在babel.config.js中添加配置
    ```javascript
        // 这是项目发布阶段需要用到的 babel 插件
        const prodPlugins = []
        if (process.env.NODE_ENV === 'production') {
            prodPlugins.push('transform-remove-console')
        }

        module.exports = {
            presets: ['@vue/app'],
            plugins: [
                // 发布产品时候的插件数组
                prodPlugins
            ]
        }
    ```
### 项目上线
+ node创建web服务器，将dist托管为静态资源
    * 创建一个项目app,npm init 创建app.js
    * 把build生成的dist考到这个项目的项目根路径下
    ```javascript
    var express = require('express')
    // 创建web服务器
    var app = express()
    // 托管静态资源
    app.use(express.static('./dist'))
    // 启动web服务
    app.listen(8555, () => {
        console.log('web running at http://localhost:8555')
    })
    ```
+ 开启gzip配置
    * 使用gzip压缩文件体积，网络请求传输速度加快
    * 通过服务端express实现gzip
    1. `npm i compression`
    2. 在服务端导入Compression，
    3. 在托管静态资源之前启用中间件
    ```javascript
    const compression = require('compression')
    // 启用中间件(一定要把这一行代码，写到 静态资源托管之前
    app.use(compression())
    app.use(express.static('./dist'))
    ```
    ![avatar](./image/gzip压缩文件体积.png)
+ 配置https服务
    * http协议传输的数据都是明文
    * https协议将传输数据加密，更安全
    1. 申请SSL证书，获取公钥私钥
        - 需要申请SSL证书，进入https://freessl.cn官网
        - 在后台导入证书
    2. 在app.js中配置公钥私钥，并使用https来启动服务
    ```javascript
    const https = require('https')
    const fs = require('fs')
    const app = express()
    const options = {
        cert: fs.readFileSync('./full_chain.pem'),
        key: fs.readFileSync('./private.key')
    }
    https.createServer(options, app).listen(8555)
    ```
    ![avatar](./image/https服务.png)
+ pm2管理应用
    * 在终端中node启动的应用，在终端关闭以后也跟着关闭了
    * 一台服务器开很多的终端，每个终端起一个项目，管理起来很困难
    * pm2可以解决这个问题,一个终端管理多个项目，且终端关了项目也能在后太跑
    1. `npm i pm2 -g`
    2. 启动项目 `pm2 start 可执行文件 --name 项目名`  `pm2 start ./app.js --name app_vueshop`
    3. 查看运行项目 `pm2 ls` 可以显示项目的id
    4. 重启项目 `pm2 restart id/项目名`
    5. 停止项目 `pm2 stop id/项目名`
    6. 删除项目 `pm2 delete id/项目名`
    ![avatar](./image/pm2管理应用.png)
