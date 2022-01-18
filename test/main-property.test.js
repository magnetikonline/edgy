'use strict';

const assert = require('assert').strict,
	util = require('./util.js'),
	main = require('./../main.js'),

	runner = new util.TestCaseRunner();


runner.add(function testMethodsReturnSelf() {
	// test: viewer request
	const vReq = new main.ViewerRequest();

	assert.equal(vReq.setDistributionDomainName(),vReq);
	assert.equal(vReq.setDistributionId(),vReq);
	assert.equal(vReq.setRequestId(),vReq);

	assert.equal(vReq.setRequestBody(),vReq);
	assert.equal(vReq.setClientIp(),vReq);
	assert.equal(vReq.addRequestHttpHeader('',''),vReq);
	assert.equal(vReq.setHttpMethod('GET'),vReq);
	assert.equal(vReq.setQuerystring(''),vReq);
	assert.equal(vReq.setUri(''),vReq);


	// test: origin request
	const oReq = new main.OriginRequest();

	assert.equal(oReq.setDistributionDomainName(),oReq);
	assert.equal(oReq.setDistributionId(),oReq);
	assert.equal(oReq.setRequestId(),oReq);

	assert.equal(oReq.setRequestBody(),oReq);
	assert.equal(oReq.setClientIp(),oReq);
	assert.equal(oReq.addRequestHttpHeader('',''),oReq);
	assert.equal(oReq.setHttpMethod('GET'),oReq);

	// origin methods
	assert.equal(oReq.setRequestOriginCustom(),oReq);
	assert.equal(oReq.setRequestOriginKeepaliveTimeout(),oReq);
	assert.equal(oReq.setRequestOriginPort(),oReq);
	assert.equal(oReq.setRequestOriginHttps(),oReq);
	assert.equal(oReq.setRequestOriginReadTimeout(),oReq);
	assert.equal(oReq.setRequestOriginSslProtocolList([]),oReq);
	assert.equal(oReq.setRequestOriginS3(),oReq);
	assert.equal(oReq.setRequestOriginOAI(),oReq);
	assert.equal(oReq.addRequestOriginHttpHeader('',''),oReq);

	assert.equal(oReq.setQuerystring(''),oReq);
	assert.equal(oReq.setUri(''),oReq);


	// test: origin response
	const oRsp = new main.OriginResponse();

	assert.equal(oRsp.setDistributionDomainName(),oRsp);
	assert.equal(oRsp.setDistributionId(),oRsp);
	assert.equal(oRsp.setRequestId(),oRsp);

	assert.equal(oRsp.setClientIp(),oRsp);
	assert.equal(oRsp.addRequestHttpHeader('',''),oRsp);
	assert.equal(oRsp.setHttpMethod('GET'),oRsp);

	// origin methods
	assert.equal(oRsp.setRequestOriginCustom(),oRsp);
	assert.equal(oRsp.setRequestOriginKeepaliveTimeout(),oRsp);
	assert.equal(oRsp.setRequestOriginPort(),oRsp);
	assert.equal(oRsp.setRequestOriginHttps(),oRsp);
	assert.equal(oRsp.setRequestOriginReadTimeout(),oRsp);
	assert.equal(oRsp.setRequestOriginSslProtocolList([]),oRsp);
	assert.equal(oRsp.setRequestOriginS3(),oRsp);
	assert.equal(oRsp.setRequestOriginOAI(),oRsp);
	assert.equal(oRsp.addRequestOriginHttpHeader('',''),oRsp);

	assert.equal(oRsp.setQuerystring(''),oRsp);
	assert.equal(oRsp.setUri(''),oRsp);

	assert.equal(oRsp.addResponseHttpHeader('',''),oRsp);
	assert.equal(oRsp.setResponseHttpStatusCode(),oRsp);


	// test: viewer response
	const vRsp = new main.ViewerResponse();

	assert.equal(vRsp.setDistributionDomainName(),vRsp);
	assert.equal(vRsp.setDistributionId(),vRsp);
	assert.equal(vRsp.setRequestId(),vRsp);

	assert.equal(vRsp.setClientIp(),vRsp);
	assert.equal(vRsp.addRequestHttpHeader('',''),vRsp);
	assert.equal(vRsp.setHttpMethod('GET'),vRsp);
	assert.equal(vRsp.setQuerystring(''),vRsp);
	assert.equal(vRsp.setUri(''),vRsp);

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

	inst.setRequestBody();
	assert.equal(cfEventData(inst).request.body.data,'');
	assert.equal(cfEventData(inst).request.body.inputTruncated,false);

	inst.setRequestBody('hello there viewer!');
	assert.deepEqual(cfEventData(inst).request.body,
		{
			action: 'read-only',
			data: 'aGVsbG8gdGhlcmUgdmlld2VyIQ==', // 'hello there viewer!'
			encoding: 'base64',
			inputTruncated: false,
		}
	);

	inst.setRequestBody('',true);
	assert.equal(cfEventData(inst).request.body.inputTruncated,true);
}

function testPropertyRequestClientIp(inst) {
	assert.equal(cfEventData(inst).request.clientIp,'127.0.0.1');
	inst.setClientIp('192.168.0.1');
	assert.equal(cfEventData(inst).request.clientIp,'192.168.0.1');
}

function testPropertyRequestHttpHeader(inst) {
	assert.deepEqual(cfEventData(inst).request.headers,{});

	inst
		.addRequestHttpHeader('Host','my-hostname.tld')
		.addRequestHttpHeader('User-Agent','curl/7.x.x')
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
				{ key: 'User-Agent',value: 'curl/7.x.x' },
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
	assert.deepEqual(cfEventData(inst).request.origin,{});

	// calling custom/S3 origin methods before origin mode set should throw error
	assert.throws(function() { inst.setRequestOriginKeepaliveTimeout(666); });
	assert.throws(function() { inst.setRequestOriginPort(123); });
	assert.throws(function() { inst.setRequestOriginHttps(); });
	assert.throws(function() { inst.setRequestOriginReadTimeout(6); });
	assert.throws(function() { inst.setRequestOriginSslProtocolList([]); });
	assert.throws(function() { inst.setRequestOriginOAI(); });
	assert.throws(function() { inst.addRequestOriginHttpHeader(); });


	// test: origin [custom]
	inst.setRequestOriginCustom('my-hostname.tld'); // note: `path` defaults to `/`
	assert.deepEqual(cfEventData(inst).request.origin,
		{
			custom: {
				customHeaders: {},
				domainName: 'my-hostname.tld',
				keepaliveTimeout: 1,
				path: '/',
				port: 443,
				protocol: 'https',
				readTimeout: 4,
				sslProtocols: [],
			}
		}
	);

	inst.setRequestOriginCustom('my-hostname.tld','/my/path');
	assert.equal(cfEventData(inst).request.origin.custom.path,'/my/path');

	inst
		.addRequestOriginHttpHeader('User-Agent','curl/7.x.x')
		.addRequestOriginHttpHeader('Multi-Origin-Key','apples')
		.addRequestOriginHttpHeader('Multi-Origin-Key','oranges');

	assert.deepEqual(cfEventData(inst).request.origin.custom.customHeaders,
		{
			'multi-origin-key': [
				{ key: 'Multi-Origin-Key',value: 'apples' },
				{ key: 'Multi-Origin-Key',value: 'oranges' },
			],
			'user-agent': [
				{ key: 'User-Agent',value: 'curl/7.x.x' },
			],
		}
	);

	inst.setRequestOriginKeepaliveTimeout(666);
	assert.equal(cfEventData(inst).request.origin.custom.keepaliveTimeout,666);
	inst.setRequestOriginKeepaliveTimeout('123');
	assert.equal(cfEventData(inst).request.origin.custom.keepaliveTimeout,123);
	inst.setRequestOriginKeepaliveTimeout();
	assert.equal(cfEventData(inst).request.origin.custom.keepaliveTimeout,0);
	inst.setRequestOriginKeepaliveTimeout('invalid');
	assert.equal(cfEventData(inst).request.origin.custom.keepaliveTimeout,0);

	inst.setRequestOriginPort(123);
	assert.equal(cfEventData(inst).request.origin.custom.port,123);
	inst.setRequestOriginPort('666');
	assert.equal(cfEventData(inst).request.origin.custom.port,666);
	inst.setRequestOriginPort();
	assert.equal(cfEventData(inst).request.origin.custom.port,0);
	inst.setRequestOriginPort('invalid');
	assert.equal(cfEventData(inst).request.origin.custom.port,0);

	inst.setRequestOriginHttps();
	assert.equal(cfEventData(inst).request.origin.custom.protocol,'http');
	inst.setRequestOriginHttps(false);
	assert.equal(cfEventData(inst).request.origin.custom.protocol,'http');
	inst.setRequestOriginHttps(true);
	assert.equal(cfEventData(inst).request.origin.custom.protocol,'https');
	inst.setRequestOriginHttps(1);
	assert.equal(cfEventData(inst).request.origin.custom.protocol,'https');

	inst.setRequestOriginReadTimeout(6);
	assert.equal(cfEventData(inst).request.origin.custom.readTimeout,6);
	inst.setRequestOriginReadTimeout('14');
	assert.equal(cfEventData(inst).request.origin.custom.readTimeout,14);
	inst.setRequestOriginReadTimeout();
	assert.equal(cfEventData(inst).request.origin.custom.readTimeout,0);
	inst.setRequestOriginReadTimeout('invalid');
	assert.equal(cfEventData(inst).request.origin.custom.readTimeout,0);

	assert.throws(function() { inst.setRequestOriginSslProtocolList(); });
	assert.throws(function() { inst.setRequestOriginSslProtocolList('not array'); });
	inst.setRequestOriginSslProtocolList(['SSLv3','TLSv1.2','unknown']);
	assert.deepEqual(cfEventData(inst).request.origin.custom.sslProtocols,['SSLv3','TLSv1.2']);
	inst.setRequestOriginSslProtocolList(['unknown']);
	assert.deepEqual(cfEventData(inst).request.origin.custom.sslProtocols,[]);

	// test: origin [custom] - ensure [S3] origin methods throw error when called in custom mode
	assert.throws(function() { inst.setRequestOriginOAI(); });


	// test: origin [S3]
	inst.setRequestOriginS3('my-bucket.s3.ap-southeast-2.amazonaws.com'); // note: `path` defaults to `/`
	assert.deepEqual(cfEventData(inst).request.origin,
		{
			s3: {
				authMethod: 'none',
				customHeaders: {},
				domainName: 'my-bucket.s3.ap-southeast-2.amazonaws.com',
				path: '/',
				region: '',
			}
		}
	);

	inst.setRequestOriginS3('my-bucket.s3.ap-southeast-2.amazonaws.com','ap-southeast-2');
	assert.equal(cfEventData(inst).request.origin.s3.path,'/');
	assert.equal(cfEventData(inst).request.origin.s3.region,'ap-southeast-2');
	inst.setRequestOriginS3('my-bucket.s3.ap-southeast-2.amazonaws.com','ap-southeast-2','/my/path');
	assert.equal(cfEventData(inst).request.origin.s3.path,'/my/path');
	assert.equal(cfEventData(inst).request.origin.s3.region,'ap-southeast-2');

	inst
		.addRequestOriginHttpHeader('User-Agent','curl/7.x.x')
		.addRequestOriginHttpHeader('Multi-Origin-Key','apples')
		.addRequestOriginHttpHeader('Multi-Origin-Key','oranges');

	assert.deepEqual(cfEventData(inst).request.origin.s3.customHeaders,
		{
			'multi-origin-key': [
				{ key: 'Multi-Origin-Key',value: 'apples' },
				{ key: 'Multi-Origin-Key',value: 'oranges' },
			],
			'user-agent': [
				{ key: 'User-Agent',value: 'curl/7.x.x' },
			],
		}
	);

	inst.setRequestOriginOAI();
	assert.equal(cfEventData(inst).request.origin.s3.authMethod,'none');
	inst.setRequestOriginOAI(false);
	assert.equal(cfEventData(inst).request.origin.s3.authMethod,'none');
	inst.setRequestOriginOAI(true);
	assert.equal(cfEventData(inst).request.origin.s3.authMethod,'origin-access-identity');
	inst.setRequestOriginOAI(1);
	assert.equal(cfEventData(inst).request.origin.s3.authMethod,'origin-access-identity');

	// test: origin [S3] - ensure [custom] origin methods throw error when called in S3 mode
	assert.throws(function() { inst.setRequestOriginKeepaliveTimeout(666); });
	assert.throws(function() { inst.setRequestOriginPort(123); });
	assert.throws(function() { inst.setRequestOriginHttps(); });
	assert.throws(function() { inst.setRequestOriginReadTimeout(6); });
	assert.throws(function() { inst.setRequestOriginSslProtocolList([]); });
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
	assert.deepEqual(cfEventData(inst).response.headers,{});

	// note: tested multiple HTTP header combos with `testPropertyRequestHttpHeader()` - so only limited testing here
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
