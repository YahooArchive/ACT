ACT.setConfig("config-object-html5", {
    baseConfig: {
        template: 'billboard-enabler',
        forceEnv: {
            forcedFlashList: {},
            forcedHTML5List: {},
            forcedBackupList: {
                "MSIE": "<=9"
            }
        }
    },
    tracking: {},
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
                "label": "billboard_load_ad_::envRendered::"
            }]
        }, {
            eventType: "cappedPlay",
            doIf: {
                state: {
                    id: 'billboard',
                    value: 'close'
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
                "label": "billboard_load_ad_::envRendered::"
            }]
        }, {
            eventType: "cappedPlay",
            doIf: {
                state: {
                    id: 'billboard',
                    value: 'open'
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
                "label": "billboard_load_ad_::envRendered::"
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
                    env: ["html", "backup"],
                    css: {
                        width: '970px',
                        height: '250px'
                    },
                    content: [{
                        id: "html5_container",
                        type: "content-html5",
                        env: ["html"],
                        css: {
                            width: "970px",
                            height: "250px"
                        },
                    	trackingLabels: {
                    		"video1:start": "billboard_click_videoauto1_start",
                    		"video1:pause": "billboard_click_videoauto1_pause",
                    		"video1:resume": "billboard_click_videoauto1_pauseplay",
                    		"video1:replay": "billboard_click_videoauto1_replay",
                    		"video1:soundOn": "billboard_click_videoauto1_soundOn",
                    		"video1:soundOff": "billboard_click_videoauto1_soundOff",
                    		"video1:25": "billboard_view_videoauto1_25percent",
                    		"video1:50": "billboard_view_videoauto1_50percent",
                    		"video1:75": "billboard_view_videoauto1_75percent",
                    		"video1:ended": "billboard_view_videoauto1_complete",
                    		"clickTag": "billboard_click_billboard_clicktaghtml"
                    	}
                    }, {
                        type: 'content-container',
                        id: 'backup_container',
                        env: ["backup"],
                        css: {
                            width: '970px',
                            height: '250px'
                        },
                        eventConfig: [{
                            eventType: 'click',
                            actions: [{
                                id: 'action0',
                                type: 'openURL',
                                URLpath: 'https://uk.yahoo.com',
                                URLname: 'billboard_click_backup_clicktagbackup'
                            }]
                        }],
                        content: [{
                            type: 'content-image',
                            id: 'billboard_backup_image',
                            env: ["backup"],
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
                            color: 'black',
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
                            color: 'black',
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
                            }, {
                                type: "html5Broadcast",
                                to: "html5_container",
                                name: "HIDDEN"
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