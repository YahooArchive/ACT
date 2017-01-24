var actionBtn = document.getElementById('action');
var isFullscreen = false;
var supported = false;
var adOffset = {
    t: '0px',
    l: '0px'
};

document.getElementById('cta').addEventListener(
    'click',
    function(e) {
        Enabler.exitQueryString('clickTag', 'adt=16');
    },
    false
);

document.getElementById('closeBtn').style.visibility = 'hidden';
document.getElementById('closeBtn').addEventListener(
    'click',
    function(e) {
        Enabler.close();
    },
    false
);

document.getElementById('manualCloseBtn').style.visibility = 'hidden';
document.getElementById('manualCloseBtn').addEventListener(
    'click',
    function(e) {
        Enabler.reportManualClose();
    },
    false
);

var expandDiv = function(e) {
    Enabler.startTimer('expanding');
    // Move to ad offset.
    adOffset.l = '0px';
    adOffset.t = '0px';
    viewport.style.left = adOffset.l;
    viewport.style.top = adOffset.t;
    // Trigger reflow so css applies.
    viewport.offsetHeight;
    // Add transition class, expand viewport.
    viewport.classList.add('expand-collapse-transition');
    viewport.classList.remove('collapse-viewport');
    viewport.classList.add('expand-viewport');
    // Now expand to 0x0 with transition from previous location.
    viewport.style.left = '0px';
    viewport.style.top = '0px';
};

var doFinalExpand = function() {
    viewport.classList.remove('expand-collapse-transition');
    document.getElementById('closeBtn').style.visibility = 'visible';
    document.getElementById('manualCloseBtn').style.visibility = 'visible';
    Enabler.stopTimer('expanding');
}

var collapseDiv = function() {
    Enabler.startTimer('collapsing');
    document.getElementById('closeBtn').style.visibility = 'hidden';
    document.getElementById('manualCloseBtn').style.visibility = 'hidden';
    viewport.classList.add('expand-collapse-transition');
    viewport.classList.remove('expand-viewport');
    viewport.classList.add('collapse-viewport');
    viewport.style.left = adOffset.l;
    viewport.style.top = adOffset.t;
};

var doFinalCollapse = function() {
    viewport.classList.remove('expand-collapse-transition');
    viewport.style.left = '0px';
    viewport.style.top = '0px';
    Enabler.stopTimer('collapsing');
}

// If fullscreen button is clicked, query fullscreen dimensions.
// You can also skip this step and expand immediately if you don't want
// to specify expansion dimensions.
var collapsedOnclick = function() {
    actionBtn.disabled = 'disabled';
    if (supported) {
        // Enabler.queryFullscreenDimensions();
        Enabler.dispatchEvent(studio.events.StudioEvent.FULLSCREEN_DIMENSIONS, {});
    }
};

// If the collapse button is clicked, we initiate collapse with
// requestFullscreenCollapse.
var expandedOnclick = function() {
    actionBtn.disabled = 'disabled';
    if (supported) {
        Enabler.requestFullscreenCollapse();
    }
};

// At startup, check to see if fullscreen is supported
var queryFullscreenSupport = function() {
    Enabler.setFloatingPixelDimensions(700, 450);
    Enabler.dispatchEvent(studio.events.StudioEvent.FULLSCREEN_SUPPORT, {supported: true})
};

// If fullscreen is supported, reveal the fullscreen button.
Enabler.addEventListener(studio.events.StudioEvent.FULLSCREEN_SUPPORT,
    function(e) {
        supported = e.supported;
        if (supported) {
            actionBtn.style.display = 'inline-block';
            actionBtn.addEventListener('click', collapsedOnclick, false);
        }
    });

// Once we know the max dimensions, we can request a fullscreen expand,
// We can pass in width and height values to expand to a specific size,
// or we can leave the dimensions unspecified, in which case it will
// expand to the full available area.
Enabler.addEventListener(studio.events.StudioEvent.FULLSCREEN_DIMENSIONS,
    function(e) {
        Enabler.requestFullscreenExpand();
    });

// After the expansion starts, we can perform any expansion animations that
// we want to do, then call finishFullscreenExpand.
Enabler.addEventListener(studio.events.StudioEvent.FULLSCREEN_EXPAND_START,
    function(e) {
        expandDiv(e);
    });

// Expand process is complete, so we set up handlers for the collapse event.
Enabler.addEventListener(studio.events.StudioEvent.FULLSCREEN_EXPAND_FINISH,
    function(e) {
        isFullscreen = true;
        actionBtn.innerHTML = 'Collapse Fullscreen';
        actionBtn.removeEventListener('click', collapsedOnclick);
        actionBtn.addEventListener('click', expandedOnclick, false);
    });

// Once collapse has begun, we perform animations and then notify the Enabler
// that it should complete the collapse.
Enabler.addEventListener(studio.events.StudioEvent.FULLSCREEN_COLLAPSE_START,
    function(e) {
        collapseDiv();
    });

// Collapse process is complete.
Enabler.addEventListener(studio.events.StudioEvent.FULLSCREEN_COLLAPSE_FINISH,
    function(e) {
        isFullscreen = false;
        actionBtn.innerHTML = 'Expand Fullscreen';
        actionBtn.removeEventListener('click', expandedOnclick);
        actionBtn.addEventListener('click', collapsedOnclick, false);
    });

var transitionEndHandler = function(e) {
    if (e.propertyName == 'width') {
        actionBtn.disabled = '';
        if (isFullscreen) {
            Enabler.finishFullscreenCollapse();
            doFinalCollapse();
        } else {
            Enabler.finishFullscreenExpand();
            doFinalExpand();
        }
    }
};

var transitionEnds = [
    'transitionend',
    'oTransitionEnd',
    'msTransitionEnd',
    'webkitTransitionEnd'
];
for (var i = 0; i < transitionEnds.length; i++) {
    viewport.addEventListener(transitionEnds[i], transitionEndHandler, false);
}

if (Enabler.isInitialized()) {
    queryFullscreenSupport();
} else {
    Enabler.callAfterInitialized(queryFullscreenSupport);
}

// Some random testing
console.log('Enabler.getUrl', Enabler.getUrl('test'));
console.log('Enabler.setUseCustomClose', Enabler.setUseCustomClose(true));

// test load script
Enabler.loadScript('https://s.yimg.com/cv/ae/hoang/test/test.js', function(){
    console.log('load script success');
});
