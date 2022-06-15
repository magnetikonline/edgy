'use strict';

const lib = require('./lib.js');


class ViewerRequest extends lib.EdgeEventRequestBase {
	constructor() {
		super('viewer-request');
	}

	_payloadVerify(payload) {
		lib.payloadVerifyRequest(payload);
	}
}

class OriginRequest extends lib.EdgeEventRequestBase {
	constructor() {
		super('origin-request',true);
	}

	// [set|add]Origin*() methods shared by `OriginRequest` / `OriginResponse`
	setOriginCustom(domainName,path) {
		lib.setEdgeEventOriginCustom(this._event,domainName,path);
		return this;
	}

	setOriginKeepaliveTimeout(timeout) {
		lib.setEdgeEventOriginKeepaliveTimeout(this._event,timeout);
		return this;
	}

	setOriginPort(port) {
		lib.setEdgeEventOriginPort(this._event,port);
		return this;
	}

	setOriginHttps(isHttps) {
		lib.setEdgeEventOriginHttps(this._event,isHttps);
		return this;
	}

	setOriginReadTimeout(timeout) {
		lib.setEdgeEventOriginReadTimeout(this._event,timeout);
		return this;
	}

	setOriginSslProtocolList(protocolList) {
		lib.setEdgeEventOriginSslProtocolList(this._event,protocolList);
		return this;
	}

	setOriginS3(domainName,region,path) {
		lib.setEdgeEventOriginS3(this._event,domainName,region,path);
		return this;
	}

	setOriginOAI(isOAI) {
		lib.setEdgeEventOriginOAI(this._event,isOAI);
		return this;
	}

	setOriginHttpHeader(key,value) {
		lib.setEdgeEventOriginHttpHeader(this._event,key,value);
		return this;
	}

	addOriginHttpHeader(key,value) {
		lib.addEdgeEventOriginHttpHeader(this._event,key,value);
		return this;
	}

	_payloadVerify(payload) {
		lib.payloadVerifyRequest(payload);
		lib.payloadVerifyRequestOrigin(payload);
	}
}

class OriginResponse extends lib.EdgeEventResponseBase {
	constructor() {
		super('origin-response',true);
	}

	// [set|add]Origin*() methods shared by `OriginRequest` / `OriginResponse`
	setOriginCustom(domainName,path) {
		lib.setEdgeEventOriginCustom(this._event,domainName,path);
		return this;
	}

	setOriginKeepaliveTimeout(timeout) {
		lib.setEdgeEventOriginKeepaliveTimeout(this._event,timeout);
		return this;
	}

	setOriginPort(port) {
		lib.setEdgeEventOriginPort(this._event,port);
		return this;
	}

	setOriginHttps(isHttps) {
		lib.setEdgeEventOriginHttps(this._event,isHttps);
		return this;
	}

	setOriginReadTimeout(timeout) {
		lib.setEdgeEventOriginReadTimeout(this._event,timeout);
		return this;
	}

	setOriginSslProtocolList(protocolList) {
		lib.setEdgeEventOriginSslProtocolList(this._event,protocolList);
		return this;
	}

	setOriginS3(domainName,region,path) {
		lib.setEdgeEventOriginS3(this._event,domainName,region,path);
		return this;
	}

	setOriginOAI(isOAI) {
		lib.setEdgeEventOriginOAI(this._event,isOAI);
		return this;
	}

	setOriginHttpHeader(key,value) {
		lib.setEdgeEventOriginHttpHeader(this._event,key,value);
		return this;
	}

	addOriginHttpHeader(key,value) {
		lib.addEdgeEventOriginHttpHeader(this._event,key,value);
		return this;
	}

	_payloadVerify(payload) {
		lib.payloadVerifyResponse(payload);
	}
}

class ViewerResponse extends lib.EdgeEventResponseBase {
	constructor() {
		super('viewer-response');
	}

	_payloadVerify(payload) {
		lib.payloadVerifyResponse(payload);
	}
}


module.exports = {
	ViewerRequest,
	OriginRequest,
	OriginResponse,
	ViewerResponse,
};
