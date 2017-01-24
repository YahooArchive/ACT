ACT.setConfig("tablet_expanding", {
	baseConfig : {
		template : 'html5',
		forceEnv : {
			forcedFlashList : {},
			forcedHTML5List : {},
			forcedBackupList : {
				"MSIE": "*"
			}
		}
	},
	tracking : {},
	format : {
		flow : [{
			eventType : "firstPlay",
			actions : [{
				"type" : "playLayer",
				"to" : "SLIVER",
				"animate" : false
			}, {
				"type" : "trackState",
				"stateId" : "SLIVER",
				"state" : "open"
			}, {
				"type" : "track",
				"label" : 'tablet-expandable_load_ad_html'
			}]
		}, {
			eventType : "cappedPlay",
			actions : [{
				"type" : "playLayer",
				"to" : "SLIVER",
				"animate" : false
			}, {
				"type" : "trackState",
				"stateId" : "SLIVER",
				"state" : "open"
			}, {
				"type" : "track",
				"label" : 'tablet-expandable_load_ad_html'
			}]

		}],
		layers : {
			SLIVER : {
				layerName : "SLIVER",
				base : "act-ad",
				type : "inline",
				width : "728px",
				height : "90px",
				x : "0",
				y : "0",
				contentLayer : {
					type : "content-container",
					id : "FPAD_container",
					env : ["mobile", "tablet", "html", "backup"],
					css : {
						width : '728px',
						height : '90px'
					},
					content : [{
						id : "html5_container",
						type : "content-html5",
						env : ["mobile", "tablet", "html"],
						css : {
							width : "728px",
							height : "90px"
						},
						eventConfig : [{
							eventType : 'requestExpand',
							actions : [{
								type : "expandInlineFrame",
								"top" : '310',
								"bottom": '0',
								"left" : '0',
								"right": '0',
								"push" : false
							}, {
								type : 'stopLayer',
								to : 'SLIVER',
								destroy : true
							}, {
								type : 'playLayer',
								to : 'EXPAND',
								destroy : true
							}, {
								type : 'track',
								label : 'base_click_exp_open'
							}]
						}],
						trackingLabels : {
						}
					}, {
						id : 'backup_container',
						type : 'content-container',
						env : ["backup"],
						css : {
							width : '728px',
							height : '90px'
						},
						eventConfig : [{
							eventType : 'click',
							actions : [{
								id : 'action0',
								type : 'openURL',
								URLpath : '',
								URLname : 'base_click_base_clicktaghtml'
							}]
						}],
						content : [{
							id : 'FPAD_backup_image',
							type : 'content-image',
							env : ["backup"],
							css : {
								width : '728px',
								height : '90px'
							},
							imageConfig : {
								src : '',
								alt : '',
								title : ''
							}
						}]
					}]
				}
			}
		}
	}
});
