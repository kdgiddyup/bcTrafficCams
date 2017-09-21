 trafficMap = {
         urlprefix: 'http://itmsweb.bcgov.net/ITMS/jpeg',
         urlpostfix: '.jpg?',
         refreshrate: 4, // in seconds
         // trafficMap.dataset.{mapID}.location|lat|lng
         dataset: camData,
         createMarker: function(point, html) {
             /*var camicon = new GIcon(G_DEFAULT_ICON);
             camicon.iconSize = trafficMap.pinsize;
             camicon.shadSize = trafficMap.shadsize;
             camicon.image = trafficMap.pinicon;
             camicon.shadow = trafficMap.shadicon;
             var opts = new Object();
             opts.icon = camicon;  */
             var marker = new GMarker(point);
             GEvent.addListener(marker, "click", function() {
                 marker.openInfoWindowHtml(html);
             });
             return marker;
         },
         reloadImage: function() {
             img = document.getElementById('traffic_cam_image');
             if (!img) return;
             i = Math.floor(Math.random()*100000000000);
             qidx = img.src.indexOf('?');
             img.src = img.src.substring(0,qidx) + '?' + i;
         },
         load: function() {
             if (GBrowserIsCompatible()) {
                 setInterval('trafficMap.reloadImage()', trafficMap.refreshrate * 1000);
                 var map = new GMap2(document.getElementById("map"));
                 map.setCenter(new GLatLng(32.3318, -80.8266), 10);
                 for (var key in trafficMap.dataset) {
                    var cpoint = new GLatLng(trafficMap.dataset[key].lat, trafficMap.dataset[key].lng);
                    var cmarker;
                    if (location.href.indexOf('expmap') > -1) //this is the Experience Hilton Head version
                        cmarker = trafficMap.createMarker(cpoint, '<div style="overflow: auto"><strong><a style="text-decoration: none; color: #777;" target="_parent" href="http://media.islandpacket.com/static/news/traffic/expcams.html?'+key+'">' + trafficMap.dataset[key].location.toUpperCase() + '</strong><br /><em>Click or tap to open this location</em><br /><img id="traffic_cam_image" src="' + trafficMap.urlprefix + key + trafficMap.urlpostfix + '" width="100%" /></a></div>')
                    else  
                        cmarker = trafficMap.createMarker(cpoint, '<div style="overflow: auto;"><strong><a style="text-decoration: none; color: #777;" target="_parent" href="http://www.islandpacket.com/news/local/traffic/article131638114.html?'+key+'">'+ trafficMap.dataset[key].location.toUpperCase() + '</strong><br /><em>Click or tap to open this location</em><br /><img id="traffic_cam_image" src="' + trafficMap.urlprefix + key + trafficMap.urlpostfix + '" width="100%" /></a></div>');
                     map.addOverlay(cmarker);
                 }
             }
         }
    }
    
    