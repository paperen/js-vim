js-vim
======

# 概括

通过javascript在网页中重现vi的操作方式(基于jquery)

## 如何使用

1. 引入 `core.js`

  ```html
  <script type="text/javascript" src="vim/core.js"></script>
  ```

2. 在想要实现vi操作的页面中加入

  ```js
  <script>
  $(document).ready(function(){
     $(this).vim();
  });
  </script>
  ```
  
## 现有支持的命令

* r : 重新载入当前页面
* j : 向下滚动
* k : 向上滚动
* d : 向下滚动半页
* u : 向上滚动半页
* gg : 滚动到页面顶部
* G : 滚动到页面底部
* H : 后退
* L : 前进
* f : 打开当前页面上某个链接
* F : 在新标签页中打开当前页面上某个链接

## 初始化参数

* debug 调试模式（默认是false） 若为true会在console输出一些信息
* scrollpx 上下滚动的跨度（默认是50） 主要是j、k命令

  ```js
  <script>
  $(document).ready(function(){
     $(this).vim({
		'debug' : true,
		'scrollpx' : 80
	 });
  });
  </script>
  ```

## 待完善

* f命令可能会出现重复的标记……
* yy命令