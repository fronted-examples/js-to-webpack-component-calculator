// import Compute from '../lib/Compute'; // 导入计算模块
import compute from '../lib/compute' // 不作为类继承，这里使用小写

import { trimSpace, digitalize } from '../utils/tools'

import ResultComponent from '../components/Result/index' // 导入ResultComponents组件
import InputGroupComponent from '../components/InputGroup/index'
import BtnGroupComponent from '../components/BtnGroup/index'


// 计算器模块, 继承Compute,Calculator方法就可以直接访问Compute里的方法，类似于java的类继承
// 由于JavaScript是单继承的，所以这里继承Compute是不合理的
// 装饰器，在这声明之后，下面的this[method](fVal, sVal);中的this不用更改，照样可以访问到相应的方法
// 因为compute中的target就是Calculator,将@compute放在这里，那么target就就等于Calculator,这里实际上是映射关系，能继续直接使用compute中的加减乘除，实际上是利用了原型继承
// 这里报错了，是因为es6,es7,装饰器都需要单独配置.babelrc文件
@compute
export default class Calculator /**extends Compute */ { // 一个类时，使用export default定义很方便, 导入时，使用import Calculator from './Calculator',不用大括号
    // 类的构造函数, el是使用new Calculator(getElementsByClassName('J_calculator')[0])的形参，这样就把dom和类结合起来，该dom就是该类的对象，拥有该类的属性和方法，类似于Java类和对象的关系
    // 每一个类都有它的构造函数，即使不声明。类的构造函数用于实例化类为一个具体的对象，类似于Java
    constructor (el) {
        this.el = el; // 保存el,因为后面要将每个组件的的tpl(),假如有三个组件，就需要使用el进行三次appendChild(),就需要三次重绘重排，不行，操作dom了。

        this.name = 'Calculator'; // 每个类都有自己的名字，这是标准

        this.resultComponent = new ResultComponent(); // 这里其实就是为了拿到tpl()方法
        this.inputGroupComponent = new InputGroupComponent();
        this.btnGroupComponent = new BtnGroupComponent();
    }

    // 每一个模块都有的init函数
    init () {
        this.render();
        this.bindEvent(); // 执行bindEvent()，执行注册事件，才会去注册对应事件，之后才能使用注册事件
    }

    // 渲染
    // this.resultComponent.tpl(); // 这里肯定能拿到Result这个节点， 然后放到构造函数中的el参数中
    render () {
        // 解决多次重绘重排，首先声明一个文档碎片
        const oFrag = document.createDocumentFragment();
        // 然后使用文档碎片oFrag
        oFrag.appendChild(this.resultComponent.tpl());
        oFrag.appendChild(this.inputGroupComponent.tpl());
        oFrag.appendChild(this.btnGroupComponent.tpl());

        // 最后使用this.el进行appendChild(oFrag). 就一次性把所有子组件都存放到主div中了
        this.el.appendChild(oFrag);
    }

    // 绑定事件处理
    bindEvent () {
        // 需要在render()之后才能找到对应节点并注册事件，所以在这里获取对应节点
        this.oResult = this.el.getElementsByClassName('result')[0]; // el是一个dom对象引用，因此这里可以直接调用getElementsByClassName()方法获取对应的子节点
        this.oBtnGroup = this.el.getElementsByClassName('btn-group')[0];
        this.oInputs = this.el.getElementsByClassName('num-input');

        this.oBtnGroup.addEventListener('click', this.oBtnClick.bind(this /**改变this的指向，使其指向实例 */), false); // addListener()
    }

    oBtnClick (ev) {
        const e = ev || window.event, 
              target = e.target || e.srcElement, // 找到事件源
              tagName = target.tagName.toLowerCase(); // 找到事件源的标签名,即dom标签名
        
        console.log(tagName);

        if (tagName == 'button') {
            const method = target.getAttribute('data-method'),
                  fVal = digitalize(trimSpace(this.oInputs[0].value)), // replace用来匹配空字符，并去除, 如果为NaN，fVal则为0
                  sVal = digitalize(trimSpace(this.oInputs[1].value));

            // this.oResult.innerText = this[method](fVal, sVal); // 直接访问Compute的方法，因为被继承过来了，相当于Calculator自己的方法，直接在这里使用this.oResult.innerText赋值是不好的，最好创建一个单独的更改值的功能函数
            this.setResult(method, fVal, sVal);
        }
    }

    // 最好一个函数完成一个功能, 函数最好是可扩展性的，功能要解耦、内聚
    setResult (method, fVal, sVal) {
        this.oResult.innerText = this[method](fVal, sVal);
    }
}

// class Calculator { // 一个文件中有多个类时，class...export{...} 这种方式很友好

// }

// 导出模块, 如果是多个，可以通过逗号隔开，一起导出，这是解构的方式
// export { Calculator }

// 导入模块，如果是多个，可以通过逗号隔开，一起导入
// import { Calculator } from './Calculator'

