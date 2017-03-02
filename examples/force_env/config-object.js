ACT.setConfig( "config-object-boomerang",  {
	baseConfig: {
		id: "test",
		template: 'Inline',
		forceEnv: {
			forcedBackupList: {
				"allBrowsers": "*"
			}
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
						"label": "boomerang_firstPlay_ad_play::envRendered::"
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
						"label": "boomerang_capppedPlay_ad_play::envRendered::"
					}
				]
			}
		],
		layers: {
			mpu: {
				layerName: "mpu",
				base: "act-ad",
				type: "inline",
				width: "300px",
				height: "250px",
				x: "0",
				y: "0",
				opacity: "0",
				contentLayer: {
					type: "content-container",
					id: "mpu_container",
					env: ["tablet", "mobile", "html", "backup"],
					css: {
						width: "100%",
						height: "100%",
						overflow: "hidden"

					},
					eventConfig: [],
					containerConfig: {
						innerText: ""
					},
					content: [
						{
							id: 'nextSlideBtn',
				            type: 'content-container',
				            env: ["mobile"],
				            css: {
				                "height": '35px',
				                "width": '35px',
				                "position": 'absolute',
				                "top": '60px',
				                "right": '5px',
				                "color": "black",
				                "font-size": "35px",
				                "z-index": "100",
				                "background": 'rgba(0, 0, 0, 0) url("https://s.yimg.com/hl/ap/default/150325/left.png") no-repeat scroll 0 0'
				            },
				            containerConfig: {
				                innerText: ''
				            },
				            eventConfig: [
                                {
    				            	eventType: 'click',
    				            	actions: [{
    				            		type: 'carouselNextSlide',
    				            		to: 'carousel1'
    				            	}]
    				            },
                                {
                                    eventType: 'mouseenter',
                                    actions: [
                                        {
                                            type: "containerShow",
                                            id: "nextSlideBtn"

                                        }
                                    ]
                                },
                                {
                                    eventType: 'mouseleave',
                                    actions: [
                                        {
                                            type: "containerHide",
                                            id: "nextSlideBtn"

                                        }
                                    ]
                                },
                                {
                                    eventType: 'mouseenter',
                                    actions: [
                                        {
                                            type: "containerShow",
                                            id: "prevSlideBtn"

                                        }
                                    ]
                                },
                                {
                                    eventType: 'mouseleave',
                                    actions: [
                                        {
                                            type: "containerHide",
                                            id: "prevSlideBtn"

                                        }
                                    ]
                                }
                            ]
						},
						{
							id: 'prevSlideBtn',
				            type: 'content-container',
				            env: ["mobile"],
				            css: {
				                "height": '35px',
				                "width": '35px',
				                "position": 'absolute',
				                "top": '60px',
				                "left": '5px',
				                "color": "black",
				                "font-size": "35px",
				                "z-index": "100",
				                "background": 'rgba(0, 0, 0, 0) url("https://s.yimg.com/hl/ap/default/150325/right.png") no-repeat scroll 0 0',
                                "display": "none"
				            },
				            containerConfig: {
				                innerText: ''
				            },
				            eventConfig: [
                                {
    				            	eventType: 'click',
    				            	actions: [{
    				            		type: 'carouselPreviousSlide',
    				            		to: 'carousel1'
    				            	}]
    				            },
                                {
                                    eventType: 'mouseenter',
                                    actions: [
                                        {
                                            type: "containerShow",
                                            id: "prevSlideBtn"

                                        }
                                    ]
                                },
                                {
                                    eventType: 'mouseleave',
                                    actions: [
                                        {
                                            type: "containerHide",
                                            id: "prevSlideBtn"

                                        }
                                    ]
                                },
                                {
                                    eventType: 'mouseenter',
                                    actions: [
                                        {
                                            type: "containerShow",
                                            id: "nextSlideBtn"

                                        }
                                    ]
                                },
                                {
                                    eventType: 'mouseleave',
                                    actions: [
                                        {
                                            type: "containerHide",
                                            id: "nextSlideBtn"

                                        }
                                    ]
                                }
                            ]
						},
						{
					        type: 'content-carousel',
					        id: 'carousel1',
					        env: ["mobile"],
					        classNode: 'carousel_class',
					        css: {
					            'width': '300px',
					            'height': '250px',
					            'display': 'block',
					            'position': 'relative',
					            'overflow': 'hidden',
					            'font-family': "Helvetica Neue,HelveticaNeue,Arial,sans-serif"
					        },
					        ContentCarouselConfig:{
								transitionTime: 500,
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
	        				content:
	        				[
		        				{
						            id: 'content_one',
						            type: 'content-container',
						            env: ["mobile"],
						            "classNode": "active",
						            css: {
						                "width": '298px',
						                "height": '248px',
						                "border": '1px solid #e2e2e6'
						            },
						            containerConfig: {
						                innerText: ''
						            },
                                    eventConfig: [
                                        {
                                            eventType: 'click',
                                            actions: [
                                                {
                                                    type: "openURL",
                                                    id: "actionSlide1",
                                                    URLpath: "http://yahoo.com",
                                                    URLname: "slide1_click_slide1_clickhtml"
                                                }
                                            ]
                                        },
                                        {
                                            eventType: 'mouseenter',
                                            actions: [
                                                {
                                                    type: "containerShow",
                                                    id: "nextSlideBtn"

                                                }
                                            ]
                                        },
                                        {
                                            eventType: 'mouseleave',
                                            actions: [
                                                {
                                                    type: "containerHide",
                                                    id: "nextSlideBtn"

                                                }
                                            ]
                                        },
                                        {
                                            eventType: 'mouseenter',
                                            actions: [
                                                {
                                                    type: "containerShow",
                                                    id: "prevSlideBtn"

                                                }
                                            ]
                                        },
                                        {
                                            eventType: 'mouseleave',
                                            actions: [
                                                {
                                                    type: "containerHide",
                                                    id: "prevSlideBtn"

                                                }
                                            ]
                                        }
                                    ],
						            content: [
							            {
								            id: 'header_one',
								            type: 'content-container',
								            env: ["mobile"],
								            css: {
										        "float":"left",
										        "position":"absolute",
										        "color": "white",
										        "padding":"10px",
										        "width":"100%",
                                                "background": 'rgba(0, 0, 0, 0) url("https://s.yimg.com/dh/ap/boomerang/assets/3/black_bg.png") repeat-x scroll 0 0'

										    },
								            content:[
								            	{
								            		id: 'avatar_one',
										            type: 'content-image',
										            env: ["mobile"],
										            css:{
										            	"float":"left",
										            	"height":"16px",
										            	"width":"16px",
										            	"margin":"0 4px 8px 0",
										            	"background-color":"red"
										            },
                                                    imageConfig: {
                                                        src: "",
                                                        alt: "alt",
                                                        title: "title"
                                                    }

								            	},
								            	{
								            		id: 'title_text_one',
										            type: 'content-container',
										            env: ["mobile"],
										            content: [
										            	{
										            		id: 'main_title_one',
												            type: 'content-container',
												            env: ["mobile"],
												            css: {
												                "font-size": "13px",
								                				"font-weight": "bold"

												            },
												            containerConfig: {
												                innerText: 'GO TO SLIDE 3'
												            }
										            	},
										            	{
										            		id: 'subTitle_one',
												            type: 'content-container',
												            env: ["mobile"],
												            css: {
												                "font-size": "11px",
								                				"font-weight": "normal"

												            },
												            containerConfig: {
												                innerText: 'SUB TITLE'
												            }
										            	}
										            ]
								            	}


								            ]
							            },
							            {
							            	id: 'body_one',
								            type: 'content-container',
								            env: ["mobile"],
								            css: {
										        width:"100%"

										    },
								            content:[
								            	{
								            		id: 'image_one',
										            type: 'content-image',
										            env: ["mobile"],
										            css: {
												        width:"100%"

												    },
										           	imageConfig: {
						                                src: "",
						                                alt: "alt",
						                                title: "title"
						                            }
								            	},
								            	{
								            		id: "text_box_one",
								            		type: 'content-container',
								            		env: ['mobile'],
								            		css:{
								            			"background-color":"white",
								            			"position": "absolute",
								            			"bottom":"0",
								            			"left":"0",
								            			"height":"100px",
								            			"width":"298px"

								            		},
								            		content:[
								            			{
										            		id:'posttitle_one',
										            		type: 'content-container',
												            env: ["mobile"],
												            css: {
														        "width":"280px",
														        "text-align":"center",
														        "color": "#3a008b",
														        "font-size": "14px",
														        "font-weight": "bold",
														        "min-height": "40px",
														        "padding": "10px 10px 0"


														    },
														    containerConfig: {
														        innerText: 'BIG TITLE TO CLICK'
													        }
										            	},
										            	{
										            		id:'button_one',
										            		type: 'content-container',
												            env: ["mobile"],
												            css: {
														        "width":"263px",
														        "text-align":"center",
														        "color": "#acacac",
														        "font-size": "11px",
														        "font-weight": "500",
														        "letter-spacing": "2px",
														        "padding": "6px",
														        "background-color": "#f2f2f2",
														        "margin-left": "10px"



														    },
														    containerConfig: {
														        innerText: 'DISCOVERY'
													        }
										            	}
								            		]
								            	}

								            ]
							            }
						            ]
						        },
						    	{
						            id: 'content_two',
						            type: 'content-container',
						            env: ["mobile"],
						            "classNode": "active",
						            css: {
						                "width": '298px',
						                "height": '248px',
						                "border": '1px solid #e2e2e6'
						            },
						            containerConfig: {
						                innerText: ''
						            },
                                    eventConfig: [
                                        {
                                            eventType: 'click',
                                            actions: [
                                                {
                                                    type: "openURL",
                                                    id: "actionSlide2",
                                                    URLpath: "http://yahoo.com",
                                                    URLname: "slide1_click_slide1_clickhtml"
                                                }
                                            ]
                                        },
                                        {
                                            eventType: 'mouseenter',
                                            actions: [
                                                {
                                                    type: "containerShow",
                                                    id: "nextSlideBtn"

                                                }
                                            ]
                                        },
                                        {
                                            eventType: 'mouseleave',
                                            actions: [
                                                {
                                                    type: "containerHide",
                                                    id: "nextSlideBtn"

                                                }
                                            ]
                                        },
                                        {
                                            eventType: 'mouseenter',
                                            actions: [
                                                {
                                                    type: "containerShow",
                                                    id: "prevSlideBtn"

                                                }
                                            ]
                                        },
                                        {
                                            eventType: 'mouseleave',
                                            actions: [
                                                {
                                                    type: "containerHide",
                                                    id: "prevSlideBtn"

                                                }
                                            ]
                                        }
                                    ],
						            content: [
							            {
								            id: 'header_two',
								            type: 'content-container',
								            env: ["mobile"],
								            css: {
										        "float":"left",
										        "position":"absolute",
										        "color": "white",
										        "padding":"10px",
										        "width":"100%",
                                                "background": 'rgba(0, 0, 0, 0) url("https://s.yimg.com/dh/ap/boomerang/assets/3/black_bg.png") repeat-x scroll 0 0'

										    },
								            content:[
								            	{
								            		id: 'avatar_two',
										            type: 'content-image',
										            env: ["mobile"],
										            css:{
										            	"float":"left",
										            	"height":"16px",
										            	"width":"16px",
										            	"margin":"0 4px 8px 0",
										            	"background-color":"red"
										            },
                                                    imageConfig: {
                                                        src: "",
                                                        alt: "alt",
                                                        title: "title"
                                                    }

								            	},
								            	{
								            		id: 'title_text_two',
										            type: 'content-container',
										            env: ["mobile"],
										            content: [
										            	{
										            		id: 'main_title_two',
												            type: 'content-container',
												            env: ["mobile"],
												            css: {
												                "font-size": "13px",
								                				"font-weight": "bold"

												            },
												            containerConfig: {
												                innerText: 'GO TO SLIDE 3'
												            }
										            	},
										            	{
										            		id: 'subTitle_two',
												            type: 'content-container',
												            env: ["mobile"],
												            css: {
												                "font-size": "11px",
								                				"font-weight": "normal"

												            },
												            containerConfig: {
												                innerText: 'SUB TITLE'
												            }
										            	}
										            ]
								            	}


								            ]
							            },
							            {
							            	id: 'body_two',
								            type: 'content-container',
								            env: ["mobile"],
								            css: {
										        width:"100%"

										    },
								            content:[
								            	{
								            		id: 'image_two',
										            type: 'content-image',
										            env: ["mobile"],
										            css: {
												        width:"100%"

												    },
										           	imageConfig: {
						                                src: "",
						                                alt: "alt",
						                                title: "title"
						                            }
								            	},
								            	{
								            		id: "text_box_two",
								            		type: 'content-container',
								            		env: ['mobile'],
								            		css:{
								            			"background-color":"white",
								            			"position": "absolute",
								            			"bottom":"0",
								            			"left":"0",
								            			"height":"100px",
								            			"width":"298px"

								            		},
								            		content:[
								            			{
										            		id:'posttitle_two',
										            		type: 'content-container',
												            env: ["mobile"],
												            css: {
														        "width":"280px",
														        "text-align":"center",
														        "color": "#3a008b",
														        "font-size": "14px",
														        "font-weight": "bold",
														        "min-height": "40px",
														        "padding": "10px 10px 0"
															},
														    containerConfig: {
														        innerText: 'BIG TITLE TO CLICK'
													        }
										            	},
										            	{
										            		id:'button_two',
										            		type: 'content-container',
												            env: ["mobile"],
												            css: {
														        "width":"263px",
														        "text-align":"center",
														        "color": "#acacac",
														        "font-size": "11px",
														        "font-weight": "500",
														        "letter-spacing": "2px",
														        "padding": "6px",
														        "background-color": "#f2f2f2",
														        "margin-left": "10px"



														    },
														    containerConfig: {
														        innerText: 'DISCOVERY'
													        }
										            	}
								            		]
								            	}

								            ]
							            }
						            ]
						        },
						        {
						            id: 'content_three',
						            type: 'content-container',
						            env: ["mobile"],
						            "classNode": "active",
						            css: {
						                width: '298px',
						                height: '248px',
						                border: '1px solid #e2e2e6'
						            },
						            containerConfig: {
						                innerText: ''
						            },
                                    eventConfig: [
                                        {
                                            eventType: 'click',
                                            actions: [
                                                {
                                                    type: "openURL",
                                                    id: "actionSlide3",
                                                    URLpath: "http://yahoo.com",
                                                    URLname: "slide3_click_slide3_clickhtml"
                                                }
                                            ]
                                        },
                                        {
                                            eventType: 'mouseenter',
                                            actions: [
                                                {
                                                    type: "containerShow",
                                                    id: "nextSlideBtn"

                                                }
                                            ]
                                        },
                                        {
                                            eventType: 'mouseleave',
                                            actions: [
                                                {
                                                    type: "containerHide",
                                                    id: "nextSlideBtn"

                                                }
                                            ]
                                        },
                                        {
                                            eventType: 'mouseenter',
                                            actions: [
                                                {
                                                    type: "containerShow",
                                                    id: "prevSlideBtn"

                                                }
                                            ]
                                        },
                                        {
                                            eventType: 'mouseleave',
                                            actions: [
                                                {
                                                    type: "containerHide",
                                                    id: "prevSlideBtn"

                                                }
                                            ]
                                        }
                                    ],
						            content: [
							            {
								            id: 'header_three',
								            type: 'content-container',
								            env: ["mobile"],
								            css: {
										        "float":"left",
										        "position":"absolute",
										        "color": "white",
										        padding:"10px",
										        width:"100%",
                                                background: 'rgba(0, 0, 0, 0) url("https://s.yimg.com/dh/ap/boomerang/assets/3/black_bg.png") repeat-x scroll 0 0'

										    },
								            content:[
								            	{
								            		id: 'avatar_three',
										            type: 'content-image',
										            env: ["mobile"],
										            css:{
										            	"float":"left",
										            	"height":"16px",
										            	"width":"16px",
										            	"margin":"0 4px 8px 0",
										            	"background-color":"red"
										            },
                                                    imageConfig: {
                                                        src: "",
                                                        alt: "alt",
                                                        title: "title"
                                                    }

								            	},
								            	{
								            		id: 'title_text_three',
										            type: 'content-container',
										            env: ["mobile"],
										            content: [
										            	{
										            		id: 'main_title_three',
												            type: 'content-container',
												            env: ["mobile"],
												            css: {
												                "font-size": "13px",
								                				"font-weight": "bold"

												            },
												            containerConfig: {
												                innerText: 'GO TO SLIDE 3'
												            }
										            	},
										            	{
										            		id: 'subTitle_three',
												            type: 'content-container',
												            env: ["mobile"],
												            css: {
												                "font-size": "11px",
								                				"font-weight": "normal"

												            },
												            containerConfig: {
												                innerText: 'SUB TITLE'
												            }
										            	}
										            ]
								            	}


								            ]
							            },
							            {
							            	id: 'body_three',
								            type: 'content-container',
								            env: ["mobile"],
								            css: {
										        width:"100%"

										    },
								            content:[
								            	{
								            		id: 'image_three',
										            type: 'content-image',
										            env: ["mobile"],
										            css: {
												        width:"100%"

												    },
										           	imageConfig: {
						                                src: "",
						                                alt: "alt",
						                                title: "title"
						                            }
								            	},
								            	{
								            		id: "text_box_three",
								            		type: 'content-container',
								            		env: ['mobile'],
								            		css:{
								            			"background-color":"white",
								            			"position": "absolute",
								            			"bottom":"0",
								            			"left":"0",
								            			"height":"100px",
								            			"width":"298px"

								            		},
								            		content:[
								            			{
										            		id:'posttitle_three',
										            		type: 'content-container',
												            env: ["mobile"],
												            css: {
														        width:"280px",
														        "text-align":"center",
														        "color": "#3a008b",
														        "font-size": "14px",
														        "font-weight": "bold",
														        "min-height": "40px",
														        "padding": "10px 10px 0"


														    },
														    containerConfig: {
														        innerText: 'BIG TITLE TO CLICK'
													        }
										            	},
										            	{
										            		id:'button_three',
										            		type: 'content-container',
												            env: ["mobile"],
												            css: {
														        width:"263px",
														        "text-align":"center",
														        "color": "#acacac",
														        "font-size": "11px",
														        "font-weight": "500",
														        "letter-spacing": "2px",
														        "padding": "6px",
														        "background-color": "#f2f2f2",
														        "margin-left": "10px"



														    },
														    containerConfig: {
														        innerText: 'DISCOVERY'
													        }
										            	}
								            		]
								            	}

								            ]
							            }
						            ]
						        }
	        				]
						},
						{
							id: 'prevSlideBtn',
				            type: 'content-container',
				            env: ["tablet"],
				            css: {
				                "height": '300px',
				                "width": '250px',
				                "background-color":"red",
				                "font-size": "24px",
				                "padding":"50px"
				            },
				            containerConfig: {
				                innerText: 'this container only renders in tablet'
				            }
				        },

				        {
							id: 'prevSlideBtn2',
				            type: 'content-container',
				            env: [ "html"],
				            css: {
				                "height": '300px',
				                "width": '250px',
				                "background-color":"blue",
				                "font-size": "24px",
				                "padding":"50px",
				                "color": "white"
				            },
				            containerConfig: {
				                innerText: 'this container only renders in html'
				            }
				        },
				        {
							id: 'prevSlideBtn3',
				            type: 'content-container',
				            env: [ "backup"],
				            css: {
				                "height": '300px',
				                "width": '250px',
				                "background-color":"blue",
				                "font-size": "24px",
				                "padding":"50px",
				                "color": "white"
				            },
				            containerConfig: {
				                innerText: 'this container only renders in backup'
				            }
				        }



					]
				}
			}
		}
	}
});
