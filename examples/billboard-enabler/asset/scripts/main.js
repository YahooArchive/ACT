/* javascript code */
var videoPlayer;

if (!Enabler.isInitialized()) {
    Enabler.addEventListener(
        studio.events.StudioEvent.INIT,
        enablerInitialized);
} else {
    enablerInitialized();
}

function enablerInitialized() {
    if (!Enabler.isVisible()) {
        Enabler.addEventListener(studio.events.StudioEvent.VISIBLE, adVisible);
    } else {
        adVisible();
    }

	Enabler.addEventListener(studio.events.StudioEvent.HIDDEN, adHidden);
    setUpClickTag();
    setUpVideoTracking();
}

function adVisible() {
    // Ad visible, start ad/animation.
}

function adHidden(){
	// When the ad is hidden, all video must be pause
	if (videoPlayer){
		videoPlayer.pause();
	}
	
}
function setUpClickTag() {
    var clickArea = document.getElementById("clickArea");
    clickArea.addEventListener("click", function(){
		Enabler.exit("clickTag");
		return false;		
	});
}

function setUpVideoTracking() {
    videoPlayer = document.getElementById('video1');
    
    Enabler.loadModule(studio.module.ModuleId.VIDEO, function() {
        studio.video.Reporter.attach('video1', videoPlayer);
    }.bind(this));

}