window.addEventListener('load', function () {
    document.querySelectorAll('.evenOffsetWidths').forEach(function (_) {
        var r = '_' + Math.random().toString(36).substr(2, 10).toString();
        _.classList.add(r);
        var direct_descendants = document.querySelectorAll('.' + r + ' > *');
        var maximus = Math.max.apply(null, Array.prototype.slice.call(direct_descendants).map(function (__) {
            return __.offsetWidth;
        }));
        direct_descendants.forEach(function(__){
            __.style.width = maximus + 'px';
        })
    });
});

