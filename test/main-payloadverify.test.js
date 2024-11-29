'use strict';

const assert = require('assert/strict'),
	util = require('./util.js'),
	main = require('./../main.js'),

	runner = new util.TestCaseRunner();


runner.add(function testPayloadVerifyViewerRequest() {
	const vReq = new main.ViewerRequest();
	testPayloadVerifyRequest(vReq);
});


runner.add(function testPayloadVerifyOriginRequest() {
	const oReq = new main.OriginRequest();
	testPayloadVerifyRequest(oReq,true);
	testPayloadVerifyRequestOrigin(oReq);
});


runner.add(function testPayloadVerifyOriginResponse() {
	const oRsp = new main.OriginResponse();
	testPayloadVerifyResponse(oRsp);
});


runner.add(function testPayloadVerifyViewerResponse() {
	const vRsp = new main.ViewerResponse();
	testPayloadVerifyResponse(vRsp);
});


function testPayloadVerifyRequest(inst,withMockOrigin = false) {
	function callVerify(payload) {
		if (withMockOrigin && (typeof payload === 'object')) {
			// bolt on an `origin = {}` property to the payload
			payload.origin = {
				custom: {
					customHeaders: {},
					domainName: 'example.org',
					keepaliveTimeout: 1,
					path: '',
					port: 443,
					protocol: 'https',
					readTimeout: 4,
					sslProtocols: [],
				},
			};
		}

		inst._payloadVerify(payload);
	}

	function makePayload(mutate,extendBase = {}) {
		const payload = {
			...{
				clientIp: '127.0.0.1',
				headers: {
					'header-key': [
						{
							key: 'Header-Key',
							value: 'header-value',
						},
					],
				},
				method: 'GET',
				querystring: '',
				uri: '/',
			},
			...extendBase,
		};

		if (mutate) {
			mutate(payload);
		}

		return payload;
	}

	function makePayloadWithBody(mutate) {
		return makePayload(
			mutate,
			{
				body: {
					action: 'read-only',
					data: '',
					encoding: 'base64',
					inputTruncated: false,
				},
			}
		);
	}

	// test: passing valid payload
	callVerify(makePayload());

	callVerify(makePayload(function(payload) {
		payload.method = 'POST';
	}));

	// test: payload must be an object
	assert.throws(function() { callVerify(undefined); });

	// test: payload missing/invalid property values
	assert.throws(function() {
		callVerify(makePayload(function(payload) {
			delete payload.clientIp;
		}));
	});

	assert.throws(function() {
		callVerify(makePayload(function(payload) {
			payload.clientIp = -1;
		}));
	});

	assert.throws(function() {
		callVerify(makePayload(function(payload) {
			delete payload.headers;
		}));
	});

	assert.throws(function() {
		callVerify(makePayload(function(payload) {
			payload.headers = -1;
		}));
	});

	assert.throws(function() {
		callVerify(makePayload(function(payload) {
			payload.headers = {
				'UPPER-CASE': [],
			};
		}));
	});

	assert.throws(function() {
		callVerify(makePayload(function(payload) {
			payload.headers = {
				'header-key': -1,
			};
		}));
	});

	assert.throws(function() {
		callVerify(makePayload(function(payload) {
			payload.headers = {
				'header-key': [-1],
			};
		}));
	});

	assert.throws(function() {
		callVerify(makePayload(function(payload) {
			payload.headers = {
				'header-key': [{}],
			};
		}));
	});

	assert.throws(function() {
		callVerify(makePayload(function(payload) {
			payload.headers = {
				'header-key': [{
					value: -1,
				}],
			};
		}));
	});

	assert.throws(function() {
		callVerify(makePayload(function(payload) {
			payload.headers = {
				'header-key': [{
					key: -1,
					value: 'header-value',
				}],
			};
		}));
	});

	assert.throws(function() {
		callVerify(makePayload(function(payload) {
			payload.headers = {
				'header-key': [{
					key: 'Different-Header-Key',
					value: 'header-value',
				}],
			};
		}));
	});

	assert.throws(function() {
		callVerify(makePayload(function(payload) {
			delete payload.method;
		}));
	});

	assert.throws(function() {
		callVerify(makePayload(function(payload) {
			payload.method = -1;
		}));
	});

	assert.throws(function() {
		callVerify(makePayload(function(payload) {
			payload.method = 'INVALID_HTTP_METHOD';
		}));
	});

	assert.throws(function() {
		callVerify(makePayload(function(payload) {
			delete payload.querystring;
		}));
	});

	assert.throws(function() {
		callVerify(makePayload(function(payload) {
			payload.querystring = -1;
		}));
	});

	assert.throws(function() {
		callVerify(makePayload(function(payload) {
			delete payload.uri;
		}));
	});

	assert.throws(function() {
		callVerify(makePayload(function(payload) {
			payload.uri = -1;
		}));
	});

	assert.throws(function() {
		callVerify(makePayload(function(payload) {
			payload.uri = 'missing/leading/slash';
		}));
	});

	// test: optional `body` property is present

	// test: passing valid payload
	callVerify(makePayloadWithBody());

	callVerify(makePayloadWithBody(function(payload) {
		payload.body.action = 'replace';
	}));

	callVerify(makePayloadWithBody(function(payload) {
		payload.body.encoding = 'text';
	}));

	// test: given `body` must be an object
	assert.throws(function() {
		callVerify(makePayloadWithBody(function(payload) {
			payload.body = -1;
		}));
	});

	// test: payload missing/invalid property values
	assert.throws(function() {
		callVerify(makePayloadWithBody(function(payload) {
			delete payload.body.action;
		}));
	});

	assert.throws(function() {
		callVerify(makePayloadWithBody(function(payload) {
			payload.body.action = -1;
		}));
	});

	assert.throws(function() {
		callVerify(makePayloadWithBody(function(payload) {
			payload.body.action = 'invalid';
		}));
	});

	assert.throws(function() {
		callVerify(makePayloadWithBody(function(payload) {
			delete payload.body.data;
		}));
	});

	assert.throws(function() {
		callVerify(makePayloadWithBody(function(payload) {
			payload.body.data = -1;
		}));
	});

	assert.throws(function() {
		callVerify(makePayloadWithBody(function(payload) {
			delete payload.body.encoding;
		}));
	});

	assert.throws(function() {
		callVerify(makePayloadWithBody(function(payload) {
			payload.body.encoding = -1;
		}));
	});

	assert.throws(function() {
		callVerify(makePayloadWithBody(function(payload) {
			payload.body.encoding = 'invalid';
		}));
	});

	assert.throws(function() {
		callVerify(makePayloadWithBody(function(payload) {
			delete payload.body.inputTruncated;
		}));
	});
}

function testPayloadVerifyRequestOrigin(inst) {
	function callVerify(payload) {
		inst._payloadVerify(payload);
	}

	function makePayload(mutate,extendBase = {}) {
		const payload = {
			...{
				clientIp: '127.0.0.1',
				headers: {},
				method: 'GET',
				querystring: '',
				uri: '/',
			},
			...extendBase,
		};

		if (mutate) {
			mutate(payload);
		}

		return payload;
	}

	function makePayloadWithOriginCustom(mutate) {
		return makePayload(
			mutate,
			{
				origin: {
					custom: {
						customHeaders: {
							'header-key': [
								{
									key: 'Header-Key',
									value: 'header-value',
								},
							],
						},
						domainName: 'example.org',
						keepaliveTimeout: 1,
						path: '',
						port: 443,
						protocol: 'https',
						readTimeout: 4,
						sslProtocols: [],
					},
				},
			}
		);
	}

	function makePayloadWithOriginS3(mutate) {
		return makePayload(
			mutate,
			{
				origin: {
					s3: {
						authMethod: 'none',
						customHeaders: {
							'header-key': [
								{
									key: 'Header-Key',
									value: 'header-value',
								},
							],
						},
						domainName: 'bucket.s3.us-east-1.amazonaws.com',
						path: '',
						region: 'us-east-1',
					},
				},
			}
		);
	}

	// test: origin property must exist and be an object
	assert.throws(function() {
		callVerify(makePayload());
	});

	assert.throws(function() {
		callVerify(makePayload(function(payload) {
			payload.origin = -1;
		}));
	});

	// test: origin must contain *just one* property of `custom` or `s3` - but never both
	assert.throws(function() {
		callVerify(makePayload(function(payload) {
			payload.origin = {};
		}));
	});

	assert.throws(function() {
		callVerify(makePayload(function(payload) {
			payload.origin = {
				custom: {},
				s3: {},
			};
		}));
	});

	// test: origin [custom]

	// test: passing valid payload
	callVerify(makePayloadWithOriginCustom());

	callVerify(makePayloadWithOriginCustom(function(payload) {
		payload.origin.custom.path = '/valid/path';
	}));

	callVerify(makePayloadWithOriginCustom(function(payload) {
		payload.origin.custom.port = 80;
	}));

	callVerify(makePayloadWithOriginCustom(function(payload) {
		payload.origin.custom.port = 1024;
	}));

	callVerify(makePayloadWithOriginCustom(function(payload) {
		payload.origin.custom.protocol = 'http';
	}));

	callVerify(makePayloadWithOriginCustom(function(payload) {
		payload.origin.custom.sslProtocols = ['TLSv1.2'];
	}));

	// test: payload missing/invalid property values
	assert.throws(function() {
		callVerify(makePayloadWithOriginCustom(function(payload) {
			payload.origin.custom = -1; // `origin.custom` must be an object
		}));
	});

	assert.throws(function() {
		callVerify(makePayloadWithOriginCustom(function(payload) {
			delete payload.origin.custom.customHeaders;
		}));
	});

	assert.throws(function() {
		callVerify(makePayloadWithOriginCustom(function(payload) {
			payload.origin.custom.customHeaders = -1;
		}));
	});

	assert.throws(function() {
		callVerify(makePayloadWithOriginCustom(function(payload) {
			payload.origin.custom.customHeaders = {
				'UPPER-CASE': [],
			};
		}));
	});

	assert.throws(function() {
		callVerify(makePayloadWithOriginCustom(function(payload) {
			payload.origin.custom.customHeaders = {
				'header-key': -1,
			};
		}));
	});

	assert.throws(function() {
		callVerify(makePayloadWithOriginCustom(function(payload) {
			payload.origin.custom.customHeaders = {
				'header-key': [-1],
			};
		}));
	});

	assert.throws(function() {
		callVerify(makePayloadWithOriginCustom(function(payload) {
			payload.origin.custom.customHeaders = {
				'header-key': [{}],
			};
		}));
	});

	assert.throws(function() {
		callVerify(makePayloadWithOriginCustom(function(payload) {
			payload.origin.custom.customHeaders = {
				'header-key': [{
					value: -1,
				}],
			};
		}));
	});

	assert.throws(function() {
		callVerify(makePayloadWithOriginCustom(function(payload) {
			payload.origin.custom.customHeaders = {
				'header-key': [{
					key: -1,
					value: 'header-value',
				}],
			};
		}));
	});

	assert.throws(function() {
		callVerify(makePayloadWithOriginCustom(function(payload) {
			payload.origin.custom.customHeaders = {
				'header-key': [{
					key: 'Different-Header-Key',
					value: 'header-value',
				}],
			};
		}));
	});

	assert.throws(function() {
		callVerify(makePayloadWithOriginCustom(function(payload) {
			delete payload.origin.custom.domainName;
		}));
	});

	assert.throws(function() {
		callVerify(makePayloadWithOriginCustom(function(payload) {
			payload.origin.custom.domainName = -1;
		}));
	});

	assert.throws(function() {
		callVerify(makePayloadWithOriginCustom(function(payload) {
			payload.origin.custom.domainName = '';
		}));
	});

	assert.throws(function() {
		callVerify(makePayloadWithOriginCustom(function(payload) {
			delete payload.origin.custom.keepaliveTimeout;
		}));
	});

	assert.throws(function() {
		callVerify(makePayloadWithOriginCustom(function(payload) {
			payload.origin.custom.keepaliveTimeout = 'invalid';
		}));
	});

	assert.throws(function() {
		callVerify(makePayloadWithOriginCustom(function(payload) {
			payload.origin.custom.keepaliveTimeout = 0;
		}));
	});

	assert.throws(function() {
		callVerify(makePayloadWithOriginCustom(function(payload) {
			payload.origin.custom.keepaliveTimeout = 61;
		}));
	});

	assert.throws(function() {
		callVerify(makePayloadWithOriginCustom(function(payload) {
			delete payload.origin.custom.path;
		}));
	});

	assert.throws(function() {
		callVerify(makePayloadWithOriginCustom(function(payload) {
			payload.origin.custom.path = -1;
		}));
	});

	assert.throws(function() {
		callVerify(makePayloadWithOriginCustom(function(payload) {
			payload.origin.custom.path = 'invalid/path';
		}));
	});

	assert.throws(function() {
		callVerify(makePayloadWithOriginCustom(function(payload) {
			payload.origin.custom.path = '/invalid/path/';
		}));
	});

	assert.throws(function() {
		callVerify(makePayloadWithOriginCustom(function(payload) {
			payload.origin.custom.path = '/path/too/long'.repeat(20);
		}));
	});

	assert.throws(function() {
		callVerify(makePayloadWithOriginCustom(function(payload) {
			delete payload.origin.custom.port;
		}));
	});

	assert.throws(function() {
		callVerify(makePayloadWithOriginCustom(function(payload) {
			payload.origin.custom.port = 'invalid';
		}));
	});

	assert.throws(function() {
		callVerify(makePayloadWithOriginCustom(function(payload) {
			payload.origin.custom.port = 666;
		}));
	});

	assert.throws(function() {
		callVerify(makePayloadWithOriginCustom(function(payload) {
			delete payload.origin.custom.protocol;
		}));
	});

	assert.throws(function() {
		callVerify(makePayloadWithOriginCustom(function(payload) {
			payload.origin.custom.protocol = -1;
		}));
	});

	assert.throws(function() {
		callVerify(makePayloadWithOriginCustom(function(payload) {
			payload.origin.custom.protocol = 'invalid';
		}));
	});

	assert.throws(function() {
		callVerify(makePayloadWithOriginCustom(function(payload) {
			delete payload.origin.custom.readTimeout;
		}));
	});

	assert.throws(function() {
		callVerify(makePayloadWithOriginCustom(function(payload) {
			payload.origin.custom.readTimeout = 'invalid';
		}));
	});

	assert.throws(function() {
		callVerify(makePayloadWithOriginCustom(function(payload) {
			payload.origin.custom.readTimeout = 3;
		}));
	});

	assert.throws(function() {
		callVerify(makePayloadWithOriginCustom(function(payload) {
			payload.origin.custom.readTimeout = 61;
		}));
	});

	assert.throws(function() {
		callVerify(makePayloadWithOriginCustom(function(payload) {
			delete payload.origin.custom.sslProtocols;
		}));
	});

	assert.throws(function() {
		callVerify(makePayloadWithOriginCustom(function(payload) {
			payload.origin.custom.sslProtocols = 'not_array';
		}));
	});

	assert.throws(function() {
		callVerify(makePayloadWithOriginCustom(function(payload) {
			payload.origin.custom.sslProtocols = ['INVALID_PROTOv1.2'];
		}));
	});

	// test: origin [s3]

	// test: passing valid payload
	callVerify(makePayloadWithOriginS3());

	callVerify(makePayloadWithOriginS3(function(payload) {
		payload.origin.s3.authMethod = 'origin-access-identity';
	}));

	callVerify(makePayloadWithOriginS3(function(payload) {
		payload.origin.s3.path = '/valid/path';
	}));

	// test: payload missing/invalid property values
	assert.throws(function() {
		callVerify(makePayloadWithOriginS3(function(payload) {
			payload.origin.s3 = -1; // `origin.s3` must be an object
		}));
	});

	assert.throws(function() {
		callVerify(makePayloadWithOriginS3(function(payload) {
			delete payload.origin.s3.authMethod;
		}));
	});

	assert.throws(function() {
		callVerify(makePayloadWithOriginS3(function(payload) {
			payload.origin.s3.authMethod = -1;
		}));
	});

	assert.throws(function() {
		callVerify(makePayloadWithOriginS3(function(payload) {
			payload.origin.s3.authMethod = 'invalid';
		}));
	});

	assert.throws(function() {
		callVerify(makePayloadWithOriginS3(function(payload) {
			delete payload.origin.s3.customHeaders;
		}));
	});

	assert.throws(function() {
		callVerify(makePayloadWithOriginS3(function(payload) {
			payload.origin.s3.customHeaders = -1;
		}));
	});

	assert.throws(function() {
		callVerify(makePayloadWithOriginS3(function(payload) {
			payload.origin.s3.customHeaders = {
				'UPPER-CASE': [],
			};
		}));
	});

	assert.throws(function() {
		callVerify(makePayloadWithOriginS3(function(payload) {
			payload.origin.s3.customHeaders = {
				'header-key': -1,
			};
		}));
	});

	assert.throws(function() {
		callVerify(makePayloadWithOriginS3(function(payload) {
			payload.origin.s3.customHeaders = {
				'header-key': [-1],
			};
		}));
	});

	assert.throws(function() {
		callVerify(makePayloadWithOriginS3(function(payload) {
			payload.origin.s3.customHeaders = {
				'header-key': [{}],
			};
		}));
	});

	assert.throws(function() {
		callVerify(makePayloadWithOriginS3(function(payload) {
			payload.origin.s3.customHeaders = {
				'header-key': [{
					value: -1,
				}],
			};
		}));
	});

	assert.throws(function() {
		callVerify(makePayloadWithOriginS3(function(payload) {
			payload.origin.s3.customHeaders = {
				'header-key': [{
					key: -1,
					value: 'header-value',
				}],
			};
		}));
	});

	assert.throws(function() {
		callVerify(makePayloadWithOriginS3(function(payload) {
			payload.origin.s3.customHeaders = {
				'header-key': [{
					key: 'Different-Header-Key',
					value: 'header-value',
				}],
			};
		}));
	});

	assert.throws(function() {
		callVerify(makePayloadWithOriginS3(function(payload) {
			delete payload.origin.s3.domainName;
		}));
	});

	assert.throws(function() {
		callVerify(makePayloadWithOriginS3(function(payload) {
			payload.origin.s3.domainName = -1;
		}));
	});

	assert.throws(function() {
		callVerify(makePayloadWithOriginS3(function(payload) {
			payload.origin.s3.domainName = '';
		}));
	});

	assert.throws(function() {
		callVerify(makePayloadWithOriginS3(function(payload) {
			delete payload.origin.s3.path;
		}));
	});

	assert.throws(function() {
		callVerify(makePayloadWithOriginS3(function(payload) {
			payload.origin.s3.path = -1;
		}));
	});

	assert.throws(function() {
		callVerify(makePayloadWithOriginS3(function(payload) {
			payload.origin.s3.path = 'invalid/path';
		}));
	});

	assert.throws(function() {
		callVerify(makePayloadWithOriginS3(function(payload) {
			payload.origin.s3.path = '/invalid/path/';
		}));
	});
}

function testPayloadVerifyResponse(inst) {
	function callVerify(payload) {
		inst._payloadVerify(payload);
	}

	function makePayload(mutate) {
		const payload = {
			headers: {
				'header-key': [
					{
						key: 'Header-Key',
						value: 'header-value',
					},
				],
			},
			status: '200',
			statusDescription: 'OK',
		};

		if (mutate) {
			mutate(payload);
		}

		return payload;
	}

	// test: passing valid payload
	callVerify(makePayload());

	callVerify(makePayload(function(payload) {
		payload.status = '404';
		payload.statusDescription = 'Not Found';
	}));

	// test: payload must be an object
	assert.throws(function() { callVerify(undefined); });

	// test: payload missing/invalid property values
	assert.doesNotThrow(function() {
		callVerify(makePayload(function(payload) {
			delete payload.headers;
		}));
	});

	assert.throws(function() {
		callVerify(makePayload(function(payload) {
			payload.headers = -1;
		}));
	});

	assert.throws(function() {
		callVerify(makePayload(function(payload) {
			payload.headers = {
				'UPPER-CASE': [],
			};
		}));
	});

	assert.throws(function() {
		callVerify(makePayload(function(payload) {
			payload.headers = {
				'header-key': -1,
			};
		}));
	});

	assert.throws(function() {
		callVerify(makePayload(function(payload) {
			payload.headers = {
				'header-key': [-1],
			};
		}));
	});

	assert.throws(function() {
		callVerify(makePayload(function(payload) {
			payload.headers = {
				'header-key': [{}],
			};
		}));
	});

	assert.throws(function() {
		callVerify(makePayload(function(payload) {
			payload.headers = {
				'header-key': [{
					value: -1,
				}],
			};
		}));
	});

	assert.throws(function() {
		callVerify(makePayload(function(payload) {
			payload.headers = {
				'header-key': [{
					key: -1,
					value: 'header-value',
				}],
			};
		}));
	});

	assert.throws(function() {
		callVerify(makePayload(function(payload) {
			payload.headers = {
				'header-key': [{
					key: 'Different-Header-Key',
					value: 'header-value',
				}],
			};
		}));
	});

	assert.throws(function() {
		callVerify(makePayload(function(payload) {
			delete payload.status;
		}));
	});

	assert.throws(function() {
		callVerify(makePayload(function(payload) {
			payload.status = -1;
		}));
	});

	assert.throws(function() {
		callVerify(makePayload(function(payload) {
			payload.status = '999'; // unknown HTTP status code
		}));
	});

	assert.doesNotThrow(function() {
		callVerify(makePayload(function(payload) {
			delete payload.statusDescription;
		}));
	});

	assert.throws(function() {
		callVerify(makePayload(function(payload) {
			payload.statusDescription = -1;
		}));
	});
}


runner.execute();
