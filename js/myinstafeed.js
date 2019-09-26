$(document).ready(function() {


    var userFeed = new Instafeed({
        get: 'user',
        userId: 'x3ziox',
        limit: 12,
        resolution: 'standard_resolution',
        accessToken: '19826354525.1677ed0.b4cc45acdf2942edbbc0c41a2e3c55f9',
        sortBy: 'most-recent',
        template: '<div class="col-lg-3 instaimg"><a href="{{image}}" title="{{caption}}" target="_blank"><img src="{{image}}" alt="{{caption}}" class="img-fluid"/></a></div>',
    });


    userFeed.run();

    
    // This will create a single gallery from all elements that have class "gallery-item"
    $('.gallery').magnificPopup({
        type: 'image',
        delegate: 'a',
        gallery: {
            enabled: true
        }
    });


});