ACT.setConfig("config-object-billboard", {
    baseConfig: {
        template: 'billboard',
        forceEnv: {
            forcedFlashList: {
            },
            forcedHTML5List: {},
            forcedBackupList: {
                'MSIE': '8',
                'MSIE': '9',
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
                "label": "billboard_load_ad_html"
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
                "label": "billboard_load_ad_html"
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
                "label": "billboard_load_ad_flash"
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
                    content: 
                        [
                            {
                                type: 'content-container',
                                id: 'buttonContainer',
                                env: ["html", "backup"],
                                css: {
                                    "position": "absolute",
                                    "width": '970px',
                                    "height": '250px',
                                    "z-index": "7"
                                    

                                },
                                eventConfig: [{
                                    eventType: 'click',
                                    actions: [{
                                        type: 'openURL',
                                        id: 'clickTAG',
                                        URLpath: 'http://it.yahoo.com',
                                        URLname: 'billboard_click_billboard_clicktagbackup'
                                    }]
                                }],
                            },
                            {
                                        type: "content-video-html",
                                        id: "video1",
                                        classNode: "fluffynat0r",
                                        env: ["flash", "html"],
                                        css: {
                                            "position": "absolute",
                                            "width": "400px",
                                            "height":"224px",
                                            "top":"0px",
                                            "left":"0px",
                                            "z-index": "3"
                                        },
                                        videoHtmlConfig: {
                                            autoplay: false,
                                            videoMuted: true,
                                            controls: true,
                                            loop:true,
                                            videoWebM: "",
                                            videoMP4: "",
                                            postImage: ""
                                        },
                                        eventConfig: 
                                            [
                                                {
                                                    eventType: 'start',
                                                    actions: [
                                                        {
                                                            type: 'track',
                                                            label: 'billboard_video1_view_start'

                                                        }
                                                    ]
                                                }, 
                                                {
                                                    eventType: '25percent',
                                                    actions: [
                                                        {
                                                            type: 'track',
                                                            label: 'billboard_video1_view_25percent'
                                                        }
                                                    ]
                                                }, 
                                                {
                                                    eventType: '50percent',
                                                    actions: [
                                                        {
                                                            type: 'track',
                                                            label: 'billboard_video1_view_50percent'
                                                        }
                                                    ]
                                                }, 
                                                {
                                                    eventType: '75percent',
                                                    actions: [
                                                        {
                                                            type: 'track',
                                                            label: 'billboard_video1_view_75percent'
                                                        }
                                                    ]
                                                }, 
                                                {
                                                    eventType: 'complete',
                                                    actions: [
                                                        {
                                                            type: 'track',
                                                            label: 'billboard_video1_view_complete'
                                                        }
                                                    ]
                                                }
                                            
                                        ]
                            },
                            {
                                type: 'content-image',
                                id: 'backup_image',
                                env: ['html', 'backup'],
                                imageConfig: {
                                    src: '',
                                    alt: '',
                                    title: ''
                                }
                            }
                        ]
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
                    content: [

                    {
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
                    }, 

                    {
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
                            actions: [
                            {
                                id: 'action0',
                                type: 'openURL',
                                URLpath: 'http://surveylink.yahoo.com/wix/p0767152.aspx',
                                URLname: 'billboard_click_survey_clicktagflash'
                            }
                            ]
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
                                id: 'action0',
                                type: 'openURL',
                                URLpath: 'http://info.yahoo.com/privacy/uk/yahoo/relevantads.html',
                                URLname: 'billboard_click_adchoices_clicktagflash'
                            }]
                        }]
                    }]
                }
            }
        }
    }
});