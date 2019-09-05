
import damu from './transform'


function Carousel(imgUrls) {

    const d = document
    const w = d.documentElement.clientWidth

    var carouselWrap = d.querySelector('.carousel-wrap')

    if (carouselWrap) {

        var needAuto = carouselWrap.getAttribute('needAuto')
        var needCarousel = carouselWrap.getAttribute('needCarousel')
        var needIndicator = carouselWrap.getAttribute('needIndicator')


        var pointsLen = imgUrls.length
        if (needCarousel !== null) {
            imgUrls = imgUrls.concat(imgUrls)
        }

        //
        var ulNode = d.createElement('ul')
        ulNode.style.width = imgUrls.length + '00%'
        for (var x = 0; x < imgUrls.length; x++) {
            ulNode.innerHTML += '<li style="width:' + (100 * 1/imgUrls.length) + '%;"><a href="javascript:;"><img src="' + imgUrls[x] + '"></a></li>'
        }
        ulNode.classList.add('list')
        carouselWrap.appendChild(ulNode)

        //
        var imgNode = d.querySelector('.carousel-wrap .list img')
        setTimeout(function() {
            // debugger
            carouselWrap.style.height = imgNode.offsetHeight + 'px'
        }, 200)

        //
        
        if (needIndicator !== null) {
            var pointsWrap = d.createElement('div')
            for (var x = 0; x < pointsLen; x++) {
                if (x == 0) {
                    pointsWrap.innerHTML += '<span class="on"></span>'
                } else {
                    pointsWrap.innerHTML += '<span></span>'
                }
            }
            pointsWrap.classList.add('points-wrap')
            carouselWrap.appendChild(pointsWrap)
            var points = pointsWrap.querySelectorAll('span')
        }


        var startx = 0
        var starty = 0
        var elemx = 0
        var index = 0
        var disx = 0
        var disy = 0
        var isX = true
        var isFirst = true
        //
        carouselWrap.addEventListener('touchstart', function(e) {
            isX = true
            isFirst = true
            clearInterval(timer)
            ulNode.style.transition = 'none'
            startx = e.changedTouches[0].clientX
            starty = e.changedTouches[0].clientY

            if (needCarousel !== null) {
                // 1.1 -> 2.1, 2.n -> 1.n
                index = damu.css(ulNode, 'translateX') / w
                if (index == 0) {
                    index = -pointsLen
                } else if (index == 1-imgUrls.length) {
                    index = 1-pointsLen
                }
                damu.css(ulNode, 'translateX', index * w)
            }

            elemx = damu.css(ulNode, 'translateX')
        })

        carouselWrap.addEventListener('touchmove', function(e) {

            if (!isX) {
                return
            }

            disx = e.changedTouches[0].clientX - startx
            disy = e.changedTouches[0].clientY - starty

            if (isFirst) {
                isFirst = false
                if (Math.abs(disx) < Math.abs(disy)) {
                    isX = false
                    return
                }
            }

            damu.css(ulNode, 'translateX', elemx + disx)
        })

        carouselWrap.addEventListener('touchend', function(e) {
            index = damu.css(ulNode, 'translateX') / w
            index = Math.round(index)
            // index = disx > 0 ? Math.ceil(index) : Math.floor(index)
            if (index > 0) {
                index = 0
            } else if (index < 1-imgUrls.length) {
                index = 1-imgUrls.length
            }
            toCurPoint(index)
            damu.css(ulNode, 'translateX', index * w)
            ulNode.style.transition = '.6s transform'
            if (needAuto !== null) {
                auto()
            }
        })

        //
        function toCurPoint(index) {
            if (needIndicator === null) {
                return
            }
            for (var x = 0; x < points.length; x++) {
                points[x].classList.remove('on')
            }
            points[-index%pointsLen].classList.add('on')
        }

        //
        var timer = null
        if (needAuto !== null) {
            auto()
        }
        function auto() {
            clearInterval(timer)
            timer = setInterval(function() {
                if (index == 1-imgUrls.length) {
                    index = 1-imgUrls.length/2
                    ulNode.style.transition = 'none'
                    damu.css(ulNode, 'translateX', index * w)
                }
                
                setTimeout(function() {
                    index--
                    toCurPoint(index)
                    ulNode.style.transition = '.6s transform'
                    damu.css(ulNode, 'translateX', index * w)
                }, 50)
            }, 3000)
        }
    }

}

export default Carousel
