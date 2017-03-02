YUI.add("yuidoc-meta", function(Y) {
   Y.YUIDoc = { meta: {
    "classes": [
        "Dom",
        "Enabler",
        "Event",
        "Json",
        "Lang",
        "UA",
        "Util"
    ],
    "modules": [
        "ACT",
        "Enabler"
    ],
    "allModules": [
        {
            "displayName": "ACT",
            "name": "ACT",
            "description": "User Agent Detection - UA\n\n    var env = ACT.UA;\n    env.browser;\n    env.os;\n    env.flash;\n    env.isHtml5Supported;\n    env.html;"
        },
        {
            "displayName": "Enabler",
            "name": "Enabler",
            "description": "ACT Enabler\n\n```\n    var conf = {\n        tracking: {\n            trackUnique: true\n        },\n        exitUrls: {\n            clickTAG: 'https://www.yahoo.com/?clickTAG=true',\n            clickTAG1: 'https://www.yahoo.com/?clickTAG=true',\n            clickTAG2: 'https://www.yahoo.com/?clickTAG=true'\n        },\n        trackingLabels: {\n            video1:25 : 'billboard_view_video1_25percent',\n            video1:50 : 'billboard_view_video1_50percent',\n            video1:75 : 'billboard_view_video1_75percent'\n        },\n        enablerInteractionTracking : false,\n        enablerTarget: 'http://cdn.path.here.com/ACT_Enabler.js',\n        htmlRoot : 'http://cdn.path.here.com/'\n    };\n    Enabler.setConfig( conf );\n```"
        }
    ]
} };
});