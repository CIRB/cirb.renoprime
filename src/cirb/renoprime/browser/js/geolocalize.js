/*
 * Site: Primes à la rénovation / à l'embellissement
 * URL: http://www.primes-renovation.be/index.php
 * File: geolocalize.js
 *
 * @author fkrzewinski@cirb.irisnet.be inspired by the work of Jean-Paul Dzisiak
 * @version november 2012
 */


function geolocalize(addressValue, language, viewObject) {
    $.get(address_wb_url, { language: language, address:addressValue }, function(data) {
        viewObject.clear();
        data=jQuery.parseJSON(data);
        if(data.status=='success')  {
            viewObject.populate(data.result);
            var firstLink=$("#addressList").eq(0).children("tbody").eq(0).children("tr").eq(0).children("td").eq(0).children("a");
            if(firstLink!=null) {
                firstLink.click();
            }
        }
        else {
            //msg error to display
            viewObject.error(data);
        }
    });
}

function localize(x,y,map,msg) {
    map.setCenter(new OpenLayers.LonLat(x,y), 7);

    var size = new OpenLayers.Size(21,25);
    var offset = new OpenLayers.Pixel(-(size.w/2), -size.h);
    var icon = new OpenLayers.Icon('images/marker.png', size, offset);
    markers.clearMarkers();

    markers.addMarker(new OpenLayers.Marker(new OpenLayers.LonLat(x,y),icon));
    //requesting which layers are present at x y, so we emulate a click on a map with the info control WMSGetFeatureInfo

    /*
       clickPosition  {OpenLayers.Pixel} The position on the map where the mouse event occurred.
       options    {Object} additional options for this method.
       */

    info.request(map.getViewPortPxFromLonLat(map.getCenter()) );

}

function localize_with_addess(x, y, map, msg) {
    localize(x, y, map, msg);
    $('#ratesAddress').html(unescape(msg));
}
