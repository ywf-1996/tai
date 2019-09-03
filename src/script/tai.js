
import '../css/tai.less'
// import '../css/carousel.css'
// import Carousel from './carousel.js'
import damu from './transform'

let doc = document
let docEl = document.documentElement

let w = docEl.clientWidth
let h = docEl.clientHeight


doc.addEventListener('touchstart', (e) => {
    e.preventDefault()
})


var styleNode = doc.createElement('style')
styleNode.innerHTML = 'html {font-size: ' + (w/16) + 'px!important;'
doc.head.appendChild(styleNode)


// head
var menuBtn = doc.querySelector('.menuBtn')
var mask = doc.querySelector('.mask')
var isTouched = false
menuBtn.addEventListener('touchstart', (e) => {
    if (isTouched) {
        menuBtn.classList.remove('active')
        mask.style.display = 'none'
    } else {
        menuBtn.classList.add('active')
        mask.style.display = 'block'
    }
    isTouched = !isTouched
    e.stopPropagation()
    // iphone往下拉
    e.preventDefault()
})
doc.addEventListener('touchstart', (e) => {
    if (isTouched) {
        menuBtn.classList.remove('active')
        mask.style.display = 'none'
        isTouched = !isTouched
    }
})
mask.addEventListener('touchstart', (e) => {
    e.stopPropagation()
    // iphone往下拉
    e.preventDefault()
})
// 让a链接可以跳转
var aNodes = mask.querySelectorAll('.mask li a')
for (var x = 0; x < aNodes.length; x++) {
    aNodes[x].addEventListener('touchstart', (e) => {
        e.stopPropagation()
    })
}
// 输入框 - iphone
var inputText = doc.querySelector('.head .head-bottom form input[type=text]')
inputText.addEventListener('touchstart', (e) => {
    inputText.focus()
    // 事件不需要传到父级元素
    e.stopPropagation()
    // iphone往下拉
    e.preventDefault()
})
doc.addEventListener('touchstart', () => {
    inputText.blur()
})



// nav
var nav = doc.querySelector('.nav')
var item = doc.querySelector('.nav .list')

var startx = 0
var elemx = 0
var disx = 0
var minx = w - item.offsetWidth

// 快速滑屏
var nowTime = 0
var nowPoint = 0
var lastTime = 0
var lastPoint = 0
// 避免一上来用户就点击, 时间差为0（分子为0）
var deltaTime = 1
var deltaDis = 0

nav.addEventListener('touchstart', (e) => {
    item.style.transition = 'none'
    startx = e.changedTouches[0].clientX
    elemx = damu.css(item, 'translateX')

    lastTime = new Date().getTime()
    lastPoint = elemx
    // 清除上一次的快速滑屏的位移差
    deltaDis = 0
})

nav.addEventListener('touchmove', (e) => {

    disx = e.changedTouches[0].clientX - startx
    var translatex = elemx + disx

    nowTime = new Date().getTime()
    nowPoint = translatex
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
    if (translatex > 0) {
        item.isOutOfRange = true
        // translatex = 0
        // var scale = 1 - (disx / w) * 0.5 // 当 disx 大于 w 时, 出现负数
        var scale = w / ((w + disx) * 0.8)
        // translatex = elemx + disx * scale
        translatex = damu.css(item, 'translateX') + deltaDis * scale
    } else if (translatex < minx) {
        item.isOutOfRange = true
        // translatex = minx
        var over = minx - translatex
        var scale = w / ((w + over) * 0.8)
        // translatex = elemx + disx * scale
        translatex = damu.css(item, 'translateX') + deltaDis * scale
    }
    damu.css(item, 'translateX', translatex)

})

nav.addEventListener('touchend', (e) => {

    var translatex = damu.css(item, 'translateX')

    if (item.isOutOfRange) {
        // 超过了内容的两边
        item.style.transition = '.8s transform'

        if (translatex > 0) {
            translatex = 0
            damu.css(item, 'translateX', translatex)
        } else if (translatex < minx) {
            translatex = minx
            damu.css(item, 'translateX', translatex)
        }

        item.isOutOfRange = !item.isOutOfRange

    } else {
        // console.log(deltaDis, deltaTime)

        // 速度越大，位移越大
        var speed = deltaDis / deltaTime
        speed = Math.abs(speed) < 0.3 ? 0 : speed
        // console.log("speed: " + speed)

        var time = Math.abs(speed) * 0.2
        time = time < 0.6 ? 0.6 : time
        time = time > 1.2 ? 1.2 : time
        // console.log("time: " + time)

        translatex = translatex + speed * 400

        var bezier = ''
        if (translatex > 0) {
            translatex = 0
            bezier = 'cubic-bezier(0,1.33,.39,1.57)'
        } else if (translatex < minx) {
            translatex = minx
            bezier = 'cubic-bezier(0,1.33,.39,1.57)'
        }

        item.style.transition = time + 's ' + bezier + ' transform'
        
        damu.css(item, 'translateX', translatex)
    }
    
})


// var imgUrls = ['img/01.jpg', 'img/02.jpg', 'img/03.jpg', 'img/04.jpg', 'img/05.jpg', ]
// Carousel(imgUrls)
