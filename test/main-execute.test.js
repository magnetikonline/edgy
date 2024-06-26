'use strict';

const assert = require('assert/strict'),
	util = require('./util.js'),
	main = require('./../main.js'),

	runner = new util.TestCaseRunner();


runner.add(async function testExecuteViewerRequest() {
	const vReq = new main.ViewerRequest();

	// test: Lambda@Edge functions with bad argument counts
	rejectsExecuteBadArgCount(vReq);

	// test: Lambda@Edge functions returning errors
	await assert.rejects(vReq.execute(
		async function(event) {
			throw new Error('function went bad');
		}
	));

	await assert.rejects(vReq.execute(
		function(event,context,callback) {
			callback(new Error('function went bad'));
		}
	));

	// test: return invalid request payload
	await assert.rejects(vReq.execute(
		buildEdgeFunctionRequestAsync(function(payload) {
			payload.headers = -1;
		})
	));

	await assert.rejects(vReq.execute(
		buildEdgeFunctionRequestCallback(function(payload) {
			payload.headers = -1;
		})
	));

	// test: successful Lambda@Edge function executions
	vReq
		.setClientIp('1.2.3.4')
		.addRequestHttpHeader('X-My-Header','viewer-request')
		.setHttpMethod('POST')
		.setQuerystring('?test=viewer-request-async');

	const asyncResp = await vReq.execute(
		buildEdgeFunctionRequestAsync(function(payload) {
			payload.uri = '/test/viewer-request-async';
		})
	);

	assert.deepEqual(asyncResp,
		{
			clientIp: '1.2.3.4',
			headers: {
				'x-my-header': [
					{
						key: 'X-My-Header',
						value: 'viewer-request',
					},
				],
			},
			method: 'POST',
			querystring: 'test=viewer-request-async',
			uri: '/test/viewer-request-async',
		}
	);

	vReq.setQuerystring('?test=viewer-request-callback');
	const callbackResp = await vReq.execute(
		buildEdgeFunctionRequestCallback(function(payload) {
			payload.uri = '/test/viewer-request-callback';
		})
	);

	assert.deepEqual(callbackResp,
		{
			clientIp: '1.2.3.4',
			headers: {
				'x-my-header': [
					{
						key: 'X-My-Header',
						value: 'viewer-request',
					},
				],
			},
			method: 'POST',
			querystring: 'test=viewer-request-callback',
			uri: '/test/viewer-request-callback',
		}
	);
});


runner.add(async function testExecuteOriginRequest() {
	const oReq = new main.OriginRequest();
	oReq.setOriginCustom('domain.tld');

	// test: Lambda@Edge functions with bad argument counts
	rejectsExecuteBadArgCount(oReq);

	// test: Lambda@Edge functions returning errors
	await assert.rejects(oReq.execute(
		async function(event) {
			throw new Error('function went bad');
		}
	));

	await assert.rejects(oReq.execute(
		function(event,context,callback) {
			callback(new Error('function went bad'));
		}
	));

	// test: return invalid request payload
	await assert.rejects(oReq.execute(
		buildEdgeFunctionRequestAsync(function(payload) {
			payload.headers = -1;
		})
	));

	await assert.rejects(oReq.execute(
		buildEdgeFunctionRequestCallback(function(payload) {
			payload.headers = -1;
		})
	));

	// test: successful Lambda@Edge function executions
	oReq
		.setClientIp('1.2.3.4')
		.addRequestHttpHeader('X-My-Header','origin-request')
		.setHttpMethod('POST')
		.setQuerystring('?test=origin-request-async');

	const asyncResp = await oReq.execute(
		buildEdgeFunctionRequestAsync(function(payload) {
			payload.uri = '/test/origin-request-async';
		})
	);

	assert.deepEqual(asyncResp,
		{
			clientIp: '1.2.3.4',
			headers: {
				'x-my-header': [
					{
						key: 'X-My-Header',
						value: 'origin-request',
					},
				],
			},
			method: 'POST',
			origin: {
				custom: {
					customHeaders: {},
					domainName: 'domain.tld',
					keepaliveTimeout: 1,
					path: '',
					port: 443,
					protocol: 'https',
					readTimeout: 4,
					sslProtocols: [],
				},
			},
			querystring: 'test=origin-request-async',
			uri: '/test/origin-request-async',
		}
	);

	oReq.setQuerystring('?test=origin-request-callback');
	const callbackResp = await oReq.execute(
		buildEdgeFunctionRequestCallback(function(payload) {
			payload.uri = '/test/origin-request-callback';
		})
	);

	assert.deepEqual(callbackResp,
		{
			clientIp: '1.2.3.4',
			headers: {
				'x-my-header': [
					{
						key: 'X-My-Header',
						value: 'origin-request',
					},
				],
			},
			method: 'POST',
			origin: {
				custom: {
					customHeaders: {},
					domainName: 'domain.tld',
					keepaliveTimeout: 1,
					path: '',
					port: 443,
					protocol: 'https',
					readTimeout: 4,
					sslProtocols: [],
				},
			},
			querystring: 'test=origin-request-callback',
			uri: '/test/origin-request-callback',
		}
	);
});


runner.add(async function testExecuteOriginResponse() {
	const oRsp = new main.OriginResponse();

	// test: Lambda@Edge functions with bad argument counts
	rejectsExecuteBadArgCount(oRsp);

	// test: Lambda@Edge functions returning errors
	await assert.rejects(oRsp.execute(
		async function(event) {
			throw new Error('function went bad');
		}
	));

	await assert.rejects(oRsp.execute(
		function(event,context,callback) {
			callback(new Error('function went bad'));
		}
	));

	// test: return invalid response payload
	await assert.rejects(oRsp.execute(
		buildEdgeFunctionResponseAsync(function(payload) {
			payload.headers = -1;
		})
	));

	await assert.rejects(oRsp.execute(
		buildEdgeFunctionResponseCallback(function(payload) {
			payload.headers = -1;
		})
	));

	// test: successful Lambda@Edge function executions
	oRsp
		.addResponseHttpHeader('X-My-Header','origin-response')
		.setResponseHttpStatusCode(304);

	const asyncResp = await oRsp.execute(
		buildEdgeFunctionResponseAsync(function(payload) {
			payload.statusDescription = 'Mutated async';
		})
	);

	assert.deepEqual(asyncResp,
		{
			headers: {
				'x-my-header': [
					{
						key: 'X-My-Header',
						value: 'origin-response',
					},
				],
			},
			status: '304',
			statusDescription: 'Mutated async',
		}
	);

	const callbackResp = await oRsp.execute(
		buildEdgeFunctionResponseCallback(function(payload) {
			payload.statusDescription = 'Mutated callback';
		})
	);

	assert.deepEqual(callbackResp,
		{
			headers: {
				'x-my-header': [
					{
						key: 'X-My-Header',
						value: 'origin-response',
					},
				],
			},
			status: '304',
			statusDescription: 'Mutated callback',
		}
	);
});


runner.add(async function testExecuteViewerResponse() {
	const vRsp = new main.ViewerResponse();

	// test: Lambda@Edge functions with bad argument counts
	rejectsExecuteBadArgCount(vRsp);

	// test: Lambda@Edge functions returning errors
	await assert.rejects(vRsp.execute(
		async function(event) {
			throw new Error('function went bad');
		}
	));

	await assert.rejects(vRsp.execute(
		function(event,context,callback) {
			callback(new Error('function went bad'));
		}
	));

	// test: return invalid response payload
	await assert.rejects(vRsp.execute(
		buildEdgeFunctionResponseAsync(function(payload) {
			payload.headers = -1;
		})
	));

	await assert.rejects(vRsp.execute(
		buildEdgeFunctionResponseCallback(function(payload) {
			payload.headers = -1;
		})
	));

	// test: successful Lambda@Edge function executions
	vRsp
		.addResponseHttpHeader('X-My-Header','viewer-response')
		.setResponseHttpStatusCode(304);

	const asyncResp = await vRsp.execute(
		buildEdgeFunctionResponseAsync(function(payload) {
			payload.statusDescription = 'Mutated async';
		})
	);

	assert.deepEqual(asyncResp,
		{
			headers: {
				'x-my-header': [
					{
						key: 'X-My-Header',
						value: 'viewer-response',
					},
				],
			},
			status: '304',
			statusDescription: 'Mutated async',
		}
	);

	const callbackResp = await vRsp.execute(
		buildEdgeFunctionResponseCallback(function(payload) {
			payload.statusDescription = 'Mutated callback';
		})
	);

	assert.deepEqual(callbackResp,
		{
			headers: {
				'x-my-header': [
					{
						key: 'X-My-Header',
						value: 'viewer-response',
					},
				],
			},
			status: '304',
			statusDescription: 'Mutated callback',
		}
	);
});


async function rejectsExecuteBadArgCount(inst) {
	await assert.rejects(
		async function() {
			await inst.execute(async function() {
				// note: an async Lambda@Edge function needs 1 or 2 arguments
			});
		},
		{ message: 'unexpected async handler argument count - expecting either one or two arguments' }
	);

	await assert.rejects(
		async function() {
			await inst.execute(function() {
				// note: a callback Lambda@Edge function needs exactly 3 arguments
			});
		},
		{ message: 'unexpected callback handler argument count - expecting exactly three arguments' }
	);
}

function buildEdgeFunctionRequestAsync(mutate) {
	return async function(event) {
		const payload = event.Records[0].cf.request;
		if (mutate) {
			mutate(payload);
		}

		return payload;
	};
}

function buildEdgeFunctionRequestCallback(mutate) {
	return function(event,context,callback) {
		const payload = event.Records[0].cf.request;
		if (mutate) {
			mutate(payload);
		}

		callback(null,payload);
	};
}

function buildEdgeFunctionResponseAsync(mutate) {
	return async function(event) {
		const payload = event.Records[0].cf.response;
		if (mutate) {
			mutate(payload);
		}

		return payload;
	};
}

function buildEdgeFunctionResponseCallback(mutate) {
	return function(event,context,callback) {
		const payload = event.Records[0].cf.response;
		if (mutate) {
			mutate(payload);
		}

		callback(null,payload);
	};
}


runner.execute();
