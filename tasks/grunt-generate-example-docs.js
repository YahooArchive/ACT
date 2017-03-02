/*
 * Grunt generate examples for documentation
 */
'use strict'

/* Imports */
const fs = require('fs');
const handlebars = require('handlebars');

/* Variables */
const structure = {};
const DEFAULT_OPTIONS = {
	filter: ['js', 'html', 'json'],
	filter_ignore: ['asset', '.DS_Store']
};

let filterFiles = new RegExp([ 'js', 'html', 'json' ].join('|'));
let filterIgnore = new RegExp([ 'asset', '.DS_Store' ].join('|'));
let filterFolder = false;
let projectName = 'ACT.js Demos';
let projectLogo = '';
let template;

const handlevars = {
	htmlTitle: '',
	projectName: projectName,
	yuiGridsUrl: 'http://yui.yahooapis.com/3.9.1/build/cssgrids/cssgrids-min.css',
	yuiSeedUrl: 'http://yui.yahooapis.com/combo?3.9.1/build/yui/yui-min.js',
	projectAssets: '../assets'
};

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

function makeSideBar(){
	var sidebarContent = '<div id="api-list">'+
						'	<div id="api-tabview" class="tabview">'+
						'		<ul class="tabs">'+
						'			<li><a href="#act-js-examples">Demo and Examples</a></li>'+
						'		</ul>'+
						'		<div id="api-tabview-filter">'+
						'			<input type="search" id="api-filter" style="display:none;" placeholder="Type to filter Demos">'+
						'		</div>'+
						'		<div id="api-tabview-panel">'+
						'			<ul id="api-classes" class="apis classes">'+
						'			{{#each sideBar}}'+
						'				<li><a href="{{this}}">{{@key}}</a></li>'+
						'			{{/each}}'+
						'			</ul>'+
						'		</div>'+
						'	</div>'+
						'</div>';
	handlebars.registerPartial('sidebar', sidebarContent);
	handlebars.registerPartial('options', '<a href="../">Back to docs</a>');
	
	var sideBar = Object.keys(structure.examples).sort();
	var context = {};
	sideBar.forEach(function(value){
		if(value === '__fullpath') {
			return;
		}
		context[value] = 'ACT_Demo_' + value + '.html';
	});
	handlevars.sideBar = context;
}

function makeContent(){
	var content = '<h1>Demo For {{demoName}}</h1>'+
					'<div class="box meta">'+
					'        <div class="foundat">File for this demo is found: {{codePath}}</div>'+
					'</div>'+
					'<div id="classdocs" class="tabview">'+
					'    <ul class="api-class-tabs">'+
					'        <li class="api-class-tab index"><a href="#index">Rendered Example</a></li>'+
					' 		{{#if configCode}}'+
					'		<li class="api-class-tab methods"><a href="#methods">Config Object</a></li>'+
					' 		{{/if}}'+
					'    </ul>'+
					'    <div>'+
					'        <div id="index" class="api-class-tabpanel index">{{srcCodeLive}}</div>'+
					' 		{{#if configCode}}'+
					'		<div id="methods" class="api-class-tabpanel methods">'+
					'			<pre class="code prettyprint"><code>{{configCode}}</code></pre>'+
					'		</div>'+
					' 	{{/if}}'+
					'   </div>'+
					'</div>'+
					'<div class="box intro">'+
					'	<pre class="code prettyprint"><code>{{srcCode}}</code></pre>'+
					'</div>';
;
	handlebars.registerPartial('layout_content', content);	
}

function updateReferences(code){
	var codeStr = code.toString();
	var codePath = handlevars.codePath.split('/').slice(0, -1).join('/');

	/* We need to replace ../src/ with ../../src/ as well as the config obj to reference correctly */
	codeStr = codeStr.replace(/src="..\/src\//gi, 'src="../../src/');
	codeStr = codeStr.replace(/src=".\//gi, 'src="../../'+codePath+'/');
	codeStr = codeStr.replace(/src="..\/Tracking/gi, 'src="../../examples/Tracking');
	codeStr = codeStr.replace(/.\/asset\//gi, '../../'+codePath+'/asset/');

	return codeStr;
}

function generateDemos(writeCodePath){
	var start = structure['examples'];
	var count = 0;

	// Create demo folder if it does not exist
	if (!fs.existsSync(writeCodePath)) {
		fs.mkdirSync(writeCodePath);
	}

	Object.keys(start).forEach(function (key) {
		handlevars.configCode = null;
		delete handlevars.configCode;
		
		Object.keys(start[key]).forEach( function(myKey){
			if(myKey === '__fullpath' || key === '__fullpath') {
				return;
			}
			
			handlevars.demoName = key;
			handlevars.htmlTitle = 'ACT.js Demo : ' + key;
			if(myKey.match('.html')) {
				/* If we match HTML we want to inject this into the page to render and code preview */
				handlevars.srcCode = fs.readFileSync(start[key][myKey]['__fullpath']);
				handlevars.codePath = start[key][myKey]['__fullpath'];
	
				handlebars.registerHelper('srcCodeLive', function() {
					var srcCode = updateReferences(handlevars.srcCode);
					return new handlebars.SafeString(srcCode);
				});			
				
			} else if(start[key][myKey]['__fullpath']) {
				/* We simply want to link to this other content as extra data. */
				handlevars.configCode = fs.readFileSync(start[key][myKey]['__fullpath']);
			}
			/* Context is now in handlevars */
			try {
				var demoOutput = template(handlevars);
			} catch(e){ }

			fs.writeFileSync(writeCodePath + '/ACT_Demo_' + key + '.html', demoOutput, { flag: 'w'});
			count++;
		});
	});
	return count;
}

module.exports = function (grunt) {
	grunt.registerMultiTask('docs-demo', 'Generating Demos and Examples for the Docs.', function() {
		var done = this.async();
		var options = this.options(DEFAULT_OPTIONS);
		var filterOK = options.filter && options.filter.ok || DEFAULT_OPTIONS.filter;
		var filterIgnore = options.filter && options.filter.ignore || DEFAULT_OPTIONS.filter_ignore;
		var filterFolderOK = options.filter.folder_ok || false;
		var path = options.src;
		var codeTemplate = fs.readFileSync(options.template).toString();
		var writeCodePath = options.storePath;

		template = handlebars.compile(codeTemplate);

		filterFiles = new RegExp(filterOK.join('|'));
		filterIgnore = new RegExp(filterIgnore.join('|'));
		
		if(filterFolderOK){
			filterFolder = new RegExp(filterFolderOK.join('|'));
		}

		// empty out the structure in case we have remnants in there.
		Object.keys(structure).forEach(function(key) { delete structure[key]; });

		getFolderContents(path[0], structure);

		makeSideBar();
		makeContent();

		var count = generateDemos(writeCodePath);
		grunt.log.ok("Done");
		grunt.log.ok("Wrote " + count + " examples to ", writeCodePath);

		if (done) {
			done();
		}
	});
}
