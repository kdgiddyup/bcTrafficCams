/****************
 * 
 * Kelly Davis, 
 * github.com/kdgiddyup 
 * September 2017
 * 
 * *************/

// initialize

var camURL = 'http://itmsweb.bcgov.net/ITMS/jpeg';
// camera url structure is camURL+camNo+'.jpg'

// some initial variables
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
	  center: {lat: 32.3318, lng: -80.8266}
		});
	// add markers
	for (var cam in camData){
		console.log(camData[cam].location);
		var thisMarker = new google.maps.Marker({
			position: camData[cam].pos,
			map: map,
			title: camData[cam].location,
			animation: google.maps.Animation.DROP,
			icon: {
				path: google.maps.SymbolPath.CIRCLE,
				scale: 10,
				fillColor: "#0288d1",
				fillOpacity: .8
			  },
			camID: cam
		  });
		thisMarker.addListener('click', function() {
			$("#modalHeader").html(camData[cam].location);
			var mapImgURL = `${camURL}${cam}.jpg`;
			var mapImg = $("#modalImage");
			mapImg.attr("src", mapImgURL);
			
			// add error listener to modal image
			mapImg.on("error",()=>{mapImg.attr("src",errorImg)});

			// add timer to modal image
			setTimer(mapImgURL,mapImg);
			
			// show modal
			$("#camModal").modal().show()
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

		var thisBlock = 
		`<div class="camContainer col-lg-3 col-md-3 col-sm-4 col-xs-12" data-location="${camData[cam].location}">
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
// note that argument should be a $jquery-selected img tag
function setTimer(camURL,camImg){
	var imageTimer = setInterval(function(){
		camImg.attr("src",`${camURL}?${Math.floor(Math.random()*100000000000)}`)
	},delay);
}

// //  build out filter and camera menu, and build panel of cameras

// 	// place data from object into an array for simpler sorting; we'll also gather locales for the location filter
// var camArray = [];  
// for (var key in camData) {
// 	var camObj = {location:camData[key].location,cam:key,locale:camData[key].locale};
// 	camArray.push(camObj);
// }

// //   sort camera array by location 
// //	the sort method passes location value in to anonymous function that compares 'a.location' and 'b.location' 
// //  eg, in first loop, a.location = camArray[0].location, b=camArray[1].location

// camArray.sort(     
// 	function(a, b){
// 		if(a.location < b.location) return -1;
// 	    if(a.location > b.location) return 1;
// 	    return 0;
// 		}
// 	);

// 	// build filter list
// var localeArray = [];
// var match;
// for (key in camData) {
// 	match=0;
// 	var thisLocale = camData[key].locale;  
// 	if (localeArray.length > 0) {   // not our first locale
// 		for (var i=0;i<localeArray.length;i++)  // loop through locale array
// 			if (thisLocale == localeArray[i])  
// 				match = 1;
// 		if (!match)					// if this locale doesn't match anything in array ...
// 			localeArray.push(thisLocale)	// ... add it
// 	}
// 	else    // this is the first locale so just add it
// 		localeArray.push(thisLocale)
// }
// localeArray.sort();  // sort locales alphabetically

// for (var i=0;i<localeArray.length;i++) {
// 	var thisBlock = document.createElement('div')
// 		// add classes for local styling and bootstrap responsiveness
// 	thisBlock.className='inputBlock col-lg-4 col-md-4 col-sm-6 col-xs-12';
// 	var thisInput = document.createElement('input');
// 	thisInput.type = 'checkbox';
// 	thisInput.id='chk'+(i+1);
// 	thisInput.className = 'filterButton';
// 	thisInput.checked = true;
// 	thisInput.setAttribute('onchange','filterCams(this.id)');
// 	boxes.push(thisInput);  // add other locale input checkboxes to boxes array
// 	thisInput.value=localeArray[i];
// 	var thisLabel = document.createElement('label');
// 	thisLabel.innerHTML = localeArray[i];
// 	thisBlock.appendChild(thisInput);
// 	thisBlock.appendChild(thisLabel);
// 	filterForm.appendChild(thisBlock);
// }
	
// 	//loop through sorted array to
// 	// 1. build dropdown menu
// for (var i=0;i<camArray.length;i++) {
// 	var option = document.createElement('li');
// 	option.setAttribute('locale',camArray[i].locale);
// 	option.id = 'cam'+i;
// 	option.setAttribute('onclick','singleCam('+camArray[i].cam+');');
// 	option.innerHTML = camArray[i].location;
// 	options.push(option);  // add option to options array
// 	menu.appendChild(option)	

// 	// 2. build out a panel of cameras
// 	var blockContainer = document.createElement('div');
// 		// add classes for local styling and bootstrap responsiveness
// 	blockContainer.className = 'blockContainer hidden col-lg-4 col-md-4 col-sm-4 col-xs-12';
// 	blockContainer.id = 'block'+camArray[i].cam;
// 	blockContainer.setAttribute('onclick','singleCam('+camArray[i].cam+');');
// 	panel.appendChild(blockContainer);
// 	var camBlock = document.createElement('div');
// 	blockContainer.appendChild(camBlock);
// 	camBoxes.push(blockContainer); // add camera block to camBoxes array;
// 	camBlock.className = 'camBlock';
// 	camBlock.setAttribute('locale',camArray[i].locale);	
// 	var camImage = document.createElement('div');
// 	camImage.className = 'camImage';
// 	var camLabel = document.createElement('div');
// 	camLabel.className = 'camLabel';
// 	camLabel.innerHTML = camArray[i].location;
// 	var thisImg = document.createElement('img');
// 	thisImg.id='img'+camArray[i].cam;
// 	thisImg.className = 'camImage';
// 	var imgURL = baseURL+camArray[i].cam+'.jpg'; 
// 	thisImg.src = imgURL;
// 	thisImg.setAttribute('onerror','imgError(this)');
// 	camImage.appendChild(thisImg);
// 	camBlock.appendChild(camImage);
// 	camBlock.appendChild(camLabel);
// }

// filterCams(allButton.id);  // initialize camera panel
// var autoUpdate = setInterval(updateImages,4000); // set up timed auto-reload of cam images

// // was a cam no. passed in via URL? filter for that camera:
// if (isSingle)
// 	singleCam(imageNo);


// function filterCams(chkbox) {
// /*
// initial state:
//  all cam blocks are hidden;
//  all inputs are checked;
//  allButton.checked=1 is passed in
 
// cases:
// 	show all cameras
// 		test: thisBox == allButton && thisBox.checked
// 		action: make all inputs checked
// 				show all cam blocks
// */
// 	var thisBox = document.getElementById(chkbox);
// 	if (thisBox == allButton && thisBox.checked) {
// 		for (var c=0;c<boxes.length;c++)
// 			boxes[c].checked = true;
// 		for (var i=0;i<camBoxes.length;i++)
// 			camBoxes[i].className = 'blockContainer col-lg-4 col-md-4 col-sm-4 col-xs-12';
// 	}
// /*
// 	hide all cameras
// 		test: thisBox == allButton && !thisBox.checked
// 		action: make all inputs unchecked
// 				hide all cam blocks
// */
// 	if (thisBox == allButton && !thisBox.checked) {
// 		for (var c=0;c<boxes.length;c++)
// 			boxes[c].checked = false;
// 		for (var i=0;i<camBoxes.length;i++)
// 			camBoxes[i].className = 'blockContainer hidden col-lg-4 col-md-4 col-sm-4 col-xs-12';
// 	}
// /*
// 	show some, hide others
// 		test: thisBox.id != allButton
// 		action: 
// 			count checked boxes from boxes[1] to boxes.length-1
// 				if checked boxes == boxes.length-1, they've checked all boxes manually
// 					allButton.checked = true
// 					filterCams(allButton)
// 				else 
// 					loo through cam blocks and hide them all
// 					loop through boxes from boxes[1] to boxes.length-1
// 						is it checked?
// 							yes: loop through cam boxes and compare cam box locale attribute to boxes[n].value
// 									does it match? 
// 										yes: show box
// */
// 	if (thisBox != allButton) {
// 		var numChecks;
// 		for (var c=1;c<boxes.length;c++)
// 			if (boxes[c].checked)
// 				numChecks++;
// 		if (numChecks == boxes.length) {
// 			allButton.checked = true;
// 			filterCams(allButton.id)
// 			}
// 		else {
// 			for (var i=0;i<camBoxes.length;i++)
// 				camBoxes[i].className = 'blockContainer hidden col-lg-4 col-md-4 col-sm-6 col-xs-12';
// 			for (var c=1;c<boxes.length;c++)
// 				if (boxes[c].checked)
// 					for (var i=0;i<camBoxes.length;i++)
// 						if (camBoxes[i].firstChild.getAttribute('locale') == boxes[c].value)
// 							camBoxes[i].className = 'blockContainer col-lg-4 col-md-4 col-sm-6 col-xs-12'  
// 			}
// 		}
// }

// function singleCam(cam){
// 	// hide all cams, except the one selected
// 	cam=parseInt(cam);
// 	for (var i=0;i<camBoxes.length;i++)  { 
// 		camBoxes[i].className = 'blockContainer hidden col-lg-12 col-md-12 col-sm-12 col-xs-12';
// 		if (cam < 10)
// 			var thisCam = '0'+cam
// 		else
// 			var thisCam = cam;
// 		if (camBoxes[i].id == 'block'+thisCam)
// 			camBoxes[i].className = 'blockContainer col-lg-12 col-md-12 col-sm-12 col-xs-12';
// 	}
// }

// function updateImages() {
// 	for (var key in camData)
// 		reloadImage(key)
// }

// function filterText(input) {
// 	for (var i=0;i<camBoxes.length;i++)   // hide all cams
// 		camBoxes[i].className = 'blockContainer hidden col-lg-4 col-md-4 col-sm-6 col-xs-12';
// 	for (var i=0;i<camBoxes.length;i++)	{
// 		var thisLabel = camBoxes[i].getElementsByClassName('camLabel')[0].innerHTML.toLowerCase();
// 		if (thisLabel.indexOf(input.toLowerCase()) > -1) // is input string in the block label?
// 			camBoxes[i].className = 'blockContainer col-lg-4 col-md-4 col-sm-6 col-xs-12';
// 		}
// }

// function reloadImage(imgNo) {
// 	imgID = 'img'+imgNo;
// 	thisImage = document.getElementById(imgID);
// 	thisImage.src = 'http://itmsweb.bcgov.net/ITMS/jpeg'+imgNo+'.jpg?'+rand();
// }

// function rand() {
// 	var randNum = Math.floor(Math.random()*100000000000);
// 	return randNum;
// }
// function imgError(image) {
//     //image.onerror = '';
//     image.src = errorImg.src;
//     return true;
// }