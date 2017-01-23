ACT.setConfig("config-object-billboard", {
    baseConfig: {
        id: 'billboard',
        template: 'billboard',
        forceEnv: {
            forcedFlashList: {
                'FireFox': '*',
                'MSIE': '*',
                'Safari': '*',
                'Chrome': '*'
            },
            forcedHTML5List: {},
            forcedBackupList: {}
        }
    },
    trackingConfig: {
        macros: {}
    },
    format: {
        flow: [{
            eventType: "firstPlay",
            actions: [{
                "type": "playLayer",
                "to": "billboard",
                "animate": false
            }, {
                "type": "playLayer",
                "to": "extraBtns",
                "animate": false
            }, {
                "type": "playLayer",
                "to": "textLinks",
                "animate": false
            }, {
                "type": "containerShow",
                "id": "closeBtn"
            }, {
                "type": "trackState",
                "stateId": "billboard",
                "state": "open"
            }, {
                "type": "resizeInlineFrame",
                "width": 970,
                "height": 270,
                "animationLength": 1000
            }, {
                "type": "track",
                "label": "billboard_firstplay_ad_html"
            }]
        }, {
            eventType: "cappedPlay",
            doIf: {
                // state: {
                //     id: 'billboard',
                //     value: 'close'
                // }
               	date: {
               		from: 'July 12, 2015 00:00:00',
               		to: 'July 12, 2015 23:59:59'
               	}
            },
            actions: [{
                "type": "playLayer",
                "to": "textLinks",
                "animate": false
            }, {
                "type": "containerShow",
                "id": "openBtn"
            }, {
                "type": "resizeInlineFrame",
                "width": '970',
                "height": '20',
                "animationLength": 1000
            }, {
                "type": "track",
                "label": "billboard_cappedplay_ad_html"
            }]
        }, {
            eventType: "cappedPlay",
            doIf: {
                // state: {
                //     id: 'billboard',
                //     value: 'open'
                // }
               	date: {
               		from: 'July 12, 2015',
               		// to: 'July 12, 2015'
               	}
            },
            actions: [{
                "type": "playLayer",
                "to": "billboard",
                "animate": false
            }, {
                "type": "playLayer",
                "to": "extraBtns",
                "animate": false
            }, {
                "type": "playLayer",
                "to": "textLinks",
                "animate": false
            }, {
                "type": "containerShow",
                "id": "closeBtn"
            }, {
                "type": "resizeInlineFrame",
                "width": '970',
                "height": '270',
                "animationLength": 1000
            }, {
                "type": "track",
                "label": "billboard_cappedplay_ad_html"
            }]
        }],
        layers: {
            billboard: {
                layerName: "billboard",
                base: "act-ad",
                type: "inline",
                width: "970px",
                height: "250px",
                x: "0",
                y: "0",
                contentLayer: {
                    type: "content-container",
                    id: "billboard_container",
                    env: ["flash", "html", "backup"],
                    css: {
                        width: '970px',
                        height: '250px'
                    },
                    content: [{
                        id: "swf_1_1",
                        type: "content-swf",
                        env: [
                            "flash"
                        ],
                        css: {
                            width: "970px",
                            height: "250px"
                        },
                        swfConfig: {
                            src: "https://s.yimg.com/dh/ap/actjs/rc/0-0-1/assets/970x250.swf",
                            flashvars: {
                                clickTAG: "http://www.yahoo.com"
                            }
                        }
                    }, {
                        type: 'content-container',
                        id: 'backup_container',
                        env: ["html", "backup"],
                        css: {
                            width: '970px',
                            height: '250px'
                        },
                        eventConfig: [{
                            eventType: 'click',
                            actions: [{
                                type: 'openURL',
                                URLpath: 'https://uk.yahoo.com',
                                URLname: 'billboarc_backup_click_clicktag'
                            }]
                        }],
                        content: [{
                            type: 'content-image',
                            id: 'billboard_backup_image',
                            env: ['html', 'backup'],
                            imageConfig: {
                                src: 'https://s.yimg.com/qq/ap/actjs/demo/images/banner-970x250.jpg',
                                alt: '',
                                title: ''
                            }
                        }]
                    }]
                }
            },
            textLinks: {
                layerName: 'textLinks',
                base: 'act-ad',
                type: 'overlay',
                width: 'auto',
                height: '20px',
                x: '0',
                y: '0',
                alignH: 'right',
                contentLayer: {
                    type: 'content-container',
                    id: 'textLinks_container',
                    env: ['html', 'flash', 'backup'],
                    classNode: 'bbBtns',
                    css: {
                        'margin': '2px',
                        'text-align': 'right'
                    },
                    content: [{
                        type: 'content-container',
                        id: 'openBtn',
                        env: ['html', 'flash', 'backup'],
                        css: {
                            color: '#000',
                            display: 'none'
                        },
                        eventConfig: [{
                            eventType: 'click',
                            actions: [{
                                type: 'containerHide',
                                id: 'openBtn'
                            }, {
                                type: 'resizeInlineFrame',
                                width: '970',
                                height: '270',
                                animationLength: 1000
                            }, {
                                type: 'playLayer',
                                to: 'billboard'
                            }, {
                                type: 'playLayer',
                                to: 'extraBtns'
                            }, {
                                type: 'containerShow',
                                id: 'closeBtn'
                            }, {
                                type: 'trackState',
                                stateId: 'billboard',
                                state: 'open'
                            }, {
                                type: 'track',
                                label: 'billboard_click_button_open'
                            }]
                        }],
                        containerConfig: {
                            innerText: 'Show Ad'
                        }
                    }, {
                        type: 'content-container',
                        id: 'closeBtn',
                        env: ['html', 'flash', 'backup'],
                        css: {
                            color: '#fff',
                            display: 'none'
                        },
                        eventConfig: [{
                            eventType: 'click',
                            actions: [{
                                type: 'stopLayer',
                                to: 'billboard'
                            }, {
                                type: 'stopLayer',
                                to: 'extraBtns'
                            }, {
                                type: 'containerHide',
                                id: 'closeBtn'
                            }, {
                                type: 'containerShow',
                                id: 'openBtn'
                            }, {
                                type: 'trackState',
                                stateId: 'billboard',
                                state: 'close'
                            }, {
                                type: 'track',
                                label: 'billboard_click_button_close'
                            }, {
                                type: 'resizeInlineFrame',
                                width: '970',
                                height: '20',
                                animationLength: 1000
                            }]
                        }],
                        containerConfig: {
                            innerText: 'Close Ad'
                        }
                    }]
                }
            },
            extraBtns: {
                layerName: 'extraBtns',
                type: 'inline',
                base: 'act-ad',
                x: 0,
                y: 0,
                width: '970px',
                height: '20px',
                contentLayer: {
                    id: 'extraBtns_container',
                    type: 'content-container',
                    env: ["html", "flash", "backup"],
                    css: {
                        'text-align': 'right'
                    },
                    content: [{
                        id: 'surveyBtn',
                        type: 'content-container',
                        env: ["html", "flash", "backup"],
                        css: {
                            display: 'inline'
                        },
                        containerConfig: {
                            innerText: 'Ad Feedback'
                        },
                        eventConfig: [{
                            eventType: 'click',
                            actions: [{
                                type: 'openURL',
                                URLpath: 'http://surveylink.yahoo.com/wix/p0767152.aspx',
                                URLname: 'billboard_click_surveylink_open'
                            }]
                        }]
                    }, {
                        id: 'hyphen',
                        type: 'content-container',
                        env: ["html", "flash", "backup"],
                        css: {
                            display: 'inline',
                            margin: '0 5px'
                        },
                        containerConfig: {
                            innerText: '-'
                        }
                    }, {
                        id: 'adchoicesBtn',
                        type: 'content-container',
                        env: ["html", "flash", "backup"],
                        classNode: 'fpad_can_ad_slug',
                        css: {
                            display: 'inline'
                        },
                        containerConfig: {
                            innerText: 'Ad Choices'
                        },
                        eventConfig: [{
                            eventType: 'click',
                            actions: [{
                                type: 'openURL',
                                URLpath: 'http://info.yahoo.com/privacy/uk/yahoo/relevantads.html',
                                URLname: 'billboard_click_adchoiceslink_open'
                            }]
                        }]
                    }]
                }
            }
        }
    }
});