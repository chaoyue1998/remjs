# remjs - 可伸缩布局

## 用法：
~~~ sh
<meta name="design" content="design-width=640,max-width=540">
~~~

### 参数

design-width 为设计稿宽度，默认480。<br>
max-width 页面显示最大宽度，默认540。

### 建议
建议对于js做内联处理，在所有资源加载之前执行。

## 把视觉稿中的px转换成rem
rem值等于视觉稿px数值除以100。