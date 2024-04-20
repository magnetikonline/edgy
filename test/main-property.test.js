'use strict';

const assert = require('assert/strict'),
	util = require('./util.js'),
	main = require('./../main.js'),

	runner = new util.TestCaseRunner();


runner.add(function testMethodsReturnSelf() {
	// test: viewer request
	const vReq = new main.ViewerRequest();

	assert.equal(vReq.setDistributionDomainName(),vReq);
	assert.equal(vReq.setDistributionId(),vReq);
	assert.equal(vReq.setRequestId(),vReq);

	assert.equal(vReq.setBody(),vReq);
	assert.equal(vReq.setClientIp(),vReq);
	assert.equal(vReq.setRequestHttpHeader(''),vReq);
	assert.equal(vReq.addRequestHttpHeader('',''),vReq);
	assert.equal(vReq.setHttpMethod('GET'),vReq);
	assert.equal(vReq.setQuerystring(''),vReq);
	assert.equal(vReq.setUri(''),vReq);


	// test: origin request
	const oReq = new main.OriginRequest();

	assert.equal(oReq.setDistributionDomainName(),oReq);
	assert.equal(oReq.setDistributionId(),oReq);
	assert.equal(oReq.setRequestId(),oReq);

	assert.equal(oReq.setBody(),oReq);
	assert.equal(oReq.setClientIp(),oReq);
	assert.equal(oReq.setRequestHttpHeader(''),oReq);
	assert.equal(oReq.addRequestHttpHeader('',''),oReq);
	assert.equal(oReq.setHttpMethod('GET'),oReq);

	// origin methods
	assert.equal(oReq.setOriginCustom(),oReq);
	assert.equal(oReq.setOriginKeepaliveTimeout(),oReq);
	assert.equal(oReq.setOriginPort(),oReq);
	assert.equal(oReq.setOriginHttps(),oReq);
	assert.equal(oReq.setOriginReadTimeout(),oReq);
	assert.equal(oReq.setOriginSslProtocolList([]),oReq);
	assert.equal(oReq.setOriginS3(),oReq);
	assert.equal(oReq.setOriginOAI(),oReq);
	assert.equal(oReq.setOriginHttpHeader(''),oReq);
	assert.equal(oReq.addOriginHttpHeader('',''),oReq);

	assert.equal(oReq.setQuerystring(''),oReq);
	assert.equal(oReq.setUri(''),oReq);


	// test: origin response
	const oRsp = new main.OriginResponse();

	assert.equal(oRsp.setDistributionDomainName(),oRsp);
	assert.equal(oRsp.setDistributionId(),oRsp);
	assert.equal(oRsp.setRequestId(),oRsp);

	assert.equal(oRsp.setClientIp(),oRsp);
	assert.equal(oRsp.setRequestHttpHeader(''),oRsp);
	assert.equal(oRsp.addRequestHttpHeader('',''),oRsp);
	assert.equal(oRsp.setHttpMethod('GET'),oRsp);

	// origin methods
	assert.equal(oRsp.setOriginCustom(),oRsp);
	assert.equal(oRsp.setOriginKeepaliveTimeout(),oRsp);
	assert.equal(oRsp.setOriginPort(),oRsp);
	assert.equal(oRsp.setOriginHttps(),oRsp);
	assert.equal(oRsp.setOriginReadTimeout(),oRsp);
	assert.equal(oRsp.setOriginSslProtocolList([]),oRsp);
	assert.equal(oRsp.setOriginS3(),oRsp);
	assert.equal(oRsp.setOriginOAI(),oRsp);
	assert.equal(oRsp.setOriginHttpHeader(''),oRsp);
	assert.equal(oRsp.addOriginHttpHeader('',''),oRsp);

	assert.equal(oRsp.setQuerystring(''),oRsp);
	assert.equal(oRsp.setUri(''),oRsp);

	assert.equal(oRsp.setResponseHttpHeader(''),oRsp);
	assert.equal(oRsp.addResponseHttpHeader('',''),oRsp);
	assert.equal(oRsp.setResponseHttpStatusCode(),oRsp);


	// test: viewer response
	const vRsp = new main.ViewerResponse();

	assert.equal(vRsp.setDistributionDomainName(),vRsp);
	assert.equal(vRsp.setDistributionId(),vRsp);
	assert.equal(vRsp.setRequestId(),vRsp);

	assert.equal(vRsp.setClientIp(),vRsp);
	assert.equal(vRsp.setRequestHttpHeader(''),vRsp);
	assert.equal(vRsp.addRequestHttpHeader('',''),vRsp);
	assert.equal(vRsp.setHttpMethod('GET'),vRsp);
	assert.equal(vRsp.setQuerystring(''),vRsp);
	assert.equal(vRsp.setUri(''),vRsp);

	assert.equal(vRsp.setResponseHttpHeader(''),vRsp);
	assert.equal(vRsp.addResponseHttpHeader('',''),vRsp);
	assert.equal(vRsp.setResponseHttpStatusCode(),vRsp);
});


runner.add(function testPropertyViewerRequest() {
	const vReq = new main.ViewerRequest();

	// test: config
	assert.equal(cfEventData(vReq).config.eventType,'viewer-request');
	testPropertyConfigDistributionDomainName(vReq);
	testPropertyConfigDistributionId(vReq);
	testPropertyConfigRequestId(vReq);

	// test: request
	testPropertyRequestBody(vReq);
	testPropertyRequestClientIp(vReq);
	testPropertyRequestHttpHeader(vReq);
	testPropertyRequestMethod(vReq);
	assert.equal(cfEventData(vReq).request.origin,undefined);
	testPropertyRequestQuerystring(vReq);
	testPropertyRequestUri(vReq);
});


runner.add(function testPropertyOriginRequest() {
	const oReq = new main.OriginRequest();

	// test: config
	assert.equal(cfEventData(oReq).config.eventType,'origin-request');
	testPropertyConfigDistributionDomainName(oReq);
	testPropertyConfigDistributionId(oReq);
	testPropertyConfigRequestId(oReq);

	// test: request
	testPropertyRequestBody(oReq);
	testPropertyRequestClientIp(oReq);
	testPropertyRequestHttpHeader(oReq);
	testPropertyRequestMethod(oReq);
	testPropertyRequestOrigin(oReq);
	testPropertyRequestQuerystring(oReq);
	testPropertyRequestUri(oReq);
});


runner.add(function testPropertyOriginResponse() {
	const oRsp = new main.OriginResponse();

	// test: config
	assert.equal(cfEventData(oRsp).config.eventType,'origin-response');
	testPropertyConfigDistributionDomainName(oRsp);
	testPropertyConfigDistributionId(oRsp);
	testPropertyConfigRequestId(oRsp);

	// test: request
	testPropertyRequestClientIp(oRsp);
	testPropertyRequestHttpHeader(oRsp);
	testPropertyRequestMethod(oRsp);
	testPropertyRequestOrigin(oRsp);
	testPropertyRequestQuerystring(oRsp);
	testPropertyRequestUri(oRsp);

	// test: response
	testPropertyResponseHttpHeader(oRsp);
	testPropertyResponseStatus(oRsp);
});


runner.add(function testPropertyViewerResponse() {
	const vRsp = new main.ViewerResponse();

	// test: config
	assert.equal(cfEventData(vRsp).config.eventType,'viewer-response');
	testPropertyConfigDistributionDomainName(vRsp);
	testPropertyConfigDistributionId(vRsp);
	testPropertyConfigRequestId(vRsp);

	// test: request
	testPropertyRequestClientIp(vRsp);
	testPropertyRequestHttpHeader(vRsp);
	testPropertyRequestMethod(vRsp);
	assert.equal(cfEventData(vRsp).request.origin,undefined);
	testPropertyRequestQuerystring(vRsp);
	testPropertyRequestUri(vRsp);

	// test: response
	testPropertyResponseHttpHeader(vRsp);
	testPropertyResponseStatus(vRsp);
});


function testPropertyConfigDistributionDomainName(inst) {
	assert.equal(cfEventData(inst).config.distributionDomainName,undefined);
	inst.setDistributionDomainName('abcd.cloudfront.net');
	assert.equal(cfEventData(inst).config.distributionDomainName,'abcd.cloudfront.net');
}

function testPropertyConfigDistributionId(inst) {
	assert.equal(cfEventData(inst).config.distributionId,undefined);
	inst.setDistributionId('ABCD010ZKWG3C');
	assert.equal(cfEventData(inst).config.distributionId,'ABCD010ZKWG3C');
}

function testPropertyConfigRequestId(inst) {
	assert.equal(cfEventData(inst).config.requestId,undefined);
	inst.setRequestId('OxakAoSw89Qow3gwR5oJQpWZiHB4ZcYIG2qoBwDtFvq_8nPn5_W_9w==');
	assert.equal(cfEventData(inst).config.requestId,'OxakAoSw89Qow3gwR5oJQpWZiHB4ZcYIG2qoBwDtFvq_8nPn5_W_9w==');
}

function testPropertyRequestBody(inst) {
	assert.equal(cfEventData(inst).request.body,undefined);

	inst.setBody();
	assert.equal(cfEventData(inst).request.body.data,'');
	assert.equal(cfEventData(inst).request.body.inputTruncated,false);

	inst.setBody('hello there viewer!');
	assert.deepEqual(cfEventData(inst).request.body,
		{
			action: 'read-only',
			data: 'aGVsbG8gdGhlcmUgdmlld2VyIQ==', // 'hello there viewer!'
			encoding: 'base64',
			inputTruncated: false,
		}
	);

	inst.setBody('',true);
	assert.equal(cfEventData(inst).request.body.data,'');
	assert.equal(cfEventData(inst).request.body.inputTruncated,true);
}

function testPropertyRequestClientIp(inst) {
	assert.equal(cfEventData(inst).request.clientIp,'127.0.0.1');
	inst.setClientIp('192.168.0.1');
	assert.equal(cfEventData(inst).request.clientIp,'192.168.0.1');
}

function testPropertyRequestHttpHeader(inst) {
	// initial state is an empty header set
	assert.deepEqual(cfEventData(inst).request.headers,{});

	// add a series of HTTP headers
	inst
		.addRequestHttpHeader('Host','my-hostname.tld')
		.addRequestHttpHeader('User-Agent','curl/8.4.0')
		.addRequestHttpHeader('Multi-Key','apples')
		.addRequestHttpHeader('Multi-Key','oranges')
		.addRequestHttpHeader(' Trim ',' value ');

	assert.deepEqual(cfEventData(inst).request.headers,
		{
			'host': [
				{ key: 'Host',value: 'my-hostname.tld' },
			],
			'multi-key': [
				{ key: 'Multi-Key',value: 'apples' },
				{ key: 'Multi-Key',value: 'oranges' },
			],
			'trim': [
				{ key: 'Trim',value: 'value' },
			],
			'user-agent': [
				{ key: 'User-Agent',value: 'curl/8.4.0' },
			],
		}
	);

	// set a series of HTTP headers
	inst
		.setRequestHttpHeader('Multi-Key','single-header') // reduce to single HTTP header
		.setRequestHttpHeader('trim'); // remove HTTP header

	assert.deepEqual(cfEventData(inst).request.headers,
		{
			'host': [
				{ key: 'Host',value: 'my-hostname.tld' },
			],
			'multi-key': [
				{ key: 'Multi-Key',value: 'single-header' },
			],
			'user-agent': [
				{ key: 'User-Agent',value: 'curl/8.4.0' },
			],
		}
	);
}

function testPropertyRequestMethod(inst) {
	assert.equal(cfEventData(inst).request.method,'GET');

	inst.setHttpMethod('DELETE');
	assert.equal(cfEventData(inst).request.method,'DELETE');

	assert.throws(function() { inst.setHttpMethod('Invalid'); });
}

function testPropertyRequestOrigin(inst) {
	function throwsOriginModeCustom(fn) {
		assert.throws(fn,{ message: 'method only valid in custom origin [setOriginCustom()] mode' });
	}

	function throwsOriginModeS3(fn) {
		assert.throws(fn,{ message: 'method only valid in S3 origin [setOriginS3()] mode' });
	}

	function throwsOriginModeEither(fn) {
		assert.throws(fn,{ message: 'an origin mode must be set via one of [setOriginCustom()/setOriginS3()]' });
	}

	assert.deepEqual(cfEventData(inst).request.origin,{});

	// calling any custom/S3 origin methods before origin mode set should throw error
	throwsOriginModeCustom(function() { inst.setOriginKeepaliveTimeout(666); });
	throwsOriginModeCustom(function() { inst.setOriginPort(123); });
	throwsOriginModeCustom(function() { inst.setOriginHttps(); });
	throwsOriginModeCustom(function() { inst.setOriginReadTimeout(6); });
	throwsOriginModeCustom(function() { inst.setOriginSslProtocolList([]); });
	throwsOriginModeS3(function() { inst.setOriginOAI(); });
	throwsOriginModeEither(function() { inst.setOriginHttpHeader(); });
	throwsOriginModeEither(function() { inst.addOriginHttpHeader(); });


	// test: origin [custom]
	inst.setOriginCustom('my-hostname.tld'); // note: `path` defaults to empty string
	assert.deepEqual(cfEventData(inst).request.origin,
		{
			custom: {
				customHeaders: {},
				domainName: 'my-hostname.tld',
				keepaliveTimeout: 1,
				path: '',
				port: 443,
				protocol: 'https',
				readTimeout: 4,
				sslProtocols: [],
			},
		}
	);

	inst.setOriginCustom('my-hostname.tld','/my/path');
	assert.equal(cfEventData(inst).request.origin.custom.path,'/my/path');
	assert.throws(function() { inst.setOriginCustom('my-hostname.tld','invalid/path'); });
	assert.throws(function() { inst.setOriginCustom('my-hostname.tld','/invalid/path/'); });
	assert.throws(function() { inst.setOriginCustom('my-hostname.tld','/path/too/long'.repeat(20)); });

	inst
		.addOriginHttpHeader('Multi-Origin-Key','apples')
		.addOriginHttpHeader('Multi-Origin-Key','oranges')
		.addOriginHttpHeader('User-Agent','curl/8.4.0')
		.addOriginHttpHeader('X-Remove-Me','banana');

	assert.deepEqual(cfEventData(inst).request.origin.custom.customHeaders,
		{
			'multi-origin-key': [
				{ key: 'Multi-Origin-Key',value: 'apples' },
				{ key: 'Multi-Origin-Key',value: 'oranges' },
			],
			'x-remove-me': [
				{ key: 'X-Remove-Me',value: 'banana' },
			],
			'user-agent': [
				{ key: 'User-Agent',value: 'curl/8.4.0' },
			],
		}
	);

	inst
		.setOriginHttpHeader('Multi-Origin-Key','single-header') // reduce to single HTTP header
		.setOriginHttpHeader('X-Remove-Me'); // remove HTTP header

	assert.deepEqual(cfEventData(inst).request.origin.custom.customHeaders,
		{
			'multi-origin-key': [
				{ key: 'Multi-Origin-Key',value: 'single-header' },
			],
			'user-agent': [
				{ key: 'User-Agent',value: 'curl/8.4.0' },
			],
		}
	);

	inst.setOriginKeepaliveTimeout(666);
	assert.equal(cfEventData(inst).request.origin.custom.keepaliveTimeout,666);
	inst.setOriginKeepaliveTimeout('123');
	assert.equal(cfEventData(inst).request.origin.custom.keepaliveTimeout,123);
	inst.setOriginKeepaliveTimeout();
	assert.equal(cfEventData(inst).request.origin.custom.keepaliveTimeout,0);
	inst.setOriginKeepaliveTimeout('invalid');
	assert.equal(cfEventData(inst).request.origin.custom.keepaliveTimeout,0);

	inst.setOriginPort(123);
	assert.equal(cfEventData(inst).request.origin.custom.port,123);
	inst.setOriginPort('666');
	assert.equal(cfEventData(inst).request.origin.custom.port,666);
	inst.setOriginPort();
	assert.equal(cfEventData(inst).request.origin.custom.port,0);
	inst.setOriginPort('invalid');
	assert.equal(cfEventData(inst).request.origin.custom.port,0);

	inst.setOriginHttps();
	assert.equal(cfEventData(inst).request.origin.custom.protocol,'http');
	inst.setOriginHttps(false);
	assert.equal(cfEventData(inst).request.origin.custom.protocol,'http');
	inst.setOriginHttps(true);
	assert.equal(cfEventData(inst).request.origin.custom.protocol,'https');
	inst.setOriginHttps(1);
	assert.equal(cfEventData(inst).request.origin.custom.protocol,'https');

	inst.setOriginReadTimeout(6);
	assert.equal(cfEventData(inst).request.origin.custom.readTimeout,6);
	inst.setOriginReadTimeout('14');
	assert.equal(cfEventData(inst).request.origin.custom.readTimeout,14);
	inst.setOriginReadTimeout();
	assert.equal(cfEventData(inst).request.origin.custom.readTimeout,0);
	inst.setOriginReadTimeout('invalid');
	assert.equal(cfEventData(inst).request.origin.custom.readTimeout,0);

	assert.throws(function() { inst.setOriginSslProtocolList(); });
	assert.throws(function() { inst.setOriginSslProtocolList('not array'); });
	inst.setOriginSslProtocolList(['SSLv3','TLSv1.2','unknown']);
	assert.deepEqual(cfEventData(inst).request.origin.custom.sslProtocols,['SSLv3','TLSv1.2']);
	inst.setOriginSslProtocolList(['unknown']);
	assert.deepEqual(cfEventData(inst).request.origin.custom.sslProtocols,[]);

	// test: origin [custom] - ensure [S3] only origin methods throw error when called in [custom] mode
	throwsOriginModeS3(function() { inst.setOriginOAI(); });


	// test: origin [S3]
	inst.setOriginS3('my-bucket.s3.ap-southeast-2.amazonaws.com'); // note: `region` and `path` defaults to empty string
	assert.deepEqual(cfEventData(inst).request.origin,
		{
			s3: {
				authMethod: 'none',
				customHeaders: {},
				domainName: 'my-bucket.s3.ap-southeast-2.amazonaws.com',
				path: '',
				region: '',
			},
		}
	);

	inst.setOriginS3('my-bucket.s3.ap-southeast-2.amazonaws.com','ap-southeast-2');
	assert.equal(cfEventData(inst).request.origin.s3.path,'');
	assert.equal(cfEventData(inst).request.origin.s3.region,'ap-southeast-2');
	inst.setOriginS3('my-bucket.s3.ap-southeast-2.amazonaws.com','ap-southeast-2','/my/path');
	assert.equal(cfEventData(inst).request.origin.s3.path,'/my/path');
	assert.equal(cfEventData(inst).request.origin.s3.region,'ap-southeast-2');
	assert.throws(function() { inst.setOriginS3('my-bucket.s3.ap-southeast-2.amazonaws.com','ap-southeast-2','invalid/path'); });
	assert.throws(function() { inst.setOriginS3('my-bucket.s3.ap-southeast-2.amazonaws.com','ap-southeast-2','/invalid/path/'); });

	inst
		.addOriginHttpHeader('Multi-Origin-Key','apples')
		.addOriginHttpHeader('Multi-Origin-Key','oranges')
		.addOriginHttpHeader('User-Agent','curl/8.4.0');

	assert.deepEqual(cfEventData(inst).request.origin.s3.customHeaders,
		{
			'multi-origin-key': [
				{ key: 'Multi-Origin-Key',value: 'apples' },
				{ key: 'Multi-Origin-Key',value: 'oranges' },
			],
			'user-agent': [
				{ key: 'User-Agent',value: 'curl/8.4.0' },
			],
		}
	);

	inst.setOriginOAI();
	assert.equal(cfEventData(inst).request.origin.s3.authMethod,'none');
	inst.setOriginOAI(false);
	assert.equal(cfEventData(inst).request.origin.s3.authMethod,'none');
	inst.setOriginOAI(true);
	assert.equal(cfEventData(inst).request.origin.s3.authMethod,'origin-access-identity');
	inst.setOriginOAI(1);
	assert.equal(cfEventData(inst).request.origin.s3.authMethod,'origin-access-identity');

	// test: origin [S3] - ensure [custom] only origin methods throw error when called in [S3] mode
	throwsOriginModeCustom(function() { inst.setOriginKeepaliveTimeout(666); });
	throwsOriginModeCustom(function() { inst.setOriginPort(123); });
	throwsOriginModeCustom(function() { inst.setOriginHttps(); });
	throwsOriginModeCustom(function() { inst.setOriginReadTimeout(6); });
	throwsOriginModeCustom(function() { inst.setOriginSslProtocolList([]); });
}

function testPropertyRequestQuerystring(inst) {
	assert.equal(cfEventData(inst).request.querystring,'');
	inst.setQuerystring('?key01=value01&key02=value02');
	assert.equal(cfEventData(inst).request.querystring,'key01=value01&key02=value02');
	inst.setQuerystring('  ???  key01=value01&key02=value02  ');
	assert.equal(cfEventData(inst).request.querystring,'key01=value01&key02=value02');
}

function testPropertyRequestUri(inst) {
	assert.equal(cfEventData(inst).request.uri,'/');
	inst.setUri('/index.html');
	assert.equal(cfEventData(inst).request.uri,'/index.html');
	inst.setUri('  //  image.png  ');
	assert.equal(cfEventData(inst).request.uri,'/image.png');
	inst.setUri('image.png');
	assert.equal(cfEventData(inst).request.uri,'/image.png');
}

function testPropertyResponseHttpHeader(inst) {
	// initial state is an empty header set
	assert.deepEqual(cfEventData(inst).response.headers,{});

	// note: tested multiple HTTP header combos with `testPropertyRequestHttpHeader()` - so only perform limited testing here
	inst
		.addResponseHttpHeader('ETag','"e659e87d5a580948081a33d9d0e8d00e"')
		.addResponseHttpHeader('Server','AmazonS3');

	assert.deepEqual(cfEventData(inst).response.headers,
		{
			'etag': [
				{ key: 'ETag',value: '"e659e87d5a580948081a33d9d0e8d00e"' },
			],
			'server': [
				{ key: 'Server',value: 'AmazonS3' },
			],
		}
	);

	inst
		.setResponseHttpHeader('ETag','"mutated"')
		.setResponseHttpHeader('Server');

	assert.deepEqual(cfEventData(inst).response.headers,
		{
			'etag': [
				{ key: 'ETag',value: '"mutated"' },
			],
		}
	);
}

function testPropertyResponseStatus(inst) {
	assert.equal(cfEventData(inst).response.status,'200');
	assert.equal(cfEventData(inst).response.statusDescription,'OK');

	inst.setResponseHttpStatusCode(404);
	assert.equal(cfEventData(inst).response.status,'404');
	assert.equal(cfEventData(inst).response.statusDescription,'Not Found');

	inst.setResponseHttpStatusCode(666);
	assert.equal(cfEventData(inst).response.status,'666');
	assert.equal(cfEventData(inst).response.statusDescription,'');
}

function cfEventData(obj) {
	return obj._event.Records[0].cf;
}


runner.execute();
