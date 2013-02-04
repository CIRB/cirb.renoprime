var LANG=0;
var EMBELLIS_MODE=false;
var address_wb_url;
var wms_cirb_url;
var urlBrugis;
var currentDate;

var language=["FR","NL"];

var isoCurrentDate='';
var isoLowerDate='';
 
function format_integer(num) {
    var res=''+num;
    if(res.length<2)
        return res='0'+res;
    else
        return res; 
}



$(document).ready(function() {
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
    
    isoCurrentDate=currentDate.getFullYear()+
                '-'+format_integer((currentDate.getMonth()+1))+
                '-'+format_integer(currentDate.getDate());


    isoLowerDate=currentDate.getFullYear()-4+
                '-'+format_integer((currentDate.getMonth()+1))+
                '-'+format_integer((currentDate.getDate()+1));


    // prefix_gis_url = $('#map').data('gisurl');                    
    // address_wb_url = prefix_gis_url+"service/urbis/Rest/Localize/getaddresses";
    address_wb_url = "/gis/service/urbis/Rest/Localize/getaddresses";
    //wms_cirb_url = prefix_gis_url+"geoserver/wms";
    wms_cirb_url = "/gis/geoserver/wms";

    prefix_mybrugis_url = $('#map').data('mybrugisurl');
    urlBrugis = "/proxy/geoserver/ows"; 

    init();

});
