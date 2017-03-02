var fs = require('fs');
var DEFAULT_OPTIONS = {
	filter: ['js', 'html', 'json'],
	filter_ignore: ['asset', '.DS_Store']
};

var filterFiles = new RegExp([ 'js', 'html', 'json' ].join('|'));
var filterIgnore = new RegExp([ 'asset', '.DS_Store' ].join('|'));
var filterFolder = false;

function getFolderContents(currentPath, output) {
	var data = fs.readdirSync(currentPath);
	for (var itor = 0; itor < data.length; itor++) {
		var curPath = currentPath + "/" + data[itor];
		var stat = fs.statSync(curPath);

		if (filterFolder && !curPath.match(filterFolder)){
			continue;
		} else {
			if (stat.isDirectory()) {
				getFolderContents(curPath, output);
			} else {
				if( curPath.match(filterFiles) && !curPath.match(filterIgnore)){
					var ourWay = curPath.replace('../', '').split("/");
					var ref = output;
					ourWay.forEach(function(folder){
						if(ref[folder]) {
							ref = ref[folder];
						} else {
							ref[folder] = {
								__fullpath: curPath
							};
							ref = ref[folder];
						}
					});
				}
			}
		}
	}
	return output;
}

module.exports = {
	allDemo: function(item, options){
		var tmpFilename = item.data.root.projectType
		filterFolder = false;
		if(tmpFilename) {
			if(tmpFilename.match(/enabler/)){
				filterFolder = new RegExp([ 'enabler' ].join('|'));
			}
		}

		var structure = {};
		getFolderContents('examples', structure);

		var sideBar = Object.keys(structure.examples).sort();
		var context = {};
		var docDemos = [];
		var out = "";

		sideBar.forEach(function(value){
			if(value === '__fullpath') {
				return;
			}
			docDemos.push({
				displayName: value,
				name: 'ACT_Demo_' + value
			});
		});

		for(var i=0, l=docDemos.length; i<l; i++) {
			out += item.fn(docDemos[i]);
		}
		return out;
	}
}