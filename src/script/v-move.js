
import damu from './transform'

let doc = document
let docEl = document.documentElement

let w = docEl.clientHeight
let h = docEl.clientHeight

let vmove = (wrap, item, callBack) => {
    // 开启硬件加速
    damu.css(item, 'translateZ', 0.1)
    var starty = 0
    var startx = 0
    var elemy = 0
    var disy = 0
    var disx = 0
    var miny = 0
    
    // 快速滑屏
    var nowTime = 0
    var nowPoint = 0
    var lastTime = 0
    var lastPoint = 0
    // 避免一上来用户就点击, 时间差为0（分子为0）
    var deltaTime = 1
    var deltaDis = 0

    var isFirst = true
    var isY = true
    
    wrap.addEventListener('touchstart', (e) => {
        clearInterval(timer)
        miny = wrap.offsetHeight - item.offsetHeight
        item.style.transition = 'none'
        starty = e.changedTouches[0].clientY
        startx = e.changedTouches[0].clientX
        elemy = damu.css(item, 'translateY')
    
        lastTime = new Date().getTime()
        lastPoint = elemy
        // 清除上一次的快速滑屏的位移差
        deltaDis = 0
        isY = true
        isFirst = true
        item.isOutOfRange = false

        if (callBack && typeof callBack['start'] == 'function') {
            callBack['start'].call(item)
        }
    })
    
    wrap.addEventListener('touchmove', (e) => {
        if (!isY) {
            return
        }

        disy = e.changedTouches[0].clientY - starty
        disx = e.changedTouches[0].clientX - startx

        if (isFirst) {
            isFirst = false
            if (Math.abs(disx) > Math.abs(disy)) {
                isY = false
                return
            }
        }

        var translatey = elemy + disy
    
        nowTime = new Date().getTime()
        nowPoint = translatey
        deltaTime = nowTime - lastTime
        deltaDis = nowPoint - lastPoint
        lastTime = nowTime
        lastPoint = nowPoint
    
        /* 
            橡皮筋效果 - 两端往内
                在move的过程中，每一次touchmove的有效距离慢慢变小，元素的滑动距离还在变大
                move事件:
                    移动端: 每隔1px就触发一次
                    pc端: 每隔n毫秒触发一次
        */
        if (translatey > 0) {
            item.isOutOfRange = true
            var scale = h / ((h + disy) * 0.8)
            translatey = damu.css(item, 'translateY') + deltaDis * scale
        } else if (translatey < miny) {
            item.isOutOfRange = true
            var over = miny - translatey
            var scale = h / ((h + over) * 0.8)
            translatey = damu.css(item, 'translateY') + deltaDis * scale
        }
        damu.css(item, 'translateY', translatey)
    
        if (callBack && typeof callBack['move'] == 'function') {
            callBack['move'].call(item)
        }
    })
    
    wrap.addEventListener('touchend', (e) => {
    
        var translatey = damu.css(item, 'translateY')
    
        if (item.isOutOfRange) {
            // 超过了内容的两边
            item.style.transition = '.8s transform'
    
            if (translatey > 0) {
                translatey = 0
                damu.css(item, 'translateY', translatey)
            } else if (translatey < miny) {
                translatey = miny
                damu.css(item, 'translateY', translatey)
            }

            // item.isOutOfRange = !item.isOutOfRange
            if (callBack && typeof callBack['end'] == 'function') {
                callBack['end'].call(item)
            }
        } else {
            // 速度越大，位移越大
            var speed = deltaDis / deltaTime
            speed = Math.abs(speed) < 0.3 ? 0 : speed
    
            var time = Math.abs(speed) * 0.2
            time = time < 0.6 ? 0.6 : time
            time = time > 1.2 ? 1.2 : time
            // time = 10
    
            translatey = translatey + speed * 400
    
            // var bezier = ''
            var type = 'linear'
            if (translatey > 0) {
                translatey = 0
                // bezier = 'cubic-bezier(0,1.33,.39,1.57)'
                type = 'back'
            } else if (translatey < miny) {
                translatey = miny
                // bezier = 'cubic-bezier(0,1.33,.39,1.57)'
                type = 'back'
            }

            // item.style.transition = time + 's ' + bezier + ' transform'
            // damu.css(item, 'translateY', translatey)
            bezier(type, time, translatey)
        }
    })

    // 即点即停
    var Tween = {
        linear: function(t,b,c,d){ return c*t/d + b; },
        back: function(t,b,c,d,s){
            if (s == undefined) s = 1.70158;
            return c*((t=t/d-1)*t*((s+1)*t + s) + 1) + b;
        }
    }

    var timer = null
    let bezier = (type, time, targetY) => {
        clearInterval(timer)
        /*
            t:当前是哪一次
            b:初始位置
            c:最终位置与初始位置之间的差值
            d:总次数
        */
       var t = 0
       var b = damu.css(item, 'translateY')
       var c = targetY - b
       var d = time * 1000 / (1000/60)
       timer = setInterval(function() {
           t++

           if (callBack && typeof callBack['move'] == 'function') {
                callBack['move'].call(item)
            }

           if (t > d) {
               clearInterval(timer)

               if (callBack && typeof callBack['end'] == "function") {
                    callBack['end'].call(item)
                }
           }

           var point = Tween[type](t, b, c, d)

           damu.css(item, 'translateY', point)
       }, 1000/60)
    }
}

export default vmove