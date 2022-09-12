'use strict';

const assert = require('assert/strict'),
	util = require('./util.js'),
	lib = require('./../lib.js'),

	runner = new util.TestCaseRunner();


runner.add(function testSetEdgeEventResponseHttpStatusCode() {
	const mockEvent = {
		Records: [{
			cf: {
				response: {},
			},
		}],
	};

	function assertStatus(httpCode,description) {
		assert.equal(mockEvent.Records[0].cf.response.status,'' + httpCode);
		assert.equal(mockEvent.Records[0].cf.response.statusDescription,description);
	}

	// unknown HTTP code
	lib.setEdgeEventResponseHttpStatusCode(mockEvent,666);
	assertStatus(666,'');

	// HTTP 20X
	lib.setEdgeEventResponseHttpStatusCode(mockEvent,200);
	assertStatus(200,'OK');
	lib.setEdgeEventResponseHttpStatusCode(mockEvent,201);
	assertStatus(201,'Created');
	lib.setEdgeEventResponseHttpStatusCode(mockEvent,202);
	assertStatus(202,'Accepted');
	lib.setEdgeEventResponseHttpStatusCode(mockEvent,203);
	assertStatus(203,'Non-Authoritative Information');
	lib.setEdgeEventResponseHttpStatusCode(mockEvent,204);
	assertStatus(204,'No Content');
	lib.setEdgeEventResponseHttpStatusCode(mockEvent,205);
	assertStatus(205,'Reset Content');
	lib.setEdgeEventResponseHttpStatusCode(mockEvent,206);
	assertStatus(206,'Partial Content');

	// HTTP 30X
	lib.setEdgeEventResponseHttpStatusCode(mockEvent,300);
	assertStatus(300,'Multiple Choices');
	lib.setEdgeEventResponseHttpStatusCode(mockEvent,301);
	assertStatus(301,'Moved Permanently');
	lib.setEdgeEventResponseHttpStatusCode(mockEvent,302);
	assertStatus(302,'Found');
	lib.setEdgeEventResponseHttpStatusCode(mockEvent,303);
	assertStatus(303,'See Other');
	lib.setEdgeEventResponseHttpStatusCode(mockEvent,304);
	assertStatus(304,'Not Modified');
	lib.setEdgeEventResponseHttpStatusCode(mockEvent,305);
	assertStatus(305,'Use Proxy');
	lib.setEdgeEventResponseHttpStatusCode(mockEvent,307);
	assertStatus(307,'Temporary Redirect');

	// HTTP 4XX
	lib.setEdgeEventResponseHttpStatusCode(mockEvent,400);
	assertStatus(400,'Bad Request');
	lib.setEdgeEventResponseHttpStatusCode(mockEvent,401);
	assertStatus(401,'Unauthorized');
	lib.setEdgeEventResponseHttpStatusCode(mockEvent,402);
	assertStatus(402,'Payment Required');
	lib.setEdgeEventResponseHttpStatusCode(mockEvent,403);
	assertStatus(403,'Forbidden');
	lib.setEdgeEventResponseHttpStatusCode(mockEvent,404);
	assertStatus(404,'Not Found');
	lib.setEdgeEventResponseHttpStatusCode(mockEvent,405);
	assertStatus(405,'Method Not Allowed');
	lib.setEdgeEventResponseHttpStatusCode(mockEvent,406);
	assertStatus(406,'Not Acceptable');
	lib.setEdgeEventResponseHttpStatusCode(mockEvent,407);
	assertStatus(407,'Proxy Authentication Required');
	lib.setEdgeEventResponseHttpStatusCode(mockEvent,408);
	assertStatus(408,'Request Timeout');
	lib.setEdgeEventResponseHttpStatusCode(mockEvent,409);
	assertStatus(409,'Conflict');
	lib.setEdgeEventResponseHttpStatusCode(mockEvent,410);
	assertStatus(410,'Gone');
	lib.setEdgeEventResponseHttpStatusCode(mockEvent,411);
	assertStatus(411,'Length Required');
	lib.setEdgeEventResponseHttpStatusCode(mockEvent,412);
	assertStatus(412,'Precondition Failed');
	lib.setEdgeEventResponseHttpStatusCode(mockEvent,413);
	assertStatus(413,'Request Entity Too Large');
	lib.setEdgeEventResponseHttpStatusCode(mockEvent,414);
	assertStatus(414,'Request-URI Too Long');
	lib.setEdgeEventResponseHttpStatusCode(mockEvent,415);
	assertStatus(415,'Unsupported Media Type');
	lib.setEdgeEventResponseHttpStatusCode(mockEvent,416);
	assertStatus(416,'Requested Range Not Satisfiable');
	lib.setEdgeEventResponseHttpStatusCode(mockEvent,417);
	assertStatus(417,'Expectation Failed');

	// HTTP 50X
	lib.setEdgeEventResponseHttpStatusCode(mockEvent,500);
	assertStatus(500,'Internal Server Error');
	lib.setEdgeEventResponseHttpStatusCode(mockEvent,501);
	assertStatus(501,'Not Implemented');
	lib.setEdgeEventResponseHttpStatusCode(mockEvent,502);
	assertStatus(502,'Bad Gateway');
	lib.setEdgeEventResponseHttpStatusCode(mockEvent,503);
	assertStatus(503,'Service Unavailable');
	lib.setEdgeEventResponseHttpStatusCode(mockEvent,504);
	assertStatus(504,'Gateway Timeout');
	lib.setEdgeEventResponseHttpStatusCode(mockEvent,505);
	assertStatus(505,'HTTP Version Not Supported');
});


runner.add(function testCfEventClone() {
	const source = {
		one: '1',
		two: '2',
		three: [
			1,2,
			{ child: 3 },
		],
		undef: undefined,
	};

	const copy = lib.cfEventClone(source);
	assert.notEqual(copy,source);
	assert.deepEqual(copy,source);
	assert.equal(copy.undef,source.undef);

	copy.one = 'mutate';
	copy.three[0] = 66;
	copy.undef = 'blurg';
	assert.notEqual(copy.one,source.one);
	assert.notDeepEqual(copy.three,source.three);
	assert.notEqual(copy.undef,source.undef);

	// force a circular reference, ensure `lib.cfEventClone()` can handle it
	source.circular = source;
	lib.cfEventClone(source);
});


runner.execute();
