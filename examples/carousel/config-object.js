ACT.setConfig( "config-object-carousel",  {
	baseConfig: {
		id: "test",
		template: 'Inline',
		forceEnv: {
			forcedBackupList: {},
			forcedHTML5List: {},
			forcedFlashList: {}
		}
	},
	tracking: {},
	format: {
		darlaLayer: {
            holder: {
                contractedWidth: "300",
                contractedHeight: "250"
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
						"label": "mpu_::envRendered::_firstPlay::Test1::::Test2::_::envRendered::"
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
						"label": "mpu_::envRendered::_firstPlay::Test1::::Test2::_::envRendered::"
					}
				]
			}
		],
		layers: {
			mpu: {
				layerName: "mpu",
				base: "actjs-container",
				type: "inline",
				width: "300px",
				height: "250px",
				x: "0",
				y: "0",
				opacity: "0",
				contentLayer: {
					type: "content-container",
					id: "mpu_container",
					env: ["flash", "html", "backup"],
					css: {
						width: "100%",
						height: "100%",
						overflow: "hidden",
						minHeight: "320px"
					},
					eventConfig: [],
					containerConfig: {
						innerText: ""
					},
					content: [{
				        type: 'content-carousel',
				        id: 'carousel1',
				        env: ["flash", "html", "backup"],
				        classNode: 'carousel_class',
				        css: {
				            'width': '300px',
				            'height': '250px',
				            'display': 'block',
				            'position': 'relative',
				            'overflow': 'hidden'
				        },
				        ContentCarouselConfig:{
							transitionTime: 1500,
							currentSlideId: 2
				        },
				        eventConfig:[{
			            	eventType: 'carouselAnimationStart',
			            	actions: [{
			            		type: 'containerHide',
			            		id: 'nextSlideBtn'
			            	},{
			            		type: 'containerHide',
			            		id: 'prevSlideBtn'
			            	}]
			            },{
			            	eventType: 'carouselAnimationComplete',
			            	actions: [{
			            		type: 'containerShow',
			            		id: 'nextSlideBtn'
			            	},{
			            		type: 'containerShow',
			            		id: 'prevSlideBtn'
			            	}]
			            }],
        				content: [{
				            id: 'content_one',
				            type: 'content-container',
				            env: ["flash", "html", "backup"],
				            "classNode": "active",
				            css: {
				                height: '250px',
				                width: '300px',
				                "color": "black",
				                "background-color": "red",
				                cursor: "pointer"
				            },
				            containerConfig: {
				                innerText: ''
				            },
				            eventConfig: [],
				            content: [{
					            id: 'child_content_one',
					            type: 'content-container',
					            env: ["flash", "html", "backup"],
					            css: {
					                height: '100px',
					                width: '100px',
					                "color": "white",
					                position: "relative",
					                top: "75px",
					                left: "100px",
					                "background-color": "black",
					                cursor: "pointer",
					                fontSize: "12px"
					            },
					            containerConfig: {
					                innerText: 'GO TO SLIDE 3'
					            },
					            eventConfig: [{
					            	eventType: 'click',
					            	actions: [{
					            		type: 'carouselJumpToSlide',
					            		to: 'carousel1',
					            		slidePositionId: 2
					            	}]
					            }]
				            }]          
				        },{
				            id: 'content_two',
				            type: 'content-container',
				            env: ["flash", "html", "backup"],
				            "classNode": "active",
				            css: {
				                height: '250px',
				                width: '300px',
				                "color": "black",
				                "background-color": "blue",
				                cursor: "pointer"
				            },
				            containerConfig: {
				                innerText: ''
				            },
				            eventConfig: [],
				            content: [{
					            id: 'child_content_one',
					            type: 'content-container',
					            env: ["flash", "html", "backup"],
					            css: {
					                height: '100px',
					                width: '100px',
					                "color": "white",
					                position: "absolute",
					                top: "75px",
					                left: "100px",
					                "background-color": "black",
					                cursor: "pointer",
					                fontSize: "12px"
					            },
					            containerConfig: {
					                innerText: 'CONTENT 2'
					            },
					            eventConfig: []
				            }]         
        				},{
				            id: 'content_three',
				            type: 'content-container',
				            env: ["flash", "html", "backup"],
				            "classNode": "active",
				            css: {
				                height: '250px',
				                width: '300px',
				                "color": "black",
				                "background-color": "green",
				                cursor: "pointer"
				            },
				            containerConfig: {
				                innerText: ''
				            },
				            eventConfig: []          
        				}]						
					},{
						id: 'nextSlideBtn',
			            type: 'content-container',
			            env: ["flash", "html", "backup"],
			            "classNode": "actjs-icon-arrow-right-alt1",
			            css: {
			                height: '35px',
			                width: '35px',
			                position: 'absolute',
			                top: '100px',
			                right: '5px',
			                color: "black",
			                fontSize: "35px",
			                zIndex: 100
			            },
			            containerConfig: {
			                innerText: ''
			            },
			            eventConfig: [{
			            	eventType: 'click',
			            	actions: [{
			            		type: 'carouselNextSlide',
			            		to: 'carousel1'
			            	}]
			            }]  
					},{
						id: 'prevSlideBtn',
			            type: 'content-container',
			            env: ["flash", "html", "backup"],
			            "classNode": "actjs-icon-arrow-left-alt1",
			            css: {
			                height: '35px',
			                width: '35px',
			                position: 'absolute',
			                top: '100px',
			                left: '5px',
			                color: "black",
			                fontSize: "35px",
			                zIndex: 100
			            },
			            containerConfig: {
			                innerText: ''
			            },
			            eventConfig: [{
			            	eventType: 'click',
			            	actions: [{
			            		type: 'carouselPreviousSlide',
			            		to: 'carousel1'
			            	}]
			            }] 						
					}]					
				}
			}
		}
	}
});