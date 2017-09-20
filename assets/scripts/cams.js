// initialize display
// check URL for cam parameter
var ourURL=window.location.href;
if (ourURL.indexOf('?') > -1) {
	var isSpecific=true;
	var imagePos=ourURL.indexOf('?')+1;
	imageNo=ourURL.substr(imagePos,2);
	if (imageNo == '00') imageNo='74';
	}
else {
	var isSpecific = false;
	};
	
var camURL = 'http://itmsweb.bcgov.net/ITMS/jpeg';
// camera url structure is camURL+camNo+'.jpg'

// some initial variables
// time between cam image updates
var delay = 4000;

// an image to show if camera image isn't available
errorImg = 'http://media.islandpacket.com/static/news/traffic/imageLoading.png';

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
		
		// place time stamp under image and update it on same delay interval as image updates
		// we separate this from the image timer because it is used only on this specific camera view
		$("#camera_time").html(new Date().toLocaleString());
		setInterval(function(){
			$("#camera_time").html(new Date().toLocaleString());
		},delay);

		// unhide single camera div
		$("#cam_specific").show();

	}

	// no specific cam requested
	else {


	}

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