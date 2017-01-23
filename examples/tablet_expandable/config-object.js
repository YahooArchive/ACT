ACT.setConfig("config-object-tablet-expandable", {
   baseConfig: {
        id: "test",
        template: "Expandable",
        forceEnv: {
            forcedFlashList: {

            },
            forcedHTML5List: {
            },
            forcedBackupList: {}
        }
    },
    tracking: {},
    format: {
        darlaLayer: {
            holder: {
                contractedWidth: "729",
                contractedHeight: "90"
            }
        },
        flow: [{
            eventType: "firstPlay",
            actions: [
                {
                    type: "playLayer",
                    to: "tabletBanner",
                    animate: false
                },
                {
                    type: "track",
                    label: "homepage_tablet_expandable_load_ad_html"

                }
            ]
        }
        ],
        layers: {
            tabletBanner: {
                layerName: "tabletBanner",
                base: "act-ad",
                type: "inline",
                x:0,
                y:0,
                contentLayer: {
                    type: "content-container",
                    id: "mpu_container",
                    env: ["tablet", "html"],
                    css: {
                        width: "728px",
                        height: "90px",
                    },
                    content: [
                        {
                            id: "click_area",
                            type: "ContentContainer",
                            env: ["tablet", "html"],
                            css: {
                                width: "728px",
                                height: "90px",
                                position:"absolute"
                            },
                            eventConfig: [
                                {
                                    eventType: "click",
                                    actions: [
                                        {
                                            type: "playLayer",
                                            to: "expandable",

                                        },
                                        {
                                            type: 'videoPlay', // this aciton to make sure replay will be fired
                                            videoId: 'video1'
                                        },
                                        {
                                            type: 'videoSoundOn',
                                            videoId: 'video1'
                                        },
                                        {
                                            type: "containerAnimate",
                                            id: "expanded_wrapper",
                                            from:{

                                                "marginTop": "550px",
                                                opacity: "0.7"
                                            },
                                            to: {
                                                "marginTop": "0px",
                                                opacity: "1"

                                            },
                                            duration: 300,
                                            delay:0

                                        },
                                        {
                                            type: "track",
                                            label: "base_click_exp_open"

                                        }



                                    ]
                                }
                            ]

                        },
                        {
                            id: "click_area_down",
                            type: "ContentContainer",
                            env: ["tablet", "html"],
                            css: {
                                width: "728px",
                                height: "90px",
                                position:"absolute",
                                display: "none"
                            },
                            eventConfig: [
                                {
                                    eventType: "click",
                                    actions: [
                                        {
                                            type: "playLayer",
                                            to: "expandable",

                                        },
                                        {
                                            type: 'videoPlay', // this aciton to make sure replay will be fired
                                            videoId: 'video1'
                                        },
                                        {
                                            type: 'videoSoundOn',
                                            videoId: 'video1'
                                        },
                                        {
                                            type: "containerAnimate",
                                            id: "expanded_wrapper",
                                            from:{

                                                "marginTop": "-150px",
                                                opacity: "0.7"
                                            },
                                            to: {
                                                "marginTop": "0px",
                                                opacity: "1"

                                            },
                                            duration: 300,
                                            delay:0

                                        },
                                        {
                                            type: "track",
                                            label: "base_click_exp_open"

                                        }



                                    ]
                                }
                            ]

                        },
                        {
                            id: "tabletBanner_background",
                            type: "content-image",
                            env: ["tablet", "html"],
                            css: {
                                width: "728px",
                                height: "90px",
                            },
                            imageConfig: {
                                src: "",
                                alt: "alt",
                                title: "title"
                            }
                        }
                    ]
                }
            }
            ,
            expandable: {
                layerName: "expandable",
                base: "act-ad",
                type: "overlay",
                width: "770px",
                height: "500px",
                x: '-20px',
                y: '-409px',
                contentLayer: {
                    type: "content-container",
                    id: "expanded_container",
                    env: ["tablet", "html"],
                    css: {
                        width: "770px",
                        height: "500px",
                        "z-index":"9999999",
                        position:"relative",
                        'overflow':'hidden'

                    },

                    content:
                    [
                       {
                        type: "content-container",
                        id: "expanded_wrapper",
                        env: ["tablet", "html"],
                        css:{
                            position:"relative",
                            "margin-top":"350px"
                        },
                        content:
                            [
                                {
                                    type: "content-video-html",
                                    id: "video1",
                                    classNode: "fluffynat0r",
                                    env: ["tablet", "html"],
                                    css: {
                                        "position": "absolute",
                                        "width": "620px",
                                        "height":"352px",
                                        "left": "50%",
                                        "top": "103px",
                                        "z-index": "3"
                                    },
                                    videoHtmlConfig: {
                                        autoplay: false,
                                        videoMuted: true,
                                        controls: false,
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
                                                        label: 'exp_view_video_auto1_start'


                                                    }
                                                ]
                                            },
                                            {
                                                eventType: '25percent',
                                                actions: [
                                                    {
                                                        type: 'track',
                                                        label: 'exp_view_videoauto1_25percent'


                                                    }
                                                ]
                                            },
                                        {
                                            eventType: '50percent',
                                            actions: [
                                                {
                                                    type: 'track',
                                                    label: 'exp_view_videoauto1_50percent'
                                                }
                                            ]
                                        },
                                        {
                                            eventType: '75percent',
                                            actions: [
                                                {
                                                    type: 'track',
                                                    label: 'exp_view_videoauto1_75percent'
                                                }
                                            ]
                                        },
                                        {
                                            eventType: 'complete',
                                            actions: [
                                                {
                                                    type: 'track',
                                                    label: 'exp_view_videoauto1_complete'
                                                }
                                            ]
                                        },
                                        {
                                            eventType: 'replay',
                                            actions: [
                                                {
                                                    type: 'track',
                                                    label: 'exp_click_videouser1_replay'

                                                }
                                            ]
                                        },
                                        {
                                            eventType: 'pause',
                                            actions: [
                                                {
                                                    type: 'track',
                                                    label: 'exp_click_videouser1_replay_pause'
                                                }

                                            ]
                                        },
                                        {
                                            eventType: 'pausePlay',
                                            actions: [
                                                {
                                                    type: 'track',
                                                    label: 'exp_click_videouser1_pausePlay'
                                                }
                                            ]
                                        },
                                        {
                                            eventType: 'soundon',
                                            actions: [
                                                {
                                                    type: 'track',
                                                    label: 'exp_click_videouser1_soundon'
                                                }
                                            ]
                                        },
                                        {
                                            eventType: 'soundoff',
                                            actions: [
                                                {
                                                    type: 'track',
                                                    label: 'exp_click_videouser1_soundoff'
                                                }
                                            ]
                                        }
                                    ]
                                },

                                {
                                    id: "expandable_back",
                                    type: "content-image",
                                    classNode: "",
                                    env: ["tablet", "html"],
                                    css: {
                                        width: "770px",
                                        height: "500px",

                                    },
                                    imageConfig: {
                                        src: "",
                                        alt: "alt",
                                        title: "title"
                                    }
                                },

                                {
                                    id: "close_btn",
                                    type: "content-container",
                                    classNode: "actjs-icon-x-altx-alt",
                                    env: ["tablet", "html"],
                                    css: {
                                        "position": "absolute",
                                        "top": "12px",
                                        "right": "5px",
                                        "width": "30px",
                                        "height": "30px",
                                        "font-size": "30px",
                                        "color": "#FFFFFF",
                                        "z-index":"999"
                                    },
                                    eventConfig: [{
                                        eventType: "click",
                                        actions: [
                                            {
                                                type: "stopLayer",
                                                to: "expandable",
                                                destroy: "false"
                                            },
                                            {
                                                type: "track",
                                                label: "exp_click_exp_close"
                                            },
                                            {
                                                type: 'videoPause', // this aciton to make sure replay will be fired
                                                videoId: 'video1'
                                            },
                                            {
                                                type: 'videoSoundOff',
                                                videoId: 'video1'
                                            },
                                            {
                                                type: "containerChangeStyles",
                                                id: "expanded_wrapper",
                                                styles: {
                                                     "margin-top": "550px",
                                                     "opacity":0
                                                }
                                            },
                                            {
                                                type: "track",
                                                label: "exp_click_exp_close"

                                            }


                                        ]
                                    }]
                                },

                                {
                                    id: "button_click",
                                    type: "content-container",
                                    classNode: "",
                                    env: ["tablet", "html"],
                                    css: {
                                        width: "770px",
                                        height: "500px",
                                        "position":"absolute",
                                        "z-index":"1",
                                        "top":"0"
                                    },
                                    eventConfig: [
                                        {
                                            eventType: "click",
                                            actions: [
                                                {
                                                    type: "stopLayer",
                                                    to: "expandable",
                                                    destroy: "false"
                                                },
                                                {
                                                    type: 'videoPause', // this aciton to make sure replay will be fired
                                                    videoId: 'video1'
                                                },
                                                {
                                                    type: 'videoSoundOff',
                                                    videoId: 'video1'
                                                },
                                                {
                                                    type: "containerChangeStyles",
                                                    id: "expanded_wrapper",
                                                    styles: {

                                                        "margin-top": "550px",
                                                        "opacity":0
                                                    }
                                                },
                                                {
                                                    type: "openURL",
                                                    id: "actionClick",
                                                    URLpath: "http://redbullopencircle.tumblr.com/",
                                                    URLname: "contract_click_expandable_clickhtml"
                                                }

                                            ]
                                        }
                                    ]
                                }

                            ]
                       }
                    ]
                }
            }
        }
    }
});
