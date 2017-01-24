/* Function to assist with subbing SecureDarla */
function refreshSecureDarla(which){
	if(which){
		window.Y = {
			SandBox: {
				vendor: {
						lyr: {
							open: sinon.stub(), // function(layer) {},
							close: sinon.stub() // function() {}
						},
						geom: sinon.stub(),
						resizeTo: sinon.stub(),
						register: sinon.stub(), // function(w, h, msg, root) {},
						expand: sinon.stub(), // function(x, y, push) {},
						collapse: sinon.stub(), // function() {},
						supports: sinon.stub(), // function(bool) {},
						cookie: sinon.stub() // function(cookie, obj) {}
					}
				}
			};
        refreshModule('SecureDarla');
	} else {
        window.Y = null;
		refreshModule('SecureDarla');
	}
}

/* Function to help clean up Event module */
function cleanEvent(){
	var removable = ACT.Event.removable;
	for(var itor = 0; itor < removable.length; itor++){
		if (removable[itor].eventType === 'message') continue;
		if (removable[itor].eventType === 'screen:status') continue;
		if (removable[itor].eventType === 'collapseStart') continue;
        if (removable[itor].eventType === 'html5:message') continue;
		removable[itor].remove();
	}
	ACT.Event.removable = [];
}

/* Function to help refresh / re-instantiate any ACT module. */
function refreshModule(name) {
	ACT = window.ACT || {};
	var modules = ACT.store;
	delete ACT.store;
	ACT.store = [];

	for(var itor = 0; itor < modules.length; itor++){
		var mod = modules[itor];
		if(mod.name === 'Event'){
			cleanEvent();
		} else if(mod.name == name) {
			delete ACT[mod.name];
			ACT[mod.name] = null;
			ACT[mod.name] = mod.factory(ACT);
			ACT.define(mod.name, [], mod.factory);
		}
	}

	ACT.store = modules;
}

/* To keep logging to a minimum, we overwrite window.console - reduces clutter. */
window.debug = window.console.log;
window.console.warn = function() {};
window.console.error = function() {};
window.console.log = function() {};
window.console.info = function() {};
