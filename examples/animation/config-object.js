ACT.setConfig("config-object-animation", {
    baseConfig: {
        id: "test",
        template: "thirdparty",
        forceEnv: {
            forcedFlashList: {},
            forcedHTML5List: {
                Chrome: "*",
                FireFox: "*",
                Safari: "*",
                MSIE: "*"
            },
            forcedBackupList: {}
        }
    },
    tracking: {},
    format: {
        darlaLayer: {
            holder: {
                contractedWidth: "300",
                contractedHeight: "250"
            }
        },
        flow: [{
            eventType: "firstPlay",
            actions: [{
                type: "playLayer",
                to: "mpu",
                animate: false
            }, {
                type: "track",
                label: "mpu_firstplay_ad_html"
            }]
        }, {
            eventType: "cappedPlay",
            actions: [{
                type: "playLayer",
                to: "mpu",
                animate: false
            }, {
                type: "track",
                label: "mpu_cappedplay_ad_html"
            }]
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
                    type: "ContentContainer",
                    id: "mpu_container",
                    env: ["html"],
                    css: {
                        position: "relative"
                    },
                    content: [{
                        type: "ContentContainer",
                        id: "mpu_button",
                        env: ["html"],
                        css: {
                            position: "absolute",
                            left: "0px",
                            zIndex: 10,
                            border: "1px solid green",
                            top: "0"
                        },
                        content:[{
                            type: "ContentContainer",
                            id: "mpu_btn_1",
                            env: ["html"],
                            css: {
                                background: "yellow"
                            },
                            containerConfig: {
                                innerText: 'Right'
                            },
                            eventConfig: [{
                                eventType: "click",
                                actions:[{
                                    type: "containerAnimate",
                                    id: "mpu_slider",
                                    from: {left:"0",opacity:".5",height:"500px"},
                                    to: {left:"-300px",opacity:"1",height:"250px"},
                                    duration: 1000,
                                    delay: 10
                                }]
                            }]
                        }]
                    }, {
                        type: "ContentContainer",
                        id: "mpu_container_slider",
                        env: ["html"],
                        css: {
                            width: "300px",
                            height: "250px",
                            overflow: "hidden",
                            position: "relative"
                        },
                        content:[{
                            type: "ContentContainer",
                            id: "mpu_slider",
                            env: ["html"],
                            css: {
                                width: "900px",
                                position: "absolute"
                            },
                            content: [{
                                type: "ContentContainer",
                                id: "mpu_slide_1",
                                env: ["html"],
                                css: {
                                    width: "300px",
                                    height: "250px",
                                    background: "blue",
                                    display: "inline-block"
                                }
                            },
                            {
                                type: "ContentContainer",
                                id: "mpu_slide_2",
                                env: ["html"],
                                css: {
                                    width: "300px",
                                    height: "250px",
                                    background: "yellow",
                                    display: "inline-block"
                                }
                            }]
                        }]
                    }, {
                        type: "ContentContainer",
                        id: "mpu_button",
                        env: ["html"],
                        css: {
                            position: "absolute",
                            right: "0px",
                            top: "0",
                            zIndex: 10,
                            border: "1px solid green"
                        },
                        content:[{
                            type: "ContentContainer",
                            id: "mpu_btn_1",
                            env: ["html"],
                            css: {
                                background: "yellow"
                            },
                            containerConfig: {
                                innerText: 'Left'
                            },
                            eventConfig: [{
                                eventType: "click",
                                actions:[{
                                    type: "containerAnimate",
                                    id: "mpu_slider",
                                    from: {left:"-300px",opacity:"1",height:"250px"},
                                    to: {left:"0",opacity:".5",height:"500px"},
                                    duration: 1000,
                                    delay: 10
                                }]
                            }]
                        }]
                    }]
                }
            }
        }
    }
});