/*
 * Site: Primes à la rénovation / à l'embellissement
 * URL: http://www.primes-renovation.be/index.php
 * File: renove3.0.js
 *
 * @author fkrzewinski@cirb.irisnet.be inspired by the work of Jean-Paul Dzisiak
 * @version november 2012                                             
 */


var map, lyrUrbIS, lyrRates;


// Rates results
var zone, rates, localisation, embelisOutzone;


// PRIME A L'EMBELLISSEMENT
// @see http://prm.irisnet.be/Pages/Facades/FR/Doc/Circulaire_facades.pdf
// +------------------+---------------------+-------+--------------------+--------+-----------+
// | Conditions       | Contrat de quartier | EDRLR | Espace Structurant | ZICHEE | Hors Zone |
// +------------------+---------------------+-------+--------------------+--------+-----------+
// |revenus <= 40000€ |          85 %       | 75 %  |       75 %         |   75 % |   55 %    |
// +------------------+---------------------+-------+--------------------+--------+-----------+
// |revenus > 40000€  |          75 %       | 50 %  |       50 %         |   50 % |   30 %    |
// +------------------+---------------------+-------+--------------------+--------+-----------+
// Notre immeuble est en partie situé dans un périmètre de contrat de quartier et en partie
// dans une ZICHEE. Quel taux lui sera-t-il appliqué ? Le taux le plus favorable, c’est-à-dire
// le taux en vigueur dans le périmètre de contrat de quartier

// PRIME A LA RENOVATION
// @see http://prm.irisnet.be/Pages/Reno/FR/Doc/notice.pdf
// +------------------+---------------------+-------+----------------+
// | Conditions       | Contrat de quartier | EDRLR | Hors Périmètre |
// +------------------+---------------------+-------+----------------+
// |revenus <= 30000€ |          70 %       | 70 %  |       70 %     |
// +------------------+---------------------+-------+----------------+
// |30000€ <=         |                     |       |                |
// |revenus <= 60000€ |          50 %       | 40 %  |       30 %     |
// +------------------+---------------------+-------+----------------+
// |revenus > 60000€  |          40 %       | 30 %  |       0 %      |
// +------------------+---------------------+-------+----------------+

// This method is a facade for selecting the rates type
function populateAccordion(idResults) {
    var noteExtraI18n = [
        "Vérifiez si votre bâtiment se situe le long d’une rue appartenant à l’espace structurant. Si c’est le cas, il bénéficie peut-être des primes qui sont liées à cette zone." +
        "Les conditions d'octroi et le taux de la prime y afférent sont consultables via la page home.",
        "Controleert of uw gebouw zich bevindt langs een straat in de structurerende ruimte. Indien dat het geval is, geniet hij misschien van de premies die eigen zijn aan deze zone." +
        "De toekenningsvoorwaarden en het bedrag van de premie zijn na te gaan via de homepagina."];

    var noteI18n = [
        "* Le type de zone est donné à titre indicatif. Il sera verifié par le service logement sur la base de votre dossier. ",
        "* De zone geeft u ter informatie. Ze zal gecontroleerd worden door de dienst huisvesting op basis van uw dossier. "];

    var infoURLI18n = ["http://prm.irisnet.be/Pages/Facades/fr/BA_Ba.asp#prime",
        "http://prm.irisnet.be/Pages/Facades/nl/BA_Ba.asp#prime"];

    // gets rates
    var noteI18nMsg = noteI18n[LANG];

    if (EMBELLIS_MODE) 
    {
        getEmbellisRates(idResults);
        if (embelisOutzone) 
        {
            noteI18nMsg = noteI18nMsg + noteExtraI18n[LANG];
        }
    } 
    else 
    {
        getRenoveRates(idResults);
    }

    $('#ratesLoc').html('<p></p>');
    $("#ratesZone").text(zone);
    $("#ratesInfo").text(rates);
    $("#ratesNote").text(noteI18nMsg);
    $("#infoURL").text(infoURLI18n[LANG]);
  
}

/*
 * This method process the messages for the Embellissement rates
 * to be displayed in the Dojo's Rates Accordion panel. It uses
 * the results from a user identification when she clicks on the Map.
 *
 * ArcGIS Services Directory - prime_embellis
 * ZICHEE (0)
 * ESPACE_STRUCTURANT (1)
 * CONTRAT_QUARTIER (2)
 * EDRLR (3)
 */
function getEmbellisRates(idResults) {
    // default rates (outside zones)
    var prime_lower40K = 55;
    var prime_upper40K = 30;

    // localisations on the Map
    var localisationI18n = [];
    localisationI18n[0] = ["Centre de la carte", "midden van de kaart"];

    // geolocalized rate zones
    var zoneI18n = [];
    //zoneI18n[0] = ["Zone non prioritaire", "Niet prioritaire zone"];
    zoneI18n[0] = ["Zone hors périmètre", "Zone buiten omtrek"];
    zoneI18n[1] = ["Zone ZICHEE", "GCHEWS zone"];
    zoneI18n[2] = ["Zone espace structurant ", "Structurerende ruimte zone"];
    zoneI18n[3] = ["Zone contrat de quartier", "Wijkcontract zone"];
    zoneI18n[4] = ["Zone EDRLR", "RVOHR zone"];

    // displayed geolocalized rates
    var ratesI18n = [];
    ratesI18n[0] = ["Revenus inférieurs à 40.000€ : {0}%, supérieurs à 40.000€ : {1}%",
        "Inkomen lager dan 40.000€ : {0}%, hoger dan 40.000€ : {1}%"];    
    ratesI18n[1]=["Revenus inférieurs à 40.000€ : {0}%","Inkomen lager dan 40.000€ : {0}%"];
    ratesI18n[2]=["Revenus supérieurs à 40.000€ : {1}%","Inkomen hoger dan 40.000€ : {1}%"];

    // outside zones
    embelisOutzone = true;
    localisation = localisationI18n[0][LANG];
    zone = zoneI18n[0][LANG];

    for (var i = 0, il = idResults.length; i < il; i++) {
        var idResult = idResults[i];
        switch (idResult.layerId) {
            case 2: // ZICHEE
                embelisOutzone = false;
                if (prime_lower40K < 75) {
                    prime_lower40K = Math.max(prime_lower40K, 75);
                    prime_upper40K = Math.max(prime_upper40K, 50);
                    zone = zoneI18n[1][LANG];
                }
                break;
            case 0: // CONTRAT_QUARTIER
                embelisOutzone = false;
                //var serie = idResult.feature.attributes['SERIE'];
                //var found = lookup(CONTRAT_QUARTIER_SERIES, serie);
                if ((prime_lower40K < 85)) {
                    prime_lower40K = Math.max(prime_lower40K, 85);
                    prime_upper40K = Math.max(prime_upper40K, 75);
                    zone = zoneI18n[3][LANG]+ " "+ serie;
                }
                break;
            case 1: // EDRLR
                embelisOutzone = false;
                if (prime_lower40K < 75) {
                    prime_lower40K = Math.max(prime_lower40K, 75);
                    prime_upper40K = Math.max(prime_upper40K, 50);
                    zone = zoneI18n[4][LANG];
                }
                break;
            case 3: // ESPACE_STRUCTURANT_EXTENDED (last case and for the LayerId = 4)
                embelisOutzone = false;
                if (prime_lower40K < 75) {
                    prime_lower40K = Math.max(prime_lower40K, 75);
                    prime_upper40K = Math.max(prime_upper40K, 50);
                    zone = zoneI18n[2][LANG];
                }
                break;
        }
    }
    
    
    var income=$('#income').val();
    if(income==null||income.length==0)
    {
        //global msg        
        rates = substitute(ratesI18n[0][LANG], prime_lower40K, prime_upper40K);
    }
    else
    {
    if(income>40000)
    {
        // income > 40000           
            rates = substitute(ratesI18n[2][LANG], prime_lower40K, prime_upper40K);
    }
    else
    {
        // income <= 40000      
        rates = substitute(ratesI18n[1][LANG], prime_lower40K, prime_upper40K);
    }
    }
    
    
}

/*
 * This method process the messages for the Renovation rates
 * to be displayed in the Dojo's Rates Accordion panel. It uses
 * the results from a user identification when she clicks on the Map.
 *
 * ArcGIS Services Directory - prime_renove
 * CONTRAT_QUARTIER (1)
 * EDRLR (2)
 */
function getRenoveRates(idResults) {
    // default rates (outside zones)
    var prime_lower30K = 70;
    var prime_between30_60K = 30;
    var prime_upper60K = 0;

    // localisations on the Map
    var localisationI18n = [];
    localisationI18n[0] = ["Centre de la carte", "midden van de kaart"];

    // geolocalized rate zones
    var zoneI18n = [];
    //zoneI18n[0] = ["Zone non prioritaire", "Niet prioritaire zone"];
    zoneI18n[0] = ["Zone hors périmètre", "Zone buiten omtrek"];
    zoneI18n[1] = ["Zone contrat de quartier", "Wijkcontract zone"];
    zoneI18n[2] = ["Zone EDRLR", "RVOHR zone"];

    // displayed geolocalized rates
    var ratesI18n = [];
    /*["Revenus inférieurs à 30000 € : {0}%, entre 30000 et 60000€ : {1}%, revenus supérieurs à 60000€ : {2}%",
        "Inkomen lager dan 30000€ : {0}%, tussen 30000 en 60000€ : {1}%, inkomen hoger dan 60000€ : {2}%"];*/
    ratesI18n[0] = ["Revenus inférieurs à 30000 € : {0}%, entre 30000 et 60000€ : {1}%, revenus supérieurs à 60000€ : {2}%",
                    "Inkomen lager dan 30000€ : {0}%, tussen 30000 en 60000€ : {1}%, inkomen hoger dan 60000€ : {2}%"];
    ratesI18n[1] = ["Revenus inférieurs à 30000 € : {0}%",
                        "Inkomen lager dan 30000€ : {0}%"];
    ratesI18n[2] = ["Revenus entre 30000 et 60000€ : {1}%",
                    "Inkomen tussen 30000 en 60000€ : {1}%"];
    ratesI18n[3] = ["Revenus supérieurs à 60000€ : {2}%",
                    "Inkomen inkomen hoger dan 60000€ : {2}%"];
    localisation = localisationI18n[0][LANG];
    zone = zoneI18n[0][LANG];

    if(isEDRLRPresent===true || isQuartierPresent===true)    
    {
        for (var i = 0, il = idResults.length; i < il; i++) {
            var idResult = idResults[i];
            switch (idResult.layerId) {
            case 0: // CONTRAT_QUARTIER
                if (prime_between30_60K < 50) {
                    prime_lower30K = Math.max(prime_lower30K, 70);
                    prime_between30_60K = Math.max(prime_between30_60K, 50);
                    prime_upper60K = Math.max(prime_upper60K, 40);
                    zone = zoneI18n[1][LANG]+ " "+ serie;
                }
                break;
            case 1: // EDRLR
                if (prime_between30_60K < 40) {
                    prime_lower30K = Math.max(prime_lower30K, 70);
                    prime_between30_60K = Math.max(prime_between30_60K, 40);
                    prime_upper60K = Math.max(prime_upper60K, 30);
                    zone = zoneI18n[2][LANG];
                }
                break;
            }
        }
        //rates = substitute(ratesI18n[LANG], prime_lower30K, prime_between30_60K, prime_upper60K);
    }
    
    var income=$('#income').val();
    if(income==null||income.length==0)
    {
        //global msg
        rates = substitute(ratesI18n[0][LANG], prime_lower30K, prime_between30_60K, prime_upper60K);
    }
    else
    {
    if(income>=30000)
    {
        if(income<=60000)
        {
            //income income>=30000 && income<=60000) 
            rates = substitute(ratesI18n[2][LANG], prime_lower30K, prime_between30_60K, prime_upper60K);
        }
        else
        {
            // income > 60000
            rates = substitute(ratesI18n[3][LANG], prime_lower30K, prime_between30_60K, prime_upper60K);
        }
    }
    else
    {
        //income < 30k
        rates = substitute(ratesI18n[1][LANG], prime_lower30K, prime_between30_60K, prime_upper60K);
    }
    }
    
}

//string substitution
//elements to substitute: {0} {1} ...
function substitute() {
 var args = substitute.arguments;
 var Base = args[0];
 var Seek,Len,ix1,ix2,ix3;
 for (ix1 = 1; ix1 < args.length; ix1++) {
     ix2 = ix1 - 1;
     Seek = '{' + ix2 + '}';
     if ((ix3 = Base.indexOf(Seek)) > -1) {
         Len = Seek.length;
         Base = Base.substring(0, ix3) + args[ix1] + Base.substring(ix3 + Len);
     }
 }
 return Base;
}
