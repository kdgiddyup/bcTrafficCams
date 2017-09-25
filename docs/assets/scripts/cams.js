/****************
 * 
 * Kelly Davis, 
 * github.com/kdgiddyup 
 * September 2017
 * 
 * *************/

// initialize

var camURL = 'http://itmsweb.bcgov.net/ITMS/jpeg';
// camera image url structure is camURL+camNo+'.jpg'

// some initial variables

// timer object for cam images in modal window launched from map markers
var modalTimer;

// time between cam image updates
var delay = 4000;

// an image to show if camera image isn't available
errorImg = 'http://media.islandpacket.com/static/news/traffic/imageLoading.png';

// check URL for cam parameter
var ourURL=location.href;

// an array of all camera IDs in the dataset
var camIDs = Object.keys(camData);

//URL parsing - is this a specific cam or the landing page?
if (ourURL.indexOf('?') > -1) {
	var isSpecific=true;
	var imagePos=ourURL.indexOf('?')+1;
	var imageNo=ourURL.substr(imagePos,2);
	
	// if imageNo doesn't match any cam IDs in our dataset, lets set it to the downtown Beaufort camera
	if (camIDs.indexOf(imageNo) === -1) {
		imageNo='74';
		location.href=location.href.split("?")[0]+"?74";
	}
}
else {
	var isSpecific = false;
	};

// create map at bottom of page
function initMap(){
	var map = new google.maps.Map(document.getElementById('map'), {
	  zoom: 10, 
	  center: {lat: 32.450887, lng: -80.765051} 
		});
	// add markers
	for (var cam in camData){
		var thisMarker = new google.maps.Marker({
			position: camData[cam].pos,
			map: map,
			title: camData[cam].location,
			animation: google.maps.Animation.DROP,
			icon: {
				path: google.maps.SymbolPath.CIRCLE,
				scale: 7,
				fillColor: "#0288d1",
				fillOpacity: .75,
				strokeWeight: 3,
				strokeColor: "#fff"
			  },
			camID: cam
		  });

		// add click listener for markers  
		thisMarker.addListener('click', function() {
			var camID = this.camID;
			$("#mapModalHeader").html(this.title);
			var mapImgURL = `${camURL}${camID}.jpg`;
			var mapImg = $("#modalImage");
			mapImg.attr("src", mapImgURL);
			
			// add timer to modal image
			setModalTimer(mapImgURL,mapImg);
			
			// show modal
			$("#camModal").modal().show();
			
			// add error and click listeners to modal image
			$(mapImg).off().on({
				"error":()=>{mapImg.attr("src",errorImg)},
				"click": ()=>{
				location.href= `${location.href.split("?")[0]}?${camID}`}
				});
			});
		
	};
}


// do these things after the page loads
$(document).ready(function(){
	
	// hide cam_specific div
	$("#cam_specific").hide();

	// is this a specific camera request or non-specific?

	// specific camera requested
	if (isSpecific) {
		thisCam = camURL + imageNo + '.jpg';
		var camImg = $("#camera_image");
		camImg.attr("src",thisCam);
		camImg.on("error",()=>{camImg.attr("src",errorImg)});

		// add interval to this img element; send URL separately so it can be reapplied if there is an image loading error
		setTimer(thisCam,camImg);
		
		// update camera label
		$("#camera_label").html(camData[imageNo].location);

		// place time stamp on DOM and update it on same  interval as image
		// we separate this from the image timer because it is used only on this specific-camera view
		$("#camera_time").html(new Date().toLocaleString());
		setInterval(function(){
			$("#camera_time").html(new Date().toLocaleString());
		},delay);

		// unhide single camera div
		$("#cam_specific").show();

	};

	// do these things whether specific camera is requested or not

	// get locales from camData
	var locales = $.map(camData, 
		(key)=>{ 
			return key.locale;
		}
	);

	// filter locales to a unique set
	locales = locales.filter( (item, i, locales) => {
		return i == locales.indexOf(item);
	});
	// sort locales alphabetically
	locales.sort();

	// build panel headers, div
	$(locales).each( (index,element)=>{
		$("#panelCol").append(`
			<button class="localeHeader btn btn-success btn-block" data-locale="${element}">${element}</button>
			<div class="locale row" data-locale="${element}"></div>`);
	});
	

	// add cameras to appropriate locale divs
	$(camIDs).each( function(index,cam){
		
		//build this cam's URL
		var thisCam = camURL+cam+".jpg";

		// build this cam's div and attributes
		var thisBlock = 
		`<div class="camContainer col-lg-4 col-md-4 col-sm-6 col-xs-12" data-location="${camData[cam].location}">
			<img data-camID="${cam}" src="${thisCam}" class="camThumb"/> 
			<h4 data-camID="${cam}" class="camLabel">${camData[cam].location}</h4>    
		</div>`;
		$(`.locale[data-locale="${camData[cam].locale}"]`).append(thisBlock);
		
		var camImg = $(`img[data-camID="${cam}"]`);

		// add error and click event functions
		camImg.on({
			"error":()=>{ camImg.attr("src",errorImg) },
			"click":()=>{ location.href= `${location.href.split("?")[0]}?${cam}` } 
		});

		// add update timer to cameras
		setTimer(thisCam,camImg);
	});

	// sort cameras within each locale
	// first, select all locales and cycle through them
	$(".locale").each( function( index,element){
		
		// each element is a locale, whose children are arrays of camera containers
		//  
		var thisLocaleCams = $(element).children();
		thisLocaleCams.sort( function( a, b ){
			// obtain location string for each camera in this comparison
			var locationA = $(a).attr("data-location");
			var locationB = $(b).attr("data-location");	 
			if(locationA > locationB) {
				return 1;
			}
			if(locationA < locationB) {
				return -1;
			}
			return 0;
		 	});
		// detach selected elements and reattach in sorted form
		thisLocaleCams.detach().appendTo(element);
	});


	// add click listener on headers
	$(".localeHeader").on("click",function () {

		// get locale data from clicked button
		var thisLocale = $(this).attr("data-locale");
		
		// apply toggle to matching locale divs
		$(`.locale[data-locale="${thisLocale}"]`).toggle("fast");
	})
	
	// show/hide buttons: not just one that toggles all because user can also individually hide/show individual locales

	// click event for button to hide all cameras 
	$("#hideAllBtn").on("click",function(){
		$(".locale").hide("fast");
	});

	// click event for button to show all cameras 
	$("#showAllBtn").on("click",function(){
		$(".locale").show("fast");
	});

	// click event for map button: scroll to map
	$("#showMapBtn").on("click",function(){
		$("body").css("overflow-y","hidden");
		$("body").animate({
			scrollTop: $("#mapReturnBtn").offset().top
		}, 1000);
		$("body").css("overflow-y", "auto");
	});

	// click event for map return button: scroll to top
	$("#mapReturnBtn").on("click",function(){
		$("body").css("overflow-y","hidden");
		$("body").animate({
			scrollTop: $("#camTop").offset().top
		}, 1000,function(){$("body").css("overflow-y", "auto")});
	});

	
	// keyup listener for camera filter input
	$("#filterInput").on("keyup", function(){
		
		// grab and normalize value from input
		var value = $(this).val().toLowerCase().trim();
		
		// loop through camera containers and look for matches to value; if found, show that camera, if not, hide it. 
		//We don't just hide cams in case text input changes and becomes a match for a previously hidden camera
		$(".camContainer").each( function(index,element){
			if ($(element).attr("data-location").toLowerCase().indexOf(value)>-1) {
				$(element).show("fast")
			}
			else {
				$(element).hide("fast")
			}
			});
		});

}) // end doc ready

// helper functions
function imgError(camImg){
	camImg.attr("src",errorImg);
	console.log(camImg.attr("src"));

	}

// set cam image to update in a timer
// note that 2nd argument should be a $jquery-selected img tag
function setTimer(camURL,camImg){
	var timer = setInterval(function(){
		camImg.attr("src",`${camURL}?${Math.floor(Math.random()*100000000000)}`)
	},delay);
}

// reset image timer in modal window;
// note that 2nd argument should be a $jquery-selected img tag
function setModalTimer(camURL,camImg){
	clearInterval(modalTimer);
	modalTimer = setInterval(function(){
		camImg.attr("src",`${camURL}?${Math.floor(Math.random()*100000000000)}`)
	},delay);
}