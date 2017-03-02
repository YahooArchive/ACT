ACT.setConfig("config-object-floating", {
    baseConfig: {
        id: "test",
        template: 'floating',
        version: '0.0.1.5',
        forceEnv: {
            forcedFlashList: {
                Chrome: "*",
                FireFox: "*",
                Safari: "*",
                MSIE: "*"
            },
            forcedHTML5List: {},
            forcedBackupList: {}
        }
    },
    tracking: {},
    format: {
        darlaLayer: {
            holder: {
                "contractedWidth": "300",
                "contractedHeight": "250"
            }
        },
        flow: [{
            eventType: "firstPlay",
            doIf: {
            	cookie: true
            },
            actions: [{
                "type": "playLayer",
                "to": "mpu",
                "animate": false
            }, {
                "type": "contractInlineFrame"
            }, {
                "type": "expandInlineFrame",
                "top": 10,
                "right": 0,
                "bottom": 20,
                "left": 600,
                "push": false
            }, {
                "type": "playLayer",
                "to": "floating",
                "animate": true
            }, {
                "type": "track",
                "label": "floating_firstplay_ad_html"
            }]
        }, {
            eventType: "firstPlay",
            doIf: {
            	cookie: true
            },
            timeTo: 6,
            actions: [{
                "type": "stopLayer",
                "to": "floating"
            }, {
                "type": "contractInlineFrame"
            }, {
                "type": "expandInlineFrame",
                "top": 230,
                "right": 0,
                "bottom": 0,
                "left": 470,
                "push": false
            }, {
                "type": "playLayer",
                "to": "expandable",
                "animate": true
            }]
        }, {
            eventType: "firstPlay",
            doIf: {
            	cookie: false
            },
            actions: [{
                    "type": "contractInlineFrame"
                }, {
                    "type": "expandInlineFrame",
                    "top": 10,
                    "right": 0,
                    "bottom": 10,
                    "left": 0,
                    "push": true
                },
                {
                    "type": "playLayer",
                    "to": "mpu",
                    "animate": false
                }, {
                    "type": "track",
                    "label": "floating_firstplay_ad_html"
                }
            ]
        }, {
            eventType: "cappedPlay",
            actions: [{
                    "type": "contractInlineFrame"
                }, {
                    "type": "expandInlineFrame",
                    "top": 10,
                    "right": 0,
                    "bottom": 10,
                    "left": 0,
                    "push": true
                },
                {
                    "type": "playLayer",
                    "to": "mpu",
                    "animate": false
                }, {
                    "type": "track",
                    "label": "floating_cappedplay_ad_html"
                }
            ]
        }],
        layers: {
            mpu: {
                layerName: "mpu",
                base: "act-ad",
                type: "inline",
                width: "300px",
                height: "250px",
                x: "0",
                y: "0",
                contentLayer: {
                    type: "content-container",
                    id: "mpu_container",
                    env: ["flash", "html", "backup"],
                    content: [{
                            id: "container_1_1",
                            type: "content-container",
                            env: ['backup'],
                            css: {
                                width: '300px',
                                height: '250px',
                                background: 'blue',
                                'text-color': '#fff'
                            },
                            eventConfig: [{
                                eventType: "click",
                                actions: [{
                                    "type": "contractInlineFrame"
                                }, {
                                    "type": "expandInlineFrame",
                                    "top": 200,
                                    "right": 0,
                                    "bottom": 0,
                                    "left": 470,
                                    "push": false
                                }, {
                                    "type": "playLayer",
                                    "to": "expandable"
                                }]
                            }],
                            containerConfig: {
                                innerText: 'MPU container, click to open expandable'
                            }
                        }, {
                            id: 'mpu_flash',
                            type: 'content-swf',
                            env: ["flash"],
                            css: {
                                width: '300px',
                                height: '250px'
                            },
                            swfConfig: {
                                src: 'https://s.yimg.com/dh/ap/demo/assets/swfassets/300x250.swf',
                                width: 300,
                                height: 250,
                                flashvars: {
                                    clickTag: 'https://uk.yahoo.com'
                                }
                            }
                        },
                        {
                            id: 'extraBtns',
                            type: 'content-container',
                            env: ["flash", "html"],
                            css: {
                                width: '100%',
                                fontFamily: '"Helvetica Neue",Helvetica,Arial',
                                marginTop: "2px",
                                textAlign: "right",
                                fontSize: "11px"
                            },
                            content: [{
                                id: 'replay_btn',
                                type: 'content-container',
                                env: ["flash", "html", "backup"],
                                "classNode": "active",
                                css: {
                                    bottom: '0px',
                                    right: '0px',
                                    "color": "black",
                                    "display": "inline",
                                    cursor: "pointer"
                                },
                                containerConfig: {
                                    innerText: 'Replay Ad - '
                                },
                                eventConfig: [{
                                    eventType: "click",
                                    actions: [{
                                        "type": "replayAd"
                                    }, {
                                        "type": "track",
                                        "label": "floating_click_ad_replay"
                                    }]
                                }]
                            }, {
                                id: 'surveyBtn',
                                type: 'content-container',
                                env: ["flash", "html", "backup"],
                                "classNode": "active",
                                css: {
                                    bottom: '0px',
                                    right: '0px',
                                    "display": "inline",
                                    cursor: "pointer"
                                },
                                containerConfig: {
                                    innerText: 'Ad Feedback -'
                                },
                                eventConfig: [{
                                    eventType: "click",
                                    actions: [{
                                            "type": 'openURL',
                                            "URLpath": 'https://surveylink.yahoo.com/wix/p0767152.aspx',
                                            "URLname": "expandable_click_clicktag_open"
                                        }
                                    ]
                                }]
                            }, {
                                id: 'adchoicesBtn',
                                type: 'content-container',
                                env: ["flash", "html", "backup"],
                                "classNode": "fpad_can_ad_slug",
                                css: {
                                    bottom: '0px',
                                    right: '0px',
                                    "display": "inline",
                                    cursor: "pointer"
                                },
                                containerConfig: {
                                    innerText: '- AdChoices'
                                },
                                eventConfig: [{
                                    eventType: "click",
                                    actions: [{
                                            "type": 'openURL',
                                            "URLpath": 'http://info.yahoo.com/privacy/uk/yahoo/relevantads.html',
                                            "URLname": "expandable_click_clicktag_open"
                                        }
                                    ]
                                }]
                            }]
                        }
                    ]
                }
            },
            floating: {
                layerName: "floating",
                base: "body",
                type: "overlay",
                width: '900px',
                height: '250px',
                x: 'get:mpu:x',
                y: 'get:mpu:y',
                coordinate: 'br',
                onResize: "refresh",
                contentLayer: {
                    type: "content-container",
                    id: "floating_container",
                    env: ["flash", "html", "backup"],
                    css: {
                        'position': 'relative',
                        'width': '900px',
                        'height': '250px'
                    },
                    content: [{
                        id: 'floating_flash',
                        type: 'content-swf',
                        env: ["flash"],
                        css: {
                            width: '900px',
                            height: '250px'
                        },
                        swfConfig: {
                            src: 'https://s.yimg.com/dh/ap/demo/assets/swfassets/900x250.swf',
                            width: 900,
                            height: 250,
                            flashvars: {
                                clickTAG: 'https://uk.yahoo.com',
                                URLname: 'test_floating'
                            }
                        }
                    }, {
                        id: 'floating_close_btn',
                        type: 'content-container',
                        classNode: "actjs-icon-x-altx-alt",
                        env: ['flash', 'html', 'backup'],
                        css: {
                            position: 'absolute',
                            top: '0',
                            right: '0',
                            width: '86',
                            height: '86',
                            padding: '5px',
                            fontSize: '24px',
                            cursor: "pointer",
                            color: "#fff"
                        },
                        eventConfig: [{
                            eventType: "click",
                            actions: [{
                                "type": "stopLayer",
                                "to": "floating"
                            }, {
                                "type": "contractInlineFrame"
                            }, {
                                "type": "expandInlineFrame",
                                "top": 0,
                                "right": 0,
                                "bottom": 20,
                                "left": 0,
                                "push": false
                            }, {
                                "type": "stopProcesses"
                            }]
                        }]
                    }]
                }
            },
            expandable: {
                layerName: "expandable",
                base: "body",
                type: "overlay",
                width: '770px',
                height: '450px',
                x: 'get:mpu:x',
                y: 'get:mpu:y',
                coordinate: 'br',
                onResize: "refresh",
                contentLayer: {
                    type: "content-container",
                    id: "expandable_container",
                    env: ["flash", "html", "backup"],
                    css: {},
                    content: [{
                        id: 'expandable_content_clicktag',
                        type: 'content-container',
                        env: ['backup'],
                        css: {
                            width: '770px',
                            height: '450px',
                            background: 'green',
                            'text-color': '#fff'
                        },
                        eventConfig: [{
                            eventType: "click",
                            actions: [{
                                "type": 'openURL',
                                "URLpath": 'https://fr.yahoo.com',
                                "URLname": "expandable_click_clicktag_open"
                            }, {
                                "type": "stopLayer",
                                "to": "expandable"
                            }, {
                                "type": "contractInlineFrame"
                            }]
                        }],
                        containerConfig: {
                            innerText: 'expandable layer - only play when user click on MPU. - click to close'
                        }
                    }, {
                        id: 'expandable_flash',
                        type: 'content-swf',
                        env: ["flash"],
                        css: {
                            width: '770px',
                            height: '450px'
                        },
                        swfConfig: {
                            src: 'https://s.yimg.com/dh/ap/demo/assets/swfassets/770x450.swf',
                            width: 770,
                            height: 450,
                            flashvars: {
                                clickTag: 'https://vn.yahoo.com'
                            }
                        }
                    }, {
                        id: 'expandable_close_btn',
                        type: 'content-container',
                        classNode: "actjs-icon-x-altx-alt",
                        env: ['flash', 'html', 'backup'],
                        css: {
                            position: 'absolute',
                            top: '0',
                            right: '0',
                            padding: '5px',
                            width: '86',
                            height: '86',
                            fontSize: '24px',
                            color: '#fff'
                        },
                        eventConfig: [{
                            eventType: "click",
                            actions: [{
                                    "type": "stopLayer",
                                    "to": "expandable"
                                }, {
                                    "type": "contractInlineFrame"
                                }, {
                                    "type": "expandInlineFrame",
                                    "top": 0,
                                    "right": 0,
                                    "bottom": 20,
                                    "left": 0,
                                    "push": true
                                }
                            ]
                        }]
                    }]
                }
            }
        }
    }
});