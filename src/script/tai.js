
// CSS
import '../css/common.css'

// LESS
import '../css/tai.less'
import '../css/drag-nav.less'
import '../css/carousel.less'

// JS
import DragNav from './drag-nav'
import Carousel from './carousel'
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
DragNav(nav, item)

// carousel
var imgUrls = ['img/1.jpg', 'img/2.jpg', 'img/3.jpg', 'img/4.jpg', 'img/5.jpg', ]
Carousel(imgUrls)

// tap
let jump = (content, dis) => {

    if (Math.abs(dis.x) > tabWidth/2) {
        content.isJumped = true

        // 判断方向
        content.now = dis.x < 0 ? ++content.now : --content.now
        // 判断是否越界
        if (content.now > content.aNodes.length-1) {
            content.now = 0
        } else if (content.now < 0) {
            content.now = content.aNodes.length-1
        }
        if (content.aNodes[content.now].offsetWidth != content.gMask.offsetWidth) {
            content.gMask.style.width = content.aNodes[content.now].offsetWidth + 'px'
            console.log('变了变了...')
        }
        damu.css(content.gMask, 'translateX', content.aNodes[content.now].offsetLeft)

        content.style.transition = '.8s transform'
        var targetx = dis.x > 0 ? 0 : -2*tabWidth
        damu.css(content, 'translateX', targetx)

        content.addEventListener('transitionend', fn)
        function fn() {
            // 只执行一次
            content.removeEventListener('transitionend', fn)

            for (var x = 0; x < content.loadings.length; x++) {
                content.loadings[x].style.opacity = 1
            }

            setTimeout(() => {
                content.isJumped = false

                content.style.transition = 'none'
                damu.css(content, 'translateX', -tabWidth)

                for (var x = 0; x < content.loadings.length; x++) {
                    content.loadings[x].style.opacity = 0
                }

                console.log(new Date())
            }, 3000)

        }
    }
}

let move = (content) => {
    content.loadings = content.querySelectorAll('.tab-loading')
    content.gMask = content.parentNode.querySelector('.tab-nav .g-mask')
    content.aNodes = content.parentNode.querySelectorAll('.tab-nav a')
    content.gMask.style.width = content.aNodes[0].offsetWidth + 'px'
    // 调整内容位置
    damu.css(content, 'translateX', -tabWidth)
    content.isJumped = false

    var elemx = 0
    var start = {x: 0, y: 0}
    var dis = {x: 0, y: 0}
    var isFirst = true
    var isX = true

    content.addEventListener('touchstart', function(e) {
        if(content.isJumped) {
            return
        }

        content.style.transition = 'none'
        start.x = e.changedTouches[0].clientX
        start.y = e.changedTouches[0].clientY
        elemx = damu.css(content, 'translateX')
        isFirst = true
        isX = true
    })

    content.addEventListener('touchmove', function(e) {
        if (content.isJumped || !isX) {
            return 
        }

        dis.x = e.changedTouches[0].clientX - start.x
        dis.y = e.changedTouches[0].clientY - start.y

        if (isFirst) {
            isFirst = false
            if (Math.abs(dis.x) < Math.abs(dis.y)) {
                isX = false
                return
            }
        }

        var translatex = elemx + dis.x
        damu.css(content, 'translateX', translatex)

        jump(content, dis)
    })

    content.addEventListener('touchend', function(e) {
        if(content.isJumped) {
            return
        }
        
        // // 判断是否满足移动的条件, 超过一半才移动
        if (Math.abs(dis.x) <= tabWidth/2) {
            content.style.transition = '.8s transform'
            damu.css(content, 'translateX', -tabWidth)
        }
    })
}

var tabWrap = doc.querySelector('.tab-wrap')
var tabWidth = tabWrap.offsetWidth
// content既是滑屏区域，又是滑屏元素
var contentNodes = doc.querySelectorAll('.tab-wrap .tab-content')
for (var x = 0; x < contentNodes.length; x++) {
    contentNodes[x].now = 0
    move(contentNodes[x])
}
