var LANG=0;
var EMBELLIS_MODE=false;
var address_wb_url;
var wms_cirb_url;
var gis_basemap_url_prefix;
var gis_localization_url_prefix;
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


    gis_basemap_url_prefix = $('#map').data('gis_basemap_url_prefix');
    wms_cirb_url = gis_basemap_url_prefix + "/geoserver/wms";

    gis_localization_url_prefix = $('#map').data('gis_localization_url_prefix');
    address_wb_url = gis_localization_url_prefix + "/Rest/Localize/getaddresses";
    
    urlBrugis = "/proxy/geoserver/ows";

    init();




});
