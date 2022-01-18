'use strict';

const lib = require('./lib.js');


class ViewerRequest extends lib.EdgeEventRequestBase {
	constructor() {
		super('viewer-request',false);
	}

	_payloadVerify(payload) {
		lib.payloadVerifyRequest(payload);
	}
}

class OriginRequest extends lib.EdgeEventRequestBase {
	constructor() {
		super('origin-request',true);
	}

	// [set|add]RequestOrigin*() methods shared by `OriginRequest` / `OriginResponse`
	setRequestOriginCustom(domainName,path) {
		lib.setEdgeEventRequestOriginCustom(this._event,domainName,path);
		return this;
	}

	setRequestOriginKeepaliveTimeout(timeout) {
		lib.setEdgeEventRequestOriginKeepaliveTimeout(this._event,timeout);
		return this;
	}

	setRequestOriginPort(port) {
		lib.setEdgeEventRequestOriginPort(this._event,port);
		return this;
	}

	setRequestOriginHttps(isHttps) {
		lib.setEdgeEventRequestOriginHttps(this._event,isHttps);
		return this;
	}

	setRequestOriginReadTimeout(timeout) {
		lib.setEdgeEventRequestOriginReadTimeout(this._event,timeout);
		return this;
	}

	setRequestOriginSslProtocolList(protocolList) {
		lib.setEdgeEventRequestOriginSslProtocolList(this._event,protocolList);
		return this;
	}

	setRequestOriginS3(domainName,region,path) {
		lib.setEdgeEventRequestOriginS3(this._event,domainName,region,path);
		return this;
	}

	setRequestOriginOAI(isOAI) {
		lib.setEdgeEventRequestOriginOAI(this._event,isOAI);
		return this;
	}

	addRequestOriginHttpHeader(key,value) {
		lib.addEdgeEventRequestOriginHttpHeader(this._event,key,value);
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

	// [set|add]RequestOrigin*() methods shared by `OriginRequest` / `OriginResponse`
	setRequestOriginCustom(domainName,path) {
		lib.setEdgeEventRequestOriginCustom(this._event,domainName,path);
		return this;
	}

	setRequestOriginKeepaliveTimeout(timeout) {
		lib.setEdgeEventRequestOriginKeepaliveTimeout(this._event,timeout);
		return this;
	}

	setRequestOriginPort(port) {
		lib.setEdgeEventRequestOriginPort(this._event,port);
		return this;
	}

	setRequestOriginHttps(isHttps) {
		lib.setEdgeEventRequestOriginHttps(this._event,isHttps);
		return this;
	}

	setRequestOriginReadTimeout(timeout) {
		lib.setEdgeEventRequestOriginReadTimeout(this._event,timeout);
		return this;
	}

	setRequestOriginSslProtocolList(protocolList) {
		lib.setEdgeEventRequestOriginSslProtocolList(this._event,protocolList);
		return this;
	}

	setRequestOriginS3(domainName,region,path) {
		lib.setEdgeEventRequestOriginS3(this._event,domainName,region,path);
		return this;
	}

	setRequestOriginOAI(isOAI) {
		lib.setEdgeEventRequestOriginOAI(this._event,isOAI);
		return this;
	}

	addRequestOriginHttpHeader(key,value) {
		lib.addEdgeEventRequestOriginHttpHeader(this._event,key,value);
		return this;
	}

	_payloadVerify(payload) {
		lib.payloadVerifyResponse(payload);
	}
}

class ViewerResponse extends lib.EdgeEventResponseBase {
	constructor() {
		super('viewer-response',false);
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
