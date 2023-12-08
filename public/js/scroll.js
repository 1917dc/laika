$(document).ready(function(){
    $(window).scroll(function(){
        if($(this).scrollTop() > 300){
            $('#scroll').css("right","10px");
        } else {
            $('#scroll').css("right","-140px");
        }
    });

    $('#scroll').click(function(){
        // Scroll to the end of the page
        $("html, body").animate({ scrollTop: document.body.scrollHeight }, 600);
        return false;
    });
});
