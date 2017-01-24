ACT.setConfig("config-object-demo_splash", {
    baseConfig: {
        id: "splash-ad",
        template: 'Splash',
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
    tracking: {},
    format: {
        darlaLayer: {
            holder: {
                contractedWidth: "100%",
                expandedWidth: "100%",
                contractedHeight: "100%",
                expandedHeight: "100%",
                target: "#fc_align",
                css: {
                    position: "relative",
                    width: "100%"
                }
            }
        },
        flow: [{
            eventType: "firstPlay",
            actions: [{
                "type": "playLayer",
                "to": "splash",
                "animate": false
            }, {
                "type": "track",
                "label": "splash_firstplay_ad_html"
            }]
        }, {
            eventType: "cappedPlay",
            actions: [{
                "type": "playLayer",
                "to": "splash",
                "animate": false
            }, {
                "type": "track",
                "label": "splash_cappedplay_ad_html"
            }]
        }],
        layers: {
            splash: {
                layerName: "splash",
                base: "act-ad",
                type: "inline",
                width: "100%",
                height: "100%",
                x: "0",
                y: "0",
                contentLayer: {
                    //FULL CONTAINER -- START
                    type: "content-container",
                    id: "splash_container",
                    env: ["flash", "html", "backup"],
                    css: {
                        width: '100%',
                        height: '100%'
                    },
                    content: [{
                        //BUTTONS CONTAINER -- START
                        type: "content-container",
                        id: "button_container",
                        env: ["html", "flash"],
                        css: {

                        },
                        content: [
                            //START BUTTON
                            {
                                type: "content-container",
                                id: "start_button",
                                env: ["html", "flash"],
                                classNode: "actjs-icon-play",
                                css: {
                                    fontSize: "100px",
                                    padding: "10px",
                                    display: 'inline-block',
                                    verticalAlign: 'top',
                                    color: 'red'
                                },
                                eventConfig: [{
                                    eventType: "click",
                                    actions: [{
                                        type: "videoStart",
                                        from: "start_button",
                                        videoId: "flash_video_container"
                                    }]
                                }]
                            },
                            //STOP BUTTON
                            {
                                type: "content-container",
                                id: "stop_button",
                                env: ["html", "flash"],
                                classNode: "actjs-icon-stop",
                                css: {
                                    fontSize: "100px",
                                    padding: "10px",
                                    display: 'inline-block',
                                    verticalAlign: 'top'
                                },
                                eventConfig: [{
                                    eventType: "click",
                                    actions: [{
                                        type: "videoStop",
                                        from: "stop_button",
                                        videoId: "flash_video_container"
                                    }]
                                }]
                            },
                            //PLAY BUTTON
                            {
                                type: "content-container",
                                id: "play_button",
                                env: ["html", "flash"],
                                classNode: "actjs-icon-play",
                                css: {
                                    fontSize: "100px",
                                    padding: "10px",
                                    display: 'inline-block',
                                    verticalAlign: 'top'
                                },
                                eventConfig: [{
                                    eventType: "click",
                                    actions: [{
                                        type: "videoPlay",
                                        from: "play_button",
                                        videoId: "flash_video_container"
                                    }]
                                }]
                            },
                            //PAUSE BUTTON
                            {
                                type: "content-container",
                                id: "pause_button",
                                env: ["html", "flash"],
                                classNode: "actjs-icon-pause",
                                css: {
                                    fontSize: "100px",
                                    padding: "10px",
                                    display: 'inline-block',
                                    verticalAlign: 'top'
                                },
                                eventConfig: [{
                                    eventType: "click",
                                    actions: [{
                                        type: "videoPause",
                                        from: "pause_button",
                                        videoId: "flash_video_container"
                                    }]
                                }]
                            },
                            //MUTE BUTTON
                            {
                                type: "content-container",
                                id: "mute_button",
                                env: ["html", "flash"],
                                classNode: "actjs-icon-volume-mute",
                                css: {
                                    fontSize: "100px",
                                    padding: "10px",
                                    display: 'inline-block',
                                    verticalAlign: 'top'
                                },
                                eventConfig: [{
                                    eventType: "click",
                                    actions: [{
                                        type: "videoMute",
                                        from: "mute_button",
                                        videoId: "flash_video_container"
                                    }]
                                }]
                            },
                            //UNMUTE BUTTON
                            {
                                type: "content-container",
                                id: "unmute_button",
                                env: ["html", "flash"],
                                classNode: "actjs-icon-volume-medium",
                                css: {
                                    fontSize: "100px",
                                    padding: "10px",
                                    display: 'inline-block',
                                    verticalAlign: 'top'
                                },
                                eventConfig: [{
                                    eventType: "click",
                                    actions: [{
                                        type: "videoUnmute",
                                        from: "unmute_button",
                                        videoId: "flash_video_container"
                                    }]
                                }]
                            }
                        ]
                        //BUTTONS CONTAINER -- FINISH
                    }, {

                        //FLASH VIDEO CONTAINER -- START
                        type: "content-video-flash",
                        id: "flash_video_container",
                        classNode: "fluffynat0r",
                        env: ["flash"],
                        css: {},
                        "videoFlashConfig": {
                            width: '100%',
                            height: '100%',
                            videoPath: "https://c-5a32c98d74858092.http.atlas.cdn.yimg.com/ycreative/ycpmojovideovideojob_20364748704_54caa79f1d1f478399dee91072baff69_b3e1bdfb_10.mp4",
                            autoplay: true,
                            videoMuted: true,
                            flashvars: {
                                //FLASHVARS
                            }
                        },
                        eventActions: [{
                            eventType: "start",
                            actions: [{
                                type: "track",
                                from: "splash",
                                to: "splash",
                                label: "splash_view_video1_start"
                            }]
                        }, {
                            eventType: "stop",
                            actions: [{
                                type: "track",
                                from: "splash",
                                to: "splash",
                                label: "splash_view_video1_stop"
                            }]
                        }, {
                            eventType: "play",
                            actions: [{
                                type: "track",
                                from: "splash",
                                to: "splash",
                                label: "splash_view_video1_play"
                            }]
                        }, {
                            eventType: "pause",
                            actions: [{
                                type: "track",
                                from: "splash",
                                to: "splash",
                                label: "splash_view_video1_pause"
                            }]
                        }, {
                            eventType: "replay",
                            actions: [{
                                type: "track",
                                from: "splash",
                                to: "splash",
                                label: "splash_view_video1_replay"
                            }]
                        }, {
                            eventType: "soundon",
                            actions: [{
                                type: "track",
                                from: "splash",
                                to: "splash",
                                label: "splash_view_video1_soundon"
                            }]
                        }, {
                            eventType: "soundoff",
                            actions: [{
                                type: "track",
                                from: "splash",
                                to: "splash",
                                label: "splash_view_video1_soundoff"
                            }]
                        }, {
                            eventType: "25percent",
                            actions: [{
                                type: "track",
                                from: "splash",
                                to: "splash",
                                label: "splash_view_video1_25percent"
                            }]
                        }, {
                            eventType: "50percent",
                            actions: [{
                                type: "track",
                                from: "splash",
                                to: "splash",
                                label: "splash_view_video1_50percent"
                            }]
                        }, {
                            eventType: "75percent",
                            actions: [{
                                type: "track",
                                from: "splash",
                                to: "splash",
                                label: "splash_view_video1_75percent"
                            }]
                        }, {
                            eventType: "complete",
                            actions: [{
                                type: "track",
                                from: "splash",
                                to: "splash",
                                label: "splash_view_video1_complete"
                            }]
                        }]
                        //FLASH VIDEO CONTAINER -- FINISH
                    }, {
                        //HTML VIDEO CONTAINER -- START
                        type: "content-video-html",
                        id: "html_video_container",
                        classNode: "fluffynat0r",
                        env: ["html"],
                        css: {
                            width: "100%",
                            height: "100%"
                        },
                        "videoHTMLConfig": {
                            width: '100%',
                            height: '100%',
                            videoPath: "",
                            autoplay: false,
                            videoMuted: false
                        }
                        //HTML VIDEO CONTAINER-- FINISH
                    }]
                }
            }
        }
    }
});