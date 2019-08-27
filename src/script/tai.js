

import '../css/carousel.css'
import Carousel from './carousel.js'

(function() {
    document.addEventListener('touchstart', function(e) {
        e.preventDefault()
    })
})()

var imgUrls = ['img/01.jpg', 'img/02.jpg', 'img/03.jpg', 'img/04.jpg', 'img/05.jpg', ]
Carousel(imgUrls)
