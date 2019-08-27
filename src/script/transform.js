
const css = function(node, action, val) {

    if (typeof node === 'object' && typeof node['transform'] === 'undefined') {
        node['transform'] = {}
    }

    if (arguments.length >= 3) {

        var text = ''
        
        node['transform'][action] = val
        for (var attr in node['transform']) {
            if (node['transform'].hasOwnProperty(attr)) {
                switch (attr) {
                    case 'translateX':
                    case 'translateY':
                        text += attr + '(' + node['transform'][attr] + 'px)'
                        break
                    case 'rotate':
                        text += attr + '(' + node['transform'][attr] + 'deg)'
                        break
                    case 'scale':
                            text += attr + '(' + node['transform'][attr] + ')'
                        break
                }
            }
        }

        node.style.transform = text

    } else if (arguments.length == 2) {

        val = node['transform'][action]
        
        if (typeof val === 'undefined') {
            switch (action) {
                case 'translateX':
                case 'translateY':
                case 'rotate':
                    val = 0
                    break
                case 'scale':
                    val = 1
                    break
            }   
        }

        return val
    }

}


export default {
    css
}