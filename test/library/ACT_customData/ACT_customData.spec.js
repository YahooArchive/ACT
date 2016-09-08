var expect = chai.expect;

describe("ACT.CustomData", function() {
	
    describe("map function", function(){
        var ad;
        var customData;
        var superConf;

        before(function() {

        	superConf = {
    		    baseConfig: {
			        forceEnv: {
			            forcedFlashList: {
			                Chrome: "*",
			                FireFox: "*",
			                Safari: "*",
			                MSIE: "*"
			            },
			            forcedHTML5List: {},
			            forcedBackupList: {}
			        }
			    },
    		    format: {
    				darlaLayer: {
			            holder: {
			                "contractedWidth": "300",
			                "contractedHeight": "250"
			            }
			        },
	    			flow: 
	    				[
	                		{
		                		eventType: "firstPlay",
		                		actions: [
		                			{
					                    "type": "playLayer",
					                    "id":"action1",
					                    "to": "mpu",
					                    "animate": false
				                	}, 
					                {
					                    "type": "track",
					                    "id":"action5",
					                    "label": "floating_firstplay_ad_html"
					                }
		            			]
	        				}
	        			],
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
			                    type: "content-container",
			                    id: "mpu_container",
			                    env: ["flash", "html", "backup"],
			                    content: [{
			                            id: "container_1_1",
			                            type: "content-container",
			                            env: ['backup'],
			                            css: {
			                                width: '300px',
			                                height: '250px',
			                                background: 'blue',
			                                'text-color': '#fff'
			                            },
			                            eventConfig: [
				                                {
				                                eventType: "click",
				                                actions: [

				                                {
				                                    "type": "expandInlineFrame",
				                                    "id":"action15",
				                                    "top": 200,
				                                    "right": 0,
				                                    "bottom": 0,
				                                    "left": 470,
				                                    "push": false
				                                }, 
				                                {
				                                    "type": "playLayer",
				                                    "id":"action16",
				                                    "to": "expandable"
				                                }
			                                ]
			                            }],
			                            containerConfig: {
			                                innerText: 'MPU container, click to open expandable'
			                            }
			                        } 
			                       
			                    ]
			                }
			            }
	         
	        		}
	    		}
	        };

        });

		it("should map layer data with correctly specified customData", function(){

        	var customData = {
        	  "layers.mpu.width": "400px",
              "layers.mpu.container_1_1.css.height" : "500px",
              "layers.mpu.container_1_1.env" : ['flash']
            };

			var configResult = ACT.CustomData.map(customData, superConf);
			expect(configResult.format.layers.mpu.width).to.equal(customData["layers.mpu.width"]);
			expect(configResult.format.layers.mpu.contentLayer.content[0].css.height).to.equal(customData["layers.mpu.container_1_1.css.height"]);
			expect(configResult.format.layers.mpu.contentLayer.content[0].env).to.equal(customData["layers.mpu.container_1_1.env"]);
		});

		it("should map forceEnv data with correctly specified customData", function(){

        	var customData = {
              "forceEnv.forcedFlashList.MSIE": "<=9",
            };


			var configResult = ACT.CustomData.map(customData, superConf);
			expect(configResult.baseConfig.forceEnv.forcedFlashList.MSIE).to.equal("<=9");

		});

		it("should map forceEnv data with customData set as object", function(){

        	var customData = {
               "forceEnv.forcedHTML5List": {"Chrome":"<=9"}
            };


			var configResult = ACT.CustomData.map(customData, superConf);
			expect(configResult.baseConfig.forceEnv.forcedHTML5List.Chrome).to.equal("<=9");

		});

		it("should map darlaLayer data with correctly specified customData", function(){

        	var customData = {
              "darlaLayer.contractedWidth": "382"
            };

			var configResult = ACT.CustomData.map(customData, superConf);
			expect(configResult.format.darlaLayer.holder.contractedWidth).to.equal(customData["darlaLayer.contractedWidth"]);

		});

		it("should map flow action data with correctly specified customData", function(){

        	var customData = {
              "flow.action5.label": "floating_firstplay_ad_flash"
            };

			var configResult = ACT.CustomData.map(customData, superConf);
			expect(configResult.format.flow[0].actions[1].label).to.equal(customData["flow.action5.label"]);

		});

		it("should not map flow action data with invalid attribute in customData", function(){

        	var customData = {
              "flow.action1.id": "mihuevos"
            };

			var configResult = ACT.CustomData.map(customData, superConf);
			expect(configResult.format.flow[0].actions[0].id).to.not.equal(customData["flow.action1.id"]);

		});

		it("should not map incorrectly defined events with correctly specified customData", function(done){

        	var customData = {
              "flow.action5.label": "floating_firstplay_ad_flash"
            };

			var invalidEventSuperConf = {
    		    baseConfig: {
			        forceEnv: {
			            forcedFlashList: {
			                Chrome: "*",
			                FireFox: "*",
			                Safari: "*",
			                MSIE: "*"
			            },
			            forcedHTML5List: {},
			            forcedBackupList: {}
			        }
			    },
    		    format: {
    				darlaLayer: {
			            holder: {
			                "contractedWidth": "300",
			                "contractedHeight": "250"
			            }
			        },
	    			flow: {
		                		eventType: "firstPlay",
		                		actions: [
		                			{
					                    "type": "playLayer",
					                    "id":"action1",
					                    "to": "mpu",
					                    "animate": false
				                	}, 
					                {
					                    "type": "track",
					                    "id":"action5",
					                    "label": "floating_firstplay_ad_html"
					                }
		            			]
	        				}
	        			
	    		}
	        };

        	sinon.stub(ACT.Debug, 'log', function(data){
        		if(data === "[ ACT_customData.js ]: ERROR: target does not have events"){
        			ACT.Debug.log.restore();
        			done();
        		}
        	});


			var configResult = ACT.CustomData.map(customData, invalidEventSuperConf);

		});

		it("should not map illegal attribute data", function(){

			var customData = {
              "layers.mpu.mpu_container.id" : "billboard_container",
         	  "layers.mpu.width.width" : "600px"
            };

			var configResult = ACT.CustomData.map(customData, superConf);
			expect(configResult.format.layers.mpu.width).to.not.equal(customData["layers.mpu.width.width"]);
			expect(configResult.format.layers.mpu.contentLayer.content[0].id).to.not.equal("billboard_container");

		});

	});

	describe("JSON function", function(){

		it("should map feed information into customData if configured correctly", function(){

        	var customData = {
              	"layers.mpu.container_1_1.containerConfig.innerText" : "myYT.blog.title"
            };

            var inputData = {
            	id: "myYT",
            	"blog": {
            		"title": "Winter Adventures"
            	}		
            };

			var configResult = ACT.CustomData.inputOntoCustomDataJSON("myYT", customData, inputData);
			
			expect(configResult["layers.mpu.container_1_1.containerConfig.innerText"]).to.equal(inputData.blog.title);

		});

		it("should map feed information into customData if customData contains array", function(){

        	var customData = {
              	"layers.mpu.container_1_1.containerConfig.innerText" : "myYT.blog.title[0]"
            };

            var inputData = {
            	id: "myYT",
            	"blog": {
            		"title": ["Winter Adventures"]
            	}		
            };

			var configResult = ACT.CustomData.inputOntoCustomDataJSON("myYT", customData, inputData);
			
			expect(configResult["layers.mpu.container_1_1.containerConfig.innerText"]).to.equal(inputData.blog.title[0]);

		});

		it("should map feed information into customData if configured with value object", function(){

        	var customData = {
              	"layers.mpu.container_1_1.containerConfig.innerText" : {
              		value: "myYT.blog.title"
              	}
            };

            var inputData = {
            	id: "myYT",
            	"blog": {
            		"title": "Winter Adventures"
            	}		
            };

			var configResult = ACT.CustomData.inputOntoCustomDataJSON("myYT", customData, inputData);
			
			expect(configResult["layers.mpu.container_1_1.containerConfig.innerText"]).to.equal(inputData.blog.title);

		});

		it("should call a callback set in the customData", function(done){

        	var customData = {
              	"layers.mpu.container_1_1.containerConfig.innerText" : {
              		value: "myYT.blog.title",
              		callback: function(){
              			done();
              		}
              	} 
            };

            var inputData = {
            	id: "myYT",
            	"blog": {
            		"title": "Winter Adventures"
            	}		
            };

			var configResult = ACT.CustomData.inputOntoCustomDataJSON("myYT", customData, inputData);
			
			

		});

		it("should not map feed information into customData if the ID is a partial match in the customData", function(){

        	var customData = {
              	"layers.mpu.container_1_1.containerConfig.innerText" : "myYTumblr.blog.title"
            };

            var inputData = {
            	id: "myYT",
            	"blog": {
            		"title": "Winter Adventures"
            	}		
            };

			var configResult = ACT.CustomData.inputOntoCustomDataJSON("myYT", customData, inputData);
			
			expect(configResult["layers.mpu.container_1_1.containerConfig.innerText"]).to.equal("myYTumblr.blog.title");

		});

		it("should not map feed information into customData if the ID does not match in the customData", function(){

        	var customData = {
              	"layers.mpu.container_1_1.containerConfig.innerText" : "yahoo.blog.title"
            };

            var inputData = {
            	id: "myYT",
            	"blog": {
            		"title": "Winter Adventures"
            	}		
            };

			var configResult = ACT.CustomData.inputOntoCustomDataJSON("myYT", customData, inputData);
			
			expect(configResult["layers.mpu.container_1_1.containerConfig.innerText"]).to.equal("yahoo.blog.title");

		});

		it("should not map feed information into customData if the ID does not match in the customData and the customData is an object", function(){

        	var customData = {
              	"layers.mpu.container_1_1.containerConfig.innerText" : {
              		value: "yahoo.blog.title"
              	}
            };

            var inputData = {
            	id: "myYT",
            	"blog": {
            		"title": "Winter Adventures"
            	}		
            };

			var configResult = ACT.CustomData.inputOntoCustomDataJSON("myYT", customData, inputData);
			
			expect(configResult["layers.mpu.container_1_1.containerConfig.innerText"]).to.equal("yahoo.blog.title");

		});

		it("should not map feed information into customData if the customData is an invalid array", function(){

        	var customData = ["myYT.blog.title"];

            var inputData = {
            	id: "myYT",
            	"blog": {
            		"title": "Winter Adventures"
            	}		
            };

			var configResult = ACT.CustomData.inputOntoCustomDataJSON("myYT", customData, inputData);
			
			expect(configResult).to.not.equal("Winter Adventures");

		});

		it("should not map feed information into customData if customData contains invalid array", function(){

        	var customData = {
              	"layers.mpu.container_1_1.containerConfig.innerText" : "myYT.blog.title[1]"
            };

            var inputData = {
            	id: "myYT",
            	"blog": {
            		"title": ["Winter Adventures"]
            	}		
            };

			var configResult = ACT.CustomData.inputOntoCustomDataJSON("myYT", customData, inputData);
			
			expect(configResult["layers.mpu.container_1_1.containerConfig.innerText"]).to.not.equal(inputData.blog.title[0]);

		});

		it("should not map feed information into customData if customData contains invalid array", function(){

        	var customData = {
              	"layers.mpu.container_1_1.containerConfig.innerText" : "myYT.blog.title[0]"
            };

            var inputData = {
            	id: "myYT",
            	"blog": {
            		"author": "Yahoo"
            	}		
            };

			var configResult = ACT.CustomData.inputOntoCustomDataJSON("myYT", customData, inputData);
			
			expect(configResult["layers.mpu.container_1_1.containerConfig.innerText"]).to.equal(false);

		});

		it("should not map feed information into customData if the customData is not an object", function(){

        	var customData = "myYT.blog.title";

            var inputData = {
            	id: "myYT",
            	"blog": {
            		"title": "Winter Adventures"
            	}		
            };

			var configResult = ACT.CustomData.inputOntoCustomDataJSON("myYT", customData, inputData);
			
			expect(configResult).to.not.equal("Winter Adventures");

		});

	});

	
});