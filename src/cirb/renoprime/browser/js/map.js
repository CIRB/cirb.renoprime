/*
 * Site: Primes à la rénovation / à l'embellissement
 * URL: http://www.primes-renovation.be/index.php
 * File: map.js
 *
 * @author fkrzewinski@cirb.irisnet.be inspired by the work of Jean-Paul Dzisiak
 * @version november 2012            		                          
 */

        var map, layer,layer_EDRLR,layer_espaces_structurants,layer_Zichee;
        var info;
        
        var isEDRLRPresent,isQuartierPresent;

        function init()
        	{
        	
        	var options = {
        			projection:"EPSG:31370",
        			maxExtent:new OpenLayers.Bounds(16478.795,19244.928,285000,320000),
        			units:"m"
            };
        	
        	OpenLayers.Projection.defaults["EPSG:31370"]=options;
        	
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
	            	        	
	            
	        	today = $('#map').data('today');	            
	            var currentDate=new Date(today);

	        	//Date notification commune  et d’ajouter 4 ans (moins 1 jour).4 ans (moins 1 jour)
	            var isoCurrentDate=currentDate.getFullYear()+'-'+(currentDate.getMonth()+1)+'-'+currentDate.getDate();
	            
	            var isoLowerDate=currentDate.getFullYear()-4+'-'+(currentDate.getMonth()+1)+'-'+(currentDate.getDate()+1);
	            
	            
	            var filter = new OpenLayers.Filter.Comparison({
	            	   type: OpenLayers.Filter.Comparison.BETWEEN,
	            	   property: "NOTIF_COMM",
	            	   lowerBoundary: isoLowerDate,
	            	   upperBoundary: isoCurrentDate
	            	});
	            
	            var parser = new OpenLayers.Format.Filter.v1_1_0();
	            var filterAsXml = parser.write(filter);
	            var xml = new OpenLayers.Format.XML();
	            var filterAsString = xml.write(filterAsXml);
	            
	            layer = new OpenLayers.Layer.WMS( "Contrats de quartier",
	            		urlBrugis, 
	                    {	layers: 'Contrats_de_quartier',
	                    	version:'1.3.0',
	                    	transparent: "true",
	                    	format: 'image/png'
	                    },
	            		{isBaseLayer: false}
	            );
	            
	            layer.params["FILTER"] = filterAsString;
	            
	            layer_EDRLR = new OpenLayers.Layer.WMS( "EDRLR",
	            		urlBrugis, 
	                    {	layers: 'EDRLR',
	                    	version:'1.3.0',
	                    	transparent: "true",
	                    	format: 'image/png'
	                    },
	            		{isBaseLayer: false}
	            );	            	    
	            
	            //urbis
	        	map.addLayer(urbis_layer);
	            
	            //contrat de quartier
  	           	map.addLayer(layer);
	            
  	        	//EDRLR
  	          	map.addLayer(layer_EDRLR);	
  	          	
  	          if(EMBELLIS_MODE)
  	        	  {
  	        	  	layer_espaces_structurants = new OpenLayers.Layer.WMS( "Espaces_structurants",
	            		urlBrugis, 
	                    {	layers: 'Espaces_structurants',
	                    	version:'1.3.0',
	                    	transparent: "true",
	                    	format: 'image/png'
	                    },
	            		{isBaseLayer: false}
	            );	            	 
	            
  	        	  	layer_Zichee = new OpenLayers.Layer.WMS( "Zichee",
	            		urlBrugis, 
	                    {	layers: 'Zichee',
	                    	version:'1.3.0',
	                    	transparent: "true",
	                    	format: 'image/png'
	                    },
	            		{isBaseLayer: false}
	            );	            	 
  	        	  	
  	        	  	
  	  	          	map.addLayer(layer_espaces_structurants);
  	  	        	
  	  	          	map.addLayer(layer_Zichee);
  	        	  }
  	          	
	
	            map.setCenter(new OpenLayers.LonLat(149642,171451), 3);
	            
	            var isQuartierPresent=false;
	            var isEDRLRPresent=false;
	            var isZicheePresent=false;
	            var isEspacePresent=false;
	            
  		        info = new OpenLayers.Control.WMSGetFeatureInfo({	            	
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
	                    getfeatureinfo: function(event) 
	                    {
	                        if (event.features && event.features.length) 
	                        {
	                        	
	                        	for(var i=0;i<event.features.length;i++)
	                        	{
	                        		console.log(event.features[i].fid);
	                        		
	                        		if(event.features[i].fid.indexOf("EDRLR")>-1)
	                        		{
	                        			isEDRLRPresent=true;
	                        			event.features[i].layerId=1;
	                        		}
	                        		
	                        		if(event.features[i].fid.indexOf("quartier")>-1)
	                        		{
	                        			isQuartierPresent=true;
	                        			event.features[i].layerId=0;
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
	                        
	                        //display the result of the request knowing all the layers concerned
	                        populateAccordion(event.features);
	                    }
	                }
	            });
	            map.addControl(info);
	            
	            info.activate();
	            
        }    
