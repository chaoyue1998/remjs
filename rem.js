;(function(win, lib) {
    var doc = win.document;
    var docEl = doc.documentElement;
    var metaEl = doc.querySelector('meta[name="viewport"]');
    var designEl = doc.querySelector('meta[name="design"]');
    var dpr = 0;
    var scale = 0;
    var dsw = 480;
    var tid;
    var flexible = lib.flexible || (lib.flexible = {});
    
    if (metaEl) {
        console.warn('将根据已有的meta标签来设置缩放比例');
        var match = metaEl.getAttribute('content').match(/initial\-scale=([\d\.]+)/);
        if (match) {
            scale = parseFloat(match[1]);
            dpr = parseInt(1 / scale);
        }
    }
    // 通过design设计稿
    if (designEl) {
        var content = designEl.getAttribute('content');
        if (content) {
            var designWidth = content.match(/design\-width=([\d\.]+)/);
            var maxWidth = content.match(/max\-width=([\d\.]+)/);
            if (designWidth) {
                dsw = parseFloat(designWidth[1]);
            }
            if (maxWidth) {
                var css = 'body { max-width:' + maxWidth[1] +'px; }',
                style = document.createElement('style');
                style.type = 'text/css';
                if (style.styleSheet){
                  style.styleSheet.cssText = css;
                } else {
                  style.appendChild(document.createTextNode(css));
                }
                writeHead(style)
            }
        }
    }

    if (!dpr && !scale) {
        var isAndroid = win.navigator.appVersion.match(/android/gi);
        var isIPhone = win.navigator.appVersion.match(/iphone/gi);
        var devicePixelRatio = win.devicePixelRatio;
        if (isIPhone) {
            // iOS下，对于2和3的屏，用2倍的方案，其余的用1倍方案
            if (devicePixelRatio >= 3 && (!dpr || dpr >= 3)) {                
                dpr = 3;
            } else if (devicePixelRatio >= 2 && (!dpr || dpr >= 2)){
                dpr = 2;
            } else {
                dpr = 1;
            }
        } else {
            // 其他设备下，仍旧使用1倍的方案
            dpr = 1;
        }
        scale = 1 / dpr;
    }

    docEl.setAttribute('data-dpr', dpr);
    if (!metaEl) {
        metaEl = doc.createElement('meta');
        metaEl.setAttribute('name', 'viewport');
        metaEl.setAttribute('content', 'initial-scale=' + scale + ', maximum-scale=' + scale + ', minimum-scale=' + scale + ', user-scalable=no');
        writeHead(metaEl);
    }

    // 写入头部
    function writeHead(el) {
        if (docEl.firstElementChild) {
            docEl.firstElementChild.appendChild(el);
        } else {
            var wrap = doc.createElement('div');
            wrap.appendChild(el);
            doc.write(wrap.innerHTML);
        }
    }

    // 设置html的rem
    function refreshRem(){
    	// docEl.clientWidth客户端宽度
    	// docEl.getBoundingClientRect().width 文档宽度
        var width = docEl.clientWidth || docEl.getBoundingClientRect().width;
        if (width / dpr > 540) {
            width = 540 * dpr;
        }
        // var rem = width / 10;
        var rem = 100 * (width / dsw);
        docEl.style.fontSize = rem + 'px';
        flexible.rem = win.rem = rem;
    }
	refreshRem();

    win.addEventListener('resize', function() {
        clearTimeout(tid);
        tid = setTimeout(refreshRem, 300);
    }, false);
    win.addEventListener('pageshow', function(e) {
        if (e.persisted) {
            clearTimeout(tid);
            tid = setTimeout(refreshRem, 300);
        }
    }, false);

    // 设置body字体大小
    if (doc.readyState === 'complete') {
        doc.body.style.fontSize = 12 * dpr + 'px';
    } else {
        doc.addEventListener('DOMContentLoaded', function(e) {
            doc.body.style.fontSize = 12 * dpr + 'px';
        }, false);
    }
    
    flexible.dpr = win.dpr = dpr;
    flexible.refreshRem = refreshRem;
    flexible.rem2px = function(d) {
        var val = parseFloat(d) * this.rem;
        if (typeof d === 'string' && d.match(/rem$/)) {
            val += 'px';
        }
        return val;
    }
    flexible.px2rem = function(d) {
        var val = parseFloat(d) / this.rem;
        if (typeof d === 'string' && d.match(/px$/)) {
            val += 'rem';
        }
        return val;
    }

})(window, window['lib'] || (window['lib'] = {}));