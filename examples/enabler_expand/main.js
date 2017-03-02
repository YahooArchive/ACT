var actionBtn = document.getElementById('action');
var direction = document.getElementById('direction');
var videoPlayer = document.getElementById('videoPlayer');

function actionClickHandler() {
    if(Enabler.getContainerState() == studio.sdk.ContainerState.EXPANDED) {
        Enabler.counter('clickCollapse');
        Enabler.requestCollapse();
    } else {
        Enabler.counter('clickExpand');
        Enabler.requestExpand();
    }
}

function exitClickHandler() {
    Enabler.exit('clickTag');
}

function exitOverrideClickHandler(){
    Enabler.exitOverride('clickTAG2', 'https://uk.yahoo.com');
}

function toggleClass(from, to) {
    viewport.className = viewport.className.replace(from, to);
    actionBtn.innerHTML = from[0].toUpperCase() + from.slice(1);
}

function expandHandler() {
    console.log('start expading');
    direction.innerHTML = 'Expand direction:' + Enabler.getExpandDirection();
    viewport.className = viewport.className.replace(/ dir-[trbl]{2}/, '') +
        ' dir-' + Enabler.getExpandDirection();
    toggleClass('collapse', 'expand')
}

function collapseHandler() {
    console.log('start collapsing');
    viewport.className = viewport.className.replace(/ dir-[trbl]{2}/, '');
    toggleClass('expand', 'collapse')
    direction.innerHTML = '';
    hideAndDetachVideo();
}

function transitionEndHandler(e) {
    if (e.propertyName == 'width') {
        Enabler.getContainerState() == studio.sdk.ContainerState.COLLAPSING ?
            Enabler.finishCollapse() :
            Enabler.finishExpand();
    }
}

function finishExpandHandler(e){
    console.log('expand finish');
    showAndTrackVideo();
}

function finishCollapseHandler(e){
    console.log('collapse finish');
}

function showAndTrackVideo(){
    Enabler.loadModule(studio.module.ModuleId.VIDEO, function() {
        studio.video.Reporter.attach('videoinline', videoPlayer);
    }.bind(this));
    videoPlayer.style.visibility = 'visible';
    videoPlayer.play();
}

function hideAndDetachVideo(){
    videoPlayer.style.visibility = 'hidden';
    Enabler.loadModule(studio.module.ModuleId.VIDEO, function() {
        studio.video.Reporter.detach('videoinline');
    }.bind(this));
    videoPlayer.pause(0);
}

var transitionEnds = [
    'transitionend',
    'oTransitionEnd',
    'msTransitionEnd',
    'webkitTransitionEnd'
];
for (var i = 0; i < transitionEnds.length; i++) {
    viewport.addEventListener(transitionEnds[i], transitionEndHandler, false);
}

if (!Enabler.isInitialized()) {
    Enabler.addEventListener(studio.events.StudioEvent.INIT, enablerInitialized);
} else {
    enablerInitialized();
}

function enablerInitialized() {
    Enabler.removeEventListener(studio.events.StudioEvent.INIT);
    if (!Enabler.isVisible()) {
        Enabler.addEventListener(studio.events.StudioEvent.VISIBLE, adVisible);
    } else {
        adVisible();
    }
}

Enabler.callAfterInitialized(enablerInitialized);

function adVisible() {
    // Ad visible, start ad/animation.
    Enabler.removeEventListener(studio.events.StudioEvent.VISIBLE);

    Enabler.addEventListener(studio.events.StudioEvent.EXPAND_START, expandHandler);
    Enabler.addEventListener(studio.events.StudioEvent.EXPAND_FINISH, finishExpandHandler);
    Enabler.addEventListener(studio.events.StudioEvent.COLLAPSE_START, collapseHandler);
    Enabler.addEventListener(studio.events.StudioEvent.COLLAPSE_FINISH, finishCollapseHandler);

    actionBtn.addEventListener('click', actionClickHandler, false);
    document.getElementById('exit').addEventListener('click', exitClickHandler, false);
    document.getElementById('exitOverride').addEventListener('click', exitOverrideClickHandler, false);

    Enabler.setExpandingPixelOffsets(
        0, // left
        0, // top
        700, // expandedWidth
        450 // expandedHeight
    );
    Enabler.setIsMultiDirectional(true);
    Enabler.setStartExpanded(false);

    // some random test for unused functions
    testFunctions();
}

function testFunctions(){
    console.log('Enabler.isPageLoaded', Enabler.isPageLoaded());
    console.log('Enabler.getParameter', Enabler.getParameter('something1'));
    console.log('Enabler.getParameterAsInteger', Enabler.getParameterAsInteger('something2'));
    console.log('Enabler.getParameterAsNullableString', Enabler.getParameterAsNullableString('something3'));
    console.log('Enabler.getStudio', Enabler.getStudio());
}
