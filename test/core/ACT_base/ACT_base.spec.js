var expect = chai.expect;

describe('ACT.Base:', function () {

    var simpleConfig = {
	    baseConfig: {
	        forceEnv: {}
	    },
	    format: {
			flow: [],
    		layers: {
	            mpu: {
	                layerName: 'mpu',
	                base: 'act-ad',
	                type: 'inline',
	                width: '300px',
	                height: '250px',
	                x: '0',
	                y: '0',
	                contentLayer: {
	                    type: 'content-container',
	                    id: 'mpu_container',
	                    env: ['flash', 'html', 'backup'],
	                    content: []
	                }
	            }

    		}
		}
    };

    ACT.setConfig('simple-super-conf', simpleConfig);
    for (var itor = 0; itor < 20; itor++) {
    	ACT.setConfig('simple-super-conf' + itor, simpleConfig);
    }

	beforeEach(function () {
//		refreshModule('Event');
		sinon.stub(ACT.Event, 'on');
		sinon.stub(ACT.Event, 'fire');
	});

	afterEach(function () {
		ACT.Event.on.restore();
		ACT.Event.fire.restore();
	});


	describe('attributes:', function () {

		it('should have ATTRS defined', function () {
			expect(ACT.Base.ATTRS).to.exist;
		});

		it('should have ATTRS.NAME defined', function () {
			expect(ACT.Base.ATTRS.NAME).to.exist;
		});
	});

	describe('initialise of instance:', function () {

		before(function () {

			noConf = {};

			customAdConf = {
				conf: {
					adId: 'test_ad_id',
					cookie: {
						name: '${LIBRARYADID}'
					},
					tracking: {
						rB: 'https://beap-bc.yahoo.com/yc/bv=1.0.0&bs=(17go8ee5u(gid$yD7alTEwLjL99m35VVVHHiByNjYuMVVd6xoQiIHM,st$1432218394369790,si$2664532,sp$2142647235,cr$3939742532,v$2.0,aid$kOTTWArIEuE-,ct$25,ybx$jS9jIkzn3USrovO6qRYhyg,bi$280585532,mme$2946903901166084135,lng$de-de,r$1,yoo$1,agp$361430032,ap$LREC))/*',
						r0: 'https://beap-bc.yahoo.com/yc/YnY9MS4wLjAmYnM9KDE3ZzFodG1uMihnaWQkeUQ3YWxURXdMakw5OW0zNVZWVkhIaUJ5TmpZdU1WVmQ2eG9RaUlITSxzdCQxNDMyMjE4Mzk0MzY5NzkwLHNpJDI2NjQ1MzIsc3AkMjE0MjY0NzIzNSxjciQzOTM5NzQyNTMyLHYkMi4wLGFpZCRrT1RUV0FySUV1RS0sY3QkMjUseWJ4JGpTOWpJa3puM1VTcm92TzZxUlloeWcsYmkkMjgwNTg1NTMyLG1tZSQyOTQ2OTAzOTAxMTY2MDg0MTM1LGxuZyRkZS1kZSxyJDIseW9vJDEsYWdwJDM2MTQzMDAzMixhcCRMUkVDKSk/1/*',
						z1: 'https://ci.beap.ad.yieldmanager.net/reg_ci?bv=1.0.0&bs=(1434kdv95(gid$yD7alTEwLjL99m35VVVHHiByNjYuMVVd6xoQiIHM,si$2664532,sp$2142647235,bi$280585532,cr$3939742532,cpcv$0,v$2.0,st$1432218394369790))&al=(as$11vf3o7pb,aid$kOTTWArIEuE-,ct$25,id({beap_client_event}))',
						cb: '1432218394.443105'
					}
				},
				extend: {}
			};

			customAdInitConf = {
				conf: {
					adId: 'test_ad_id',
					cookie: {
						name: '${LIBRARYADID}'
					},
					tracking: {
						rB: 'https://beap-bc.yahoo.com/yc/bv=1.0.0&bs=(17go8ee5u(gid$yD7alTEwLjL99m35VVVHHiByNjYuMVVd6xoQiIHM,st$1432218394369790,si$2664532,sp$2142647235,cr$3939742532,v$2.0,aid$kOTTWArIEuE-,ct$25,ybx$jS9jIkzn3USrovO6qRYhyg,bi$280585532,mme$2946903901166084135,lng$de-de,r$1,yoo$1,agp$361430032,ap$LREC))/*',
						r0: 'https://beap-bc.yahoo.com/yc/YnY9MS4wLjAmYnM9KDE3ZzFodG1uMihnaWQkeUQ3YWxURXdMakw5OW0zNVZWVkhIaUJ5TmpZdU1WVmQ2eG9RaUlITSxzdCQxNDMyMjE4Mzk0MzY5NzkwLHNpJDI2NjQ1MzIsc3AkMjE0MjY0NzIzNSxjciQzOTM5NzQyNTMyLHYkMi4wLGFpZCRrT1RUV0FySUV1RS0sY3QkMjUseWJ4JGpTOWpJa3puM1VTcm92TzZxUlloeWcsYmkkMjgwNTg1NTMyLG1tZSQyOTQ2OTAzOTAxMTY2MDg0MTM1LGxuZyRkZS1kZSxyJDIseW9vJDEsYWdwJDM2MTQzMDAzMixhcCRMUkVDKSk/1/*',
						z1: 'https://ci.beap.ad.yieldmanager.net/reg_ci?bv=1.0.0&bs=(1434kdv95(gid$yD7alTEwLjL99m35VVVHHiByNjYuMVVd6xoQiIHM,si$2664532,sp$2142647235,bi$280585532,cr$3939742532,cpcv$0,v$2.0,st$1432218394369790))&al=(as$11vf3o7pb,aid$kOTTWArIEuE-,ct$25,id({beap_client_event}))',
						cb: '1432218394.443105'
					}
				},
				extend: {
					init: function () {
						console.log('customAdInitConf: init called');
					}
				}

			};

			customAdAdInitConf = {
				conf: {
					adId: 'test_ad_id',
					cookie: {
						name: '${LIBRARYADID}'
					},
					tracking: {
						rB: 'https://beap-bc.yahoo.com/yc/bv=1.0.0&bs=(17go8ee5u(gid$yD7alTEwLjL99m35VVVHHiByNjYuMVVd6xoQiIHM,st$1432218394369790,si$2664532,sp$2142647235,cr$3939742532,v$2.0,aid$kOTTWArIEuE-,ct$25,ybx$jS9jIkzn3USrovO6qRYhyg,bi$280585532,mme$2946903901166084135,lng$de-de,r$1,yoo$1,agp$361430032,ap$LREC))/*',
						r0: 'https://beap-bc.yahoo.com/yc/YnY9MS4wLjAmYnM9KDE3ZzFodG1uMihnaWQkeUQ3YWxURXdMakw5OW0zNVZWVkhIaUJ5TmpZdU1WVmQ2eG9RaUlITSxzdCQxNDMyMjE4Mzk0MzY5NzkwLHNpJDI2NjQ1MzIsc3AkMjE0MjY0NzIzNSxjciQzOTM5NzQyNTMyLHYkMi4wLGFpZCRrT1RUV0FySUV1RS0sY3QkMjUseWJ4JGpTOWpJa3puM1VTcm92TzZxUlloeWcsYmkkMjgwNTg1NTMyLG1tZSQyOTQ2OTAzOTAxMTY2MDg0MTM1LGxuZyRkZS1kZSxyJDIseW9vJDEsYWdwJDM2MTQzMDAzMixhcCRMUkVDKSk/1/*',
						z1: 'https://ci.beap.ad.yieldmanager.net/reg_ci?bv=1.0.0&bs=(1434kdv95(gid$yD7alTEwLjL99m35VVVHHiByNjYuMVVd6xoQiIHM,si$2664532,sp$2142647235,bi$280585532,cr$3939742532,cpcv$0,v$2.0,st$1432218394369790))&al=(as$11vf3o7pb,aid$kOTTWArIEuE-,ct$25,id({beap_client_event}))',
						cb: '1432218394.443105'
					}
				},
				extend: {
					ad_init: function () {
						return 'ad_init called';
					}
				}

			};

			standardAdConf = {
				conf: {
					adId: 'test_ad_id',
					cookie: {
						name: '${LIBRARYADID}'
					},
					tracking: {
						rB: 'https://beap-bc.yahoo.com/yc/bv=1.0.0&bs=(17go8ee5u(gid$yD7alTEwLjL99m35VVVHHiByNjYuMVVd6xoQiIHM,st$1432218394369790,si$2664532,sp$2142647235,cr$3939742532,v$2.0,aid$kOTTWArIEuE-,ct$25,ybx$jS9jIkzn3USrovO6qRYhyg,bi$280585532,mme$2946903901166084135,lng$de-de,r$1,yoo$1,agp$361430032,ap$LREC))/*',
						r0: 'https://beap-bc.yahoo.com/yc/YnY9MS4wLjAmYnM9KDE3ZzFodG1uMihnaWQkeUQ3YWxURXdMakw5OW0zNVZWVkhIaUJ5TmpZdU1WVmQ2eG9RaUlITSxzdCQxNDMyMjE4Mzk0MzY5NzkwLHNpJDI2NjQ1MzIsc3AkMjE0MjY0NzIzNSxjciQzOTM5NzQyNTMyLHYkMi4wLGFpZCRrT1RUV0FySUV1RS0sY3QkMjUseWJ4JGpTOWpJa3puM1VTcm92TzZxUlloeWcsYmkkMjgwNTg1NTMyLG1tZSQyOTQ2OTAzOTAxMTY2MDg0MTM1LGxuZyRkZS1kZSxyJDIseW9vJDEsYWdwJDM2MTQzMDAzMixhcCRMUkVDKSk/1/*',
						z1: 'https://ci.beap.ad.yieldmanager.net/reg_ci?bv=1.0.0&bs=(1434kdv95(gid$yD7alTEwLjL99m35VVVHHiByNjYuMVVd6xoQiIHM,si$2664532,sp$2142647235,bi$280585532,cr$3939742532,cpcv$0,v$2.0,st$1432218394369790))&al=(as$11vf3o7pb,aid$kOTTWArIEuE-,ct$25,id({beap_client_event}))',
						cb: '1432218394.443105'
					}
				},
				superConf: 'simple-super-conf1',
				extend: {}
			};


		});

		it('should not set data with an empty config', function () {

			var ad = ACT.Base(noConf);

			expect(ad.config.adId).to.equal(undefined);
			expect(ad.config.superConf).to.equal(null);
			expect(ad.config.standardAd).to.equal(false);
		});


		it('should set the supplied customAd config', function () {

			var ad = ACT.Base(customAdConf);

			expect(ad.config.adId).to.equal(customAdConf.conf.adId);
			expect(ad.config.cookie.name).to.equal(customAdConf.conf.cookie.name);
			expect(ad.config.tracking.cb).to.equal(customAdConf.conf.tracking.cb);
			expect(ad.config.superConf).to.equal(null);
			expect(ad.config.standardAd).to.equal(false);
		});

		it('should recognise a standard ad with supplied superConf', function () {
			var ad = ACT.Base(standardAdConf);
			expect(ad.config.standardAd).to.equal(true);
		});


		it('should run the init function when defined', function (done) {

        	sinon.stub(window.console, 'log', function (data) {
        		if (data === 'customAdInitConf: init called') {
        			window.console.log.restore();
        			done();
        		}
        	});

			var ad = ACT.Base(customAdInitConf);

		});

		it('should run an undefined ad_init function on load', function () {

			var ad = ACT.Base(customAdInitConf);
			var res = ad.ad_init();
			expect(res).to.equal(undefined);

		});

		it('should run an overwritten the ad_init function on load', function () {

			var ad = ACT.Base(customAdAdInitConf);
			var res = ad.ad_init();
			expect(res).to.equal('ad_init called');

		});


	});

	describe('register function:', function () {

		before(function () {

			customAdConf = {
				conf: {
					adId: 'test_ad_id',
					cookie: {
						name: '${LIBRARYADID}'
					},
					tracking: {
						rB: 'https://beap-bc.yahoo.com/yc/bv=1.0.0&bs=(17go8ee5u(gid$yD7alTEwLjL99m35VVVHHiByNjYuMVVd6xoQiIHM,st$1432218394369790,si$2664532,sp$2142647235,cr$3939742532,v$2.0,aid$kOTTWArIEuE-,ct$25,ybx$jS9jIkzn3USrovO6qRYhyg,bi$280585532,mme$2946903901166084135,lng$de-de,r$1,yoo$1,agp$361430032,ap$LREC))/*',
						r0: 'https://beap-bc.yahoo.com/yc/YnY9MS4wLjAmYnM9KDE3ZzFodG1uMihnaWQkeUQ3YWxURXdMakw5OW0zNVZWVkhIaUJ5TmpZdU1WVmQ2eG9RaUlITSxzdCQxNDMyMjE4Mzk0MzY5NzkwLHNpJDI2NjQ1MzIsc3AkMjE0MjY0NzIzNSxjciQzOTM5NzQyNTMyLHYkMi4wLGFpZCRrT1RUV0FySUV1RS0sY3QkMjUseWJ4JGpTOWpJa3puM1VTcm92TzZxUlloeWcsYmkkMjgwNTg1NTMyLG1tZSQyOTQ2OTAzOTAxMTY2MDg0MTM1LGxuZyRkZS1kZSxyJDIseW9vJDEsYWdwJDM2MTQzMDAzMixhcCRMUkVDKSk/1/*',
						z1: 'https://ci.beap.ad.yieldmanager.net/reg_ci?bv=1.0.0&bs=(1434kdv95(gid$yD7alTEwLjL99m35VVVHHiByNjYuMVVd6xoQiIHM,si$2664532,sp$2142647235,bi$280585532,cr$3939742532,cpcv$0,v$2.0,st$1432218394369790))&al=(as$11vf3o7pb,aid$kOTTWArIEuE-,ct$25,id({beap_client_event}))',
						cb: '1432218394.443105'
					}
				},
				extend: {}
			};

			standardAdConf = {
				conf: {
					adId: 'test_ad_id',
					cookie: {
						name: '${LIBRARYADID}'
					},
					tracking: {
						rB: 'https://beap-bc.yahoo.com/yc/bv=1.0.0&bs=(17go8ee5u(gid$yD7alTEwLjL99m35VVVHHiByNjYuMVVd6xoQiIHM,st$1432218394369790,si$2664532,sp$2142647235,cr$3939742532,v$2.0,aid$kOTTWArIEuE-,ct$25,ybx$jS9jIkzn3USrovO6qRYhyg,bi$280585532,mme$2946903901166084135,lng$de-de,r$1,yoo$1,agp$361430032,ap$LREC))/*',
						r0: 'https://beap-bc.yahoo.com/yc/YnY9MS4wLjAmYnM9KDE3ZzFodG1uMihnaWQkeUQ3YWxURXdMakw5OW0zNVZWVkhIaUJ5TmpZdU1WVmQ2eG9RaUlITSxzdCQxNDMyMjE4Mzk0MzY5NzkwLHNpJDI2NjQ1MzIsc3AkMjE0MjY0NzIzNSxjciQzOTM5NzQyNTMyLHYkMi4wLGFpZCRrT1RUV0FySUV1RS0sY3QkMjUseWJ4JGpTOWpJa3puM1VTcm92TzZxUlloeWcsYmkkMjgwNTg1NTMyLG1tZSQyOTQ2OTAzOTAxMTY2MDg0MTM1LGxuZyRkZS1kZSxyJDIseW9vJDEsYWdwJDM2MTQzMDAzMixhcCRMUkVDKSk/1/*',
						z1: 'https://ci.beap.ad.yieldmanager.net/reg_ci?bv=1.0.0&bs=(1434kdv95(gid$yD7alTEwLjL99m35VVVHHiByNjYuMVVd6xoQiIHM,si$2664532,sp$2142647235,bi$280585532,cr$3939742532,cpcv$0,v$2.0,st$1432218394369790))&al=(as$11vf3o7pb,aid$kOTTWArIEuE-,ct$25,id({beap_client_event}))',
						cb: '1432218394.443105'
					}
				},
				superConf: 'simple-super-conf2',
				extend: {}
			};

			standardAdCustomDataConf = {
				conf: {
					adId: 'test_ad_id',
					cookie: {
						name: '${LIBRARYADID}'
					},
					tracking: {
						rB: 'https://beap-bc.yahoo.com/yc/bv=1.0.0&bs=(17go8ee5u(gid$yD7alTEwLjL99m35VVVHHiByNjYuMVVd6xoQiIHM,st$1432218394369790,si$2664532,sp$2142647235,cr$3939742532,v$2.0,aid$kOTTWArIEuE-,ct$25,ybx$jS9jIkzn3USrovO6qRYhyg,bi$280585532,mme$2946903901166084135,lng$de-de,r$1,yoo$1,agp$361430032,ap$LREC))/*',
						r0: 'https://beap-bc.yahoo.com/yc/YnY9MS4wLjAmYnM9KDE3ZzFodG1uMihnaWQkeUQ3YWxURXdMakw5OW0zNVZWVkhIaUJ5TmpZdU1WVmQ2eG9RaUlITSxzdCQxNDMyMjE4Mzk0MzY5NzkwLHNpJDI2NjQ1MzIsc3AkMjE0MjY0NzIzNSxjciQzOTM5NzQyNTMyLHYkMi4wLGFpZCRrT1RUV0FySUV1RS0sY3QkMjUseWJ4JGpTOWpJa3puM1VTcm92TzZxUlloeWcsYmkkMjgwNTg1NTMyLG1tZSQyOTQ2OTAzOTAxMTY2MDg0MTM1LGxuZyRkZS1kZSxyJDIseW9vJDEsYWdwJDM2MTQzMDAzMixhcCRMUkVDKSk/1/*',
						z1: 'https://ci.beap.ad.yieldmanager.net/reg_ci?bv=1.0.0&bs=(1434kdv95(gid$yD7alTEwLjL99m35VVVHHiByNjYuMVVd6xoQiIHM,si$2664532,sp$2142647235,bi$280585532,cr$3939742532,cpcv$0,v$2.0,st$1432218394369790))&al=(as$11vf3o7pb,aid$kOTTWArIEuE-,ct$25,id({beap_client_event}))',
						cb: '1432218394.443105'
					},
					customData: {
						'layers.mpu.mpu_container.css.height' : '500px'
					}
				},
				superConf: 'simple-super-conf3',
				extend: {}
			};


			standardAdInputDataConf = {
				conf: {
					adId: 'test_ad_id',
					cookie: {
						name: '${LIBRARYADID}'
					},
					tracking: {
						rB: 'https://beap-bc.yahoo.com/yc/bv=1.0.0&bs=(17go8ee5u(gid$yD7alTEwLjL99m35VVVHHiByNjYuMVVd6xoQiIHM,st$1432218394369790,si$2664532,sp$2142647235,cr$3939742532,v$2.0,aid$kOTTWArIEuE-,ct$25,ybx$jS9jIkzn3USrovO6qRYhyg,bi$280585532,mme$2946903901166084135,lng$de-de,r$1,yoo$1,agp$361430032,ap$LREC))/*',
						r0: 'https://beap-bc.yahoo.com/yc/YnY9MS4wLjAmYnM9KDE3ZzFodG1uMihnaWQkeUQ3YWxURXdMakw5OW0zNVZWVkhIaUJ5TmpZdU1WVmQ2eG9RaUlITSxzdCQxNDMyMjE4Mzk0MzY5NzkwLHNpJDI2NjQ1MzIsc3AkMjE0MjY0NzIzNSxjciQzOTM5NzQyNTMyLHYkMi4wLGFpZCRrT1RUV0FySUV1RS0sY3QkMjUseWJ4JGpTOWpJa3puM1VTcm92TzZxUlloeWcsYmkkMjgwNTg1NTMyLG1tZSQyOTQ2OTAzOTAxMTY2MDg0MTM1LGxuZyRkZS1kZSxyJDIseW9vJDEsYWdwJDM2MTQzMDAzMixhcCRMUkVDKSk/1/*',
						z1: 'https://ci.beap.ad.yieldmanager.net/reg_ci?bv=1.0.0&bs=(1434kdv95(gid$yD7alTEwLjL99m35VVVHHiByNjYuMVVd6xoQiIHM,si$2664532,sp$2142647235,bi$280585532,cr$3939742532,cpcv$0,v$2.0,st$1432218394369790))&al=(as$11vf3o7pb,aid$kOTTWArIEuE-,ct$25,id({beap_client_event}))',
						cb: '1432218394.443105'
					},
					inputData: {
	               		type:'JSON',
	              		id: 'myYT',
	               		dataFeed: 'https://s.yimg.com/cv/ae/default/161201/json_feed.js'
					}
				},
				superConf: 'simple-super-conf4',
				extend: {}
			};

			standardAdInvalidInputDataConf = {
				conf: {
					adId: 'test_ad_id',
					cookie: {
						name: '${LIBRARYADID}'
					},
					tracking: {
						rB: 'https://beap-bc.yahoo.com/yc/bv=1.0.0&bs=(17go8ee5u(gid$yD7alTEwLjL99m35VVVHHiByNjYuMVVd6xoQiIHM,st$1432218394369790,si$2664532,sp$2142647235,cr$3939742532,v$2.0,aid$kOTTWArIEuE-,ct$25,ybx$jS9jIkzn3USrovO6qRYhyg,bi$280585532,mme$2946903901166084135,lng$de-de,r$1,yoo$1,agp$361430032,ap$LREC))/*',
						r0: 'https://beap-bc.yahoo.com/yc/YnY9MS4wLjAmYnM9KDE3ZzFodG1uMihnaWQkeUQ3YWxURXdMakw5OW0zNVZWVkhIaUJ5TmpZdU1WVmQ2eG9RaUlITSxzdCQxNDMyMjE4Mzk0MzY5NzkwLHNpJDI2NjQ1MzIsc3AkMjE0MjY0NzIzNSxjciQzOTM5NzQyNTMyLHYkMi4wLGFpZCRrT1RUV0FySUV1RS0sY3QkMjUseWJ4JGpTOWpJa3puM1VTcm92TzZxUlloeWcsYmkkMjgwNTg1NTMyLG1tZSQyOTQ2OTAzOTAxMTY2MDg0MTM1LGxuZyRkZS1kZSxyJDIseW9vJDEsYWdwJDM2MTQzMDAzMixhcCRMUkVDKSk/1/*',
						z1: 'https://ci.beap.ad.yieldmanager.net/reg_ci?bv=1.0.0&bs=(1434kdv95(gid$yD7alTEwLjL99m35VVVHHiByNjYuMVVd6xoQiIHM,si$2664532,sp$2142647235,bi$280585532,cr$3939742532,cpcv$0,v$2.0,st$1432218394369790))&al=(as$11vf3o7pb,aid$kOTTWArIEuE-,ct$25,id({beap_client_event}))',
						cb: '1432218394.443105'
					},
					inputData: {
	               		type:'JS',
	              		id: 'myYT',
	               		dataFeed: 'https://s.yimg.com/cv/ae/default/161201/json_feed2.js'
					}
				},
				superConf: 'simple-super-conf5',
				extend: {}
			};

		});

		it('should track Pixels for custom ads only', function (done) {
			var ad = ACT.Base(customAdConf);

			sinon.stub(ad, 'trackPixel', function (pixels) {
				ad.trackPixel.restore();
				done();
			});

			ad.register();

		});

		it('should call loadStandard ad for standard ads', function (done) {

			var ad = ACT.Base(standardAdConf);

			sinon.stub(ad, 'loadStandardAd', function () {
				ad.loadStandardAd.restore();
				done();
			});

			ad.register();

		});

		it('should merge config and customData for standard ads', function (done) {
			var ad = ACT.Base(standardAdCustomDataConf);
			sinon.stub(ad, 'loadStandardAd', function () {
				expect(ad.config.format.layers.mpu).to.be.an('object');
				ad.loadStandardAd.restore();
				done();
			});

			ad.register();
		});

		it('should merge JSON inputData for standard ads', function (done) {
			var ad = ACT.Base(standardAdInputDataConf);
			expect(ad.config.format.layers.mpu).to.be.an('object');
			done();
            // console.log('AD event', ACT.Event);
			// ACT.Event.fire.restore();
			// ACT.Event.on.restore();
			// var ad = ACT.Base(standardAdInputDataConf);
			// console.log('AD', ad);
            //
			// sinon.stub(ad, 'loadStandardAd', function(){
			// 	expect(ad.config.format.layers.mpu).to.be.an('object');
            //
			// 	sinon.stub(ACT.Event, 'fire');
			// 	sinon.stub(ACT.Event, 'on');
			// 	ad.loadStandardAd.restore();
			// 	done();
			// });
			// ad.register();
		});
	});

	describe('loadStandardAd function:', function () {
		it('should call trackPixel for standard ads', function (done) {
			var standardAdConf = {
				conf: {
					adId: 'test_ad_id12',
					cookie: {
						name: '${LIBRARYADID}'
					},
					tracking: {
						rB: 'https://beap-bc.yahoo.com/yc/bv=1.0.0&bs=(17go8ee5u(gid$yD7alTEwLjL99m35VVVHHiByNjYuMVVd6xoQiIHM,st$1432218394369790,si$2664532,sp$2142647235,cr$3939742532,v$2.0,aid$kOTTWArIEuE-,ct$25,ybx$jS9jIkzn3USrovO6qRYhyg,bi$280585532,mme$2946903901166084135,lng$de-de,r$1,yoo$1,agp$361430032,ap$LREC))/*',
						r0: 'https://beap-bc.yahoo.com/yc/YnY9MS4wLjAmYnM9KDE3ZzFodG1uMihnaWQkeUQ3YWxURXdMakw5OW0zNVZWVkhIaUJ5TmpZdU1WVmQ2eG9RaUlITSxzdCQxNDMyMjE4Mzk0MzY5NzkwLHNpJDI2NjQ1MzIsc3AkMjE0MjY0NzIzNSxjciQzOTM5NzQyNTMyLHYkMi4wLGFpZCRrT1RUV0FySUV1RS0sY3QkMjUseWJ4JGpTOWpJa3puM1VTcm92TzZxUlloeWcsYmkkMjgwNTg1NTMyLG1tZSQyOTQ2OTAzOTAxMTY2MDg0MTM1LGxuZyRkZS1kZSxyJDIseW9vJDEsYWdwJDM2MTQzMDAzMixhcCRMUkVDKSk/1/*',
						z1: 'https://ci.beap.ad.yieldmanager.net/reg_ci?bv=1.0.0&bs=(1434kdv95(gid$yD7alTEwLjL99m35VVVHHiByNjYuMVVd6xoQiIHM,si$2664532,sp$2142647235,bi$280585532,cr$3939742532,cpcv$0,v$2.0,st$1432218394369790))&al=(as$11vf3o7pb,aid$kOTTWArIEuE-,ct$25,id({beap_client_event}))',
						cb: '1432218394.443105'
					}
				},
				superConf: 'simple-super-conf7',
				extend: {}
			};
			var ad = ACT.Base(standardAdConf);
			sinon.stub(ad, 'trackPixel', function () {
				ad.trackPixel.restore();
				done();
			});
			ad.loadStandardAd();
		});
	});


	describe('trackPixel function:', function () {
		before(function () {
			var customAdConf = {
				conf: {
					adId: 'test_ad_id',
					cookie: {
						name: '${LIBRARYADID}'
					},
					tracking: {
						rB: 'https://beap-bc.yahoo.com/yc/bv=1.0.0&bs=(17go8ee5u(gid$yD7alTEwLjL99m35VVVHHiByNjYuMVVd6xoQiIHM,st$1432218394369790,si$2664532,sp$2142647235,cr$3939742532,v$2.0,aid$kOTTWArIEuE-,ct$25,ybx$jS9jIkzn3USrovO6qRYhyg,bi$280585532,mme$2946903901166084135,lng$de-de,r$1,yoo$1,agp$361430032,ap$LREC))/*',
						r0: 'https://beap-bc.yahoo.com/yc/YnY9MS4wLjAmYnM9KDE3ZzFodG1uMihnaWQkeUQ3YWxURXdMakw5OW0zNVZWVkhIaUJ5TmpZdU1WVmQ2eG9RaUlITSxzdCQxNDMyMjE4Mzk0MzY5NzkwLHNpJDI2NjQ1MzIsc3AkMjE0MjY0NzIzNSxjciQzOTM5NzQyNTMyLHYkMi4wLGFpZCRrT1RUV0FySUV1RS0sY3QkMjUseWJ4JGpTOWpJa3puM1VTcm92TzZxUlloeWcsYmkkMjgwNTg1NTMyLG1tZSQyOTQ2OTAzOTAxMTY2MDg0MTM1LGxuZyRkZS1kZSxyJDIseW9vJDEsYWdwJDM2MTQzMDAzMixhcCRMUkVDKSk/1/*',
						z1: 'https://ci.beap.ad.yieldmanager.net/reg_ci?bv=1.0.0&bs=(1434kdv95(gid$yD7alTEwLjL99m35VVVHHiByNjYuMVVd6xoQiIHM,si$2664532,sp$2142647235,bi$280585532,cr$3939742532,cpcv$0,v$2.0,st$1432218394369790))&al=(as$11vf3o7pb,aid$kOTTWArIEuE-,ct$25,id({beap_client_event}))',
						cb: '1432218394.443105'
					}
				},
				extend: {}
			};
		});

		it('should get its environment from currentEnv', function () {
			var ad = ACT.Base(customAdConf);
			ad.currentEnv = 'backup';

			var pixels = {
				html: ['https://s.yimg.com/html-pixel.gif'],
				flash: ['https://s.yimg.com/flash-pixel.gif'],
				backup: ['https://s.yimg.com/backup-pixel.gif']
			};

			sinon.stub(ACT.Util, 'pixelTrack', function (pixel) {
				expect(pixel).to.equal(pixels.backup[0]);
				ACT.Util.pixelTrack.restore();
			});

			ad.trackPixel(pixels);
		});

		it('should set its environment to html from UA', function () {
			var ad = ACT.Base(customAdConf);
			ad.currentEnv = 'html';
			var pixels = {
				html: ['https://s.yimg.com/html-pixel.gif'],
				flash: ['https://s.yimg.com/flash-pixel.gif'],
				backup: ['https://s.yimg.com/backup-pixel.gif']
			};

			sinon.stub(ACT.Util, 'pixelTrack', function (pixel) {
				expect(pixel).to.equal(pixels.html[0]);
				ACT.Util.pixelTrack.restore();
			});

			ad.trackPixel(pixels);

		});

		it('should send a pixel if param is an array', function () {

			var ad = ACT.Base(customAdConf);

			var pixelParam = ['https://s.yimg.com/html-pixel.gif'];


			sinon.stub(ACT.Util, 'pixelTrack', function (pixel) {
				expect(pixel).to.equal(pixelParam[0]);
				ACT.Util.pixelTrack.restore();
			});

			ad.trackPixel(pixelParam);

		});

		it('should send a pixel if param is a string', function () {

			var ad = ACT.Base(customAdConf);

			var pixelParam = 'https://s.yimg.com/backup-pixel.gif';


			sinon.stub(ACT.Util, 'pixelTrack', function (pixel) {
				expect(pixel).to.equal(pixelParam);
				ACT.Util.pixelTrack.restore();
			});

			ad.trackPixel(pixelParam);

		});
	});
});
