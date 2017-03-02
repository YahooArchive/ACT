ACT.setConfig("config-object", {
    baseConfig: {
        id: "test",
        template: 'Splash-ad-video-html',
        forceEnv: {
            forcedFlashList: {},
            forcedHTML5List: {},
            forcedBackupList: {}
        }
    },
    tracking: {},
    format: {
        flow: [{
            eventType: "firstPlay",
            actions: [{
                "type": "playLayer",
                "to": "splash",
                "animate": false
            }, {
                "type": "track",
                "label": "splash_load_ad_::envRendered::"
            }]
        }, {
            eventType: "cappedPlay",
            actions: [{
                "type": "playLayer",
                "to": "splash",
                "animate": false
            }, {
                "type": "track",
                "label": "splash_load_ad_::envRendered::"
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
                    type: "content-container",
                    id: "splash_container",
                    env: ["html", "backup"],
                    css: {
                        width: '100%',
                        height: '100%',
                        background: '#000',
                        overflow: 'hidden'
                    },
                    content: [{
                        type: "content-video-html",
                        id: "video1",
                        classNode: "fluffynat0r",
                        env: ["html"],
                        css: {
                            width: "100%",
                            height: "100%",
                            "object-fit": "contain"
                        },
                        videoHtmlConfig: {
                            autoplay: true,
                            videoMuted: true,
                            controls: false,
                            videoWebM: "",
                            videoMP4: "",
                            postImage: ""
                        },
                        customEventActions:{
                        },
                        eventConfig: [{
                            eventType: 'start',
                            actions: [{
                                type: 'track',
                                label: 'template_videohtml_view_start'
                            }, {
                                type: 'containerHide',
                                id: 'wallpaper-container'
                            }, {
                                type: 'containerHide',
                                id: 'ad_txt'
                            }, {
                                "type": 'containerShow',
                                "id": 'video-controls-container'
                            }, {
                                "type": 'containerShow',
                                "id": 'unmuteBtn'
                            }, {
                                "type": 'containerShow',
                                "id": 'pauseBtn'
                            }, {
                                "type": 'containerShow',
                                "id": 'video-progressbar'
                            }]
                        }, {
                            eventType: '25percent',
                            actions: [{
                                type: 'track',
                                label: 'template_videohtml_view_25percent'
                            }]
                        }, {
                            eventType: '50percent',
                            actions: [{
                                type: 'track',
                                label: 'template_videohtml_view_50percent'
                            }]
                        }, {
                            eventType: '75percent',
                            actions: [{
                                type: 'track',
                                label: 'template_videohtml_view_75percent'
                            }]
                        }, {
                            eventType: 'complete',
                            actions: [{
                                type: 'track',
                                label: 'template_videohtml_view_complete'
                            }, {
                                "type": 'containerShow',
                                "id": 'wallpaper-container'
                            }, {
                                "type": 'containerShow',
                                "id": 'ad_txt'
                            }, {
                                "type": 'containerShow',
                                "id": 'playBtnBig'
                            }, {
                                "type": 'containerHide',
                                "id": 'video-controls-container'
                            }, {
                                type: 'containerHide',
                                id: 'ballon-1'
                            }, {
                                type: 'containerHide',
                                id: 'ballon-2'
                            }, {
                                type: 'containerHide',
                                id: 'ballon-3'
                            }]
                        }, {
                            eventType: 'replay',
                            actions: [{
                                type: 'track',
                                label: 'template_videohtml_view_replay'
                            }, {
                                type: 'containerHide',
                                id: 'wallpaper-container'
                            }, {
                                type: 'containerHide',
                                id: 'ad_txt'
                            }, {
                                "type": 'containerShow',
                                "id": 'video-controls-container'
                            }, {
                                "type": 'containerShow',
                                "id": 'pauseBtn'
                            }, {
                                "type": 'containerShow',
                                "id": 'muteBtn'
                            }, {
                                "type": 'containerHide',
                                "id": 'unmuteBtn'
                            }, {
                                "type": 'containerHide',
                                "id": 'playBtn'
                            }, {
                                "type": 'containerHide',
                                "id": 'playBtnBig'
                            }, {
                                "type": 'containerHide',
                                "id": 'unmuteBtnBig'
                            }]
                        }, {
                            eventType: 'pause',
                            actions: [{
                                type: 'track',
                                label: 'template_videohtml_view_pause'
                            }, {
                                "type": 'containerShow',
                                "id": 'playBtn'
                            }, {
                                "type": 'containerHide',
                                "id": 'pauseBtn'
                            }]
                        }, {
                            eventType: 'resume',
                            actions: [{
                                type: 'track',
                                label: 'template_videohtml_view_pausePlay'
                            }, {
                                "type": 'containerShow',
                                "id": 'pauseBtn'
                            }, {
                                "type": 'containerHide',
                                "id": 'playBtn'
                            }]
                        }, {
                            eventType: 'soundon',
                            actions: [{
                                type: 'track',
                                label: 'template_videohtml_view_soundon'
                            }]
                        }, {
                            eventType: 'soundoff',
                            actions: [{
                                type: 'track',
                                label: 'template_videohtml_view_soundoff'
                            }]
                        }, {
                            eventType: 'cuePoint1',
                            actions: [{
                                type: 'containerShow',
                                id: 'ballon-1'
                            }, {
                                type: 'containerHide',
                                id: 'ballon-2'
                            }, {
                                type: 'containerHide',
                                id: 'ballon-3'
                            }]
                        }, {
                            eventType: 'cuePoint2',
                            actions: [{
                                type: 'containerHide',
                                id: 'ballon-1'
                            }, {
                                type: 'containerShow',
                                id: 'ballon-2'
                            }, {
                                type: 'containerHide',
                                id: 'ballon-3'
                            }]
                        }, {
                            eventType: 'cuePoint3',
                            actions: [{
                                type: 'containerHide',
                                id: 'ballon-1'
                            }, {
                                type: 'containerHide',
                                id: 'ballon-2'
                            }, {
                                type: 'containerShow',
                                id: 'ballon-3'
                            }]
                        }]
                    }, {
                        type: "content-container",
                        id: 'wallpaper-container',
                        env: ["html", "backup"],
                        css: {},
                        eventConfig: [{
                            eventType: 'click',
                            actions: [{
                                id: 'clickThrough',
                                type: 'openURL',
                                URLpath: '',
                                URLname: ''
                            }]
                        }],
                        content: [{
                            type: 'content-image',
                            id: 'wallpaper-image',
                            env: ["flash", "html", "backup"],
                            css: {
                                width: '100%',
                                height: '100%',
                                position: 'absolute',
                                top: '0px',
                                left: '0px'
                            },
                            imageConfig: {
                                src: ''
                            }
                        }]
                    }, {
                        type: "content-container",
                        id: 'video-controls-container',
                        env: ["html", "backup"],
                        css: {
                            position: 'absolute',
                            left: '0px',
                            background: 'rbg(0,0,0,0.5)',
                            bottom: '0px',
                            width: '100%',
                            padding: '10px 0px'
                        },
                        content: [{
                            type: 'content-container',
                            id: 'video-progressbar',
                            env: ["html", "backup"],
                            css: {
                                width: '100%',
                                position: 'relative'
                            },
                            content: [{
                                type: "content-container",
                                id: "hotspot-1",
                                env: ["html", "backup"],
                                classNode: "hotspot",
                                css: {
                                    left: '25%'
                                },
                                eventConfig: [{
                                    eventType: 'click',
                                    actions: [{
                                        id: 'hotspotClick',
                                        type: 'videoSeek',
                                        videoId: 'video1',
                                        percentage: 25
                                    }]
                                }],
                                content: [{
                                    type: 'content-image',
                                    id: 'hotspotimg1',
                                    env: ["html", "backup"],
                                    imageConfig: {
                                        src: 'https://s.yimg.com/cv/ae/hoang/test/splashad/dot1443534453.png'
                                    }
                                }]
                            }, {
                                type: "content-container",
                                id: 'hotspot-2',
                                env: ["html", "backup"],
                                classNode: "hotspot",
                                css: {
                                    left: '50%'
                                },
                                eventConfig: [{
                                    eventType: 'click',
                                    actions: [{
                                        id: 'hotspotClick',
                                        type: 'videoSeek',
                                        videoId: 'video1',
                                        percentage: 50
                                    }]
                                }],
                                content: [{
                                    type: 'content-image',
                                    id: 'hotspotimg2',
                                    env: ["html", "backup"],
                                    imageConfig: {
                                        src: 'https://s.yimg.com/cv/ae/hoang/test/splashad/dot1443534453.png'
                                    }
                                }]
                            }, {
                                type: "content-container",
                                id: 'hotspot-3',
                                env: ["html", "backup"],
                                classNode: "hotspot",
                                css: {
                                    left: '75%'
                                },
                                eventConfig: [{
                                    eventType: 'click',
                                    actions: [{
                                        id: 'hotspotClick',
                                        type: 'videoSeek',
                                        videoId: 'video1',
                                        percentage: 75
                                    }]
                                }],
                                content: [{
                                    type: 'content-image',
                                    id: 'hotspotimg3',
                                    env: ["html", "backup"],
                                    imageConfig: {
                                        src: 'https://s.yimg.com/cv/ae/hoang/test/splashad/dot1443534453.png'
                                    }
                                }]
                            }, {
                                type: 'content-progressBar',
                                id: 'progressbar',
                                env: ["html", "backup"],
                                css: {
                                    width: '100%',
                                    margin: '0px',
                                    height: '25px',
                                    cursor: 'pointer'
                                },
                                progressBarConfig: {
                                    value: 0,
                                    sourceId: 'video1'
                                }
                            }, {
                                type: "content-container",
                                id: "ballon-1",
                                classNode: "hotspotBallon",
                                env: ["html", "backup"],
                                css: {
                                    left: '25%',
                                },
                                eventConfig: [{
                                    eventType: 'click',
                                    actions: [{
                                        type: 'videoPause',
                                        videoId: 'video1'
                                    }, {
                                        type: 'containerShow',
                                        id: 'info-container'
                                    }, {
                                        type: 'containerShow',
                                        id: 'hotspot1-info'
                                    }, {
                                        type: 'containerHide',
                                        id: 'hotspot2-info'
                                    }, {
                                        type: 'containerHide',
                                        id: 'hotspot3-info'
                                    }]
                                }, {
                                    eventType: 'mouseenter',
                                    actions: [{
                                        type: 'containerChangeStyles',
                                        id: 'ballon-1',
                                        styles: {
                                            opacity: 1
                                        }
                                    }]
                                }, {
                                    eventType: 'mouseleave',
                                    actions: [{
                                        type: 'containerChangeStyles',
                                        id: 'ballon-1',
                                        styles: {
                                            opacity: 0.75
                                        }
                                    }]
                                }],
                                content: [{
                                    type: 'content-image',
                                    id: 'ballonimg-1',
                                    env: ["html", "backup"],
                                    imageConfig: {
                                        src: ''
                                    }
                                }]
                            }, {
                                type: "content-container",
                                id: "ballon-2",
                                classNode: "hotspotBallon",
                                env: ["html", "backup"],
                                css: {
                                    left: '50%'
                                },
                                eventConfig: [{
                                    eventType: 'click',
                                    actions: [{
                                        type: 'videoPause',
                                        videoId: 'video1'
                                    }, {
                                        type: 'containerShow',
                                        id: 'info-container'
                                    }, {
                                        type: 'containerHide',
                                        id: 'hotspot1-info'
                                    }, {
                                        type: 'containerShow',
                                        id: 'hotspot2-info'
                                    }, {
                                        type: 'containerHide',
                                        id: 'hotspot3-info'
                                    }]
                                }, {
                                    eventType: 'mouseenter',
                                    actions: [{
                                        type: 'containerChangeStyles',
                                        id: 'ballon-2',
                                        styles: {
                                            opacity: 1
                                        }
                                    }]
                                }, {
                                    eventType: 'mouseleave',
                                    actions: [{
                                        type: 'containerChangeStyles',
                                        id: 'ballon-2',
                                        styles: {
                                            opacity: 0.75
                                        }
                                    }]
                                }],
                                content: [{
                                    type: 'content-image',
                                    id: 'ballonimg-2',
                                    env: ["html", "backup"],
                                    imageConfig: {
                                        src: ''
                                    }
                                }]
                            }, {
                                type: "content-container",
                                id: 'ballon-3',
                                classNode: "hotspotBallon",
                                env: ["flash", "html", "backup"],
                                css: {
                                    left: '83%',
                                },
                                eventConfig: [{
                                    eventType: 'click',
                                    actions: [{
                                        type: 'videoPause',
                                        videoId: 'video1'
                                    }, {
                                        type: 'containerShow',
                                        id: 'info-container'
                                    }, {
                                        type: 'containerHide',
                                        id: 'hotspot1-info'
                                    }, {
                                        type: 'containerHide',
                                        id: 'hotspot2-info'
                                    }, {
                                        type: 'containerShow',
                                        id: 'hotspot3-info'
                                    }]
                                }, {
                                    eventType: 'mouseenter',
                                    actions: [{
                                        type: 'containerChangeStyles',
                                        id: 'ballon-3',
                                        styles: {
                                            opacity: 1
                                        }
                                    }]
                                }, {
                                    eventType: 'mouseleave',
                                    actions: [{
                                        type: 'containerChangeStyles',
                                        id: 'ballon-3',
                                        styles: {
                                            opacity: 0.75
                                        }
                                    }]
                                }],
                                content: [{
                                    type: 'content-image',
                                    id: 'ballonimg-3',
                                    env: ["html", "backup"],
                                    imageConfig: {
                                        src: ''
                                    }
                                }]
                            }]
                        }, {
                            type: 'content-container',
                            id: 'unmuteBtnBig',
                            env: ["html", "backup"],
                            css: {
                                display: 'none',
                                'float': 'left',
                                width: '80px',
                                height: '80px',
                                "margin-left": "25px",
                                background: 'url("https://s.yimg.com/dh/ap/template/splashad/imgs/big_mute.gif") no-repeat transparent'
                            },
                            eventConfig: [{
                                eventType: 'click',
                                actions: [{
                                    type: 'videoPause', // this aciton to make sure replay will be fired
                                    videoId: 'video1'
                                }, {
                                    type: 'videoStart',
                                    videoId: 'video1'
                                }, {
                                    type: 'videoSoundOn',
                                    videoId: 'video1'
                                }]
                            }]
                        }, {
                            type: 'content-container',
                            id: 'muteBtn',
                            env: ["html", "backup"],
                            css: {
                                display: 'none',
                                float: 'right',
                                width: '25px',
                                height: '25px',
                                "margin-right": "25px",
                                background: 'url("https://s.yimg.com/dh/ap/template/splashad/imgs/small_mute.gif") no-repeat transparent'
                            },
                            eventConfig: [{
                                eventType: 'click',
                                actions: [{
                                    type: 'videoSoundOff',
                                    videoId: 'video1'
                                }, {
                                    type: 'containerHide',
                                    id: 'muteBtn'
                                }, {
                                    type: 'containerShow',
                                    id: 'unmuteBtn'
                                }]
                            }]
                        }, {
                            type: 'content-container',
                            id: 'unmuteBtn',
                            env: ["html", "backup"],
                            css: {
                                display: 'none',
                                float: 'right',
                                width: '25px',
                                height: '25px',
                                "margin-right": "25px",
                                background: 'url("https://s.yimg.com/dh/ap/template/splashad/imgs/small_unmute.gif") no-repeat transparent'
                            },
                            eventConfig: [{
                                eventType: 'click',
                                actions: [{
                                    type: 'videoSoundOn',
                                    videoId: 'video1'
                                }, {
                                    type: 'containerHide',
                                    id: 'unmuteBtn'
                                }, {
                                    type: 'containerShow',
                                    id: 'muteBtn'
                                }]
                            }]
                        }, {
                            type: 'content-container',
                            id: 'playBtn',
                            env: ["html", "backup"],
                            css: {
                                display: 'none',
                                float: 'left',
                                width: '25px',
                                height: '25px',
                                "margin-left": "25px",
                                background: 'url("https://s.yimg.com/dh/ap/template/splashad/imgs/small_play.gif") no-repeat transparent'
                            },
                            eventConfig: [{
                                eventType: 'click',
                                actions: [{
                                    type: 'videoPlay',
                                    videoId: 'video1'
                                }]
                            }]
                        }, {
                            type: 'content-container',
                            id: 'pauseBtn',
                            env: ["html", "backup"],
                            css: {
                                display: 'none',
                                float: 'left',
                                width: '25px',
                                height: '25px',
                                "margin-left": "25px",
                                background: 'url("https://s.yimg.com/dh/ap/template/splashad/imgs/small_pause.gif") no-repeat transparent'
                            },
                            eventConfig: [{
                                eventType: 'click',
                                actions: [{
                                    type: 'videoPause',
                                    videoId: 'video1'
                                }]
                            }]
                        }]
                    }, {
                        type: 'content-container',
                        id: 'playBtnBig',
                        env: ["html", "backup"],
                        css: {
                            display: 'none',
                            position: 'absolute',
                            left: '10px',
                            bottom: '130px',
                            width: '80px',
                            height: '80px',
                            background: 'url("https://s.yimg.com/dh/ap/template/splashad/imgs/big_blue_play.gif") no-repeat transparent'
                        },
                        eventConfig: [{
                            eventType: 'click',
                            actions: [{
                                type: 'videoStart',
                                videoId: 'video1'
                            }, {
                                type: 'videoSoundOn',
                                videoId: 'video1'
                            }]
                        }]
                    }, {
                        type: 'content-container',
                        id: 'info-container',
                        env: ['html'],
                        css: {
                            display: 'none',
                            position: 'absolute',
                            top: '0',
                            left: '0',
                            width: '100%',
                            height: '100%'
                        },
                        content: [{
                            type: 'content-container',
                            id: 'lightbox',
                            env: ['html', 'backup'],
                            css: {
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                width: '100%',
                                height: '100%',
                                background: '#ddd',
                                opacity: 0.4
                            },
                            eventConfig: [{
                                eventType: 'click',
                                actions: [{
                                    type: 'containerHide',
                                    id: 'info-container'
                                }, {
                                    type: 'videoPlay',
                                    videoId: 'video1'
                                }]
                            }]
                        }, {
                            type: 'content-container',
                            id: 'info-container-detail',
                            env: ['html', 'backup'],
                            css: {
                                position: 'relative',
                                width: '1371px',
                                height: '438px',
                                top: '50%',
                                left: '50%',
                                'margin-left': '-685px',
                                'margin-top': '-219px',
                                background: '#fff'
                            },
                            content: [{
                                id: 'info_close_btn',
                                type: 'content-container',
                                env: ['html', 'backup'],
                                css: {
                                    position: 'absolute',
                                    top: '10px',
                                    right: '10px',
                                    color: '#fff'
                                },
                                eventConfig: [{
                                    eventType: "click",
                                    actions: [{
                                        type: 'containerHide',
                                        id: 'info-container'
                                    }, {
                                        type: 'videoPlay',
                                        videoId: 'video1'
                                    }]
                                }],
                                content: [{
                                    type: 'content-image',
                                    id: 'closeBtnImage',
                                    env: ['html'],
                                    imageConfig: {
                                        src: 'https://s.yimg.com/cv/ae/hoang/test/splashad/closebtn1443536789.png'
                                    }
                                }]
                            }, {
                                type: 'content-container',
                                id: 'hotspot1-info',
                                env: ['html'],
                                css: {
                                    display: 'none',
                                    width: '100%',
                                    height: '100%',
                                    'font-size': '25px'
                                },
                                eventConfig: [{
                                    eventType: 'click',
                                    actions: [{
                                        id: 'clickThrough',
                                        type: 'openURL',
                                        URLpath: '',
                                        URLname: ''
                                    }]
                                }],
                                content: [{
                                    type: 'content-image',
                                    id: 'infoimage-1',
                                    env: ['html'],
                                    imageConfig: {
                                        src: ''
                                    }
                                }]
                            }, {
                                type: 'content-container',
                                id: 'hotspot2-info',
                                env: ['html'],
                                css: {
                                    display: 'none',
                                    width: '100%',
                                    height: '100%',
                                    'font-size': '25px'
                                },
                                eventConfig: [{
                                    eventType: 'click',
                                    actions: [{
                                        id: 'clickThrough',
                                        type: 'openURL',
                                        URLpath: '',
                                        URLname: ''
                                    }]
                                }],
                                content: [{
                                    type: 'content-image',
                                    id: 'infoimage-2',
                                    env: ['html'],
                                    imageConfig: {
                                        src: ''
                                    }
                                }]
                            }, {
                                type: 'content-container',
                                id: 'hotspot3-info',
                                env: ['html'],
                                css: {
                                    display: 'none',
                                    width: '100%',
                                    height: '100%',
                                    'font-size': '25px'
                                },
                                eventConfig: [{
                                    eventType: 'click',
                                    actions: [{
                                        id: 'clickThrough',
                                        type: 'openURL',
                                        URLpath: '',
                                        URLname: ''
                                    }]
                                }],
                                content: [{
                                    type: 'content-image',
                                    id: 'infoimage-3',
                                    env: ['html'],
                                    imageConfig: {
                                        src: ''
                                    }
                                }]
                            }]
                        }]
                    }, {
                        "id": "ad_txt",
                        "type": "content-container",
                        "env": ["html", "backup"],
                        "css": {
                            "display": "none",
                            "left": "25px",
                            "position": "absolute",
                            "bottom": "15px",
                            "color": "#fff",
                            "z-index": "11",
                            "opacity": "1",
                            "-moz-user-select": "none",
                            "-webkit-user-select": "none",
                            "-ms-user-select": "none",
                            "pointer-events": "none"
                        },
                        "content": [{
                            "id": "company_name_text",
                            "type": "content-container",
                            "env": ["html", "backup"],
                            "css": {
                                "font-family": "'Custom',sans-serif",
                                "font-size": "26px",
                                "font-weight": "200",
                                "margin": "0",
                                "padding": "0",
                                "text-shadow": "0 1px 0 rgba(0, 0, 0, 0.5)"
                            },
                            "containerConfig": {
                                "innerText": ""
                            }
                        }, {
                            "id": "title_text",
                            "type": "content-container",
                            "env": ["html", "backup"],
                            "css": {
                                "fontFamily": "'Custom',sans-serif",
                                "margin": "5px 0 0 0",
                                "fontSize": "50px",
                                "fontWeight": "400"
                            },
                            "containerConfig": {
                                "innerText": ""
                            }
                        }, {
                            "id": "description_text",
                            "type": "content-container",
                            "env": ["html","backup"],
                            "css": {
                                "font-family": "'Helvetica Neue',Helvetica,Arial,sans-serif",
                                "margin": "-3px 0 0 0",
                                "font-size": "15px",
                                "font-weight": "400"
                            },
                            "containerConfig": {
                                "innerText": ""
                            }
                        }]

                    }]
                }
            }
        }
    }
});
