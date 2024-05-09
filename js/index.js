//获取网页的容器
var box = $(".box");
var slider = $(".slider");
var ball = $(".ball");

//按键事件 按空格再触发游戏
document.onkeydown = function (e) {
    // e.stopPropagation();
    if (e.keyCode == 32) {
        clearEveryBrick();

        moveBall();

        //绑定鼠标滑动事件
        box.onmousemove = function (eve) {
            //只要移动左右方向
            var left = eve.offsetX - slider.offsetWidth / 2;

            var maxLeft = box.offsetWidth - slider.offsetWidth;
            left = left < 0 ? 0 : left > maxLeft ? maxLeft : left;

            slider.style.left = left + "px";
        }
        //解除绑定事件
        document.onkeydown = null;
        count.innerHTML=0;
    }

}

//构造器（方块类—）
function Brick() {
    //尺寸
    this.width = 50;
    this.height = 20;

    //颜色
    this.color = "#425066";

    //类名
    this.className = "brick";

    //节点
    this.currEle = null;

    //可进行拓展 动态可修改
}

//原型方法：创建方块节点的方法
Brick.prototype.clearBrickElement = function (parent) {
    //创建节点
    this.currEle = document.createElement("div");

    //添加类名
    this.currEle.setAttribute("class", this.className);

    //添加样式
    this.currEle.style.width = this.width + "px";
    this.currEle.style.height = this.height + "px";
    this.currEle.style.backgroundColor = this.color;

    parent.appendChild(this.currEle);
    // 向节点添加最后一个子节点。也可以使用此方法从一个元素向另一个元素移动元素
}


//函数：创建方块的函数
var bricks = [];
function clearEveryBrick() {
    //定义需要几行方块
    // var line=prompt+("要几行");
    var line = 10;

    for (var i = 0; i < line; i++) {
        //创建行
        var row = document.createElement("div");
        row.setAttribute("class", "row");

        //创建方块
        for (var j = 0; j <= i; j++) {
            //实例化方块对象
            var brick = new Brick();

            //方块对象创建节点(把当前行当作参数传递)
            brick.clearBrickElement(row);

            //把实例化对象存储在数组中
            bricks.push(brick);

        }

        //把行插入到页面中
        box.appendChild(row);
    }
}

//开始游戏时调用创建方块的函数
// clearEveryBrick();



//移动小球的方法
function moveBall() {
    //1.决定小球的运动方向  速度：正值往右或上 负值往左或下

    // 水平方向  parseInt 取整
    var wayX = parseInt(Math.random() * 10 - 5);

    //如果水平速度为0，则重新获取水平速度位置 
    while (!wayX) {
        var wayX = parseInt(Math.random() * 10 - 5);
    }

    //垂直方向 [-5,-2)
    var wayY = parseInt(Math.random() * 3 - 5);

    //多次定时器
    var time1 = setInterval(function () {

        //碰到左右边界反弹
        if (ball.offsetLeft < 0 || ball.offsetLeft > box.offsetWidth - ball.offsetWidth) {
            wayX *= - 1;
        }

        //碰到上边界检测
        if (ball.offsetTop < 0) {
            wayY *= -1;
        }

        if (ball.offsetTop > box.offsetHeight - ball.offsetHeight) {
            clearInterval(time1);
            setTimeout("alert('游戏结束')", 50)
        }

        //滑块的碰撞检测
        sliderTouch();

        //方块碰撞检测(遍历每一个方块)
        bricksTouch();

        //让小球移动 每次移动都是基于上一次的位置进行移动
        ball.style.left = ball.offsetLeft + wayX + "px";
        ball.style.top = ball.offsetTop + wayY + "px";

    }, 17);

    //封装：滑块碰撞检测
    function sliderTouch() {
        //获取每次滑块的最左边的值 
        var sliderLeft = slider.offsetLeft - ball.offsetWidth / 2;
        //    最右边
        var sliderRight = slider.offsetLeft + slider.offsetWidth - ball.offsetWidth / 2;
        //滑块顶边
        var sliderTop = slider.offsetTop - ball.offsetHeight + 5;
        //滑块底边
        var sliderBottom = slider.offsetTop - (ball.offsetHeight - slider.offsetHeight);

        if (ball.offsetLeft > sliderLeft && ball.offsetTop > sliderTop && ball.offsetLeft < sliderRight && ball.offsetTop < sliderBottom) {
            wayY *= -1;
        }
    }

    //     function sliderTouch(){
    //         // 滑块碰撞检测
    //            // 滑块的最左边
    //            var sliderLeft = slider.offsetLeft - ball.offsetWidth/2;
    //            // 滑块的最右边
    //            var sliderRight = slider.offsetLeft + slider.offsetWidth - ball.offsetWidth/2;
    //            // 滑块的最顶边
    //            var sliderTop = slider.offsetTop - ball.offsetHeight + 5;
    //            // 滑块的最底边
    //            var sliderBottom = slider.offsetTop - (ball.offsetHeight - slider.offsetHeight);

    //            // 小球的left > 滑块的左边 并且 小球的left < 滑块的右边
    //            // 小球的top > 滑块的顶边 并且 小球的top < 滑块的底边
    //            if( ball.offsetLeft>sliderLeft && ball.offsetLeft < sliderRight && ball.offsetTop > sliderTop && ball.offsetTop < sliderBottom){
    //                 // 颠倒速度
    //                speedY *= -1;
    //            }
    //    }

    //封装：方块碰撞检测
    function bricksTouch() {
        for (var i = 0; i < bricks.length; i++) {
            //方块的左右极限
            var brickLeft = bricks[i].currEle.offsetLeft - ball.offsetWidth;
            var brickRight = bricks[i].currEle.offsetLeft + bricks[i].currEle.offsetWidth;

            //方块的上下极限
            var brickTop = bricks[i].currEle.offsetTop - ball.offsetHeight;
            var brickBottom = bricks[i].currEle.offsetTop + bricks[i].currEle.offsetHeight;

            //碰撞检测
            if (ball.offsetLeft > brickLeft && ball.offsetLeft < brickRight && ball.offsetTop > brickTop && ball.offsetTop < brickBottom) {
                wayY *= -1;
                bricks[i].currEle.style.backgroundColor = "transparent";

                //把数组中的当前对象删除
                bricks.splice(i, 1);
                count.innerHTML = +count.innerHTML + 10;

            }
        }
    }


}
