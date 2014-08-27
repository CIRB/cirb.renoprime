/*
 * Site: Primes à la rénovation / à l'embellissement
 * URL: http://www.primes-renovation.be/index.php
 * File: gui.js
 *
 * @author fkrzewinski@cirb.irisnet.be inspired by the work of Jean-Paul Dzisiak
 * @version november 2012
 */

var addressGUI;
var addressValue;

function doSearch() {
    //show loading page
    addressValue = $('#address').val();
    geolocalize(addressValue, language[LANG], addressGUI);
}

$(document).ready(function(){
    addressGUI=$('#addressList');

    addressGUI.populate=function(data) {
        var HTMLtable = "";
        var noresultI18n = ["<br />Pas de r&eacute;sultats trouv&eacute;s", "Geen resultaten gevonden"];
        var header=["<br />S&eacute;lectionnez une des adresses trouv&eacute;es :<br />",
            "<br />Selecteer een van de gevonden adressen:<br />"];
        if(data && data.length>0) {
            HTMLtable = header[LANG];
            HTMLtable = HTMLtable.concat("<table id='addressList'>");
            for(var i=0; i<data.length; i=i+1) {
                var address = "";
                number = data[i].address.number;
                if (number != ""){
                    address = number+", ";
                }
                street = data[i].address.street.name;
                postcode = data[i].address.street.postCode;
                municipality = data[i].address.street.municipality;
                x = data[i].point.x;
                y = data[i].point.y;
                address = address.concat(street, ' ', postcode, ' ', municipality);
                HTMLtable = HTMLtable.concat(
                    "<tr><td><a href=\"#",
                    i,
                    "\" onclick=\"localize_with_addess(",
                    x,
                    ",",
                    y,
                    ",map,\'",
                    escape(address),
                    "\');\">");
                HTMLtable = HTMLtable.concat(address, '</a></td></tr>');
            }
            HTMLtable = HTMLtable.concat("</table>");
        }
        else {
            HTMLtable = noresultI18n[LANG];
        }
        //this.replaceWith(HTMLtable);
        $("#addressList").replaceWith(HTMLtable);
    };


    addressGUI.error=function(error) {
        var noresultI18n = ["Pas de r&eacute;sultats trouv&eacute;s", "Geen resultaten gevonden"];
        this.html(noresultI18n[LANG]);
    };

    $('#contrats').change(function() {
        layer.setVisibility(this.checked);
    });

    $('#EDRLR').change(function() {
        layer_EDRLR.setVisibility(this.checked);
    });

    $('#espaces').change(function() {
        layer_espaces_structurants.setVisibility(this.checked);
    });

    $('#ZICHEE').change(function() {
        layer_Zichee.setVisibility(this.checked);
    });
})


