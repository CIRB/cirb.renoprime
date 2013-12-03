/*
 * Site: Primes à la rénovation / à l'embellissement
 * URL: http://www.primes-renovation.be/index.php
 * File: map.js
 *
 * @author fkrzewinski@cirb.irisnet.be inspired by the work of Jean-Paul Dzisiak
 * @version november 2012
 */

var map, layer, layer_EDRLR, layer_espaces_structurants, layer_Zichee;

var info;
var markers;

var serie;

var infoDateSerie = ["(date de fin: ","(tot en met "];

var event;

function format_integer(num) {
    var res=''+num;
    if(res.length<2)
        return res='0'+res;
    else
        return res;
}

function init() {

    var options = {
        projection:"EPSG:31370",
        maxExtent:new OpenLayers.Bounds(16478.795,19244.928,285000,320000),
        units:"m"
    };

    OpenLayers.Projection.defaults["EPSG:31370"]=options;

    //OpenLayers.ProxyHost="/proxy?";

    var urbis_options = {
        zoom: 2,
        center: new OpenLayers.LonLat(150000, 170000),
        resolutions: [69.53831616210938, 34.76915808105469, 17.384579040527345, 8.692289520263673, 4.346144760131836, 2.173072380065918, 1.086536190032959, 0.5432680950164795, 0.2716340475082398, 0.1358170237541199],
        projection: new OpenLayers.Projection('EPSG:31370'),
        maxExtent: new OpenLayers.Bounds(16478.795,19244.928,285000,320000),
        units: "m"};

    map = new OpenLayers.Map( 'map' ,urbis_options);

    var urbisLayerName=['urbisFR','urbisNL'];

    var urbis_layer=new OpenLayers.Layer.WMS(
            urbisLayerName[LANG],
            wms_cirb_url,
            {layers: urbisLayerName[LANG], format: 'image/png' },
            {
                tileSize: new OpenLayers.Size(256,256),
        isBaseLayer: true,
        attribution: "Realized by means of Brussels UrbIS&reg;&copy;"
            }
            );

    //IE8 fix :
    /*$.get('getToday', function(data,status) {
        console.log('today '+data);
    });*/
    //console.log("isoLowerDate:"+isoLowerDate);
    //console.log("currentDate:"+isoCurrentDate);
    div_map =  $('#map');
    if (typeof div_map != 'undefined'){
        currentDate=new Date();
        isoCurrentDate=currentDate.getFullYear()+
                '-'+format_integer((currentDate.getMonth()+1))+
                '-'+format_integer(currentDate.getDate());


        isoLowerDate=currentDate.getFullYear()-4+
                '-'+format_integer((currentDate.getMonth()+1))+
                '-'+format_integer((currentDate.getDate()+1));

    }

    var filter = new OpenLayers.Filter.Comparison({
        type: OpenLayers.Filter.Comparison.BETWEEN,
        property: "NOTIF_COMM",
        lowerBoundary: isoLowerDate,
        upperBoundary: isoCurrentDate
    });

    var parser = new OpenLayers.Format.Filter.v1_1_0();
    var filterAsXml = parser.write(filter);
    //console.log("FILTER XML:"+filterAsXml);
    var xml = new OpenLayers.Format.XML();
    var filterAsString = xml.write(filterAsXml);

    layer = new OpenLayers.Layer.WMS( "Contrats de quartier",
            urlBrugis,
            {   layers: 'Contrats_de_quartier',
                version:'1.3.0',
          transparent: "true",
          format: 'image/png'
            },
            {isBaseLayer: false}
            );

    //console.log("FILTEr:"+filterAsString);

    layer.params["FILTER"] = filterAsString;

    layer_EDRLR = new OpenLayers.Layer.WMS( "EDRLR",
            urlBrugis,
            {   layers: 'EDRLR',
                version:'1.3.0',
                transparent: "true",
                format: 'image/png'
            },
            {isBaseLayer: false}
            );

    layer_batiment=new OpenLayers.Layer.WMS("Batiment Urbis",
            prefix_gis_url+"geoserver/ows",
            {'layers': 'urbis:URB_A_BU', transparent: true, format: 'image/png',visible:false},
            {isBaseLayer: false,visible:false}
            );

    //urbis
    map.addLayer(urbis_layer);

    //contrat de quartier
    map.addLayer(layer);

    //EDRLR
    map.addLayer(layer_EDRLR);

    map.addLayer(layer_batiment);
    layer_batiment.setVisibility(false);


    var protocol;

    if(EMBELLIS_MODE)
    {
        layer_espaces_structurants = new OpenLayers.Layer.WMS( "Espaces_structurants",
                urlBrugis,
                {   layers: 'Espaces_structurants',
                    version:'1.3.0',
                    transparent: "true",
                    format: 'image/png'
                },
                {isBaseLayer: false}
                );

        layer_Zichee = new OpenLayers.Layer.WMS( "Zichee",
                urlBrugis,
                {   layers: 'Zichee',
                    version:'1.3.0',
                     transparent: "true",
                     format: 'image/png'
                },
                {isBaseLayer: false}
                );


        map.addLayer(layer_espaces_structurants);

        map.addLayer(layer_Zichee);

        protocol = new OpenLayers.Protocol.WFS.fromWMSLayer(layer_espaces_structurants);


    }

    markers = new OpenLayers.Layer.Markers( "Markers" );
    map.addLayer(markers);

    map.setCenter(new OpenLayers.LonLat(149642,171451), 3);


    isQuartierPresent=false;
    isEDRLRPresent=false;
    isZicheePresent=false;
    isEspacePresent=false;

    info = new OpenLayers.Control.WMSGetFeatureInfo({
        /*FILTER: 'FILTER='+filterAsString,
          filter: 'filter='+filterAsString,*/
        vendorParams:'filter=<ogc:Filter xmlns:ogc="http://www.opengis.net/ogc"><ogc:PropertyIsBetween><ogc:PropertyName>NOTIF_COMM</ogc:PropertyName><ogc:LowerBoundary><ogc:Literal>2008-12-05</ogc:Literal></ogc:LowerBoundary><ogc:UpperBoundary><ogc:Literal>2012-12-04</ogc:Literal></ogc:UpperBoundary></ogc:PropertyIsBetween></ogc:Filter>',
         url: urlBrugis,
         title: 'Identify features by clicking',
         layers: (function()
             {
                 if(EMBELLIS_MODE)
         {
             return [layer,layer_EDRLR,layer_espaces_structurants,layer_Zichee];
         }
                 else
         {
             return [layer,layer_EDRLR];
         }
             })(),
         infoFormat: 'application/vnd.ogc.gml',
         queryVisible: true,
         eventListeners: {

             getfeatureinfo: function(event) {
                 var size = new OpenLayers.Size(21,25);
                 var offset = new OpenLayers.Pixel(-(size.w/2), -size.h);
                 var icon = new OpenLayers.Icon('++resource++cirb.renoprime.img/marker.png', size, offset);
                 markers.clearMarkers();

                 markers.addMarker(new OpenLayers.Marker(map.getLonLatFromViewPortPx(event.xy),icon));


                 serie=null;
                 if (event.features && event.features.length)
                 {
                     for(var i=0;i<event.features.length;i++)
                     {
                         //console.log(event.features[i].fid);

                         if(event.features[i].fid.indexOf("EDRLR")>-1)
                         {
                             isEDRLRPresent=true;
                             event.features[i].layerId=1;
                         }

                         if(event.features[i].fid.indexOf("quartier")>-1)
                         {
                             //console.log("NOTIF_COMM:"+event.features[i].attributes.NOTIF_COMM);

                             var tempDate=new Date();
                             //2007-12-17
                             var dateSplit=(event.features[i].attributes.NOTIF_COMM).split('-');

                             tempDate.setFullYear(dateSplit[0]);
                             tempDate.setMonth(dateSplit[1]);
                             tempDate.setDate(dateSplit[2]);

                             tempDate.setMonth(tempDate.getMonth()-1);

                             tempDate.setDate(tempDate.getDate()-1);
                             tempDate.setFullYear(tempDate.getFullYear()+4);

                             //console.log(tempDate.toString());

                             if(tempDate>=currentDate)
                             {
                                 isQuartierPresent=true;
                                 event.features[i].layerId=0;

                                 /*
                                    serie=event.features[i].attributes["SERIE"];
                                    serie=serie.split("(")[1];
                                    serie="("+serie;
                                    */
                                 serie=infoDateSerie[LANG]+tempDate.getDate()+"/"+(tempDate.getMonth()+1)+"/"+tempDate.getFullYear()+")";
                             }
                         }

                         if(EMBELLIS_MODE)
                         {
                             if(event.features[i].fid.indexOf("Zichee")>-1)
                             {
                                 isZicheePresent=true;
                                 event.features[i].layerId=2;
                             }

                             if(event.features[i].fid.indexOf("Espace")>-1)
                             {
                                 isEspacePresent=true;
                                 event.features[i].layerId=3;
                             }
                         }
                     }
                 }
                 else
                 {
                     isEDRLRPresent=false;
                     isQuartierPresent=false;
                     isEspacePresent=false;
                     isZicheePresent=false;
                 }

                 if(EMBELLIS_MODE)
                 {
                     bussinessLogicEspaceStructurant(event);
                 }
                 else
                 {
                     populateAccordion(event.features);
                 }
             }
         }
    });
    map.addControl(info);

    info.activate();

    layer.setVisibility( $('#contrats').is(':checked'));
    layer_EDRLR.setVisibility( $('#EDRLR').is(':checked'));

    if(EMBELLIS_MODE) {
        layer_espaces_structurants.setVisibility(  $('#espaces').is(':checked'));
        layer_Zichee.setVisibility( $('#ZICHEE').is(':checked'));
    }

    // map.events.register("click", map , getInfo);
    /*
       http://gis.irisnetlab.be/proxy?http%3A%2F%2Fmybrugis.irisnetlab.be%2Fgeoserver
       %2FAATL%2Fwms%3FLAYERS%3DEDRLR%2CContrats_de_quartier%26
       QUERY_LAYERS%3DEDRLR%2CContrats_de_quartier%26STYLES%3D%2C%26SERVICE%3DWMS%26VERSION%3D1.3.0%26REQUEST%3D
       GetFeatureInfo%26EXCEPTIONS%3DINIMAGE%26BBOX%3D146817.005906%252C168626.005906%252C152466.994094%252C174275.994094%26
       FEATURE_COUNT=10%26HEIGHT%3D650%26WIDTH%3D650%26FORMAT%3Dimage%252Fpng%26INFO_FORMAT%3Dapplication%252Fvnd.ogc.gml%26CRS%3D
       EPSG%253A31370&I=498&J=258&filter=<ogc:Filter xmlns:ogc="http://www.opengis.net/ogc"><ogc:PropertyIsBetween><ogc:PropertyName>NOTIF_COMM</ogc:PropertyName><ogc:LowerBoundary><ogc:Literal>2008-12-05</ogc:Literal></ogc:LowerBoundary><ogc:UpperBoundary><ogc:Literal>2012-12-04</ogc:Literal></ogc:UpperBoundary></ogc:PropertyIsBetween></ogc:Filter>
     *
     * */

}


function getTileInfos(loc)
{
    var res = layer.getServerResolution();

    var fx = (loc.lon - layer.tileOrigin.lon) / (res * layer.tileSize.w);
    var fy = (layer.tileOrigin.lat - loc.lat) / (res * layer.tileSize.h);

    var col = Math.floor(fx);
    var row = Math.floor(fy);

    return {
        col: col,
            row: row,
            i: Math.floor((fx - col) * layer.tileSize.w),
            j: Math.floor((fy - row) * layer.tileSize.h)
    };
}

function bussinessLogicEspaceStructurant(event)
{
    /*test if the feature is whitin 8 m to the features of the layer*/

    var coordinate = null;

    coordinate = map.getLonLatFromViewPortPx(event.xy);
    var p=new OpenLayers.Geometry.Point(coordinate.lon,coordinate.lat);

    getBatiment(event,p);



}

function getBatiment(event,point)
{
    //filter to retrieve the batiment from the bati
    var filterBati = new OpenLayers.Filter.Spatial(
            {
                type: OpenLayers.Filter.Spatial.INTERSECTS,
        property: "GEOM",
        value: point
            }
            );

    var protocol_bati = new OpenLayers.Protocol.WFS.fromWMSLayer(layer_batiment);

    var response = protocol_bati.read({
        filter: filterBati,
        callback: function(result) {
            if(result.success())
    {
        if(result.features.length)
    {
        var filterWithin = new OpenLayers.Filter.Spatial(
            {
                type: OpenLayers.Filter.Spatial.DWITHIN,
        property: "GEOMETRY",
        value:  result.features[0].geometry,
        distance:"8",
        distanceUnits:"m"
            }
            );

        protocol = new OpenLayers.Protocol.WFS.fromWMSLayer(layer_espaces_structurants);
        var response = protocol.read({
            filter: filterWithin,
            callback: function(result) {
                if(result.success())
        {
            if(result.features.length)
        {
            //set the boolean espace_structurant to true
            isEspacePresent=true;

            event.features.push(result.features[0]);
            var i=event.features.length;
            event.features[i-1].layerId=3;
        }
        }
        //display the result of the request knowing all the layers concerned
        populateAccordion(event.features);
            }
        });
    }
        else
        {
            populateAccordion(event.features);
        }
    }
            else
            {
                populateAccordion(event.features);
            }
        }
    });

}
