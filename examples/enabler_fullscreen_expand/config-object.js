ACT.setConfig("config-object-floating", {
    baseConfig: {
        id: "adid",
        template: "floating",
        version: "0.0.1",
        forceEnv: {
            forcedFlashList: {},
            forcedHTML5List: {},
            forcedBackupList: {
                MSIE: "<=9"
            }
        }
    },
    format: {
        flow: [{
            eventType: "firstPlay",
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
                "left": 0,
                "push": false
            }, {
                "type": "track",
                "label": "expandable_firstplay_ad_::envRendered::"
            }]
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
            }, {
                "type": "playLayer",
                "to": "mpu",
                "animate": false
            }, {
                "type": "track",
                "label": "floating_cappedplay_ad_::envRendered::"
            }]
        }],
        layers: {
            mpu: {
                layerName: "mpu",
                base: "act-ad",
                type: "inline",
                width: "300px",
                height: "270px",
                x: "0px",
                y: "0px",
                contentLayer: {
                    type: "content-container",
                    id: "mpu_container",
                    env: ["flash", "html", "backup"],
                    content: [{
                        id: "backup_container",
                        type: "content-container",
                        env: ["backup"],
                        eventConfig: [{
                            eventType: "click",
                            actions: [{
                                id: "clicktagbackup",
                                type: "openURL",
                                URLpath: "https://uk.yahoo.com",
                                URLname: "lrec_click_lrec_clicktagbackup"
                            }]
                        }],
                        content: [{
                            type: "content-image",
                            id: "backup_image",
                            env: ["backup"],
                            css: {
                                width: "300px",
                                height: "250px"
                            },
                            imageConfig: {
                                src: "https://s.yimg.com/dh/ap/debug/actjs/backup-inline.png"
                            }
                        }]
                    }, {
                        id: "mpu_html",
                        type: "content-html5",
                        env: ["html"],
                        css: {
                            width: "300px",
                            height: "250px"
                        },
                        trackingLabels: {
                            "videoinline:start": "lrec_click_videoauto1_start",
                            "videoinline:pause": "lrec_click_videoauto1_pause",
                            "videoinline:resume": "lrec_click_videoauto1_pauseplay",
                            "videoinline:replay": "lrec_click_videoauto1_replay",
                            "videoinline:soundOn": "lrec_click_videoauto1_soundOn",
                            "videoinline:soundOff": "lrec_click_videoauto1_soundOff",
                            "videoinline:25": "lrec_view_videoauto1_25percent",
                            "videoinline:50": "lrec_view_videoauto1_50percent",
                            "videoinline:75": "lrec_view_videoauto1_75percent",
                            "videoinline:ended": "lrec_view_videoauto1_complete",
                            "clickExpand": "lrec_click_exp_open",
                            "clickTag": "lrec_click_lrec_clicktaghtml"
                        },
                       eventConfig: [{
                            eventType: "requestFullscreenExpand",
                            actions: [{
                                type: "expandInlineFrame",
                                top: "0",
                                left: "0",
                                right: "0",
                                bottom: "250",
                                push: false
                            }, {
                                type: "changeHtml5FrameStyles",
                                to: "mpu_html",
                                css: {
                                    width: "700px",
                                    height: "450px"
                                }
                            }, {
                                type: "html5Broadcast",
                                to: "mpu_html",
                                name: "FULLSCREEN_EXPAND_START"
                            }]
                        }, {
                            eventType: "finishFullscreenExpand",
                            actions: [{
                                type: "html5Broadcast",
                                to: "mpu_html",
                                name: "FULLSCREEN_EXPAND_FINISH"
                            }]
                        }, {
                            eventType: "close",
                            actions: [{
                                type: "html5Broadcast",
                                to: "mpu_html",
                                name: "FULLSCREEN_COLLAPSE_START"
                            }]
                        }, {
                            eventType: "reportManualClose",
                            actions: [{
                                type: "html5Broadcast",
                                to: "mpu_html",
                                name: "FULLSCREEN_COLLAPSE_START"
                            }]
                        }, {
                            eventType: "requestFullscreenCollapse",
                            actions: [{
                                type: "html5Broadcast",
                                to: "mpu_html",
                                name: "FULLSCREEN_COLLAPSE_START"
                            }]
                        }, {
                            eventType: "finishFullscreenCollapse",
                            actions: [, {
                                type: "changeHtml5FrameStyles",
                                to: "mpu_html",
                                css: {
                                    width: "300px",
                                    height: "250px"
                                }
                            }, {
                                type: "contractInlineFrame"
                            }, {
                                type: "html5Broadcast",
                                to: "mpu_html",
                                name: "FULLSCREEN_COLLAPSE_FINISH"
                            }]
                        }]
                      }, {
                        id: "extraBtns",
                        type: "content-container",
                        env: ["html"],
                        css: {
                            width: "100%",
                            fontFamily: "Helvetica Neue,Helvetica,Arial",
                            marginTop: "2px",
                            textAlign: "right",
                            fontSize: "11px"
                        },
                        content: [{
                            id: "replay_btn",
                            type: "content-container",
                            env: ["flash", "html", "backup"],
                            "classNode": "active",
                            css: {
                                bottom: "0px",
                                right: "0px",
                                "color": "black",
                                "display": "inline",
                                cursor: "pointer"
                            },
                            containerConfig: {
                                innerText: "Replay Ad"
                            },
                            eventConfig: [{
                                eventType: "click",
                                actions: [{
                                    "type": "track",
                                    "label": "lrec_click_replay_adreplay"
                                }, {
                                    "type": "stopLayer",
                                    "to": "expandable",
                                    "destroy": true
                                }, {
                                    "type": "replayAd"
                                }]
                            }]
                        }]
                    }]
                }
            }
        }
    }
});
