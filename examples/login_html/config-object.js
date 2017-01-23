ACT.setConfig("config-object-video-login", {
    baseConfig: {
        id: "login-ad",
        template: 'VideoLogin',
        forceEnv: {
            forcedFlashList: {},
            forcedHTML5List: {},
            forcedBackupList: {}
        }
    },
    format: {
        flow: [
            {
                eventType: "firstPlay",
                actions: [{
                    "type": "playLayer",
                    "to": "videoLogin",
                    "animate": false
                }, {
                    "type": "track",
                    "label": "login_video_firstplay_ad_html"
                }]
            },
            {
                eventType: "cappedPlay",
                actions: [{
                    "type": "playLayer",
                    "to": "videoLogin",
                    "animate": false
                }, {
                    "type": "track",
                    "label": "login_video_cappedplay_ad_html"
                }]
            }
        ],
        layers: {
            videoLogin: {
                layerName: "videoLogin",
                base: "login-ad",
                type: "inline",
                width: "100%",
                height: "100%",
                x: "0",
                y: "0",
                contentLayer: {
                    //FULL CONTAINER -- START
                    type: "content-container",
                    id: "ad_container",
                    env: ["html", "flash", "backup"],
                    css: {
                        width: '1440px',
                        height: '1024px'
                    },
                    content: [
                        {
                            //HTML5 - CONTAINER - START
                            type: "content-container",
                            id: "html_container",
                            env: ["html"],
                            css: {
                                width: "100%",
                                height: "100%"
                            },
                            content:[
                                {
                                    //VIDEO CONTAINER -- START
                                    type: "content-container",
                                    id: "video_container",
                                    env: ["html"],
                                    css: {
                                        position: "absolute",
                                        zIndex: 1
                                    },
                                    content: [
                                        {
                                            //SP - CONTAINER - START
                                            type: "content-container",
                                            id: "sp_container",
                                            env: ["html"],
                                            css: {
                                                display: "none",
                                                position: "absolute",
                                                zIndex: 2
                                            },
                                            content: [
                                                {
                                                    //START FRAME - CONTAINER - START
                                                    type: "content-container",
                                                    id: "fstart_container",
                                                    env: ["html"],
                                                    css: {
                                                        width: "100%",
                                                        height: "100%",
                                                        display: "none",
                                                        position: "absolute",
                                                        zIndex: 3
                                                    },
                                                    content: []
                                                    //START FRAME - CONTAINER - END
                                                },
                                                {
                                                    //FINAL FRAME - CONTAINER - START
                                                    type: "content-container",
                                                    id: "fend_container",
                                                    env: ["html"],
                                                    css: {
                                                        width: "100%",
                                                        height: "100%",
                                                        display: "none",
                                                        position: "absolute",
                                                        zIndex: 4
                                                    },
                                                    content: []
                                                    //FINAL FRAME - CONTAINER - END
                                                }
                                            ]
                                            //SP - CONTAINER - FINISH
                                        },
                                        {
                                            //AP (BUTTONS) - CONTAINER - START
                                            type: "content-container",
                                            id: "apbt_container",
                                            env: ["html"],
                                            css: {
                                                position: "absolute",
                                                zIndex: 5,
                                                display: "none"
                                            },
                                            eventConfig: [{
                                                eventType: "click",
                                                actions: [
                                                    {
                                                        type: "videoPlay",
                                                        videoId: "video_login_full"
                                                    },
                                                    {
                                                        type: "containerShow",
                                                        id: "vfull_container"
                                                    },
                                                    {
                                                        type: "containerHide",
                                                        id: "vap_container"
                                                    },
                                                    {
                                                        type: "containerHide",
                                                        id: "apbt_container"
                                                    },
                                                    {
                                                        type: "containerHide",
                                                        id: "sp_container"
                                                    }
                                                ]
                                            }],
                                            content: [
                                                //START BUTTON
                                                {
                                                    type: "content-container",
                                                    id: "apstart_button",
                                                    env: ["html"],
                                                    classNode: "actjs-icon-play",
                                                    css: {
                                                        display: "none",
                                                        fontSize: "60px",
                                                        width: "60px",
                                                        margin: "auto auto",
                                                        height: "60px",
                                                        top: 0,
                                                        left: 0,
                                                        right: 0,
                                                        bottom: 0,
                                                        position: "absolute",
                                                        padding: "10px",
                                                        color: "white"
                                                    }
                                                }
                                            ]
                                            //AP (BUTTONS) - CONTAINER - FINISH
                                        },
                                        {
                                            //VIDEO CLICK - CONTAINER - START
                                            type: "content-container",
                                            id: "vclick_container",
                                            env: ["html"],
                                            css: {
                                                display: "none",
                                                position: "absolute",
                                                background: "url('https://s.yimg.com/cv/eng/externals/131110/a/p.gif')",
                                                zIndex: 3
                                            },
                                            eventConfig: [
                                                {
                                                    eventType: "click",
                                                    actions: [
                                                        {
                                                            type: "openURL",
                                                            id: "actVideoClick",
                                                            URLpath: "http://br.yahoo.com",
                                                            URLname: "login_click_login_clicktagrich"
                                                        },
                                                        {
                                                            type: "videoPause",
                                                            from: "vclick_container",
                                                            videoId: "video_login_full"
                                                        }
                                                    ]
                                                }
                                            ]
                                            //VIDEO CLICK - CONTAINER - FINISH
                                        },
                                        {
                                            type: "content-container",
                                            id: "vfull_container",
                                            env: ["html"],
                                            css:{},
                                            content: [
                                                {
                                                    //VIDEO HTML5 (FULL) - START
                                                    type: "content-video-html",
                                                    id: "video_login_full",
                                                    env: ["html"],
                                                    css: {},
                                                    videoHtmlConfig: {},
                                                    eventConfig: [
                                                        {
                                                            eventType: 'start',
                                                            actions: [
                                                                {
                                                                    type: 'track',
                                                                    id: "trackStart",
                                                                    label: 'login_view_videouser_start'
                                                                },
                                                                {
                                                                    type: "containerShow",
                                                                    id: "vclick_container"
                                                                }
                                                            ]
                                                        }, {
                                                            eventType: '25percent',
                                                            actions: [{
                                                                type: 'track',
                                                                id: "track25",
                                                                label: 'login_view_videouser_25percent'
                                                            }]
                                                        }, {
                                                            eventType: '50percent',
                                                            actions: [{
                                                                type: 'track',
                                                                id: "track50",
                                                                label: 'login_view_videouser_50percent'
                                                            }]
                                                        }, {
                                                            eventType: '75percent',
                                                            actions: [{
                                                                type: 'track',
                                                                id: "track75",
                                                                label: 'login_view_videouser_75percent'
                                                            }]
                                                        }, {
                                                            eventType: 'complete',
                                                            actions: [
                                                                {
                                                                    type: 'track',
                                                                    id: "trackComplete",
                                                                    label: 'login_view_videouser_complete'
                                                                },
                                                                {
                                                                    type: "containerHide",
                                                                    id: "vclick_container"
                                                                },
                                                                {
                                                                    type: "containerHide",
                                                                    id: "fstart_container"
                                                                },
                                                                {
                                                                    type: "containerShow",
                                                                    id: "sp_container"
                                                                },
                                                                {
                                                                    type: "containerShow",
                                                                    id: "fend_container"
                                                                }
                                                            ]
                                                        }, {
                                                            eventType: 'replay',
                                                            actions: [
                                                                {
                                                                    type: 'track',
                                                                    id: "trackReplay",
                                                                    label: 'login_click_videouser_replay'
                                                                },
                                                                {
                                                                    type: "containerShow",
                                                                    id: "vclick_container"
                                                                }
                                                            ]
                                                        }, {
                                                            eventType: 'pause',
                                                            actions: [{
                                                                type: 'track',
                                                                id: "trackPause",
                                                                label: 'login_click_videouser_pause'
                                                            }]
                                                        }, {
                                                            eventType: 'pausePlay',
                                                            actions: [{
                                                                type: 'track',
                                                                id: "trackPausePlay",
                                                                label: 'login_click_videouser_pausePlay'
                                                            }]
                                                        }, {
                                                            eventType: 'soundon',
                                                            actions: [{
                                                                type: 'track',
                                                                id: "trackSoundOn",
                                                                label: 'login_click_videouser_soundon'
                                                            }]
                                                        }, {
                                                            eventType: 'soundoff',
                                                            actions: [{
                                                                type: 'track',
                                                                id: "trackSoundOff",
                                                                label: 'login_click_videouser_soundoff'
                                                            }]
                                                        }
                                                    ]
                                                    //VIDEO HTML5 (FULL) - FINISH
                                                }
                                            ]
                                        },
                                        {
                                            type: "content-container",
                                            id: "vap_container",
                                            env: ["html"],
                                            css: {},
                                            content: [
                                                {
                                                    //VIDEO HTML5 (AP) - START
                                                    type: "content-video-html",
                                                    id: "video_login_ap",
                                                    env: ["html"],
                                                    css: {
                                                        display: "none"
                                                    },
                                                    videoHtmlConfig: {},
                                                    eventConfig: [
                                                        {
                                                            eventType: 'start',
                                                            actions: [{
                                                                type: 'track',
                                                                id: "trackStartAP",
                                                                label: 'login_view_videoauto_start'
                                                            }]
                                                        }, {
                                                            eventType: '25percent',
                                                            actions: [{
                                                                type: 'track',
                                                                id: "track25AP",
                                                                label: 'login_view_videoauto_25percent'
                                                            }]
                                                        }, {
                                                            eventType: '50percent',
                                                            actions: [{
                                                                type: 'track',
                                                                id: "trackAP",
                                                                label: 'login_view_videoauto_50percent'
                                                            }]
                                                        }, {
                                                            eventType: '75percent',
                                                            actions: [{
                                                                type: 'track',
                                                                id: "track75AP",
                                                                label: 'login_view_videoauto_75percent'
                                                            }]
                                                        }, {
                                                            eventType: 'complete',
                                                            actions: [
                                                                {
                                                                    type: 'track',
                                                                    id: "trackCompleteAP",
                                                                    label: 'login_view_videoauto_complete'
                                                                },
                                                                {
                                                                    type: "containerHide",
                                                                    id: "fstart_container"
                                                                },
                                                                {
                                                                    type: "containerShow",
                                                                    id: "apbt_container"
                                                                },
                                                                {
                                                                    type: "containerShow",
                                                                    id: "sp_container"
                                                                },
                                                                {
                                                                    type: "containerShow",
                                                                    id: "fend_container"
                                                                }
                                                            ]
                                                        }, {
                                                            eventType: 'replay',
                                                            actions: [{
                                                                type: 'track',
                                                                id: "trackReplayAP",
                                                                label: 'login_click_videoauto_replay'
                                                            }]
                                                        }, {
                                                            eventType: 'pause',
                                                            actions: [{
                                                                type: 'track',
                                                                id: "trackPauseAP",
                                                                label: 'login_click_videoauto_pause'
                                                            }]
                                                        }, {
                                                            eventType: 'pausePlay',
                                                            actions: [{
                                                                type: 'track',
                                                                id: "trackPausePlayAP",
                                                                label: 'login_click_videoauto_pausePlay'
                                                            }]
                                                        }, {
                                                            eventType: 'soundon',
                                                            actions: [{
                                                                type: 'track',
                                                                id: "trackSoundOnAP",
                                                                label: 'login_click_videoauto_soundon'
                                                            }]
                                                        }, {
                                                            eventType: 'soundoff',
                                                            actions: [{
                                                                type: 'track',
                                                                id: "trackSoundOffAP",
                                                                label: 'login_click_videoauto_soundoff'
                                                            }]
                                                        }
                                                    ]
                                                    //VIDEO HTML5 (AP) - FINISH
                                                }
                                            ]
                                        }
                                    ]
                                    //VIDEO CONTAINER -- FINISH
                                },
                                {
                                    type: "content-container",
                                    id: "click_container",
                                    env: ["html"],
                                    css: {
                                        width: "1440px",
                                        height: "1024px",
                                        position: "absolute",
                                        zIndex: 0
                                    },
                                    eventConfig: [
                                        {
                                            eventType: "click",
                                            actions: [
                                                {
                                                    type: "openURL",
                                                    id: "actHTMLClick",
                                                    URLpath: "http://br.yahoo.com",
                                                    URLname: "login_click_login_clicktagrich"
                                                },
                                                {
                                                    type: "videoPause",
                                                    from: "click_container",
                                                    videoId: "video_login_full"
                                                }
                                            ]
                                        }
                                    ]
                                }
                            ]
                            //HTML5 - CONTAINER - END
                        },
                        {
                            //BACKUP - CONTAINER - START
                            type: "content-container",
                            id: "bkp_container",
                            env: ["flash", "backup"],
                            css: {
                                width: "100%",
                                height: "100%"
                            },
                            eventConfig: [
                                {
                                    eventType: "click",
                                    actions: [
                                        {
                                            type: "openURL",
                                            id: "actBKPClick",
                                            URLpath: "http://br.yahoo.com",
                                            URLname: "login_click_login_clicktagbackup"
                                        }
                                    ]
                                }
                            ]
                            //BACKUP - CONTAINER - END
                        }
                    ]
                    //FULL CONTAINER -- END
                }
            }
        }
    }
});
