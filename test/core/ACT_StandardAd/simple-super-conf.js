ACT.setConfig( "simple-super-conf",  {
	baseConfig: {
		id: "test",
		template: 'Splash',
		forceEnv: {
			forcedFlashList: {
			},
			forcedHTML5List: {
			},
			forcedBackupList: {
			}
		}
	},
	tracking: {
	},
	format: {
		darlaLayer: {
			holder: {
				"contractedWidth": "300",
				"contractedHeight": "250"
			}
		},

		flow: [{
				eventType: "firstPlay",
				actions: [
					{
						"type": "playLayer",
						"to": "mpu",
						"animate": false
					},
					{
						"type": "track",
						"label": "mpu_firstplay_ad_html"
					}
				]
			}, {
				eventType: "cappedPlay",
				actions: [
					{
						"type": "playLayer",
						"to": "mpu",
						"animate": false
					},
					{
						"type": "track",
						"label": "mpu_cappedplay_ad_html"
					}
				]
			}
		],
		layers: {
			mpu: {
				layerName: "mpu",
				base: "fresco-ad",
				type: "inline",
				width: "100%",
				height: "100%",
				x: "0",
				y: "0",
				contentLayer: {
					type: "content-container",
					id: "mpu_container",
					env: ["flash", "html", "backup"],
					css: {
						width: '300px',
						height: '250px'

					},
					eventConfig: [{
						eventType: "click",
						actions: [
							{
								"type": "openURL",
								"URLpath": "https://www.yahoo.com",
								"URLname": "mpu_click_clicktag_open"
							}
						]
					}],
					content: [{
							id: "img_1_1",
							type: "content-image",
							classNode: "fluffynat0r",
							env: [
								"flash",
								"html",
								"backup"
							],
							css: {
								width: "300",
								height: "250"
							},
							"imageConfig": {
								src: "https://s.yimg.com/iv/300x250_Simple/mpu3_201521111918613.jpg",
								alt: "alt",
								title: "title"
							}
						}

					]
				}
			}
		}
	}
});