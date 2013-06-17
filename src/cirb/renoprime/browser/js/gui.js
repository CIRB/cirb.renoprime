/*
 * Site: Primes à la rénovation / à l'embellissement
 * URL: http://www.primes-renovation.be/index.php
 * File: gui.js
 *
 * @author fkrzewinski@cirb.irisnet.be inspired by the work of Jean-Paul Dzisiak
 * @version november 2012
 */

var addressGUI;

function doSearch() {
    //show loading page
    var addressValue=$('#address').val();
    geolocalize(addressValue,language[LANG],addressGUI);
}

$(document).ready(function(){
    addressGUI=$('#addressList');
    addressGUI.clear=function()
    {

    };

    addressGUI.populate=function(data) {
        var items="";   
        var noresultI18n = ["Pas de r&eacute;sultats trouv&eacute;s", "Geen resultaten gevonden"];
        var header=["S&eacute;lectionnez une des adresses trouv&eacute;es :<br />",
            "Selecteer een van de gevonden adressen:<br />"];
        if(data && data.length>0) {
            //var htmlText = "<table class='ResultTable'>";
            items=header[LANG];
            for(var i=0;i<data.length;i=i+1) {
                var textR="";
                number = data[i].address.number;
                if (number != ""){
                    textR = number+", ";
                }
                textR=textR+data[i].address.street.name+' '+data[i].address.street.postCode+' '+data[i].address.street.municipality;
                var text="<tr> <td> <a href='#" +i+"' onClick='localize("+data[i].point.x+','+data[i].point.y+",map,null);'>";
                items=items+text+textR+'</td> </tr>';

            }
            //htmlText = htmlText+items+ "</table>";
            //items=htmlText;
        }
        else {
            items=noresultI18n[LANG];
        }


        var result=this;
        result.html(items);
    };


    addressGUI.error=function(error) {
        var noresultI18n = ["Pas de r&eacute;sultats trouv&eacute;s", "Geen resultaten gevonden"];

        this.html(noresultI18n[LANG]);
    };

    $('#address_form').submit( function(){
        doSearch();
        return false;
    });

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


