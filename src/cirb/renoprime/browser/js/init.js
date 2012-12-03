var LANG=0;
var EMBELLIS_MODE=false;

$(document).ready(function(){
    site_language = $('html').attr('lang');
    if (site_language == "nl") {
        LANG = 1;
    } else {
        LANG = 0;
    }
    init();
})
