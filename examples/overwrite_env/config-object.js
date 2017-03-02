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
                    content: [
                    {
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
                    }
                    ]
                }
            }
        }
    }
});