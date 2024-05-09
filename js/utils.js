//封装：获取节点的方法 $（css选择器）
function $(selector){
    // 声明变量，获取节点 用$获取节点
    var ele=document.querySelectorAll(selector);

    if(ele.length==1){
        return ele[0];
    }else{
        return ele;
    }
}

//封装：获取样式的方法
function getstyle(node,style){
    var result;

    if(node.currentStyle){
        result=node.currentStyle[style];  //因为是字符串 所以要使用中括号的形式获取
    }else{
        result=getComputedStyle(node)[style];
    }
    return result;
}
