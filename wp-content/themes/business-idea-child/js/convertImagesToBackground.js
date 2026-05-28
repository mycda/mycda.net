window.addEventListener('load', function(){
    document.querySelectorAll('.convertImagesToBackground').forEach(function(_){
        _.querySelectorAll('img').forEach(function(__){
            __.style.visibility = 'hidden';
            __.parentElement.style.backgroundImage = 'url(' + __.src + ')';
        });
    });
});
