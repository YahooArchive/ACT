
// Remove the below code if you don't have video inside inline unit
var videoPlayer = document.getElementById('video1');

/* Start with initialize Enabler*/
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
    clickToExpand();
    setUpVideoTracking();
}

function clickToExpand() {
    var clickArea = document.getElementById("clickArea");
    clickArea.addEventListener("click", function(){
		Enabler.requestExpand();
		videoPlayer.pause();
	});
}

function setUpVideoTracking() {
    videoPlayer = document.getElementById('video1');
    
    Enabler.loadModule(studio.module.ModuleId.VIDEO, function() {
        studio.video.Reporter.attach('videoinline', videoPlayer);
    }.bind(this));
}
console.log("Started...", Enabler);