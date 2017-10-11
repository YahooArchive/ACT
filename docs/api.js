YUI.add("yuidoc-meta", function(Y) {
   Y.YUIDoc = { meta: {
    "classes": [
        "ACT",
        "ActionsQueue",
        "Base",
        "Capability",
        "CapabilitySkeleton",
        "Class",
        "ContentAdobeEdge",
        "ContentCarousel",
        "ContentContainer",
        "ContentHtml5",
        "ContentImage",
        "ContentProgressBar",
        "ContentSwf",
        "ContentThirdParty",
        "ContentVideoFlash",
        "ContentVideoHtml",
        "ContentYoutube",
        "Cookie",
        "CustomData",
        "Debug",
        "Dom",
        "DwellTime",
        "Enabler",
        "EnablerADTECH",
        "EnablerConfig",
        "Environment",
        "Event",
        "Flash",
        "IO",
        "Json",
        "Lang",
        "LayerStandard",
        "LayersList",
        "Scaffolding",
        "Screen",
        "SecureDarla",
        "StandardAd",
        "Tracking",
        "UA",
        "Util",
        "VideoEvents"
    ],
    "modules": [
        "ACT",
        "Base",
        "CapabilitySkeleton",
        "ContentAdobeEdge",
        "ContentCarousel",
        "ContentContainer",
        "ContentHtml5",
        "ContentImage",
        "ContentProgressBar",
        "ContentSwf",
        "ContentThirdParty",
        "ContentVideoFlash",
        "ContentVideoHtml",
        "ContentYoutube",
        "Cookie",
        "DwellTime",
        "Enabler",
        "EnablerADTECH",
        "IO",
        "LayerStandard",
        "LayersList",
        "Scaffolding",
        "Screen",
        "SecureDarla",
        "StandardAd",
        "Tracking",
        "actionsQueue",
        "environment"
    ],
    "allModules": [
        {
            "displayName": "ACT",
            "name": "ACT",
            "description": "The new ACT.js global namespace object. If the `ACT` object is already defined, the existing ACT object will only be overwritten\nIF the new one being loaded has a greater version than the existing one. Usage example is as follows:\n\n        ACT.define('name_of_module', [ 'required', 'sub', 'modules'], function (ACT) {\n            // ACT is the global reference to the ACT instance with all the required modules loaded.\n        });"
        },
        {
            "displayName": "actionsQueue",
            "name": "actionsQueue",
            "description": "Creates a new queue. A queue is a first-in-first-out (FIFO) data structure -\nitems are added to the end of the queue and removed from the front.\n<br/>\nProvide features:\n- register action definition\n- Add action to queue to be executed\n\nAction definition must be registered first like below example:\n\n    ACT.fire('register:Actions',\n       {\n           type: 'action_name', // must be unique name\n           argument: {\n               // list of argument accepted by this actions\n               arg1: {\n                   test: function(value) {\n                       // function to check the value of arg1\n                       // must return true or false\n                       return true;\n                   }\n               },\n               arg2: {\n                   test: function(value) {\n                       // function to check the value of arg2\n                       // must return true or false\n                       return true;\n                   }\n               }\n            },\n           proccess: function(data) {\n                //function to be executed when action is executed\n               // data is an object with passed arguments, e.g:\n               var arg1 = data.arg1;\n               var arg2 = data.arg2;\n           }\n       }\n    );\n\nAfter registered, action can be execute by adding it to actions queue:\n\n    ACT.fire('add:action',\n       {\n           type: 'unique_action_name',\n           arg1: [value], // value for arg1 must satify arg1's test function in action definition\n           arg2: [value], // value for arg2 must satify arg2's test function in action definition\n        }\n    );\n\nAs the queue work in async order, complete:action event must be fired before the next action can be executed\n\n       ACT.fire('complete:action');"
        },
        {
            "displayName": "Base",
            "name": "Base",
            "description": "Base - starts up the basic ad framework\n\n    var conf = {\n        conf: {\n            tracking: {\n                id: ''\n            },\n            loadType: 'ready', // 'domready' or 'inline' defaults to '(on)load'\n            template: {\n                name: 'name_of_ad',\n                type: 'type_of_ad',\n                format: 'format_of_ad',\n                width: 300,\n                height: 250\n            },\n            inputData:{\n               type:'JSON',\n               id: 'myYT',\n               dataFeed: 'json_feed.js'\n           },\n           customData:{\n                \"layers.mpu.width\" : '500px'\n            }\n        },\n        superConf: 'mazda-ad-20150401',\n        extend:{\n            init: function () { ... },\n            ad_init: function () { ... },\n            happy: function () { ... }\n        }\n    }"
        },
        {
            "displayName": "CapabilitySkeleton",
            "name": "CapabilitySkeleton"
        },
        {
            "displayName": "ContentAdobeEdge",
            "name": "ContentAdobeEdge",
            "description": "This capability will get the config for AdobeBride, rendering content and provide helper functions\nFeature including:\n- create AdobeBride composition\n-"
        },
        {
            "displayName": "ContentCarousel",
            "name": "ContentCarousel",
            "description": "The 'ContentCarousel' is a capability made to render its contents into a carousel slideshow with actions available to move the slides\n\nAvailable 'actions':\n- carouselNextSlide\n- carouselPreviousSlide\n- carouselJumpToSlide\n\nAvailable 'triggers':\n- carouselAnimationStart\n- carouselAnimationComplete\n- carouselAnimationPanel[X]Play\n\nExample of 'SuperConf' use case:\n\n    {\n        id: 'carousel_one',\n        type: 'content-carousel',\n        classNode: 'mpu_container_class',\n        env: ['html','flash','backup'],\n        css: {\n          width: 300\n        },\n        ContentCarouselConfig: {\n           transitionTime: 500,\n           currentSlideId: 2\n         },\n        eventConfig: [],\n        content: []\n     }"
        },
        {
            "displayName": "ContentContainer",
            "name": "ContentContainer",
            "description": "The 'ContentContainer' is a capability made to generate a 'DIV' tag use as a container.\n\nAvailable 'actions':\n- openURL\n- showContainer\n- hideContainer\n- changeStyles\n\nAvailable 'triggers':\n- click\n- mouseenter\n- mouseleave\n\nExample of 'SuperConf' use case:\n```\n   {\n       id: 'mpu_container',\n       type: 'content-container',\n       classNode: 'mpu_container_class',\n       env: ['html','flash','backup'],\n       css: {\n           width:'350'\n       },\n       eventConfig: [{\n           eventType: 'click',\n           actions: [\n               {\n                   type: 'openURL',\n                   URLpath: 'https://www.yahoo.com',\n                   URLname: 'mpu_click_clicktag_open'\n               }\n           ],\n           timeTo: 2\n       }],\n       content: []\n   }\n```"
        },
        {
            "displayName": "ContentHtml5",
            "name": "ContentHtml5",
            "description": "The 'ContentHtml5' is a capability made to generate a 'DIV' or an 'IFRAME' tag use for htlm5 assets."
        },
        {
            "displayName": "ContentImage",
            "name": "ContentImage",
            "description": "The 'ContentImage' is a capability made to generate a 'IMG' tag.\n\nExample of 'SuperConf' use case:\n\n     {\n         id: 'mpu_image',\n         type: 'content-image',\n         classNode: 'mpu_image_class',\n         env: ['html','flash','backup'],\n         css: {\n             width: 300,\n             height: 250\n         },\n         imageConfig: {\n             src: '',\n             alt: '',\n             title: ''\n         }\n     }"
        },
        {
            "displayName": "ContentProgressBar",
            "name": "ContentProgressBar",
            "description": "The 'ContentProgressBar' is a capability made to generate a progress bar and sync it with a targeted element.\n\nExample of 'SuperConf' use case:\n\n     {\n         id: 'video_progressbar',\n         type: 'content-progressbar',\n         env: ['html', 'backup'],\n         css: {\n             width: '900px',\n         },\n         progressBarConfig: {\n             value: 0, // initial value of progress bar\n             sourceId: 'videoPlayer' // id of video element\n         }\n     }"
        },
        {
            "displayName": "ContentSwf",
            "name": "ContentSwf",
            "description": "The 'ContentSwf' is a capability made to generate a 'EMBED' or 'OBJECT' tag.\n\nExample of 'SuperConf' use case:\n\n\t{\n\t\tid: 'mpu_swf',\n\t\ttype: 'content-swf',\n\t\tclassNode: 'mpu_swf_class',\n\t\tenv: ['flash'],\n\t\tcss: {},\n\t\tswfConfig: {\n\t\t\tsrc: '',\n\t\t\twidth: 300,\n\t\t\theight: 250,\n\t\t\tflashvars: {\n\t\t\t\tclickTAG: 'https://www.yahoo.com'\n\t\t\t}\n\t\t}\n\t}"
        },
        {
            "displayName": "ContentThirdParty",
            "name": "ContentThirdParty",
            "description": "The 'ContentThirdParty' is a capability made to generate a 'DIV' or an 'IFRAME' tag use as a container for a third party element.\n\nAvailable 'actions':\n- thirdpartyStart\n- thirdpartyStop\n- thirdpartyBroadcast\n\nAvailable 'triggers' for thirdparty tag:\n- expandEvent\n- contractEvent\n- closeEvent\n- openEvent\n\n\nExample of 'SuperConf' use case:\n\n     {\n         id: 'thirdparty_container',\n         type: 'content-thirdparty',\n         classNode: 'thirdparty_class',\n         env: ['html','flash'],\n         css: {\n             width:'970px',\n             height:'250px'\n         },\n         thirdPartyConfig:{\n             id: 'thirparty-id',\n             iframe: true\n         },\n         eventActions: [{\n             eventType: 'expandEvent',\n             actions: [\n                 {\n                     type: 'thirdpartyStart',\n                     to: 'thirdparty_container'\n                 },\n                 {\n                     type: 'thirdpartyBroadcast',\n                     to: 'thirdparty_container',\n                     name: 'expandedEvent'\n                 }\n             ]\n         }, {\n             eventType: 'contractEvent',\n             actions: [\n                 {\n                     type: 'thirdpartyStop',\n                     id: 'thirdparty_container'\n                 },\n                 {\n                     type: 'thirdpartyBroadcast',\n                     to: 'thirdparty_container',\n                     name: 'contractedEvent'\n                 }\n             ]\n         }]\n     }"
        },
        {
            "displayName": "ContentVideoFlash",
            "name": "ContentVideoFlash"
        },
        {
            "displayName": "ContentVideoHtml",
            "name": "ContentVideoHtml",
            "description": "Capability for rendering html5 video content.\nFeatures:\n     - rendering video tag with video source insides\n     - Broadcasting video progress and states\n\nExample for config object:\n\n    {\n        type: 'content-video-html',\n         id: 'video_id',\n         env: ['html'],\n         css: {\n             width: '400px',\n             height: '300px'\n           },\n         videoHtmlConfig:{\n             controls: true | false, // enable/disable video native control - default is true - optional\n             autoPlay: true | false, // enable/disable video auto play - default is false - optional\n             videoMuted: true | false, // disable/enable video sound - default is false - optional\n             posterImage: 'link_to_poster_image', // image to be show when video is loaded or before playing video - optional\n             videoMP4: 'link_to_mp4_video',\n             videoWebM: 'link_to_webm_video',\n             videoOGG: 'link_to_ogg_video',\n             videoOGV: 'link_to_ogv_video'\n         },\n         eventConfig: [{\n             eventType: 'start' | '25percent' | '50percent' | '75percent' | 'complete' | 'pause' | 'pausePlay'  | 'soundon' | 'soundoff' | 'replay',\n             actions: [{\n                 // ...\n             }]\n         }]\n     }\n\n     // Available actions for the actions queue:\n     {\n         type: 'video:start | video:stop | video:play | video:pause | video:soundOn | video:soundOff ',\n         videoId: 'video_id' // id of target video\n     }"
        },
        {
            "displayName": "ContentYoutube",
            "name": "ContentYoutube",
            "description": "The 'ContentYoutube' is a capability made to generate a 'DIV' tag use as a container for the Youtube player.\n\nAvailable 'actions':\n- youtubeStart\n- youtubeStop\n- youtubePlay\n- youtubePause\n- youtubeMute\n- youtubeUnmute\n\nAvailable 'triggers':\n- pause\n- play\n- complete\n- error\n- ready\n- start\n- 25percent\n- 50percent\n- 75percent\n\nExample of 'SuperConf' use case:\n\n     {\n         id: 'youtube_player',\n         type: 'content-youtube',\n         classNode: 'youtube_class',\n         env: ['html', 'flash'],\n         css: {\n             width:'352px',\n             height:'198px'\n         },\n         youtubeConfig:{\n             width: '100%',\n             height: '100%',\n             videoId: 'GQQMLE4FuIQ',\n             suggestedQuality: 'default',\n             playerVars: {\n                 autoplay: 1,\n                 controls: 1,\n                 color: 'white',\n                 disablekb: 1,\n                 enablejsapi: 1,\n                 fs: 1,\n                 iv_load_policy: 3,\n                 modestbranding: 0,\n                 rel: 0,\n                 showinfo: 0,\n                 loop: 0\n             }\n         },\n         eventActions: [{\n             eventType: 'start',\n             actions: [\n                 {\n                     type: 'track',\n                     label: 'start'\n                 }\n             ]\n         }]\n     }"
        },
        {
            "displayName": "Cookie",
            "name": "Cookie",
            "description": "ACT Cookie functionality. Enables ads to set and get cookies.\n\n    var conf = {\n        expires: 172800000,\n        default_cookieName: 'CRZY',\n        path: '/',\n        domain: 'yahoo.com',\n        name: 'cookieName'\n        freq_cap : 1,\n        disabled: false\n    };\n    var cookie = new cookie( conf, this);"
        },
        {
            "displayName": "DwellTime",
            "name": "DwellTime",
            "description": "This module is helping tracking dwelltime for seletect dome element.\nFollowing IAB definition, dwelltime for desktop will be tracked as describe below\n- Start counting when mouse in target element\n- Stop counting when mouse leave target element\n- If mouse leave and come back within 2 seconds, continues counting\n- If mouse leave for more than 2 seconds, stop counting and send tracking label\n- If mouse leave after 10 minutes, the track will count as 10 minutes\n- Maximum counting time is 10 minutes\n\n```\n    // This example will start track dwelltime for ACT_mpu element\n    var target = document.getElementById('ACT_mpu');\n    var mpuDwellTimeTracker = new ACT.DwellTime({\n          'targetElement': target,\n          'targetName': 'mpu'\n       // some other custom config\n    });\n\n    // To stop tracking dwelltime\n    mpuDwellTimeTracker.destroy();\n```"
        },
        {
            "displayName": "Enabler",
            "name": "Enabler",
            "description": "ACT Enabler\n\nEnabler takes a configuration object to initialize. Of-course it'll run in default mode if no config is provided.\nBelow, is a basic example of such a configuration Object."
        },
        {
            "displayName": "EnablerADTECH",
            "name": "EnablerADTECH",
            "description": "ACT EnablerADTECH\n\nEnabler Wrapper for AOL 1 ADTECH API.\n\n```\n    // Providing exposeADTECH `true` will create a reference in window.ADTECH = ACT.EnablerADTECH;\n    var conf = {\n        exposeADTECH: true\n    };\n    Enabler.setConfig( conf );\n```"
        },
        {
            "displayName": "environment",
            "name": "environment",
            "description": "Force browsers to play specific environments based on their capabilities,\ncurrently environment supported are flash, html, backup.\n<br/>\n__Default__ playing order is: HTML5 => Backup\nIn order to play flash, it must be force it\n<br/>\n\nSteps to follow in order to force an environment:\n<br/>\nAdd browser to be forced into configuration-object:\n\n    forceEnv = {\n        forcedBackupList: {\n            FireFox: \"*\",\n        },\n        forcedFlashList: {\n            Safari: \"*\"\n        },\n            forcedHTML5List: {\n        },\n        forcedMobileList: {\n        },\n        forcedTabletList: {\n        }\n    };\n\nAdd environment into capabilities env array, to associate them.\n\nBrowser can be chosen by using the following options:\n\nAll the browser versions:\n\n    // <browser-name>: '*'\n    Firefox: '*'\n\nSpecific browser version:\n\n    // <browser-name>: '<browser-version>'\n    Firefox: '30'\n\nGreate than a version:\n\n     // <browser-name>: '>=<browser-version>'\n     Firefox: '>=30'\n\nLower than a version:\n\n    // <browser-name>: '<=<browser-version>'\n    Firefox: '<=30'\n\nList of browser versions:\n\n    // <browser-name>: '<browser-version0>,<browser-version1>,<browser-version2>'\n    Firefox: '30,31,33'"
        },
        {
            "displayName": "IO",
            "name": "IO",
            "description": "The \"IO\" helper class to dynamically load files."
        },
        {
            "displayName": "LayersList",
            "name": "LayersList",
            "description": "The 'LayersList' is a core module made to manage the layers functionalities.\nThis module is used in 'StandardAd'."
        },
        {
            "displayName": "LayerStandard",
            "name": "LayerStandard",
            "description": "The 'LayerStandard' is a core module made to generate a parent 'DIV' tag container with a specific position/configuration.\nThis module is used in 'Layerslist'."
        },
        {
            "displayName": "Scaffolding",
            "name": "Scaffolding",
            "description": "The 'Scaffolding' is a core module made to parse the object layer to html.\nThis module is used in 'layerStandard'."
        },
        {
            "displayName": "Screen",
            "name": "Screen",
            "description": "The 'Screen' is a core module made to detect the screen size/event/orientation.\nThis module is used in 'StandardAd'."
        },
        {
            "displayName": "SecureDarla",
            "name": "SecureDarla",
            "description": "ACT Wrapper for SecureDarla communication layer and ad registration methods.\n\n\tvar config = {\n\t\tname: 'name_of_ad',\n\t\ttype: 'type_of_ad',\n\t\tformat: 'format_of_ad',\n\t\twidth: 300,\n\t\theight: 250\n\t};\n\tvar ref = this; // optional\n\tvar SD = new ACT.SecureDarla(config, ref);"
        },
        {
            "displayName": "StandardAd",
            "name": "StandardAd"
        },
        {
            "displayName": "Tracking",
            "name": "Tracking",
            "description": "ACT Generic Tracking functionality. This tracking file is a facade for tracking. It can either be completely overwritten, given that the\noverwritten version supplies similar functionality, or used with a a configuration section that defines appropriate overwrites. By default,\nthis file will attempt to fire the tracking overwrite functions if they exist or simply return the tracking parameter set via the tracking complete event.\nfor interaction tracking. In which case you should listen for ```tracking:track:complete``` event, that will provide the outcome of the tracking event that was fired.\nThe contents of the data payload will be:"
        }
    ]
} };
});