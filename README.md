# vue全家桶2019学习随记

## Vue基础
### 概述
+ Vue是渐进式JavaScript框架
+ 怎么区分框架和库
    - 库：侧重于提供大量API，例如jQuery库
    - 框架：侧重于提供基础服务为主，例如vue提供虚拟dom和数据双向绑定服务
+ 什么是渐进式
    - 声明式渲染->组件系统->客户端路由->集中式状态管理->项目构建
    - 从左到右逐层递进
    - 可以只按需使用一部分,也可以全部使用
+ 灵活高效
    - vue可以当做一个库来用，也可当做一个框架
    - 高效：运行时20KB内存，快速的虚拟DOM
+ 基本实例
```html
<body>
    <div id="app">
        <p>{{msg}}</p>

    </div>
</body>
<script src="./js/vue-2.4.0.js"></script>
<script>
    let vm = new Vue({
        el : '#app',
        data : {
            msg : '最基础的vue应用 hello word！'
        }
    });
</script>
```
+ 实例解析
    - 参数分析
        * `el`:元素挂载的位置，只可以使css选择器或者是DOM元素
        * `data`:模型数据modal, 值是一个对象
    - 插值表达式
        * 将数据填充到HTML标签中
        * 可以做基本的计算，字符串拼接
    - 编译过程
        * 写好的vue代码浏览器并不认识
        * 通过vue.js库文件编译成原生js代码
        * 浏览器就可以工作

### 模板语法
+ 前端渲染方式
    - js字符串拼接：不同的人有不同的代码风格
    - 模板引擎：统一了风格，但没有事件处理机制
    - vue模板语法
+ 模板语法分类
    - 数据绑定
    - 事件绑定
    - 属性绑定
    - 样式绑定
    - 分支循环结构
#### 数据绑定
+ 数据响应式
    - `UI = render(state)`
    - 模型数据的变化导致页面内容的变化
+ 数据绑定
    - 将模型数据填充到页面标签中
    - 绑定的数据都默认是响应式的
+ 指令的本质：自定义属性
+ 指令的格式：以v-开头
+ `v-cloak`
    - 作用：解决插值表达式的闪动问题
    - 问题：标签中的插值表达式在页面展示的时候会有闪动。
    - 原因：{{}}大括号先展示在页面上，后再经过vue.js编译迅速改变为对应的model数据，所以会闪动
    - 解决方法：使用`v-cloak`指令
    - v-cloak指令使用方法:
        1. 提供样式
        ```css
            [v-cloak]{
                display: none;
            }
        ```
        2. 在插值表达式所在的标签中添加v-cloak指令
        ```html
            <p v-cloak>{{msg}}</p>
        ```
    - 原理：先通过样式隐藏内容，然后再内存中进行值的替换，替换完成之后在显示最终的结果
+ 单向数据绑定指令
    - 数据的变化驱动页面内容的变化 model -> view
    - `{{}}` 插值表达式
    - `v-text`填充纯文本
        * 相比插值表达式更加简洁
        * 没有插值表达式的闪烁问题
        * 不能渲染HTML文本，只能是纯文本
        * 文本节点全替代，不可拼接计算
        * 用法：`v-text="model"`
    - `v-html`填充HTML片段
        * 存在安全问题,容易导致XSS跨站脚本攻击
        * 使用原则：本网站内部数据可用，第三方跨域数据不可用（不可信任可能会被攻击）
        * 用法：`v-html="model"`
    - `v-pre`填充原始信息
        * 显示原始信息，跳过vue的编译过程
        * 比如填充的数据是{{msg}}页面显示就是{{msg}}而不是模型数据
        * 用法：标签上加上`v-pre`指令即可
    - `v-once`数据只编译一次，之后失去数据响应式的能力
        * 即之后模型数据的修改，不会改变页面标签的值
        * 使用：`<p v-once>{{msg}}</p>`
        * 应用场景：数据赋值之后不需要修改，可以使用v-once提高性能
+ 双向数据绑定指令
    - 数据的变化驱动页面内容的变化,页面内容的变化也驱动数据的变化 model <-> view
    - `v-model` 实现表单元素的数据双向绑定
        * 指定只对表单元素生效
        * model数据的变化会导致页面内容的变化
        * 由于是表单元素，所以表单元素可以主动变化，驱动model数据的变化
        * 用法：`<input v-model="msg">`
    - 底层实现
        * `<input v-bind:value="msg" v-on:input="msg=$event.target.value">`
        * v-model的本质就是使用v-bind对value属性绑定读取vm实例中的模型数据，使用v-on:input绑定输入事件，将dom元素输入的值写入vm实例中的模型数据
+ MVVM设计思想
    - 分而治之：把不同的代码放在不同模块，在结合起来
    - M model
    - V view
    - VM ViewModel

    ![avatar](./image/MVVM.png)

#### 事件绑定
+ `v-on`指令实现事件绑定
    - `<button v-on:click="num++"></button>`
    - 使用：`v-on:evenName="handle"`
    - 简写：`@click="handle"`
    - 事件处理函数
        * 事件处理函数必须定义在vm实例的methods属性当中
        * methods方法里的this指向的是vm实例对象`console.log(this == vm)`
        * 函数参数
            1. `fun` 不带括号不带实参，则函数的第一个形参默认是event事件对象
            2. `fun(1,2,$event)` 带参数，最后一个实参是$event表示事件对象,函数形参按顺序接收e.target指的是触发事件的dom对象

    ```html
        <div id='app'>
            <p>{{num}}</p>
            <button v-on:click="num++">点我+1</button>
            <button @click="add">点我+1 add</button>
            <button @click="minus">点我-1 minus</button>
            <button @click="handle(1,'rr', $event)">参数传递</button>
        </div>

        <script>
            var vm = new Vue({
            el: '#app',  
            data: {
                num : 0,
            }, 
            methods : {
                add(){
                    this.num++;
                    console.log(this == vm)
                },
                minus(event){
                    this.num--;
                    console.log(event)
                },
                handle(a,b,e){
                    console.log(a,b,e.target)
                }
            }
            });
        </script>
    ```
+ 事件修饰符
    - `.stop` 停止冒泡
        * `@click.stop` 可以替代event.stopPropagation()
    - `.prevent` 阻止默认行为
        * a标签的点击跳转到href地址的默认的行为
        * form表单submit按钮点击提交表单的默认行为
        * `<a @click.prevent href=""></a>`不写事件处理函数就是单纯的阻止默认事件
        * `<button @click.prevent type="submit"></button>`
    - `@keyup.enter="handle"` 回车键抬起事件
        * 案件修饰符的本质enter其实就是一个code
    - `@keyup.delete="handle"` 删除键抬起事件
    - `Vue.config.keyCodes.a = 65` 自定义按键修饰符：名字，按键码

#### 属性绑定
+ `v-bind`指令实现属性绑定
    - 给标签的属性值绑上模型数据，实现标签属性值的动态变化
    - 使用：`<a v-bind:href=""></a>`
    - 简写：`<a :href=""></a>`

#### 样式绑定
##### class样式处理：对象语法、数组语法
+ 对象语法
    - `<div v-bind:class="{ className1 : isActive1, className2 : isActive2 }"></div>`
    - className1 isActive1控制样式类的显隐变量，在data里面定义的，值为true或false
    ```html
    <style>
      .active{
          border: 1px solid pink;
          width: 100px;
          height: 100px; 
      }
      .yellow{
          background-color:dodgerblue;
      }
    </style>
    <div v-bind:class="{active : isActive1, yellow: isActive2}"></div>
    <button v-on:click="isActive = !isActive">按钮</button>

    <script>
        var vm = new Vue({
        el: '#app',  
        data: {
            isActive1 : true,
            isActive2 : true,
        }, 
    });
  </script>
    ```
+ 数组语法
    - `<div v-bind:class="[className1, className2]"></div>`
    - className1 className2都是变量，在data里定义的，值是css样式类名
    - `style1: 'yellow'`
    - className1是变量，那么修改它就变得很容易了
    ```html
    <div v-bind:class="[activeClass, errorClass]"></div>
    <button v-on:click="handle">按钮</button>
    <script>
    var vm = new Vue({
      el: '#app',  
      data: {
          activeClass: 'active',
          errorClass: 'yellow'
      }, 
      methods : {
          handle(){
              this.activeClass = '';
              this.errorClass = '';
          }
      } 
    });
  </script>
    ```
+ 结合使用
    - `<div v-bind:class="[style1, style2, {className : isActive}]"></div>`
    - 数组内部也可以追加对象，对象内部还是css类名：boolean的形式出现，外部是变量名:'className'的形式
    ```html
    <style>
      .active{
          border: 1px solid pink;
          width: 100px;
          height: 100px; 
      }
      .yellow{
          background-color:dodgerblue;
      }
      .mix{
          color :greenyellow;
      }
    </style>
    <div v-bind:class="[activeClass, errorClass, {mix : isMixed}]">mix</div>
    <button v-on:click="handle1">按钮</button>
    <script>
    var vm = new Vue({
        el: '#app',  
        data: {
            activeClass: 'active',
            errorClass: 'yellow',
            isMixed : true
        }, 
        methods : {
            handle1(){
                this.isMixed = !this.isMixed;
            },
        } 
    });
    </script>
    ```
+ class绑定的简化操作
    - 为什么简化：dom里面class属性写太多，可读性不好
    - 对象语法简化：class属性中的对象抽离出来变为一个对象，变量一脸定义css类名:true
    - 数组语法简化：class属性的数组抽离为一个数组，数组的元素是css样式名['style1', 'style2']
    ```html
    <style>
      .active{
          border: 1px solid pink;
          width: 100px;
          height: 100px; 
      }
      .yellow{
          background-color:dodgerblue;
      }
    </style>
    <div v-bind:class="objClass"></div>
    <button v-on:click="handle2">按钮</button>

    <div v-bind:class="arrClass"></div>
    <button v-on:click="handle3">按钮</button>

    <script>
    var vm = new Vue({
      el: '#app',  
      data: {
        objClass: {
            active: true,
            yellow: true
        },
        arrClass :['active', 'yellow']
      }, 
      methods : {
          handle2(){
              this.objClass.active = false;
          },
          handle3(){
              this.arrClass.splice(1,1);
          },
      } 
    });
    </script>
    ```
+ 默认的class会保留
    - `<div class="base" v-bind:class="objClass"></div>`
    - 最后默认的class属性会被保留，最终渲染出来三个类base active yellow
##### style样式处理
+ 对象语法
    - `<div v-bind:style="{border: borderStyle, width: widthStyle}"></div>`
    - key是标准的css样式名，value是变量
    - 同样是可以简化的
    ```html
        <div v-bind:style="{border: borderStyle, width: widthStyle, height: heightStyle}"></div>
        <button v-on:click="handle">按钮</button>

        <div v-bind:style="objClass"></div>
        <script>
        var vm2 = new Vue({
            el: '#app2',
            data: {
                borderStyle: '1px solid skyblue',
                widthStyle: '100px',
                heightStyle: '100px',

                objClass : {
                    border: '1px solid skyblue', 
                    width: '100px', 
                    height: '100px'
                }
            },
            methods: {
                handle() {
                    this.heightStyle = '200px';
                }
            }
        });
    </script>
    ```
+ 数组语法
    - `<div v-bind:style="[baseStyle, overrideStyle]"></div>`
    - baseStyle是类似于{border: '1px solid red'}的样式对象
    - 后面可追加多个对象，后者覆盖前者的样式
    ```html
    <div v-bind:style="[objClass, overrideClass]"></div>
    <script>
        var vm2 = new Vue({
            el: '#app2',
            data: {
                objClass : {
                    border: '1px solid skyblue', 
                    width: '100px', 
                    height: '100px'
                },
                overrideClass: {
                    border: '1px solid orange', 
                    backgroundColor: 'blue'
                }
            },
        });
    </script>
    ```

#### 分支循环结构
+ 分支结构
    - `v-if`
    - `v-else-if`
    - `v-else`
    - `v-show`
    - v-if可以单独使用，v-if + v-else-if可以，v-if + v-else可以，v-if v-else-if v-else 可以结合起来用
        * if组合共同特点是最终渲染出一个节点
    - v-show的使用`<div v-show="flag">测试v-show</div>` 
        * v-show会渲染dom,不显示的时候只是加了一个display:none属性
    - v-if和v-show的区别
        * v-if控制元素是否渲染，性能开销比较大
        * v-show通过display属性控制元素是否显示，一定会渲染元素，性能开销小
        * 如果需求是频繁变换元素的显隐，推荐使用v-show
    - 代码
        ```html
        <body>
        <div id='app'>
            <div v-if="score >= 90">优秀</div>
            <div v-else-if="score<90 && score >= 80">良好</div>
            <div v-else-if="score<80 && score >= 60">及格</div>
            <div v-else>较差</div>
            <div v-show="flag">测试v-show</div>
            <button v-on:click="flag=!flag">按钮</button>
        </div>

        <script>
            var vm = new Vue({
            el: '#app',  
            data: {
                score : 80,
                flag: false
            }, 
            methods : {} 
            });
        </script>
        </body>
        ```
        ![avatar](./image/v-if.png)
        ![avatar](./image/v-show.png)
+ 循环结构
    - `v-for`指令遍历数组
        * `<li v-bind:key="item.id" v-for="(item, index) in list">{{item + '---' + index}}</li>`
        * item是数组元素，index是数组索引，名字自定义
        * key帮助vue区分不同的兄弟节点,从而提高性能
        ```html
            <p>水果列表</p>
            <ul>
            <li v-bind:key="item.id" v-for="(item, index) in fruits">{{item.ename + '---' + item.cname + '---' + index}}</li>
            </ul>
            <script>
            var vm2 = new Vue({
                el : '#app2',
                data : {
                    fruits: [{
                        id: 1,
                        cname : '苹果',
                        ename : 'apple'
                    },{
                        id: 2,
                        cname : '芒果',
                        ename : 'mango'
                    },{
                        id:3,
                        cname : '草莓',
                        ename : 'strawbarrie'
                    },]
                }
            })
            </script>
        ```
    - `v-for`指令遍历对象
        * `<li v-for="(value, key, index) in obj">{{value + '---' + key+  '---' + index}}</li>`
        * key是对象的键，value是值，index索引，名字自定义
    - `v-if v-for`结合使用
        * `<li v-if="value==23" v-for="(value, key, index) in obj">{{value + '---' + key+  '---' + index}}</li>`
        * 只有满足了value==13的kv对才会被渲染出来
        ```html
            <p>家庭列表</p>
            <ul>
            <li v-if="key=='child'" v-for="(value,key,index) in family">{{value + '--' + key + '--' + index}}</li>
            </ul>
            <script>
            var vm2 = new Vue({
                el : '#app2',
                data : {
                    family: {
                    mama : 'zhr',
                    papa : 'wjg',
                    child : 'whm'
                    }
                },
            })
        </script>
        ```

### 常用特性
+ 常用特性
    - 表单操作
    - 自定义指令
    - 计算属性
    - 过滤器
    - 侦听器
    - 生命周期
    - 数组响应式
    - ref引用
#### 表单操作
+ 表单输入域类型
    - input 单行文本
    - textarea 多行文本
    - select 下拉单选、多选
    - radio 单选框
    - checkbox 多选框
+ 表单操作注意
    - `<button type="submit" v-on:click.prevent="handle">提交</button>`
        * form表单提交按钮的默认行为是点击提交，如果表单没有action就会自动刷新本页面提交到自己，一般是手动js处理提交逻辑，所以需要阻止默认行为
    - `radio`的两个选项v-model绑定的是同样的变量
    - `checkbox`的多个选项绑定的也是一样的变量，且为一个数组
    - `select`单选绑定的是一个值，多选需要在select加上multiple属性，v-model绑定的值也得是一个数组
    ```html
    <div id='app'>
      <form action="">
        <div>
            <span>姓名</span>
            <input type="text" v-model="name">
        </div>
        <div>
            <span>性别</span>
            <input type="radio" name="gender" value='1' v-model="gender">男
            <input type="radio" name="gender" value='0' v-model="gender">女
        </div>
        <div>
            <span>兴趣爱好</span>
            <input type="checkbox" name="hobby" value='1' v-model="hobby">游泳
            <input type="checkbox" name="hobby" value='2' v-model="hobby">篮球
            <input type="checkbox" name="hobby" value='3' v-model="hobby">电竞
            <input type="checkbox" name="hobby" value='4' v-model="hobby">动漫
        </div>
        <div>
            <span>职业</span>
            <select name="job" v-model="job" multiple>
                <option value="1">软件工程师</option>
                <option value="2">金融</option>
                <option value="3">医生</option>
                <option value="4">律师</option>
            </select>
        </div>
        <div>
            <span>个人简介:</span><br>
            <textarea name="introduce" v-model="introduce" cols="30" rows="3"></textarea>
        </div>
        <button type="submit" v-on:click.prevent="handle"></button>
      </form>
  </div>

  <script>
    var vm = new Vue({
      el: '#app',  
      data: {
          name : '',
          gender : '1',
          hobby : ['2','3'],
          job: [],
          introduce : ''
      }, 
      methods : {
          handle(){
              console.log(this.data);
          }
      } 
    });
  </script>
    ```
+ 表单域修饰符
    - number 转化为数值
        * 语法：`<input v-model.number="data">`
        * input域的默认类型是字符串，+代表的运算会被默认理解为字符串拼接
        * 修饰为数值以后+代表的就是数值相加
    - trim 去掉首尾空格
        * 语法：`<input v-model.trim="data">`
        * input输入域拿到的值是去掉前后空格的字符串
    - lazy 将input事件转化为change事件
        * `<input type="text" v-model="info">`模型数据对输入域的监听是基于input事件的，每次输入一个字符就会触发事件
        * `<input type="text" v-model.lazy="info">`.lazy将监听事件从input改为change事件，当失去焦点的时候才触发事件
        * 说白了就是本来是输入任何的内容模型数据都立马改变，lazy之后是input失去焦点的时候才改变
    ```html
    <div id='app'>
      <!-- <input type="text" v-model="num"> -->
      <input type="text" v-model.number="num">
      <button v-on:click="sum">测试number修饰符</button>

      <input type="text" v-model.trim="info">
      <button v-on:click="trim">测试trim修饰符</button>

      <input type="text" v-model="info">
      <input type="text" v-model.lazy="info">
      <p>{{info}}</p>
      <button v-on:click="trim">测试lazy修饰符</button>
  </div>

  <script>
    var vm = new Vue({
      el: '#app',  
      data: {
          num : '',
          info: '',
      }, 
      methods : {
          sum(){
              console.log(this.num + 12);
          },
          trim(){
                console.log(this.info)
          }
      } 
    });
  </script>
    ```
#### 自定义指令
+ 原因：内置指令不满足需求
+ 语法：
```html
    <script>
        Vue.directive('focus',{
            inserted: function(el){
                //获取元素的焦点
            el.focus();
        }
    });
    </script>
 <!-- 使用： -->
    <input type="text" v-focus>
```
+ 带参数的自定义指令
    - 一个指令定义对象可以提供如下几个钩子函数 (均为可选)：
        * bind：只调用一次，指令第一次绑定到元素时调用。在这里可以进行一次性的初始化设置。
        * inserted：被绑定元素插入父节点时调用 (仅保证父节点存在，但不一定已被插入文档中)。
        * update：所在组件的 VNode 更新时调用，但是可能发生在其子 VNode 更新之前。指令的值可能发生了改变，也可能没有。但是你可以通过比较更新前后的值来忽略不必要的模板更新 (详细的钩子函数参数见下)。
    - 指令钩子函数会被传入以下参数：
        * el：指令所绑定的元素，可以用来直接操作 DOM 。
        * binding：一个对象，包含以下属性：
            + name：指令名，不包括 v- 前缀。
            + value：指令的绑定值，例如：v-my-directive="1 + 1" 中，绑定值为 2。
            + oldValue：指令绑定的前一个值，仅在 update 和 componentUpdated 钩子中可用。无论值是否改变都可用。
            + expression：字符串形式的指令表达式。例如 v-my-directive="1 + 1" 中，表达式为 "1 + 1"。
            + arg：传给指令的参数，可选。例如 v-my-directive:foo 中，参数为 "foo"。
            + modifiers：一个包含修饰符的对象。例如：v-my-directive.foo.bar 中，修饰符对象为 { foo: true, bar: true }。
        * vnode：Vue 编译生成的虚拟节点。移步 VNode API 来了解更多详情。
        * oldVnode：上一个虚拟节点，仅在 update 和 componentUpdated 钩子中可用。
    - 典型案例
    ```html
        <script>
        Vue.directive('color',{
            bind : function(el,binding){
                el.style.backgroundColor = binding.value.color;
            }
        });
        var vm = new Vue({
        el: '#app',  
        data: {
            msg : {
                color : 'orange'
            }
        }, 
        methods : {} 
        });
        </script>
        <!-- 使用： -->
        <input type="text" v-color="msg">
    ```
+ 局部自定义指令
    - 每个vue实例是一个组件，组件内部可以定义只对该组件生效的自定义指令
    - 全局指令则是对所有vm实例生效
    - 只需在vm实例对象的参数选项中加入`directives`属性即可
    - 语法：
    ```javascript
        var vm = new Vue({
            el: '#app',  
            directives : {
                color : {
                    bind : function(el, binding){
                        el.style.backgroundColor = binding.value.color;
                    }
                },
                focus: {
                    inserted(el){
                        el.focus();
                    }
                }
            } 
        });
    ```
#### 计算属性
+ 原因：模板中的表达式，计算逻辑可能比较复杂，使用计算属性能让模板更简洁
+ 示例：需要将字符串反转`<p>{{msg.split('').reverse().join('')}}</p>`
+ 语法：vm实例添加computed参数
```javascript
    computed : {
        reverseMsg : function(){
            return this.msg.split('').reverse().join('');
        }
    }
```
+ 注意：
    - 使用的时候直接写上计算属性的函数名即可，就当普通属性一样用
    - 计算属性中引用的data中的数据发生变化时，计算属性会跟着变化
+ computed和methods的对比
    - computed是基于依赖数据进行缓存的
        * 依赖数据不变则使用缓存数据，变化时重新计算
    - methods不缓存
        * 每次调用都会执行函数计算
    - 计算属性的缓存机制在计算比较耗时的计算的时候就能节省性能
    - 案例：
        * 注意：{{}}插值表达式中间可以放表达式，{{fun()}}函数调用也属于表达式
        ```html
        <div id='app'>
            <p>{{msg}}</p>
            <p>{{reverseMsg}}</p>
            <p>{{reverseMsg}}</p>
            <p>{{reverseMsgMethod()}}</p>
            <p>{{reverseMsgMethod()}}</p>
        </div>

        <script>
            var vm = new Vue({
            el: '#app',  
            data: {
                msg : 'nihao',
            }, 
            methods : {
                reverseMsgMethod(){
                    console.log('methods');
                    return this.msg.split('').reverse().join('');
                }
            },
            computed : {
                reverseMsg : function(){
                    console.log('computed');
                    return this.msg.split('').reverse().join('');
                }
            }
            });
        </script>
        ```
        ![avatar](./image/computed对比.png)
#### 侦听器
+ 当data数据变化时，会触发侦听器绑定的方法
+ 应用在异步或执行开销较大的操作上
+ 语法：
```javascript
watch : {
    name : function(newVal, oldVal){
        //执行某方法
    }
}
```
+ 注意：
    - watch监听的是在data中已有的数据，所以方法名必须和data属性一致，computed则是新的计算属性，方法名可以新定义
+ 案例：实现用户名在失去焦点的时候触发用户名异步验证
```html
    <div id='app'>
      <input type="text" v-model.lazy="name">
      <span>{{tip}}</span>
  </div>
  <script>
    var vm = new Vue({
      el: '#app',  
      data: {
          name : '',
          tip: ''
      }, 
      watch: {
        name : function(newVal){
            this.checkName(newVal);
            this.tip = '正在验证，请稍后...';
        }
      },
      methods : {
        checkName(val){
            //使用定时任务任务模拟ajax异步调用
            setTimeout(val => {
                if(val == 'admin'){
                    this.tip = '该用户名已被占用'
                }else{
                    this.tip = '该用户名可以使用'
                }
            },2000);
        }
      } 
    });
  </script>
```
#### 过滤器
+ 作用：格式化数据，比如将字符串处理为首字母大写，日期字符串处理为指定格式
+ 语法：
```javascript
    Vue.filter('dateFormat', function(value){ //value是被过滤的原数据
        // 过滤器逻辑，返回最终的结果
        return ...
    });
    //使用: 插值表达式、属性绑定的值
    <div>{{date | dateFormat | upper}}</div>
    <div v-bind:id="id | idFilter"></div>

    //局部过滤器
    filters : {
        upper : function(val){
            return val[0].toUpperCase() + val.slice(1);
        }
    }
```
+ 带参数的过滤器
    - 第一个参数始终是被过滤的元数据
    - 参数是从第二个开始的
    - 参数传递 `date | format(arg)`
    - 案例：
    ```html
    <div>{{date | format('yyyy-MM-dd hh:mm')}}</div>
    <script>
    Vue.filter('format', function(value, arg){ 
        function dateFormat(value, fmt) {
            var date = new Date(value);
            var o = {
                    "M+": date.getMonth() + 1, //月份
                    "d+": date.getDate(), //日
                    "h+": date.getHours(), //小时
                    "m+": date.getMinutes(), //分
                    "s+": date.getSeconds(), //秒
                    "q+": Math.floor((date.getMonth() + 3) / 3), //季度
                    "S": date.getMilliseconds() //毫秒
            };
            if (/(y+)/.test(fmt))
                fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
            for (var k in o)
                if (new RegExp("(" + k + ")").test(fmt))
                    fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
            return fmt;
        }
        return dateFormat(value, arg);
    });
    </script>
    ```
    ![avatar](./image/时间格式化规则.png)
#### 生命周期
+ 主要阶段
    - 挂载：初始化相关属性
        * beforeCreate
        * created
        * beforeMount
        * mounted ※: 页面中已经有模板内容了，使用频度高，一般用于从后台获取数据，填充到页面
    - 更新：元素或组件的变更操作
        * beforeUpdate
        * updated
    - 销毁：销毁相关属性
        * beforeDestroy
        * destroyed
+ 案例
    ```html
    <div id='app'>
      <p>{{msg}}</p>
      <button v-on:click="update">更新</button>
      <button v-on:click="destroy">销毁</button>
  </div>

  <script>
    var vm = new Vue({
      el: '#app',  
      data: {
          msg : '生命周期'
      }, 
      methods : {
          update(){
              this.msg = '更新';
          },
          destroy(){
              this.$destroy();
          }
      },
      beforeCreate(){
          console.info('beforeCreate');
      },
      created(){
          console.info('created');
      },
      beforeMount(){
          console.info('beforeMount');
      },
      mounted(){
          console.info('mounted');
      },
      beforeUpdate(){
          console.info('beforeUpdate');
      },
      updated(){
          console.info('updated');
      },
      beforeDestroy(){
          console.info('beforeDestroy');
      },
      desdroy(){
          console.info('destroy');
      }
    });
  </script>
    ```
    ![avatar](./image/生命周期函数.png)
#### 数组响应式
+ 数组操作本来不是响应式的，当数组内容变化的时候页面不会变化
+ vue将数组的一部分api包装成了响应式的,数组变化会导致页面变化，叫变异方法
+ 变异方法：修改原数组，数组的变化会直接响应式的反应在页面上
    - push()
    - pop()
    - shift()
    - unshift()
    - splice()
    - sort()
    - reverse()
+ 替换数组：生成新数组，不影响原数组，需要将生成的新数组赋值给原数组
    - filter()
    - concat()
    - slice()截取数组
+ 数组索引修改
    - 通过数组索引修改数组是不具备相应式的
    - 实现响应式
        * `Vue.set(vm.item, index, newVal)`
        * `vue.$set(vm.item, index, newVal)`
        * vm.item 数组 index 索引 newVal 新值
+ 案例
```html
<div id='app'>
    <ul>
        <li v-bind:key="index" v-for="(item,index) in fruits">{{item}}
            <button @click="update(index)">修改</button>
        </li>
    </ul>
    <input type="text" v-model="name">
    <button @click="add">添加</button>
    <button @click="remove">删除</button>
  </div>

  <script>
    var vm = new Vue({
      el: '#app',  
      data : {
        name: '',
        fruits: ['苹果', '芒果','草莓'],
      },
      methods : {
          add(){
              //变异数组方法有响应式
              this.fruits.push(this.name);
          },
          remove(){
            //this.fruits.slice(0,1);  数组替换方法没有响应式
            this.fruits = this.fruits.slice(0,1);
          },
          update(index){
              //直接通过索引修改数组是不具备响应式的
              //this.fruits[index]['name'] = '修改水果';
              Vue.set(this.fruits, index, '修改水果');
              this.$set(this.fruits, index, '修改水果');
          }
          
      } 
    });
  </script>
```
#### ref引用
+ 在dom元素上加上`ref="引用名"`属性
+ `vm.$refs.引用名`可以获取dom元素实例
+ 一般引用名会以Ref结尾

### 组件化开发
+ 组件化开发思想
+ 组件注册方法
+ 组件之间交互方式
+ 组件插槽用法
#### 组件化开发思想
+ 标准
+ 分治
+ 重用
+ 组合
+ 组件化规范Web Components
    - 问题：多次使用组件可能导致js css冲突
    - 使用封装好功能的自定义标签解决问题
    - vue部分实现了该规范
+ 核心理念：把不同的功能封装在不同的组件中
#### 组件注册
+ 语法：
```html
<div>
    <组件名称></组件名称>
</div>
<script>
    Vue.component('组件名称' , {
        data : 组件数据,
    template : 组件模板
});
</script>
```
+ 注意：
    - component api的第二个参数是一个对象{}
        * data属性是一个函数
            + 返回一个对象return { } 
            + 每个组件内部形成闭包，所以不同组件有独立的变量
        * template属性决定组件的html模板
            + 模板必须是单个的根元素`√ <div></div>`  `× <div>1</div><div>2</div>`
            + 类似于vm实例指定的el是一个html里的一个根元素
            + 模板属性可以是模板字符串，提高可读性
        * 组件可以有自己的自定义指令、侦听器、计算属性、方法
    - 组件是可重用的，重用的各个组件之间数据相互独立
    - vm实例本身也是一个组件，所以放在根组件里面的组件和vm组件形成了父子关系
    - 组件命名方式：推荐短横线命名，不用驼峰是因为html标签大小写不敏感
+ 实例
```html
  <div id='app'>
        <button-counter></button-counter>
        <button-counter></button-counter>
        <button-counter></button-counter>
  </div>

  <script>
    Vue.component('button-counter',{
        data : function(){
            return {
                count : 0
            }
        },
        template : `
            <div>
                <input type="text" v-model="count">
                <button @click="add">点击{{count}}次</button>
            </div>
        `,
        methods : {
            add(){
                this.count++;
            }
        }
    })

    var vm = new Vue({
      el: '#app',  
    });
  </script>
```
+ 局部组件注册
    - 语法：
    ```javaScript
    var ComponentA = { /* 同全局注册api的第二个参数 */ }
    var ComponentB = { /* 同全局注册api的第二个参数 */ }
    var ComponentC = { /* 同全局注册api的第二个参数 */ }
    var vm = new Vue({
        el: '#app',
        components : {
            'component-a' : ComponentA,
            'component-b' : ComponentB,
            'component-c' : ComponentC
        }
    })
    ```
    - 注意：
        * 局部组件只能在注册他的父组件中使用
#### 组件间数据交互
+ 父组件通过属性给子组件传值
    - 在子组件标签中添加自定义属性
    - 可以传递写死的数据，也可以通过v-bind属性绑定传递灵活的模型数据
    ```html
    <button-counter content="写死的数据" :title="msg"></button-counter>
    ```
    - 子组建内部通过props接受传递进来的数据
        ```javascript
        Vue.component('button-counter', {
            props : ['title', 'content'],
            template : '<div>{{title + "---" + content}}</div>'
        })
        ```
    - 注意：
        - props中接收的属性名如果是驼峰形式的，那么在html标签中传递的属性必须是短横线连接的
            * `<button-counter :parent-content="msg"></button-counter>`
            * 字符串形式的模板中没有这个限制
    - props属性值的类型
        * String
        * Number
        * Boolean
        * Array
        * Object
        * 代码示例
        ```html
            <div id='app'>
            <!-- <my-com :pstr="pstr" pnum="12" pboo="true"></my-com> -->
            <my-com :pstr="pstr" :pnum="12" :pboo="true" :parr="parr" :pobj="pobj"></my-com>
        </div>

        <script>
            Vue.component('my-com',{
                props : ['pstr', 'pnum', 'pboo', 'parr', 'pobj'],
                template : `
                    <div>
                        <p>{{pstr}}</p>
                        <p>{{typeof pnum}}</p>
                        <p>{{typeof pboo}}</p>

                        <ul>
                            <li v-for="item in parr">{{item}}</li>
                        </ul>

                        <p>{{pobj.name}}</p>
                        <p>{{pobj.age}}</p>
                    </div>
                    
                `
            })
            var vm = new Vue({
            el: '#app',  
            data: {
                pstr: 'msg',
                parr: ['apple', 'orange', 'mango'],
                pobj: {
                    name : 'hm',
                    age : 18
                }
            }, 
            methods : {} 
            });
        </script>
        ```
        * 示例解析
            + 对于number类型和boolean类型的数据如果是写死的`pnum="12"`
            + 标签中的属性pnum进行了v-bind属性绑定`v-bind:pnum="12"`就会解析为number可直接拿去计算，`pboo="true"`解析为Boolean类型，如果不进行v-bind绑定就是默认string类型
    - props传递数据的原则
        * 单向数据流：父向子传数据，子不要去修改它，只是去读取它 
+ 子组件通过自定义事件向父组件传值
    - 子组件通过触发自定义事件想父组件传递信息
    ```html
    <!-- arg是子组件触发事件时携带的参数 -->
    <button v-on:click="$emit('enlarge-text', arg)">点击放大字体<button>
    ```
    - 父组件监听事件绑定事件处理函数
    ```html
    <!-- $event是子组件传递给父组件的值 -->
    <menu-item v-on:enlarge-text="handle($event)"><menu-item>
    ```
    - 实例
    ```html
    <div id='app'>
    <li v-bind:style="{fontSize : fontSize + 'px'}">apple</li>
    <my-com v-on:enlarge-text="handle($event)"></my-com>
  </div>

  <script>
      Vue.component('my-com', {
          template : `
            <button v-on:click="$emit('enlarge-text', 3)">点击放大字符</button>
          `
      })
    var vm = new Vue({
      el: '#app',  
      data: {
          fontSize : 12
      }, 
      methods : {
          handle(val){
            this.fontSize += val;
          }
      } 
    });
  </script>
    ```
+ 非父子组件间通信
    - 单独的事件中心管理组件
    ```javascript
        var eventHub = new Vue();
    ```
    - 监听事件与销毁事件
    ```javascript
        eventHub.$on('eventName', handle);
        eventHub.$off('eventName');
    ```
    - 触发事件
    ```javascript
        eventHub.$emit('eventName', arg);
    ```
    ![avatar](./image/非父子组件通信.png)
    - 实例：兄弟组件互相触发对方的事件
    ```html
    <div id='app'>
      <button v-on:click="handle">点击销毁事件</button>
      <tom></tom>
      <jerry></jerry>
    </div>

    <script>
    //定义一个事件中心管理组件
    var hub = new Vue();
    //定义两个兄弟组件
    Vue.component('tom', {
        data : function(){
            return{
                num : 0
            }
        },
        template: `
        <div>
            <p>Tom:{{num}}</p>
            <button v-on:click="handle">点我jerry+2</button>
        </div>
        `,
        methods: {
            handle(){
                //点击触发兄弟的事件
                hub.$emit('jerry-event', 2)
            }
        },
        mounted : function(){
            //在模板挂载之后进行事件的监听
            hub.$on('tom-event', val => {
                this.num += val;
            })
        }
    })
    Vue.component('jerry', {
        data : function(){
            return{
                num : 0
            }
        },
        template: `
        <div>
            <p>Jerry:{{num}}</p>
            <button v-on:click="handle">点我tom+4</button>
        </div>
        `,
        methods: {
            handle(){
                //点击触发兄弟的事件
                hub.$emit('tom-event', 4)
            }
        },
        mounted : function(){
            //在模板挂载之后进行事件的监听
            hub.$on('jerry-event', val => {
                this.num += val;
            })
        }
    })
    var vm = new Vue({
      el: '#app',  
      data: {}, 
      methods : {
          handle(){
              hub.$off('tom-event');
              hub.$off('jerry-event');
          }
      } 
    });
    </script>
    ```
+ 组件插槽
    - 普通插槽
        * 作用：父组件向子组件传递模板内容
        * 语法：
        ```javascript
        //子组件
        Vue.component('alert-box', {
            template : `
                <div>
                    <strong>ERROR:</strong>
                    <slot></slot>
                </div>
            `
        })
        //父组件
        <alert-box>有bug!</alert-box>
        ```
        * 注意：
            + `<slot></slot>`相当于子组件预留的一个位置
            + 父组件在两个标签中间传递插槽模板内容
            + 父组件在两个标签中间如果不传递内容，就会使用slot中间的默认内容
        * 代码
        ```html
        <div id='app'>
            <alert-box>有bug</alert-box>
            <alert-box>嘻嘻嘻</alert-box>
            <alert-box></alert-box>
        </div>

        <script>
            Vue.component('alert-box', {
                template : `
                    <div>
                        <strong>ERROR:</strong>
                        <slot>默认内容</slot>
                    </div>
                `
            })
            var vm = new Vue({
            el: '#app',  
            data: {}, 
            methods : {} 
            });
        </script>
        ```
    - 具名插槽
        * `<slot name="footer"></slot>`子组件的占位符slot标签有name名字
        * 父组件再给子组件传递模板的时候通过`slot="footer"`属性来和子组件的占位符匹配
        * 父组件的slot属性可以写在`<template slot="footer">`里面来包裹模板内容
        * 名字不匹配的就进入默认占位符`<slot></slot>`
        * 代码
        ```html
        <div id='app'>
            <base-layout>
                <template slot="header">
                    <p>我是header插槽</p>
                </template>
                <template>
                    <p>我是main插槽</p>
                </template>
                <p slot="footer">我是footer插槽</p>
            </base-layout>
        </div>

        <script>
            Vue.component('base-layout', {
                template: `
                    <div>
                        <div class="header">
                            <slot name="header"></slot>
                        </div>
                        <div class="main">
                            <slot></slot>
                        </div>
                        <div class="footer">
                            <slot name="footer"></slot>
                        </div>
                    </div>
                `
            });
            var vm = new Vue({
            el: '#app',  
            data: {}, 
            methods : {} 
            });
        </script>
        ```
    - 作用域插槽
        * 应用场景：父组件对子组件的内容加工处理
        * 父组件可以通过slot-scope属性获取子组件的数据，进行处理
        * 代码: slot-scope 2.6.0废弃
        ```html
        <div id='app'>
            <app-com :list="list">
                <template slot-scope="data">
                        <span v-if="data.info.id == 2" style="color:orange">{{data.info.name}}</span>
                        <span v-else >{{data.info.name}}</span>
                </template>
            </app-com>
        </div>

        <script>
            Vue.component('app-com', {
                props: ['list'],
                template: `
                    <div>
                        <ul>
                            <li v-for="item in list" :key="item.id">
                                <slot :info="item"></slot>
                            </li>
                        </ul>
                    </div>
                `
            })
            var vm = new Vue({
            el: '#app',  
            data: {
                list: [{
                    id: 1,
                    name: 'apple'
                },{
                    id: 2,
                    name: 'banana'
                },{
                    id: 3,
                    name: 'orange'
                }]
            }, 
            methods : {} 
            });
        </script>
        ``` 
#### 组件化的方式实现业需
+ 根据业务功能进行组建的划分
+ 详见购物车案例cart_case
    - 来自父组件的数据，父组件通过自定义属性绑定传递给子组件
    - 子组件触发事件，父组件来真实的更改自己的数据
    - 表单控件绑定的方法可以在末尾传递一个$event参数，通过$event.target.value获取表单控件的最新数据
    - 合理使用input blur change等事件

### 前后端交互
+ 前后端交互模式
+ Promise用法
+ 接口调用
    - fetch的用法
    - axios的用法
    - async/await的用法
#### URL地址格式
+ 格式`schma://host:port/path?query#fragment`
    - schema 协议：http https ftp
    - host 域名或IP
    - port 端口号，http默认端口号80，可省略，host和port可以且已确定互联网中的-某一台电脑的某一个应用程序
    - path 路径: abc/a/c 区分应用程序中不同的资源
    - query 查询参数：?name=whm&age=10
    - fragment 锚点：hash 用于定位页面的某个位置
+ Restful形式的url
    - 对应4中http请求方法: GET POST PUT DELETE
    - `http://asset.com/books` GET
    - `http://asset.com/books` POST
    - `http://asset.com/books/233` PUT
    - `http://asset.com/books/233` DELETE
#### Promise
+ ES6引入的语法，专门用来处理异步编程
+ 异步操作：定时任务、ajax、事件函数
+ 多次异步调用的依赖分析
    - 多次异步调用的结果，顺序不确定
    - 调用结果如果存在依赖，则需要异步嵌套
    - 异步的嵌套--》回调地狱
    ![avatar](./image/异步嵌套.png)
+ promise的好处
    - 解决了回调地狱的问题（为保证执行顺序，异步操作回调的多层嵌套）
    - 简介的API
+ promise的查看
    - `typeof Promise` function
    - `console.log(Promise)` 查看一些api
+ promise的基本用法
    - Promise构造函数实例化对象，构造函数的参数是一个函数，接收两个函数resolve、reject,构造函数体中处理异步操作
    - resolve、reject用来处理成功或失败两种情况，并通过p.then获取处理结果
    - 语法：
    ```javascript
    var p = new Promise((resolve, reject) => {
        //成功时调用 resolve()
        //失败时调用 reject()
    });
    p.then(ret => {
        //从resolve得到正常结果
    }, ret => {
        //从reject得到异常结果
    });
    ```
    - 代码：
    ```javascript
       //1.把promise的构造函数异步处理过程风在函数里
    function queryData(url){
        return new Promise((resolve, reject) => {
            //执行真正的ajax异步操作，并写好成功失败的承诺
            var xhr = new XMLHttpRequest();
            xhr.onreadystatechange = function(){
                if(xhr.readyState != 4) return;
                if(xhr.readyState == 4 && xhr.status == 200){
                    //处理正常情况的承诺
                    resolve(xhr.responseText);//传递操作结果
                }else{
                    //处理异常情况的承诺
                    reject(xhr.responseText);
                }
            }
            xhr.open('get', url);
            xhr.send(null);
        });
    }
    //2.执行函数，返回的promise实例拿来调用then方法，获取操作结果
    queryData('http://localhost:3000/data').then(ret => {
        console.log(ret);
    }, ret => {
        console.log('服务器出错了。淡定淡定。');
    });
    ```
+ promise处理多次异步调用
    - .then的链式调用,时的代码的主题风格变为线性的
    - .then的第二个参数可以省略，不处理失败时候的场景
    - 语法：
    ```javascript
    queryData().then(ret => {
        return queryData(); //返回一个promise实例p
    }).then(ret => {
        return queryData();
    }).then(ret => {
        return queryData();
    });
    ```
    - 解析：
        * 这里的每一个ret都是在接受上一次异步操作的结果
        * return queryData()是返回了一个新的promise实例
        * 每次都是一个新的promise实例在调用then方法
    - 实例：
    ```javascript
    queryData('http://localhost:3000/data')//第一次异步操作
    .then(ret => {
        console.log(ret); //获取第一次操作的结果并打印
        return queryData('http://localhost:3000/data1') //第二次异步操作
    })
    .then(ret => {//这里是第二次操作返回的promise实例调用的then方法
        console.log(ret); //获取第二次操作的结果并打印
        return queryData('http://localhost:3000/data2') //第三次异步操作
    })
    .then(ret => {//这里是第三次操作返回的promise实例调用的then方法
        console.log(ret); //获取第三次操作的结果并打印
        return '123'; //then参数中的函数返回的是一个具体的值
    })
    .then(ret => {//虽然上一个then不返回promise实例，但会默认产生一个promise实例对象来调用then保持链式调用
        console.log(ret); //接受值
    });
    ```
    - then方法参数中的函数返回值
        * 返回promise实例，就作为下一个then的调用者
        * 返回一个具体的值，返回值直接传递给下一个then,通过then函数中的参数接受。默认产生一个promise实例调用下一个then保证链式操作的延续。
+ promise常用API
    - 实例方法
        * p.then() 获取异步调用的结果
        * p.catch() 获取异常信息
        * p.finally() 不管成功与否都会执行（不是正式标准）
        * 语法
        ```javascript
        queryData()
        .then(ret => {
            //只有一个函数参数时，处理正确结果
        })
        .catch(ret => {
            //处理异常结果
        })
        .finally(ret => {
            //提示结束
            console.log('finished');
        });
        //等效于
        queryData()
        .then(ret => {
            //处理正确结果
        }, ret => {
            //处理异常结果
        })
        .finally(ret => {
            //提示结束
            console.log('finished');
        });
        ```
        * 代码
        ```javaScript
        function foo(){
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    //resolve('succeed');
                    reject('error');
                }, 1000);
            });
        }

        foo()
        .then(ret => {
            console.info(ret);
        })
        .catch(ret => {
            console.info(ret);
        })
        .finally(ret => {
            console.info('finished');
        });
        ```
    - 静态方法
        * Promise.all() 同时触发多个异步操作，全部执行完毕才能获取到结果
        * Promise.race() 同时触发多个异步操作，只要有一个执行完毕就能获取到结果，最先返回异步操作的结果作为最后的结果，别的请求也会继续执行，但是race并不关心
        * all和race的不同在于获得结果的条件不同
        * 语法 
        ```javascript
        //这里的p都是promise实例对象，result是一个结果数组，顺序和p保持一致
        //注意这里是Promise.all()完了之后在.then()
        Promise.all([p1,p2,p3]).then(ret => {
            console.log(ret);
        });
        Promise.race([p1,p2,p3]).then(ret => {
            console.log(ret);
        });
        ```
        * 代码
        ```javaScript
        //建立3个promise实例
        var p1 = queryData('http://localhost:3000/a1');
        var p2 = queryData('http://localhost:3000/a2');
        var p3 = queryData('http://localhost:3000/a3');
        //promise静态方法
        Promise.all([p1,p2,p3]).then(ret => {
            console.log(ret);
        });
        Promise.race([p1,p2,p3]).then(ret => {
            console.log(ret);
        });
        ```
        ![avatar](./image/Promise.all.png)
        ![avatar](./image/Promise.race.png)
#### fetch API
+ 可以看做是xhr的升级版、基于promise实现
+ 基本语法
    ```javascript
        fetch(url)
        .then(data => {
            return data.text(); //text()是fetch API的一个方法，返回promise实例
        })
        .then(ret => {
            console.log(ret); //这里猜得到最终的数据
        })
        .catch(fn);
    ```
    - text()是fetch api的一部分
    - 这里的第一个then中的data不能直接拿到数据，需要调用data.text()返回一个promise实例，再次调用then才能获得数据
+ 带参请求常用配置
    - method：http请求方法，默认GET，string类型，GET POST PUT DELETE
    - body: http请求参数，string
    - headers: http请求头，默认{}
    - 语法：在url的后面添加一个配置对象
    ```javascript
        fetch(url, {
        method : 'get',
        })
        .then(data => {
            return data.text(); 
        })
        .then(ret => {
            console.log(ret); //这里猜得到最终的数据
        })
        .catch(fn);
    ```
    - get delete请求
        * 传统的get url传参方式是`?name=hhh`
        * restful风格的get delete传参方式是斜杠`book/12`
    - post请求
        * 要设置string类型的body,和对象类型的headers
        * 方式1 按照表单提交的方法
        ```javascript
        fetch(url, {
            method : 'post',
            body : 'name=hhh&age=oo',
            headers : {
                'Content-Type' : 'application/x-www-form-urlencoded'
            }      
        })
        .then().then()
        ```
        * 方式1 按照json格式提交
        ```javascript
        fetch(url, {
            method : 'post',
            body : JSON.stringify({
                name : 'hhh',
                age : '12'
            }),
            headers : {
                'Content-Type' : 'application/json'
            }      
        })
        .then().then()
        ```
    - put 请求
     ```javascript
        fetch(url, {
            method : 'put',
            body : 'name=hhh&age=oo',
            headers : {
                'Content-Type' : 'application/x-www-form-urlencoded'
            }      
        })
        .then().then()

        fetch(url, {
            method : 'put',
            body : JSON.stringify({
                name : 'hhh',
                age : '12'
            }),
            headers : {
                'Content-Type' : 'application/json'
            }      
        })
        .then().then()
    ```
+ fetch响应数据格式：text() 和 json()
    - text() 将返回结果处理为字符串类型
    - json() 将返回结果处理为json格式，等价于JSON.parse(responseText)
    ```javascript
    fetch('http://localhost:3000/json')
        .then(data => {
            return data.json();
        })
        .then(ret => {
            console.log(typeof ret, ret);//object {...}
        })
    ```
#### axios
+ 基于promise的http客户端，纸质浏览器和node环境
+ 能拦截请求和响应，支持json数据的自动转换
+ 基本语法
    ```javascript
    axios.get(url)
    .then(ret => {
        //data属性是固定的，获取后台响应数据
        console.log(ret.data)
    })
    ```
+ axios API
    - 根据请求类型axios封装了.get() .post() .put() .delete()四个方法
    - GET
        * 通过url传递
        * 通过params参数传递
            + nodejs后台使用的是req.query来获取参数而不是params
        ```javascript
        axios.get('http://localhost:3000/adata').then(ret => {
            //console.log(ret);
            console.log(ret.data);
        });
        axios.get('http://localhost:3000/axios?id=123').then(ret => {
            console.log(ret.data);
        });
        axios.get('http://localhost:3000/axios/123').then(ret => {
            console.log(ret.data);
        });
        axios.get('http://localhost:3000/axios',{
            params : {
                id : 'paramssssss',
                name : 'nameeee'
            }
        }).then(ret => {
            console.log(ret.data);
        });
        ```
    - DELETE 
        * 通过url传递
        * 通过params参数传递
            + nodejs后台使用的是req.query来获取参数而不是params
        ```javascript
        axios.delete('http://localhost:3000/axios?id=123').then(ret => {
            console.log(ret.data);
        });
        axios.delete('http://localhost:3000/axios/123').then(ret => {
            console.log(ret.data);
        });
        axios.delete('http://localhost:3000/axios',{
            params : {
                id : 'paramssssss',
            }
        }).then(ret => {
            console.log(ret.data);
        });
        ```
    - POST
        * 通过选项传递参数，默认json格式
        * 想传递表单格式(x-www-form-urlencoded)的数据需要调用URLSearchParams()方法构造一个对象
        ```javascript
        axios.post('http://localhost:3000/axios',{
        uname : '111',
        pwd : '2222'
        }).then(ret => {
            console.log(ret.data);
        });
        var params = new URLSearchParams();
        params.append('uname' , '111');
        params.append('pwd' , '2222');
        axios.post('http://localhost:3000/axios',params).then(ret => {
            console.log(ret.data);
        });
        ```
    - PUT
        * 和POST类似
        * 通过选项传递参数，默认json格式
        * 想传递表单格式的数据需要调用URLSearchParams()方法构造一个对象
        ```javascript
        axios.put('http://localhost:3000/axios/123', {
            uname: '111',
            pwd: '2222'
        }).then(ret => {
            console.log(ret.data);
        });
        var params = new URLSearchParams();
        params.append('uname', '111');
        params.append('pwd', '2222');
        axios.put('http://localhost:3000/axios/123', params).then(ret => {
            console.log(ret.data);
        });
        ```
+ 响应结果
    - 一个包装对象，里面包含以下属性：
    - data 响应数据
    - headers 响应头信息
    - status 响应状态码
    - statusText 响应状态信息
+ 全局配置
    - `axios.defaults.timeout = 3000` 超市时间
    - `axios.defaults.baseURL = 'http://localhost:3000/'` 默认地址
    - `axios.defaults.headers['mytoken'] = 'asdfasfasfasasdf12321'` 设置请求头
        * 对于跨域的前端请求头，需要在node后端指定的例如`res.header('Access-Control-Allow-Headers', ['mytoken','Content-Type']);`才可生效
+ 拦截器
    - axios请求拦截器
        * 就是在发送请求的时候拦截一道，做一些事情
        * 添加请求拦截器语法：
        ```javascript
        axios.interceptors.request.use(config => {
            //在发请求之前设置信息
            return config; //注意一定要把config return出去否则不生效
        }, err => {
            //处理响应的错误信息
        });
        ```
        ![avatar](./image/axios请求拦截器.png)
        * 在拦截器里面可以配置请求头，类似于token，content-type之类的参数，比全局配置更灵活，因为config参数可以拿到很多信息例如url，可以根据不同的url做不同的配置
        * 代码 
        ```javascript
        axios.interceptors.request.use(config => {
            console.log(config);
            console.log(config.url);
            config.headers.mytoken = 'asfasfsda12332';
            return config;
        }, err => {
            console.log(err);
        });

        axios.get('axios-json').then(ret => {
            console.log(ret.data);
        })
        ```
    - axios响应拦截器 
        * 响应拦截器是在获取数据之前对数据做一些加工
        * 添加响应拦截器语法：
        ```javascript
        axios.interceptors.response.use(res => {
            //在这里对相应数据做处理
            return res; //注意一定要把res return出去否则不生效
        }, err => {
            //处理响应的错误信息
        });
        ```
        ![avatar](./image/axios响应拦截器.png)
        * 代码 
        ```javascript
        axios.interceptors.response.use(ret => {
            return ret.data; //把最终到的响应数据返回
        }, err => {
            console.log(err);
        });

        axios.get('axios-json').then(data => {
            console.log(data); //直接获取data即可
        })
        ```
#### async/await
+ asynv/await是ES7引入的语法，为了让异步编程的开发体验更好而诞生，不再需要then
+ 特点
    - async关键字用在函数上，async修饰后得到async函数，async函数返回一个promise实例
    - await关键字用在async函数之中.await后面得跟一个promise实例对象,await修饰后表达式可以得到异步操作的结果
+ 语法
    ```javascript
    async function queryData(){
        const res = await axios.get('/data'); //axios get api返回一个promise实例 async函数直接把这个实例返回，可以配合后续的.then调用
        return res;//res是异步调用的结果
    }
    queryData().then(ret => {
        console.log(ret);
    });
    ```
+ 处理多个异步请求
    - 要求前一个异步请求的结果作为后一个的参数
    - 有依赖关系
    ```javascript
    async function queryData1(){
        const info = await axios.get('async1');
        const res2 = await axios.get('async2?info=' + info.data);
        return res2.data;
    }
    queryData1().then(ret => {
        console.log(ret);
    });
    ```
#### 基于接口调用的案例-详见图书管理案例-mybook
![avatar](./image/基于接口的图书管理案例.png)


## Vue高级
### 前端路由
+ 路由的基本概念
+ vue-router基本使用
+ 嵌套路由
+ 动态路由匹配
+ 命名路由
+ 编程式导航
#### 路由基本概念
+ 本质：对应关系
+ 分类：
    - 后端路由
        * 根据不同的URL返回不同的数据
        * 本质：URL地址与服务器资源的对应关系
        * 为了解决性能问题出现了SPA技术，而SPA技术运用到了前端路由
        ![avatar](./image/后端路由.png)
        ![avatar](./image/单页面应用程序SPA.png)
    - 前端路由
        * 根据不同的用户事件，显示不同的页面内容
        * 本质：用户事件与事件函数的对应关系
        ![avatar](./image/前端路由.png)
+ 实现简单的前端路由
    - 用户点击事件会改变URL中的锚点hash的值
    - 监听window.onhashchange事件，获取最新的hash值，切换组件
    ```javascript
    window.onhashchange = () => {
        //location.hash 获得最新的hash值
    }
    ```
+ 代码
    ```html
    <body>
        <div id="app">
            <a href="#/yule">娱乐</a>
            <a href="#/keji">科技</a>
            <a href="#/tiyu">体育</a>
            <a href="#/gouwu">购物</a>
            <component v-bind:is="myCom"></component>
        </div>
    </body>
    <script>
        var yule = {
            template : `
                <div>
                    <h1>娱乐天天有，今天特别多</h1>
                </div>
            `
        }
        var keji = {
            template : `
                <div>
                    <h1>特斯拉来一量？？？</h1>
                </div>
            `
        }
        var tiyu = {
            template : `
                <div>
                    <h1>看看科比</h1>
                </div>
            `
        }
        var gouwu = {
            template : `
                <div>
                    <h1>这里有好多的=白菜，买买买啊少年</h1>
                </div>
            `
        }
        var vm = new Vue({
            el : '#app',
            data: {
                myCom : 'yule'
            },
            components : {
                yule,
                keji,
                tiyu,
                gouwu,
            }
        })
        //监听hash事件
        window.onhashchange = () => {
            console.log(location.hash);
            vm.myCom = location.hash.slice(2);
        }
    </script>
    ```
#### vue-router基本使用
+ vue-router是vue的官方路由管理器，和vue.js深度继承，配合起来开发SPA应用很方便
+ vue-router使用步骤
    1. 引入vue和vue-router库文件
        - 先引入vue.js在引入vue-router.js有依赖关系
        - 自动为全局window对象挂载Vue和VueRouter构造函数
    2. 添加路由链接
        - `router-link`标签是vue提供的标签，默认渲染为a标签
        - `to`属性渲染为href属性，属性值会渲染为#开头的hash地址
        ```html
        <router-link to="/login">Login</router-link>
        <router-link to="/register">Register</router-link>
        ```
    3. 添加路由占位符
        - `router-view`标签是组件占位符
        - 将来通过路由规则匹配到的组件会渲染到router-view所在的位置
        ```html
        <router-view></router-view>
        ```
    4. 定义路由组件
        ```javascript
        const User = {
            template : `<div>User</div>`
        }
        const Register = {
            template : `<div>Register</div>`
        }
        ```
    5. 配置路由规则，创建路由实例
        - `routes`是路有规则数组
        - 每条路有规则都至少需要path和component两个属性
        - `path`表示链接的hash地址
        - `component`表示地址对应的组件
        ```javascript
        const router = new VueRouter({
            routes : [
                {path: '/user', component: User},
                {path: '/register', component: Register},
            ]
        })
        ```
    6. 将路由实例挂载到vue根实例当中
        ```javascript
        new Vue({
            el : '#app',
            router //router: router的简写 
        })
        ```
+ 路由重定向
    - 含义：用户在访问地址A的时候，强制用户跳转到地址B，展示特定的组件
    - 这里的`{path: '/', redirect: '/user'}`实现了路由重定向
    - path指的是原地址，redirect指的是强制跳转的新地址
    - 一般进入页面后默认的hash就是`#/`
    ```javascript
    const router = new VueRouter({
        routes : [
            {path: '/', redirect: '/user'},
            {path: '/user', component: User},
            {path: '/register', component: Register},
        ]
    })
    ```
#### 嵌套路由
+ 通过路由规则的嵌套实现复杂的组件结构关系
+ 功能解析
    - 点击父级链接显示模板内容
    - 模板中又有子级链接
    - 点击子级链接显示子模板内容
    ![avatar](./image/嵌套路由.png)
+ 实现步骤
    1. 确定路由的父子关系
    2. 建立父路由链接，组件占位符
    3. 定义父组件，嵌入子路由链接和占位符
        - 注意to属性里面的hash地址得写全，得带上父路由的前缀`'/register/tab1'`
    ```javascript
    //组件模板内容中嵌套子路由链接和占位符
    const Register = {
        template : `
        <div>
            <h1>Register</h1>
            <hr>
            <router-link to="/register/tab1">Tab1</router-link>
            <router-link to="/register/tab2">Tab2</router-link>
            <router-view></router-view>
        </div>`
    }
    ```
    4. 定义子组件
    ```javascript
    //路由子组件
    var Tab1 = {
        template : `<div><h3>tab1</h3></div>`
    }
    var Tab2 = {
        template : `<div><h3>tab2</h3></div>`
    }
    ```
    5. 父路由通过children属性配置子级路由
        - 注意：子路由前面的父路径也得加上`'/register/tab1'`
        - children数组表示子路由规则
    ```javascript
    //路由实例
    const router = new VueRouter({
        routes : [
            {path: '/', redirect: '/user'},
            {path: '/user', component: User},
            {
                path: '/register', 
                component: Register,
                children:[
                    {path: '/register/tab1', component: Tab1},
                    {path: '/register/tab2', component: Tab2},
                ]
            },
        ]
    })
    ```
+ 代码
    ```html
    <div id='app'>
        <router-link to="/user">User</router-link>
        <router-link to="/register">Register</router-link>
        <router-view></router-view>
    </div>

    <script>
        //路由组件
        const User = {
            template : `<div><h1>User</h1></div>`
        }
        //组件模板内容中嵌套子路由链接和占位符
        const Register = {
            template : `
            <div>
                <h1>Register</h1>
                <hr>
                <router-link to="/register/tab1">Tab1</router-link>
                <router-link to="/register/tab2">Tab2</router-link>
                <router-view></router-view>
            </div>`
        }

        //路由子组件
        var Tab1 = {
            template : `<div><h3>tab1</h3></div>`
        }
        var Tab2 = {
            template : `<div><h3>tab2</h3></div>`
        }

        //路由实例
        const router = new VueRouter({
            routes : [
                {path: '/', redirect: '/user'},
                {path: '/user', component: User},
                {
                    path: '/register', 
                    component: Register,
                    children:[
                        {path: '/register/tab1', component: Tab1},
                        {path: '/register/tab2', component: Tab2},
                    ]
                },
            ]
        })

        const vm = new Vue({
        el: '#app',  
        data: {}, 
        methods : {},
        //挂载路由实例对象
        router //router: router的简写 
        });
    </script>
    ```
#### 动态路由匹配
+ 路由规则中的地址可以带一个路由参数`user/:id`来匹配`user/1  user/2  user/3`
+ 可以给路由组件传递参数
+ 语法1:`$route.params`
    - 动态路由的路径末尾是带参数的`path: '/user/:id'`以冒号开头
    - 在组件模板中可以`$route.params.xxx`来获取路由参数
    ```javascript
    var router = new VueRouter({
        routes : [
            //动态路由参数，以冒号开头
            {path: '/user:id' , component: User}
        ]
    })
    const User = {
        //在组件模板中可以`$route.params.xxx`来获取路由参数
        template: `<div><p>{{ $route.params.id }}</p></div>`
    }
    ```
+ 语法2:使用`props:true` 最常用
    - 路有规则定义时，加上props:true的配置，$route.params将被设置为组件属性
    - 路由组件使用props属性接收路由参数
    ```javascript
    var router = new VueRouter({
        routes : [
            //props:true的配置，$route.params将被设置为组件属性
            {path: '/user:id' , component: User, props:true}
        ]
    })
    const User = {
        props : ['id'], //接收参数
        template: `<div><p>{{ id }}</p></div>`  //使用参数
    }
    ```
+ 语法3:使用`props: {uname: 'www', age: 45}`传递对象
    - 在路由规则上props属性的值设置为一个对象
    - 路由组件使用props属性接收对象中的数据
    - 注意，此时路由参数id是接收不到的,但可以通过`$route.params.id`获取
    ```javascript
    var router = new VueRouter({
        routes : [
            {path: '/user:id' , component: User, props: {uname: 'www', age: 45}}
        ]
    })
    const User = {
        props : ['uname', ' age'], //接收参数
        template: `<div><p>{{ uname + '---' + 'age' }}</p></div>`  //使用参数
    }
    ```
+ 语法4:使用`props: route => {}` props的值为一个函数
    - 在路由规则上props属性的值设置为一个箭头函数
    - 自定义传参内容
    ```javascript
    var router = new VueRouter({
        routes : [
            {
                path: '/user:id' , 
                component: User, 
                props: route => ({uname: 'www', age: 45, id: route.params.id})
            }
        ]
    })
    const User = {
        props : ['id', 'uname', ' age'], //接收参数
        template: `<div><p>{{ id + '---' + uname + '---' + 'age' }}</p></div>`  //使用参数
    }
    ```
#### 命名路由
+ 就是给路有规则起别名，添加name属性即为命名路由
+ 语法
    - name属性就是给这条路有规则起了别名
    - 注意路由链接在使用命名路由的时候:to要属性绑定
    ```javascript
    const router = new VueRouter({
        routes : [
            {path: '/user/:id', name: 'user', component: User},
        ]
    })
    //命名路由的使用
    //这里的params参数要和路有规则的设定相匹配，上面规定路由参数是id，用的时候就得写成id
    <router-link :to="{name: 'user', params: {id: 123}}"></router-link>
    router.push({name: 'user', params: {id: 123});
    ```
#### 编程式导航
+ 页面导航方式
    - 声明式导航：链接点击跳转,例如`<a> <router-link>`
    - 编程式导航：通过js的api调用实现跳转,例如`location.href`
+ 编程式导航API
    - `this.$router.push(hash)`
        * push()参数规则：
        * `this.$router.push('/user')` hash字符串
        * `this.$router.push({path: '/user'})` 对象
        * `this.$router.push({name: 'user', params: {id：123}})` 命名路由+传参
        * `this.$router.push({path: '/user', query: {id：123}})` 带查询参数'?id=123'
    - `this.$router.go(n)`
    ```html
    <div id='app'>
        <router-link to="/user">User</router-link>
        <router-link to="/register">Register</router-link>
        <router-view></router-view>
    </div>

    <script>
        //路由组件
        const User = {
            template : `
            <div>
                <h1>User</h1>
                <button @click="goReg" >点击跳转到注册页面</button>
            </div>`,
            methods: {
                goReg(){
                    this.$router.push('/register')
                }
            }
        }
        const Register = {
            template : `
            <div>
                <h1>Register</h1>
                <button @click="goBack" >后退</button>
            </div>`,
            methods: {
                goBack(){
                    this.$router.go(-1)
                }
            }
        }

        //路由实例
        const router = new VueRouter({
            routes : [
                {path: '/', redirect: '/user'},
                {path: '/user', component: User},
                {path: '/register', component: Register},
            ]
        })

        const vm = new Vue({
        el: '#app',  
        data: {}, 
        methods : {},
        //挂载路由实例对象
        router //router: router的简写 
        });
    </script>
    ```
#### 后台管理case
![avatar](./image/后台管理案例.png)

### 前端工程化
+ 模块化规范
+ webpack
+ Vue单文件组件
+ Vue脚手架
+ ElementUI基本使用
#### 模块化
+ 传统开发的问题
    - 不同js引入html后命名冲突覆盖
    - js文件不能引用js文件
+ 模块化含义
    - 将不同的功能封装到单独的文件中，模块之间相互隔离
    - 可以通过接口公布内部成员
    - 也可以依赖别的模块
    - 代码重用，提高效率，便于维护
+ ES6模块化规范
    - ※`ES6`模块化规范：前后端通用的大一统模块化规范
        * 每一个js文件都是一个独立的模块
        * 导入模块成员使用`import`关键字
        * 暴露模块成员使用`export`关键字
    - only浏览器端模块化规范：`AMD、CMD`
        * AMD Require.js (已落伍
        * CMD Sea.js (已落伍
    - only服务器端模块化规范：`CommonJS`
        * 模块分为单文件模块与包
        * 模块成员导出：`module.exports   exports`
        * 模块导入：`require('模块名')`
+ nodeJS中体验ES6模块化规范(不好使
    - `npm i --save-dev @babel/core @babel/cli @babel/preset-env @babel/node`
    - `npm i --save @babel/polyfill`
    - 项目根目录创建文件`babel.config.js`
    - 文件内容如下
    ```javascript
        const presets = [
            [
                '@babel/env',
                {
                targets: {
                    edge: '17',
                    firefox: '60',
                    chrome: '67',
                    safari: '11.1'
                }
                }
            ]
        ]
        module.exports = { presets }
    ```
    - 执行`npx babel-node index.js` 把babel跑起来，执行代码转换
+ ES6模块化语法
    - 暴露模块私有成员
        * `export default { 导出成员 }`
        * 每个模块中只允许使用一次`export default`
        ```javascript
            //文件m1.js
            let a = 1, b ={name: 'dd'};
            const show = () => {}
            export default {
                a,
                b,
                show
            }
        ```
    - 导入模块成员
        * `import 接收名称 from '模块url'`
        * 此处的就收名称随意命名
        ```javascript
            import m1 from './mi.js';
            console.log(m1); //{ a:1 , b: {name: 'dd'} , show: Function}
        ```
    - 按需导出
        * `export let s1 = 10;`
        * 此处的就收名称随意命名
        * 每个模块可以使用多次按需导出
        * 可以和默认导出语法一起用
        ```javascript
            let show = () => {}
            export let s1 = 10;
            export let s2 = {name: 'dd'};
            export function show;
            export function fun(){}
        ```
    - 按需导入
        * `import {s1, s2 as s , show} from '模块url'`
        * 使用花括号把导入名称包裹起来,逗号隔开
        * 此处的接受名称必须和导出的名字一致，可以使用`as`起别名
        * 可以和默认导入语法一起用 `import m1, {s1, s2 as s , show} from '模块url'`
        ```javascript
            import {s1, s2 as s , show} from '模块url'
            console.log(show); //show: Function
        ```
    - 直接导入并执行模块中的代码
        ```javascript
            //m2.js
            console.log(11);
            //导入并执行m2中的代码
            import './m2.js';
        ```
#### webpack
+ webpack: 前端项目构建工具（打包工具）
+ 解决的问题
    - 文件依赖关系错综复杂
    - 浏览器对高版本ES语法支持度低
    - 模块化支持不友好
    - 静态资源请求效率低
+ 功能：
    - 友好的模块化支持
    - 代码压缩混淆
    - 处理js兼容问题
    - 性能优化
+ 案例：
    - 一个index.js导入别的模块，并执行js逻辑
    - index.js通过标签嵌入html页
    - 发现浏览器对于ES6模块化语法的不支持，import无法识别
    - 配置webpack，将index.js构建为另一个文件，在导入html
    - 注意：
        * `import $ from '../node_modules/jquery'` 来自node_modules可以简写成 `import $ from 'jquery'`
    ![avatar](./image/webpack基本使用案例.png)
+ npm安装注意
    - `npm init`
    - `-S -D -g`的区别
        * `npm install module_name -S` 即 `npm install module_name --save`    写入dependencies
        * `npm install module_name -D` 即 `npm install module_name --save-dev` 写入devDependencies
        * `npm install module_name -g` 全局安装(命令行使用)
+ 在项目中安装和配置webpack
    1. `npm i webpack webpack-cli -D`安装包
    2. 项目根目录下创建`webpack.config.js`配置文件
    3. `webpack.config.js`配置文件写如下内容：
        - mode: 'development' 或 'production' 
        - 区别是开发模式不需要将最终构建的js文件压缩和混淆，打包速度快
        - 开发期间使用development模式，上线期间使用production模式
        ```javascript
        module.exports = {
            mode: 'development'  //mode 指定打编译模式
        }
        ```
    4. 在`package.json`中`script`节点下配置：
        ```javascript
        'script' : {
            'dev' : 'webpack'  //可通过 npm run dev运行打包命令
        }
        ```
    5. 可通过`npm run dev`启动webpack打包项目
        - 输出的文件在dist目录下
        - 使用script标签将main.js加入到html中即可
+ 配置webpack打包的入口和出口
    - webpack 4.x默认
        - 入口文件：src/index.js
        - 出口文件：dist/main.js
    - 修改打包的入口和出口文件，`webpack.config.js`新增如下配置信息
        ```javascript
        const path = require('path'); //导入nodejs中操作路径的path模块
        module.exports = {
            entry: path.join(__dirname, './src/index.js'), //入口文件路径
            output: {
                path: path.join(__dirname, './dist'), //输出文件的存放路径
                filename: 'bundle.js' //输出文件名
            }

        }
        ```
+ 配置webpack自动打包功能
    - 每次修改项目文件，都得重新手动执行dev脚本，编译一次得到新的输出文件bundle.js
    - 很麻烦，所以想配置自动打包，就是每次修改了代码之后都能自动编译输出新文件
    - wepack-dev-server会启动一个实时打包的http服务器，打包生成的输出文件默认放在项目根目录中，是看不见的，存放在内存中
    1. `npm i webpack-dev-server -D`安装自动打包插件
    2. 修改`package.json`的`script`节点的dev脚本为'webpack-dev-server'
        ```javascript
        'script' : {
            'dev' : 'webpack-dev-server' 
        }
        ```
    3. 将html页面中输出文件的脚本路径改为`<script src="/bundle.js"></script>`
    4. `npm run dev`重新打包，浏览器查看`localhost:8080`
        * 控制台输出`i ｢wds｣: Project is running at http://localhost:8080/`项目运行于机的8080端口
        * 控制台输出`i ｢wds｣: webpack output is served from /`
            + webpack打包的输出文件托管于项目的根目录下，所以index.html的脚本资源路径要改为`/bundle.js`
            + 不在物理磁盘中，而在内存中
            + 访问http://localhost:8080/bundle.js可以看到源码
+ 配置`html-webpack-plugin`生成预览页面
    - 由于8080打开的页面是下面这样的，我们希望直接进入项目首页，而不是再点击一下src，所以需要配置这个插件
        ![avatar](./image/自动打包.png)
    - 执行顺序如下：先装包，导入包，创建插件的实例，webpack的plugin节点配置上这个实例
    1. `npm i html-webpack-plugin -D`安装包
    2. 修改webpack.config.js文件,写在头部位置
        ```javascript
            //导入插件，得到一个构造函数
            const HtmlWebpackPlugin = require('html-webpack-plugin')
            //创建插件的实例对象
            const htmlPlugin = new HtmlWebpackPlugin({
                template: './src/index.html', //指定要用到的模板文件
                filename: 'index.html' //生成的文件名，在内存中项目根目录下，目录不显示
            })
        ```
    3. 修改webpack.config.js文件向外暴露的配置对象module.exports
        + 注意是plugins
        ```javascript
            module.exports = {
                plugins: [ htmlPlugin ] //puglin数组是webpack打包的时候会用到的插件列表
            }
        ```
+ 配置自动打包相关参数
    - `--open`打包后自动打开浏览器 
    - `--host`配置serverIP地址
    - `--port`配置端口号
    - 在package.json的script节点配置
        ```javascript
        'script' : {
            'dev' : 'webpack-dev-server --open --host 127.0.0.1 --port 3000' 
        }
        ```
+ webpack中的加载器loader
    - webpack默认只编译打包.js结尾的文件
    - 其他非.js结尾的文件需要调用loader加载器才能正常打包
    - loader加载器可协助webpack打包指定类型的文件模块
        * `less-loader` 可以打包处理.less文件
        * `sass-loader` 可以打包处理.scss文件
        * `url-loader` 可以打包处理css中与url路径相关的文件，例如图片和字体文件
        ![avatar](./image/loader的调用过程.png)
+ 加载器使用-打包处理css文件
    1. `npm i style-loader css-loader -D`安装处理css文件的loader
    2. 在webpack.config.js文件的module -> rules数组中添加loader规则
        - 多个loader的调用顺序是：从后往前
        - use中的loader先后顺序不能反，先执行css-loader解析，在经过style-loader解析，结果给webpack处理
        ```javascript
        //所有第三方文件模块的匹配规则都放在module节点里
        module: {
            rules: [//test表示匹配的文件类型，use表示使用的加载器
                { test: /\.css$/ , use: ['style-loader', 'css-loader'] }
            ]
        }   
        ```
+ 加载器使用-打包处理less文件
    1. `npm i less-loader less -D`安装处理less文件的loader
    2. 在webpack.config.js文件的module -> rules数组中添加loader规则
        - 多个loader的调用顺序是：从后往前
        - use中的loader先后顺序不能反，先执行less-loader,css-loader解析，在经过style-loader解析，结果给webpack处理
        ```javascript
        module: {
            rules: [
                { test: /\.less$/ , use: ['style-loader', 'css-loader', 'less-loader'] },
            ]
        } 
        ```
+ 加载器使用-打包处理scss文件
    1. `npm i sass-loader node-sass -D`安装处理less文件的loader
    2. 在webpack.config.js文件的module -> rules数组中添加loader规则
        - 多个loader的调用顺序是：从后往前
        - use中的loader先后顺序不能反，先执行less-loader,css-loader解析，在经过style-loader解析，结果给webpack处理
        ```javascript
        module: {
            rules: [
                { test: /\.scss$/ , use: ['style-loader', 'css-loader', 'sass-loader'] },
            ]
        } 
        ```
+ 加载器使用-配置postCSS自动添加css的兼容前缀
    - 有些css样式是存在兼容性问题的，例如`::placeholder`，此时需要在前面添加浏览器前缀，例如`:-ms-input-placeholder`但是这样麻烦，所以postCSS可以解决css的浏览器兼容问题
    - css中的样式`::placeholder{  color: blueviolet;  }`
    1. `npm i postcss-loader autoprefixer -D` 下载包
    2. 根目录下创建`postcss.config.js`文件，添加一下内容：
        ```javascript
        const autoprefixer = require('autoprefixer');
        module.exports = {
            plugins: [ autoprefixer ] //挂载插件
        }
        ```
    3. 在webpack.config.js文件的module -> rules数组中修改css的loader规则
        - 在末尾追加postcss-loader
        ```javascript
        module: {
            rules: [
                { test: /\.css$/ , use: ['style-loader', 'css-loader','postcss-loader'] }
            ]
        }   
        ```
+ 加载器使用-打包css中的图片和字体文件
    - 类似于`background: url('../img/1.jpg');`的图片都可以搞定
    1. `npm i url-loader file-loader -D` 安装包 其中file-loader是url-loader的内置依赖项
    2. 在webpack.config.js文件的module -> rules数组中添加loader规则
        - 其中ttf和后面的都是字体的后缀名
        - `url-loader?`后面的是参数
        - limit指定图片的大小单位是byte字节：大小小于limit的图片会转为base64图片
    ```javascript
            module: {
                rules: [
                    { 
                        test: /\.jpg|png|gif|bmp|ttf|eot|svg|woff|woff2$/,use: 'url-loader?limit=16940'
                    },
                ]
            }   
    ```
+ 加载器使用-打包处理js中的高级语法
    - 类似于`class Person{}`这种定义一个类的js高级语法，webpack编译不了，需要借助babel相关的加载器处理
    1. `npm i babel-loader @babel/core @babel/runtime -D`安装babel转换器相关包
    2. `npm i @babel/preset-env @babel/plugin-transform-runtime @babel/plugin-proposal-class-properties -D` 安装babel语法插件相关的包
    3. 根目录创建`babel.config.js`添加内容：
    ```javascript
        module.exports = {
            presets : ['@babel/preset-env'],
            plugins: ['@babel/plugin-transform-runtime', '@babel/plugin-proposal-class-properties']
        } 
    ```
    4. 在webpack.config.js文件的module -> rules数组中添加loader规则
        - 其中对于js文件中的高级语法进行编译处理，exclude表示排除所有node_modules模块下的js文件
    ```javascript
            module: {
                rules: [
                    { test: /\.js$/, use: 'babel-loader', exclude: /node_modules/},
                ]
            }   
    ```
+ 加载器使用-vue单位件组件的加载器
    - `.vue`结尾的单文件组件，webpack也处理不了，需要loader
    1. `npm i vue-loader vue-template-compiler -D`安装vue加载器相关包
    2. `webpack.config.js`中添加配置项
    ```javascript
        //vue-loader加载器的模块
        const VueloaderPlugin = require('vue-loader/lib/plugin');
        module.exports = {
            //puglin数组是webpack打包的时候会用到的插件列表
            plugins: [ 
                new VueloaderPlugin()
            ], 
            //所有第三方文件模块的匹配规则都放在module里
            module: {
                rules: [//test表示匹配的文件类型，use表示使用的加载器
                    { test: /\.vue$/, use: 'vue-loader'},
                ]
            }
        }
    ```
#### Vue单文件组件
+ 传统vue组件的问题
    - 全局定义的组件名称不能重复
    - 没有语法高亮的模板字符串
    - 不支持css
    - 只能用h5和es5，不支持预处理器例如babel
    - Vue提供了vue单位件组的方式件定义组件
+ vue单文件组件的结构
    - 单文件组件都是以.vue结尾，一般放在项目的src/components目录下
    - template 组件的模板区域
    - script 业务逻辑区域
    - style 样式区域
        * 为了防止样式冲突最好加上scoped,表示下面的样式都是组件私有的
+ 语法
    ```html
    <template>
        <!-- 组件的模板区域 -->
    </template>
    <script>
        //业务逻辑 
        export default{
            data(){
                return{
                    //私有数据
                }
            },
            methods:{
                //处理函数
            }
        }
    </script>
    <style scoped>
    </style>
    ```
+ 在webpack项目中使用vue
    1. `npm i vue -S`安装vue的包
    2. `import Vue from 'vue' `在src/index.js入口文件中导入Vue构造函数
    3. 创建vue跟实例，指定控制的el区域
    4. 通过render函数渲染App根组件
    ```javascript
        import Vue from 'vue';
        import App from './components/App.vue';
        const vm = new Vue({
            el: '#app',
            render: (h) => h(App)  
        });
    ```
+ webpack打包发布
    - 上线之前应该用webpack将应用整体打包，需要通过package.json配置打包指令
    - 注意.json文件里面不可以写注释的
    ```javascript
        "script": {
            //用于打包的命令
            "build": "webpack -p",
            //用于开发调试的命令
            "dev": "webpack-dev-server --open --host localhost --port 3000"
        }
    ```
    - 为了看得清晰，可以先把项目的dist目录删了，然后运行`npm run bulid`
    - 生成dist/bundle.js 和 dist/index.html就是最终要上线的成品了。可以交给后台的开发人员嵌入后端代码中完成上线
#### Vue脚手架
+ 本质：一个命令行工具
+ 用于快速生成Vue项目模板,直接上手写代码，不必关心项目是怎么构建的
+ 安装vue脚手架工具
    - 安装3.x版本的vue脚手架
    - 3.x的vue-cli工具即可以生成3.x版本的vue项目模板也能生成2.x的
    - `npm i @vue/cli -g`cmd执行命令行安装脚手架工具包
    - `vue -V`检查是否安装成功
+ 使用vue-cli创建vue项目
    - 方式1：交互式命令行，创建新版vue项目
        * cmd终端`vue create 项目名`
        * 创建项目的选项
            + manually select features -> 
            + 空格打上星花勾选功能模块 -> 
            + 是否选择history mode router历史模式的路由，选择n表示要哈希模式的路由 -> 
            + ESlint Standard config -> lint on save保存时校验语法 ->
            + babel等的配置文件放在哪里,选dedicated config files单独的文件中便于维护
            + 是否保存为预设preset 看心情
        * 默认在C:\Users\wuhuimin路径下创建新项目
        * 完事之后根据提示cd 项目路径 npm run serve启动
        ![avatar](./image/vue_create.png)
    - 方式2：图形化界面，创建新版vue项目
        * cmd终端`vue ui` 更方便快捷
        * 在图形化界面点点点
            + git仓库初始化init project
            + 手动配置：勾选babel vue-router linter 使用配置文件
            + 其他的选项跟方式1说的一样选
        * 创建好之后会跳到vue项目仪表盘页面，可视化很方便
            + 任务中有serve和build命令，serve用来实现开发期间的打包和运行，build是上线期间的打包
        * vue ui命令得在cmd敲
        * GUI项目管理器选择已存在的项目，可以导入项目输入路径后回车
        ![avatar](./image/vue项目仪表盘1.png)
        ![avatar](./image/vue项目仪表盘2.png)
        ![avatar](./image/vue项目仪表盘3.png)
        ![avatar](./image/vue项目仪表盘4.png)
        ![avatar](./image/vue项目仪表盘5.png)

    - 方式3：2.x旧模板，创建旧版vue项目
        * `npm install -g @vue/cli-init`
        * `vue init webpack 项目名`
+ 脚手架生成项目结构分析
    ![avatar](./image/cli生成项目结构.png)
    - `public` 静态文件
    - `src` 所有写的代码都要放在里面
    - `src/assets` 资源文件：图片、样式表
    - `src/components` 组件
    - `src/view` 试图组件
    - `src/App.vue` 项目根组件：承载项目所有组件
    - `src/mian.js` 项目打包入口文件
    - 配置文件`eslintrc.js .gitignore package.json postcss.config.js`
+ vue脚手架的自定义配置
    - 方式1：创建vue.config.js配置项目
    ```javascript
        module.exports = {
            devServer: {
                port: 8888,
                open: true
            }
        }
    ```
    - 方式2：通过package.json配置项目
        * 注意json文件格式得是双引号，不能有多余逗号和注释
        * 不推荐，因为package.json最好是专门只管项目依赖包比较干净
    ```javascript
        "vue": {
            "devServer": {
                "port": "8888",
                "open": true
            }
        }
    ```
#### ElementUI
+ ElementUI就是一套标准样式的PC端组件库，可以节省调试样式的时间
+ 安装ElementUI
    - 基于命令行安装
        1. `npm i element-ui -S`安装依赖包
        2. 在项目的入口js文件导入elementUI模块的相关成员
        ```javascript
        //使用vue-project02-ui项目为案例
        //导入组件的js成员
        import ElementUI from 'element-ui'
        //导入css资源文件
        import 'element-ui/lib/theme-chalk/index.css'
        //配置为Vue插件
        Vue.use(ElementUI)
        ```
    - 基于图形化界面安装
        1. `vue ui`打开图形化管理界面
        2. 插件 -> 添加插件 搜索vue-cli-plugin-element安装
        3. 配置插件 -> 按需导入import on demand减少了打包后项目的体积





## 问题汇总
+ 小心组件模板里面必须是只有一个根组件包裹起来的，尤其是需要v-for遍历的元素要尤其注意
    - 例如：
    ```javascript
    var cartList = {
            props: ['list'],
            template: `
                <div>
                    <div class="item" v-for="item in list" :key="item.id">
                        <img v-bind:src="item.img" />
                        <div class="name">{{item.name}}</div>
                        <div class="change">
                            <a href="">－</a>
                            <input type="text" class="num" v-model="item.num"/>
                            <a href="">＋</a>
                        </div>
                        <div class="del">×</div>
                    </div>
                <div>
            `
        }
    ```
+ express
+ nodemon装了以后 node程序 nodemon xxx这么启动就会热启动了，每次改的内容不需要重启
+ ESlint实在是太严格了  555
+ 为什么脚手架的App根组件的export default导出对象里面是name不是el
+ 为什么脚手架没有webpack.config.js的配置，没有第三方加载器loader的配置，package.json里面也没有写依赖
+ 依赖和插件有设么区别，为啥GUI面板上的插件安装和依赖是分开的，有一样的包可以装
+ less语言中的`>`这是什么意思
    ```css
    .el-header {
        background-color: #373d41;
        display: flex;
        > div {
            display: flex;
            align-items: center;
        }
    }
    ```
+ 老师项目地址http://shop.liulongbin.top/
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
