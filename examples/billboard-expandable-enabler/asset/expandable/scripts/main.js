/* javascript code */

// please remove below line if you don't have video in expandable unit
var videoPlayer = document.getElementById('videoPlayer');

if (!Enabler.isInitialized()) {
    Enabler.addEventListener(
        studio.events.StudioEvent.INIT,
        enablerInitialized);
} else {
    enablerInitialized();
}

function enablerInitialized() {
    if (!Enabler.isVisible()) {
        Enabler.addEventListener(
            studio.events.StudioEvent.VISIBLE,
            adVisible);
    } else {
        adVisible();
    }
}

function adVisible() {
    // Ad visible, start ad/animation.
    setUpClickTag();
    setUpCloseBtn();

    // please remove the below line if you don't have video
    setUpVideoTracking();
}

/**
 * Setup click tags for expandable unit
 * @method setUpClickTag
 */
function setUpClickTag() {
    var clickArea = document.getElementById("clickArea");
    clickArea.addEventListener("click", function(){
		// open landing page for clickTag. This clicktag will be passed by Yahoo template.
		// If you have more than 1 click tag, please do the same thing with different click id (e.g clickTag1, clickTagFacebook e.t.c)
		Enabler.exit("clickTag");
		
		// interaction tracking for clicktag
		Enabler.counter("clickTag");

		// collapse expand unit
		collapseExpand();

		return false;		
	});

    var fbButton = document.getElementById("facebookBtn");
    fbButton.addEventListener("click", function(){
		// open landing page for facebook btn
		Enabler.exit("clickTagFacebook");
		
		// interaction tracking for clicktag
		Enabler.counter("clickTagFacebook");

		// collapse expand unit
		collapseExpand();

		return false;		
	});

    var twitterBtn = document.getElementById("twitterButton");
    twitterBtn.addEventListener("click", function(){
		// open landing page for twitter button
		Enabler.exit("clickTagTwitter");
		
		// interaction tracking for clicktag
		Enabler.counter("clickTagTwitter");

		// collapse expand unit
		collapseExpand();

		return false;		
	});

}

/**
 * Setup handle action for close button
 * @method setUpCloseBtn
 */
function setUpCloseBtn() {
	var closeBtn = document.getElementById("closeButton");
	closeBtn.addEventListener('click', function(){

		// interaction tracking for close button
		Enabler.counter("closeBtnClick");

		// collapse expand unit
		collapseExpand();

	});
}

/**
 * Close the expandable unit
 * @method collapseExpand
 */
function collapseExpand(){
	// video need to be pause when click on click tag
	// please remove the below line if you don't have video in expandable unit
	videoPlayer.pause();

	// close the expandable unit
	Enabler.close();		
}

/**
 * Setup tracking for html5 video
 * @method setUpVideoTracking
 */
function setUpVideoTracking() {

    Enabler.loadModule(studio.module.ModuleId.VIDEO, function() {
        studio.video.Reporter.attach('videoexpandable', videoPlayer);
    }.bind(this));

}