/*
 * Copyright 2016, Yahoo Inc.
 * Copyrights licensed under the New BSD License.
 * See the accompanying LICENSE file for terms.
 */

/* global ACT */
/**
 * The 'ContentAdfeedback' is a capability that renders the Yahoo! Ad Feedback implimentation
 *
 * Available 'actions':
 * - enableAdFeedback
 * - disableAdFeedbackInit
 * - enableAdFeedbackInit
 * - trackAdfeedback
 *
 * Available 'eventTypes':
 * - adfeedbackEnabled
 *
 * Example of 'SuperConf' use case:
 *
 *     {
 *          id: 'adfeedback_container',
 *          type: 'content-adfeedback',
 *          env: ['html', 'flash', 'backup'],
 *          css: {
 *              width: '300px',
 *              height: '250px',
 *              display: 'block',
 *              overflow: 'visible'
 *          },
 *          AdfeedbackConfig: {
 *              triggerNode: 'act-ad'
 *              placement_config: fpad_fdb // ADFEEDBACK CONFIG FROM PAGE
 *              translation_config: {
 *                     act_fdb_balloon_text: 'I don\'t like this ad ',
 *                     fdb_srvy_title: 'What don\'t you like about this ad ? ',
 *                     fdb_srvy_thankyou_text : 'Thank you for helping us improve your Yahoo experience',
 *                     fdb_srvy_answers_one: 'It\'s distracting ',
 *                     fdb_srvy_answers_two: 'It\'s not relevant ',
 *                     fdb_srvy_answers_three: 'It\'s offensive ',
 *                     fdb_srvy_answers_four: 'Something else',
 *                     fdb_srvy_details_submit: 'Send',
 *                     fdb_srvy_why_text: 'Why do I see ads?',
 *                     fdb_srvy_learn_text: 'Learn more about your feedback.',
 *                     fdb_srvy_done: 'Done'
 *              },
 *              url_config: {
 *                     adfeedback_open_why_url: 'https://......',
 *                     adfeedback_open_learn_url: 'https://.....'
 *              }
 *          },
 *          EventConfig: [{
 *              eventType: 'adfeedbackEnabled',
 *              actions: []
 *          }]
 *     }
 *
 * @module ContentAdfeedback
 * @main ContentAdfeedback
 * @class ContentAdfeedback
 * @requires Dom, Lang, Event, Util, Class, Capability
 * @global
 */
ACT.define('ContentAdfeedback', ['Dom', 'Lang', 'Event', 'Util', 'Class', 'Capability'], function (ACT) {
    'use strict';

    /* Constants */
    var Dom = ACT.Dom;
    var Lang = ACT.Lang;
    var Event = ACT.Event;
    var Util = ACT.Util;
    var Class = ACT.Class;
    var Capability = ACT.Capability;

    var TRIGGERNODE_MOUSEENTER_EVENT;
    var TRIGGERNODE_MOUSELEAVE_EVENT;
    var CLOSE_BTN_CONTAINER_ID = 'fdb_close';
    var FORM_CONTAINER_ID = 'act_fdb_form';
    var BUTTON_DOM_STRUCTURE = {
        id: CLOSE_BTN_CONTAINER_ID,
        type: 'content-container',
        env: ['html', 'flash', 'backup'],
        css: {
            position: 'absolute',
            top: '-20px',
            left: '0px',
            zIndex: '10',
            width: '300px',
            height: '20px',
            visibility: 'inherit',
            display: 'none'
        },
        eventConfig: [{
            eventType: 'mouseenter',
            actions: [{
                type: 'containerChangeStyles',
                id: 'act_fdb_x',
                styles: {
                    background: "#fff url('https://s.yimg.com/rq/darla/i/fdb1.gif') no-repeat right 0px"
                }
            }, {
                type: 'containerShow',
                id: 'act_fdb_balloon'
            }]
        }, {
            eventType: 'mouseleave',
            actions: [{
                type: 'containerChangeStyles',
                id: 'act_fdb_x',
                styles: {
                    background: "#fff url('https://s.yimg.com/rq/darla/i/fdb1.gif') no-repeat right -25px"
                }
            }, {
                type: 'containerHide',
                id: 'act_fdb_balloon'
            }]
        }],
        content: [{
            id: 'act_fdb_x',
            type: 'content-container',
            env: ['html', 'flash', 'backup'],
            css: {
                width: '20px',
                height: '20px',
                opacity: '0.78',
                msFilter: 'progid:DXImageTransform.Microsoft.Alpha(Opacity=78)',
                filter: 'alpha(opacity=78)',
                position: 'absolute',
                right: '0px',
                background: "#fff url('https://s.yimg.com/rq/darla/i/fdb1.gif') no-repeat right -25px",
                cursor: 'pointer',
                zIndex: '1000'
            },
            eventConfig: [{
                eventType: 'click',
                actions: [{
                    type: 'enableAdFeedback'
                }, {
                    type: 'trackAdfeedback',
                    interactionType: 'fdb_start'
                }, {
                    type: 'disableAdFeedbackInit'
                }]
            }, {
                eventType: 'click',
                actions: [{
                    type: 'containerHide',
                    id: 'fdb_srvy_buttons'
                }, {
                    type: 'containerHide',
                    id: 'fdb_srvy_title'
                }, {
                    type: 'containerHide',
                    id: 'fdb_srvy_why_text'
                }, {
                    type: 'containerHide',
                    id: 'fdb_srvy_done'
                }, {
                    type: 'containerShow',
                    id: 'fdb_srvy_thankyou_text'
                }, {
                    type: 'containerShow',
                    id: 'fdb_srvy_learn_text'
                }],
                timeTo: 10
            }, {
                eventType: 'mouseenter',
                actions: [{
                    type: 'trackAdfeedback',
                    interactionType: 'fdb_movr_x'
                }]
            }]
        }, {
            id: 'act_fdb_balloon',
            type: 'content-container',
            env: ['html', 'flash', 'backup'],
            css: {
                display: 'none',
                position: 'static',
                height: '20px',
                cursor: 'pointer',
                background: "url('https://s.yimg.com/rq/darla/i/fdb1.gif') no-repeat right 0",
                textDecoration: 'none'
            },
            content: [{
                id: 'act_fdb_balloon_content',
                type: 'content-container',
                env: ['html', 'flash', 'backup'],
                css: {
                    display: 'inline-block',
                    position: 'absolute',
                    right: '0px',
                    background: "url('https://s.yimg.com/rq/darla/i/fdb1.gif') no-repeat right -69px",
                    paddingRight: '20px',
                    marginRight: '10px',
                    marginTop: '-6px',
                    whiteSpace: 'nowrap'
                },
                eventConfig: [{
                    eventType: 'click',
                    actions: [{
                        type: 'containerShow',
                        id: 'act_fdb_form'
                    }]
                }],
                content: [{
                    id: 'act_fdb_balloon_text',
                    type: 'content-container',
                    env: ['html', 'flash', 'backup'],
                    css: {
                        display: 'inline-block',
                        fontSize: '11px',
                        fontFamily: "'Helvetica Neue',Helvetica,Arial,sans-serif",
                        color: '#FFFFFF',
                        webkitBorderRadius: '4px',
                        mozBorderRadius: '4px',
                        borderRadius: '4px',
                        backgroundColor: '#F16150',
                        padding: '9px'
                    },
                    containerConfig: {
                        innerText: "I don't like this ad"
                    }
                }]
            }]
        }]
    };
    var FORM_DOM_STRUCTURE = {
        id: FORM_CONTAINER_ID,
        type: 'content-container',
        env: ['html', 'flash', 'backup'],
        css: {
            fontFamily: "'Helvetica Neue',Helvetica,Arial,sans-serif",
            width: '300px',
            height: '250px',
            color: 'rgb(63, 63, 63)',
            position: 'absolute',
            top: '0px',
            border: '1px solid rgb(229, 229, 233)',
            fontWeight: '300',
            overflow: 'hidden',
            display: 'none',
            textAlign: 'left',
            direction: 'ltr',
            boxSizing: 'border-box',
            background: 'rgb(250, 250, 253)'
        },
        content: [{
            id: 'fdb_wrapper',
            type: 'content-container',
            env: ['html', 'flash', 'backup'],
            css: {
                fontFamily: "'Helvetica Neue',Helvetica,Arial,sans-serif",
                height: '100%',
                width: '100%',
                position: 'relative',
                display: 'inline-block',
                bottom: '0px',
                webkitBoxSizing: 'border-box',
                mozBoxSizing: 'border-box',
                boxSizing: 'border-box'
            },
            content: [{
                id: 'fdb_srvy_title',
                type: 'content-container',
                env: ['html', 'flash', 'backup'],
                css: {
                    display: 'block',
                    fontFamily: "'Helvetica Neue',Helvetica,Arial,sans-serif",
                    fontSize: '16px',
                    fontWeight: '300',
                    whiteSpace: 'normal',
                    textAlign: 'left',
                    color: '#3f3f3f',
                    padding: '15px',
                    lineHeight: '18px'
                },
                containerConfig: {
                    innerText: "What don't you like about this ad?"
                }
            }, {
                id: 'fdb_srvy_thankyou_text',
                type: 'content-container',
                env: ['html', 'flash', 'backup'],
                css: {
                    display: 'none',
                    fontFamily: "'Helvetica Neue',Helvetica,Arial,sans-serif",
                    fontSize: '16px',
                    fontWeight: '300',
                    whiteSpace: 'normal',
                    textAlign: 'left',
                    color: '#3f3f3f',
                    padding: '15px',
                    lineHeight: '18px'
                },
                containerConfig: {
                    innerText: 'Thank you for helping us improve your Yahoo experience'
                }
            }, {
                id: 'fdb_srvy_buttons',
                type: 'content-container',
                env: ['html', 'flash', 'backup'],
                css: {
                    display: 'block',
                    position: 'relative',
                    background: '#fafafc',
                    textAlign: 'left'
                },
                content: [{
                    id: 'fdb_srvy_button',
                    type: 'content-container',
                    env: ['html', 'flash', 'backup'],
                    css: {
                        padding: '3px 0px 3px',
                        display: 'inline-block',
                        textAlign: 'left',
                        cursor: 'pointer',
                        marginLeft: '15px',
                        marginBottom: '10px',
                        width: '250px',
                        height: '25px'
                    },
                    content: [{
                        id: 'fdb_srvy_answers_one_label',
                        type: 'content-container',
                        env: ['html', 'flash', 'backup'],
                        containerConfig: {
                            innerText: '<input name="option" style="margin-right:10px;float:left;" type="radio">'
                        },
                        eventConfig: [{
                            eventType: 'click',
                            actions: [{
                                type: 'trackAdfeedback',
                                interactionType: 'fdb_submit',
                                suboption: 5
                            }, {
                                type: 'containerHide',
                                id: 'fdb_srvy_buttons'
                            }, {
                                type: 'containerHide',
                                id: 'fdb_srvy_title'
                            }, {
                                type: 'containerHide',
                                id: 'fdb_srvy_why_text'
                            }, {
                                type: 'containerHide',
                                id: 'fdb_srvy_done'
                            }, {
                                type: 'containerShow',
                                id: 'fdb_srvy_thankyou_text'
                            }, {
                                type: 'containerShow',
                                id: 'fdb_srvy_learn_text'
                            }, {
                                type: 'containerStopProcesses'
                            }]
                        }]
                    }, {
                        id: 'fdb_srvy_answers_one',
                        type: 'content-container',
                        env: ['html', 'flash', 'backup'],
                        css: {
                            fontFamily: "'Helvetica Neue',Helvetica,Arial,sans-serif",
                            fontSize: '12px',
                            fontWeight: '300',
                            display: 'inline-block',
                            color: '#3f3f3f',
                            whiteSpace: 'normal',
                            width: '76%',
                            marginTop: '2px'
                        },
                        containerConfig: {
                            innerText: "It's distracting"
                        }
                    }]
                }, {
                    id: 'fdb_srvy_button',
                    type: 'content-container',
                    env: ['html', 'flash', 'backup'],
                    css: {
                        padding: '3px 0px 3px',
                        display: 'inline-block',
                        textAlign: 'left',
                        cursor: 'pointer',
                        marginLeft: '15px',
                        marginBottom: '10px',
                        width: '250px',
                        height: '25px'
                    },
                    content: [{
                        id: 'fdb_srvy_answers_two_label',
                        type: 'content-container',
                        env: ['html', 'flash', 'backup'],
                        containerConfig: {
                            innerText: '<input name="option" style="margin-right:10px;float:left;" type="radio" >'
                        },
                        eventConfig: [{
                            eventType: 'click',
                            actions: [{
                                type: 'trackAdfeedback',
                                interactionType: 'fdb_submit',
                                suboption: 4
                            }, {
                                type: 'containerHide',
                                id: 'fdb_srvy_buttons'
                            }, {
                                type: 'containerHide',
                                id: 'fdb_srvy_title'
                            }, {
                                type: 'containerHide',
                                id: 'fdb_srvy_why_text'
                            }, {
                                type: 'containerHide',
                                id: 'fdb_srvy_done'
                            }, {
                                type: 'containerShow',
                                id: 'fdb_srvy_thankyou_text'
                            }, {
                                type: 'containerShow',
                                id: 'fdb_srvy_learn_text'
                            }, {
                                type: 'containerStopProcesses'
                            }]
                        }]
                    }, {
                        id: 'fdb_srvy_answers_two',
                        type: 'content-container',
                        env: ['html', 'flash', 'backup'],
                        css: {
                            fontFamily: "'Helvetica Neue',Helvetica,Arial,sans-serif",
                            fontSize: '12px',
                            fontWeight: '300',
                            display: 'inline-block',
                            color: '#3f3f3f',
                            whiteSpace: 'normal',
                            width: '76%',
                            marginTop: '2px'
                        },
                        containerConfig: {
                            innerText: "It's not relevant"
                        }
                    }]
                }, {
                    id: 'fdb_srvy_button',
                    type: 'content-container',
                    env: ['html', 'flash', 'backup'],
                    css: {
                        padding: '3px 0px 3px',
                        display: 'inline-block',
                        textAlign: 'left',
                        cursor: 'pointer',
                        marginLeft: '15px',
                        marginBottom: '10px',
                        width: '250px',
                        height: '25px'
                    },
                    content: [{
                        id: 'fdb_srvy_answers_three_label',
                        type: 'content-container',
                        env: ['html', 'flash', 'backup'],
                        containerConfig: {
                            innerText: '<input name="option" style="margin-right:10px;float:left;" type="radio">'
                        },
                        eventConfig: [{
                            type: 'trackAdfeedback',
                            interactionType: 'fdb_submit',
                            suboption: 1
                        }, {
                            eventType: 'click',
                            actions: [{
                                type: 'containerHide',
                                id: 'fdb_srvy_buttons'
                            }, {
                                type: 'containerHide',
                                id: 'fdb_srvy_title'
                            }, {
                                type: 'containerHide',
                                id: 'fdb_srvy_why_text'
                            }, {
                                type: 'containerHide',
                                id: 'fdb_srvy_done'
                            }, {
                                type: 'containerShow',
                                id: 'fdb_srvy_thankyou_text'
                            }, {
                                type: 'containerShow',
                                id: 'fdb_srvy_learn_text'
                            }, {
                                type: 'containerStopProcesses'
                            }]
                        }]
                    }, {
                        id: 'fdb_srvy_answers_three',
                        type: 'content-container',
                        env: ['html', 'flash', 'backup'],
                        css: {
                            fontFamily: "'Helvetica Neue',Helvetica,Arial,sans-serif",
                            fontSize: '12px',
                            fontWeight: '300',
                            display: 'inline-block',
                            color: '#3f3f3f',
                            whiteSpace: 'normal',
                            width: '76%',
                            marginTop: '2px'
                        },
                        containerConfig: {
                            innerText: "It's offensive"
                        }
                    }]
                }, {
                    id: 'fdb_srvy_button',
                    type: 'content-container',
                    env: ['html', 'flash', 'backup'],
                    css: {
                        padding: '3px 0px 3px',
                        display: 'inline-block',
                        textAlign: 'left',
                        cursor: 'pointer',
                        marginLeft: '15px',
                        marginBottom: '10px',
                        width: '250px',
                        height: '25px'
                    },
                    content: [{
                        id: 'fdb_srvy_answers_four_label',
                        type: 'content-container',
                        env: ['html', 'flash', 'backup'],
                        containerConfig: {
                            innerText: '<input name="option" style="margin-right:10px;float:left;" type="radio" >'
                        },
                        eventConfig: [{
                            eventType: 'click',
                            actions: [{
                                type: 'containerHide',
                                id: 'fdb_srvy_buttons'
                            }, {
                                type: 'containerHide',
                                id: 'fdb_srvy_why_text'
                            }, {
                                type: 'containerHide',
                                id: 'fdb_srvy_done'
                            }, {
                                type: 'containerShow',
                                id: 'fdb_details_container'
                            }, {
                                type: 'containerHide',
                                id: 'fdb_srvy_learn_text'
                            }, {
                                type: 'containerStopProcesses'
                            }]
                        }]
                    }, {
                        id: 'fdb_srvy_answers_four',
                        type: 'content-container',
                        env: ['html', 'flash', 'backup'],
                        css: {
                            fontFamily: "'Helvetica Neue',Helvetica,Arial,sans-serif",
                            fontSize: '12px',
                            fontWeight: '300',
                            display: 'inline-block',
                            color: '#3f3f3f',
                            whiteSpace: 'normal',
                            width: '76%',
                            marginTop: '2px'
                        },
                        containerConfig: {
                            innerText: 'Something else'
                        }
                    }]
                }]
            }, {
                id: 'fdb_details_container',
                type: 'content-container',
                env: ['html', 'flash', 'backup'],
                css: {
                    display: 'none',
                    position: 'relative',
                    width: '270px',
                    height: '45%',
                    marginLeft: '15px'
                },
                content: [{
                    id: 'fdb_details_textarea',
                    type: 'content-container',
                    env: ['html', 'flash', 'backup'],
                    css: {},
                    containerConfig: {
                        innerText: '<textarea id="act_fdb_textarea" maxlength="512" autofocus="autofocus" id="fdb_srvy_details" ' +
                                    'style="font-family:\'Helvetica Neue\',Helvetica,Arial,sans-serif;position:absolute;height:100%;' +
                                    'width:100%;text-align:left;border:1px solid #ccc;font-size:13px;font-weight:300;color:#3f3f3f;resize:none;' +
                                    '-webkit-box-sizing:border-box;-moz-box-sizing:border-box;box-sizing:border-box;"></textarea>'
                    }
                }, {
                    id: 'fdb_srvy_details_submit',
                    type: 'content-container',
                    env: ['html', 'flash', 'backup'],
                    css: {
                        display: 'block',
                        fontFamily: "'Helvetica Neue',Helvetica,Arial,sans-serif",
                        backgroundColor: '#6c50a4',
                        webkitBoxShadow: 'inset 0px -2px 0px #463763',
                        mozBoxShadow: 'inset 0px -2px 0px #463763',
                        boxShadow: 'inset 0px -2px 0px #463763',
                        webkitBorderRadius: '5px',
                        mozBorderRadius: '5px',
                        borderRadius: '5px',
                        border: '0',
                        color: '#FFFFFF',
                        padding: '8px 11px',
                        fontSize: '14px',
                        minWidth: '72px',
                        fontWeight: '300',
                        cursor: 'pointer',
                        position: 'absolute',
                        whiteSpace: 'nowrap',
                        top: '100%',
                        marginTop: '15px'
                    },
                    containerConfig: {
                        innerText: 'Send'
                    },
                    eventConfig: [{
                        eventType: 'click',
                        actions: [{
                            type: 'trackAdfeedback',
                            interactionType: 'fdb_submit',
                            suboption: 2,
                            commentNodeId: 'act_fdb_textarea'
                        }, {
                            type: 'containerHide',
                            id: 'fdb_details_container'
                        }, {
                            type: 'containerHide',
                            id: 'fdb_srvy_title'
                        }, {
                            type: 'containerHide',
                            id: 'fdb_srvy_why_text'
                        }, {
                            type: 'containerShow',
                            id: 'fdb_srvy_thankyou_text'
                        }, {
                            type: 'containerShow',
                            id: 'fdb_srvy_learn_text'
                        }]
                    }]
                }]
            }, {
                id: 'fdb_srvy_why_text',
                type: 'content-container',
                env: ['html', 'flash', 'backup'],
                css: {
                    display: 'block',
                    position: 'absolute',
                    bottom: '7px',
                    marginLeft: '15px',
                    color: '#BAB9B9',
                    textDecoration: 'none',
                    fontSize: '12px'
                },
                containerConfig: {
                    innerText: 'Why do I see ads?'
                },
                eventConfig: [{
                    eventType: 'click',
                    actions: [{
                        type: 'openURL',
                        id: 'adfeedback_open_why_url',
                        URLpath: 'https://www.yahoo.com',
                        URLname: 'adfeedback_open_why_url'
                    }]
                }]
            }, {
                id: 'fdb_srvy_done',
                type: 'content-container',
                env: ['html', 'flash', 'backup'],
                css: {
                    fontFamily: "'Helvetica Neue',Helvetica,Arial,sans-serif",
                    position: 'absolute',
                    bottom: '7px',
                    right: '10px',
                    fontSize: '12px',
                    cursor: 'pointer',
                    textDecoration: 'none',
                    color: '#6c50a4',
                    fontWeight: '900'
                },
                eventConfig: [{
                    eventType: 'click',
                    actions: [{
                        type: 'containerHide',
                        id: 'fdb_srvy_buttons'
                    }, {
                        type: 'containerHide',
                        id: 'fdb_srvy_title'
                    }, {
                        type: 'containerHide',
                        id: 'fdb_srvy_why_text'
                    }, {
                        type: 'containerHide',
                        id: 'fdb_srvy_done'
                    }, {
                        type: 'containerShow',
                        id: 'fdb_srvy_thankyou_text'
                    }, {
                        type: 'containerShow',
                        id: 'fdb_srvy_learn_text'
                    }, {
                        type: 'containerStopProcesses'
                    }]
                }],
                containerConfig: {
                    innerText: 'Done'
                }
            }, {
                id: 'fdb_srvy_learn_text',
                type: 'content-container',
                env: ['html', 'flash', 'backup'],
                css: {
                    display: 'none',
                    marginTop: '15px',
                    color: '#BAB9B9',
                    textDecoration: 'none',
                    fontSize: '12px',
                    marginLeft: '15px',
                    whiteSpace: 'normal'
                },
                containerConfig: {
                    innerText: 'Learn more about your feedback.'
                },
                eventConfig: [{
                    eventType: 'click',
                    actions: [{
                        type: 'openURL',
                        id: 'adfeedback_open_learn_url',
                        URLpath: 'https://www.yahoo.com',
                        URLname: 'adfeedback_open_learn_url'
                    }]
                }]
            }]
        }]
    };
    var EVENT_ADFEEDBACK_ENABLE = 'adfeedback:enable';
    var EVENT_ADFEEDBACK_ENABLE_INIT = 'adfeedback:enableInit';
    var EVENT_ADFEEDBACK_DISABLE_INIT = 'adfeedback:disableInit';
    var EVENT_ADFEEDBACK_INTERACTION_TRACK = 'adfeeback:interactionTrack';
    var EVENT_GLOBAL_CHECK_ACTION_CONDITION = 'standardAd:checkActionCondition';
    var EVENT_GLOBAL_ACTION_COMPLETE = 'complete:action';

    var DEFAULT_ACTION_TRIGGERS = [
        'adfeedbackEnabled',
        'adfeedbackDisabled'
    ];

    var contentActions = [{
        type: 'disableAdFeedbackInit',
        argument: {
            timeout: {
                name: 'timeout',
                test: function (value) {
                    return Lang.isNumber(value) || value === undefined || value === null;
                }
            }
        },
        process: function (actionId) {
            Event.fire(EVENT_ADFEEDBACK_DISABLE_INIT, actionId);
        }
    }, {
        type: 'enableAdFeedbackInit',
        argument: {
            timeout: {
                name: 'timeout',
                test: function (value) {
                    return Lang.isNumber(value) || value === undefined || value === null;
                }
            }
        },
        process: function (actionId) {
            Event.fire(EVENT_ADFEEDBACK_ENABLE_INIT, actionId);
        }
    }, {
        type: 'enableAdFeedback',
        argument: {
            timeout: {
                name: 'timeout',
                test: function (value) {
                    return Lang.isNumber(value) || value === undefined || value === null;
                }
            }
        },
        process: function (actionId) {
            Event.fire(EVENT_ADFEEDBACK_ENABLE, actionId);
        }
    }, {
        type: 'trackAdfeedback',
        argument: {
            interactionType: {
                name: 'interactionType',
                test: function (value) {
                    return Lang.isString(value);
                }
            },
            // TODO: Figure out proper inputs for suboption and commentNodeId - string / number
            suboption: {
                name: 'suboption',
                test: function (value) {
                    return Lang.isNumber(value) || Lang.isString(value) || value === undefined || value === null;
                }
            },
            commentNodeId: {
                name: 'commentNodeId',
                test: function (value) {
                    return Lang.isNumber(value) || Lang.isString(value) || value === undefined || value === null;
                }
            },
            timeout: {
                name: 'timeout',
                test: function (value) {
                    return Lang.isNumber(value) || value === undefined || value === null;
                }
            }
        },
        process: function (actionId, args) {
            Event.fire(EVENT_ADFEEDBACK_INTERACTION_TRACK, {
                interactionType: args.interactionType,
                suboption: args.suboption,
                commentNodeId: args.commentNodeId,
                done: function () {
                    Event.fire(EVENT_GLOBAL_ACTION_COMPLETE, actionId);
                }
            });
        }
    }];

    /**
     * @class ContentCarousel
     * @constructor
     */
    function ContentAdfeedback(config) {
        this.init(config);
    }

    ContentAdfeedback.ATTRS = {
        /**
         * @attribute NAME
         * @type String
         */
        NAME: 'ContentAdfeedback',

        /**
         * @attribute version
         * @type String
         */
        version: '1.0.22',

        /**
         * @attribute triggerNode
         * @type String
         */
        triggerNode: 'act-ad',

        /**
         * @attribute node
         * @type HTMLElement
         */
        node: null
    };

    /**
     * Returns a modified fdb url string with custom component removed
     *
     * @method retrieveFdbUrl
     * @private
     * @param {String} urlStr Feedback URL string
     * @return {String} urlStr modified
     */
    function retrieveFdbUrl(urlStr) {
        var urlArr = [];
        var newArr = [];
        var i;
        urlArr = urlStr.split('&');
        for (i = 0; i < urlArr.length; i++) {
            if (urlArr[i].indexOf('al=') === -1) {
                newArr.push(urlArr[i]);
            }
        }
        return newArr.join('&');
    }

    /**
     * Returns an encoded string
     *
     * @method fixedEncodeURIComponent
     * @private
     * @param {String} str unencoded string
     * @return {String} str encoded string
     */
    function fixedEncodeURIComponent(str) {
        var escape;
        return encodeURIComponent(str).replace(/[!'()]/g, escape).replace(/\*/g, '%2A');
    }

    /**
     * Subscribe trigger action to the container's listeners
     *
     * @method subscribeTriggerToAdfeedbackEvent
     * @private
     * @param {String} action, action to fire
     */
    function subscribeTriggerToAdfeedbackEvent(actionConfig) {
        Event.on(actionConfig.eventType, function () {
            Event.fire(EVENT_GLOBAL_CHECK_ACTION_CONDITION, {
                actionConfig: actionConfig,
                callback: function (isExecutable) {
                    if (isExecutable) {
                        Event.fire('add:actions', actionConfig.actions);
                    }
                }
            });
        });
    }

    /**
     * Attach action for an event
     *
     * @method attachEventActions
     * @private
     * @param {String} eventConfig, list of event
     */
    function attachEventActions(eventConfig) {
        var name;
        var action;
        if (typeof eventConfig !== 'object') {
            return;
        }
        for (name in eventConfig) {
            /* istanbul ignore else */
            if (eventConfig.hasOwnProperty(name)) {
                action = eventConfig[name];
                if (Lang.arrayIndexOf(DEFAULT_ACTION_TRIGGERS, action.eventType) !== -1) {
                    subscribeTriggerToAdfeedbackEvent(action);
                }
            }
        }
    }
    /**
     * Modifies the defined adfeedback close button CSS
     *
     * @method toggleCloseBtn
     * @private
     * @param {Object} displayStyle
     */
    function toggleCloseBtn(displayStyle) {
        var closeBtn = Dom.byId(CLOSE_BTN_CONTAINER_ID);
        if (closeBtn) {
            Dom.applyStyles(closeBtn, displayStyle);
        }
    }

    /* Public methods */
    Lang.extend(ContentAdfeedback, [Class, Capability], {

        /**
         * Function auto initiated when the class is instantiated
         * @method initializer
         * @param {Object} config
         */
        initializer: function (config) {
            var strippedUrl;
            var placementConfig;

            this.set('configObject', config);

            this.setConfig();
            placementConfig = this.get('placement_config');


            if (placementConfig !== undefined && placementConfig.fdb_on === '1') {
                strippedUrl = retrieveFdbUrl(placementConfig.fdb_url);

                placementConfig.fdb_url = strippedUrl;
                this.set('placement_config', placementConfig);

                BUTTON_DOM_STRUCTURE = this.parseElement(BUTTON_DOM_STRUCTURE);
                FORM_DOM_STRUCTURE = this.parseElement(FORM_DOM_STRUCTURE);

                attachEventActions(config.eventConfig);
            }

            this.initializeListeners(config);
            Event.fire('register:Actions', contentActions);
        },

        /**
         * Sets the instances ATTRS
         *
         * @method setConfig
         */
        setConfig: function () {
            var attr;
            if (Lang.isObject(this.get('configObject').AdfeedbackConfig)) {
                for (attr in this.get('configObject').AdfeedbackConfig) {
                    /* istanbul ignore else */
                    if (this.get('configObject').AdfeedbackConfig.hasOwnProperty(attr)) {
                        this.set(attr, this.get('configObject').AdfeedbackConfig[attr]);
                    }
                }
            }
        },

        /**
         * Function to initialize event listeners for this instance
         *
         * @method initializeListeners
         */
        initializeListeners: function () {
            var root = this;

            root.initializeCloseBtnListeners();
            /* istanbul ignore next */
            root.addEventListeners(
                Event.on(EVENT_ADFEEDBACK_ENABLE_INIT, function (actionId) {
                    root.initializeCloseBtnListeners();
                    Event.fire(EVENT_GLOBAL_ACTION_COMPLETE, actionId);
                }),

                Event.on(EVENT_ADFEEDBACK_DISABLE_INIT, function (actionId) {
                    toggleCloseBtn({
                        display: 'none'
                    });
                    TRIGGERNODE_MOUSEENTER_EVENT.remove();
                    TRIGGERNODE_MOUSELEAVE_EVENT.remove();
                    Event.fire(EVENT_GLOBAL_ACTION_COMPLETE, actionId);
                }),
                Event.on(EVENT_ADFEEDBACK_ENABLE, function (actionId) {
                    root.enableAdfeedback();
                    Event.fire(EVENT_GLOBAL_ACTION_COMPLETE, actionId);
                }),

                Event.on(EVENT_ADFEEDBACK_INTERACTION_TRACK, function (eventData) {
                    root.interaction_track(eventData.interactionType, eventData.suboption, eventData.commentNodeId, eventData.done);
                })
            );
        },

        /**
         * Function to initialize close button event listeners for this instance
         *
         * @method initializeCloseBtnListeners
         */
        initializeCloseBtnListeners: function () {
            var root = this;
            var triggerNode = Dom.byId(root.get('triggerNode'));

            if (triggerNode) {
                TRIGGERNODE_MOUSEENTER_EVENT = Event.on('mouseenter', function () {
                    toggleCloseBtn({
                        display: 'inline-block'
                    });
                    root.interaction_track('fdb_movr_ad', null, null, null);
                }, triggerNode);

                TRIGGERNODE_MOUSELEAVE_EVENT = Event.on('mouseleave', function () {
                    toggleCloseBtn({
                        display: 'none'
                    });
                }, triggerNode);
            }
        },

        /**
         * Render the node from given config object, environment and orientation state
         *
         * @method renderContent
         * @param {Object} configObject
         * @param {String} env
         * @param {String} orientation
         * @return {HTMLElement} node
         */
        renderContent: function (configObject) {
            var node = document.createElement('div');
            node = this.applyNodeConfig(node, configObject);
            return node;
        },

        /**
         * Function to return the generated node for ACT Scaffolding
         * @method getContent
         * @param {String} env Environment for rendering content such as html/flash/backup
         * @param {String} orientation Orientation of current device such as landscape and portraits for mobile
         * @return {Object} node and contentConfig
         */
        getContent: function (env, orientation) {
            var root = this;
            var placementConfig = root.get('placement_config');
            var contentConfig;
            var node;

            if (placementConfig !== undefined && placementConfig.fdb_on === '1') {
                node = this.renderContent(root.get('configObject'), env, orientation);
                this.set('node', node);
                contentConfig = root.getNodeContentConfig();
                return {
                    content: contentConfig,
                    node: node
                };
            }
            return false;
        },

        /**
         * Function to return pre-defined content configuration of the capability node.
         * @method getNodeContentConfig
         */
        getNodeContentConfig: function () {
            var contentConfig = [BUTTON_DOM_STRUCTURE, FORM_DOM_STRUCTURE];
            return contentConfig;
        },

        /**
         * Function to set translated content for the specified node
         * @method modifyTranslations
         * @param {Object} container
         */
        modifyTranslations: function (container) {
            var text;
            var translations = this.get('translation_config');
            for (text in translations) {
                /* istanbul ignore else */
                if (translations.hasOwnProperty(text)) {
                    if (container.id === text) {
                        container.containerConfig.innerText = translations[text];
                    }
                }
            }
        },

        /**
         * Function to set clickthrough url specified in config
         * @method setClickthrough
         * @param {Object} container
         */
        setClickthrough: function (action) {
            var root = this;
            var clickthroughs = root.get('url_config');
            var urlId;
            for (urlId in clickthroughs) {
                /* istanbul ignore else */
                if (clickthroughs.hasOwnProperty(urlId)) {
                    if (urlId === action.id) {
                        action.URLpath = clickthroughs[urlId];
                    }
                }
            }
            return action;
        },

        /**
         * Function to set clickthrough content for the specified node
         * @method modifyClickthroughs
         * @param {Object} container
         */
        modifyClickthroughs: function (container) {
            var root = this;
            var eventData;
            var i;
            var newAction;
            if (container.eventConfig) {
                for (eventData in container.eventConfig) {
                    if (Lang.isArray(container.eventConfig[eventData].actions)) {
                        for (i = 0; i < container.eventConfig[eventData].actions.length; i++) {
                            newAction = root.setClickthrough(container.eventConfig[eventData].actions[i]);
                            container.eventConfig[eventData].actions[i] = newAction;
                        }
                    }
                }
            }
        },

        /**
         * Function to fetch and assign the child content of a container
         * @method fetchChildren
         * @param {Object} container
         * @param {Object} chidrenObj
         * @return {Object} container with children
         */
        fetchChildren: function (container, childrenObj) {
            var i;
            for (i = 0; i < childrenObj.length; i++) {
                container[childrenObj[i].id] = this.parseElement(childrenObj[i]);
            }
            return container;
        },

        /**
         * Function to traverse through a container and perform actions, returning the parsed containerConfig
         * @method parseElement
         * @param {Object} containerConfig
         * @return {Object} containerConfig
         */
        parseElement: function (containerConfig) {
            this.modifyTranslations(containerConfig);
            this.modifyClickthroughs(containerConfig);

            if (Lang.isObject(containerConfig.content)) {
                containerConfig = this.fetchChildren(containerConfig, containerConfig.content);
            }
            return containerConfig;
        },

        enableAdfeedback: function () {
            var enableActions = [{
                type: 'containerShow',
                id: FORM_CONTAINER_ID
            }];
            Event.fire('add:actions', enableActions);
            Event.fire('adfeedbackEnabled');
        },

        /**
         * Interaction tracking function
         * @param {String} TrackString ID
         * @method interaction_track
         * @public
         */
        interaction_track: function (type, suboption, commentNodeId, done) {
            var config = this.get('placement_config');
            var trackString = (type || '');
            var fdbStr = '';
            var cmnt;
            var commentInput;

            if (config !== undefined && config.fdb_url !== undefined && trackString.length > 4) {
                fdbStr = config.fdb_url + '&al=(type$' + type;
                if (suboption !== undefined && suboption >= 0 && suboption !== null) {
                    if (commentNodeId !== undefined && suboption === 2 && commentNodeId && commentNodeId !== false) {
                        commentInput = Dom.byId(commentNodeId).value;
                        cmnt = fixedEncodeURIComponent(commentInput);
                        fdbStr += ',cmnt$' + cmnt;
                    }
                    fdbStr += ',subo$' + suboption;
                }
                fdbStr += ')r=10';

                Util.pixelTrack(fdbStr);
            }

            if (done) {
                done();
            }
        },

        /**
         * Function to be called when the instance is destroyed
         *
         * @method destructor
         */
        destructor: function () {
            var node = this.get('node');
            var nodeDom;
            if (Dom.isDomElement(node) && node.id !== undefined) {
                nodeDom = Dom.byId(node.id);
                nodeDom.parentNode.removeChild(nodeDom);
            }
        }
    });

    return ContentAdfeedback;
});
