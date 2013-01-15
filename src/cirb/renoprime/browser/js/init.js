var LANG=0;
var EMBELLIS_MODE=false;
var address_wb_url;
var wms_cirb_url;
var urlBrugis;
var currentDate;

var language=["FR","NL"];

$(document).ready(function(){
    if ($('body.template-reno_view').length==0 && $('body.template-prime_view').length==0) {return}
    if ($('body.template-reno_view').length==0){EMBELLIS_MODE=true;}
    site_language = $('html').attr('lang');
    if (site_language == "nl") {
        LANG = 1;
    } else {
        LANG = 0;
    }
    
    today = $('#map').data('today');                    
    currentDate=new Date(today);
    
    prefix_gis_url = $('#map').data('gisurl');                    
    address_wb_url = prefix_gis_url+"service/urbis/Rest/Localize/getaddresses";
    wms_cirb_url = prefix_gis_url+"geoserver/wms";

    prefix_mybrugis_url = $('#map').data('mybrugisurl');
    urlBrugis = prefix_mybrugis_url+"geoserver/ows"; 

    init();
})
