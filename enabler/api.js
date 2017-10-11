YUI.add("yuidoc-meta", function(Y) {
   Y.YUIDoc = { meta: {
    "classes": [
        "Dom",
        "Enabler",
        "EnablerADTECH",
        "EnablerConfig",
        "Event",
        "Json",
        "Lang",
        "UA",
        "Util"
    ],
    "modules": [
        "ACT",
        "Enabler",
        "EnablerADTECH"
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
            "description": "ACT Enabler\n\nEnabler takes a configuration object to initialize. Of-course it'll run in default mode if no config is provided.\nBelow, is a basic example of such a configuration Object."
        },
        {
            "displayName": "EnablerADTECH",
            "name": "EnablerADTECH",
            "description": "ACT EnablerADTECH\n\nEnabler Wrapper for AOL 1 ADTECH API.\n\n```\n    // Providing exposeADTECH `true` will create a reference in window.ADTECH = ACT.EnablerADTECH;\n    var conf = {\n        exposeADTECH: true\n    };\n    Enabler.setConfig( conf );\n```"
        }
    ]
} };
});