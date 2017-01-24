ACT.setConfig("config-object", {
    baseConfig: {
        id: "test",
        template: 'LREC',
        forceEnv: {
            forcedFlashList: {},
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
                        "to": "mpu",
                        "animate": false
                    }
                ]
            }, {
                eventType: "cappedPlay",
                actions: [
                    {
                        "type": "playLayer",
                        "to": "mpu",
                        "animate": false
                    }
                ]
            }
        ],
        layers: {
            mpu: {
                layerName: "mpu",
                base: "ad",
                type: "inline",
                width: "300px",
                height: "250px",
                css: {
                	zIndex: 5
                },
                x: "0",
                y: "0",
                contentLayer: {
                    type: "content-container",
                    id: "mpu_container",
                    env: ["flash", "html", "backup"],
                    css: {
                        width: '300px',
                        height: '250px'
                    },
                    eventConfig: [{
                        eventType: "click",
                        actions: [{
                                "type": "openURL",
                                "URLpath": "https://www.yahoo.com",
                                "URLname": "clickTAG"
                            }
                        ]
                    }],
                    content: [{
                            id: "img_1_1",
                            type: "content-image",
                            env: [
                                "flash",
                                "html",
                                "backup"
                            ],
                            buttonConfig: "",
                            eventActions: "",
                            classNode: "",
                            css: {
                                width: "300",
                                height: "250",
                            },
                            imageConfig: {
                                src: "https://s.yimg.com/iv/300x250_Simple/mpu3_201521111918613.jpg",
                                alt: "alt",
                                title: "title"
                            }
                        }
                    ]
                }
            }
        }
    }
});