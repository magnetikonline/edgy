# Edgy

[![Test](https://github.com/magnetikonline/edgy/actions/workflows/test.yaml/badge.svg)](https://github.com/magnetikonline/edgy/actions/workflows/test.yaml)

A harness to assist in the authoring of tests for Node.js based AWS CloudFront [Lambda@Edge](https://docs.aws.amazon.com/lambda/latest/dg/lambda-edge.html) functions.

- [Installation](#installation)
- [What can this do?](#what-can-this-do)
- [Usage](#usage)
	- [ViewerRequest()](#viewerrequest)
	- [OriginRequest()](#originrequest)
	- [OriginResponse()](#originresponse)
	- [ViewerResponse()](#viewerresponse)
- [Methods](#methods)
	- [setDistributionDomainName(name)](#setdistributiondomainnamename)
	- [setDistributionId(id)](#setdistributionidid)
	- [setRequestId(id)](#setrequestidid)
	- [setClientIp(ipAddr)](#setclientipipaddr)
	- [setHttpMethod(method)](#sethttpmethodmethod)
	- [setQuerystring(qs)](#setquerystringqs)
	- [setUri(uri)](#seturiuri)
	- [setBody(data[,isTruncated])](#setbodydataistruncated)
	- [setRequestHttpHeader(key[,value])](#setrequesthttpheaderkeyvalue)
	- [addRequestHttpHeader(key,value)](#addrequesthttpheaderkeyvalue)
	- [setOriginCustom(domainName[,path])](#setorigincustomdomainnamepath)
	- [setOriginKeepaliveTimeout(timeout)](#setoriginkeepalivetimeouttimeout)
	- [setOriginPort(port)](#setoriginportport)
	- [setOriginHttps(isHttps)](#setoriginhttpsishttps)
	- [setOriginReadTimeout(timeout)](#setoriginreadtimeouttimeout)
	- [setOriginSslProtocolList(protocolList)](#setoriginsslprotocollistprotocollist)
	- [setOriginS3(domainName[,region][,path])](#setorigins3domainnameregionpath)
	- [setOriginOAI(isOAI)](#setoriginoaiisoai)
	- [setOriginHttpHeader(key[,value])](#setoriginhttpheaderkeyvalue)
	- [addOriginHttpHeader(key,value)](#addoriginhttpheaderkeyvalue)
	- [setResponseHttpStatusCode(code)](#setresponsehttpstatuscodecode)
	- [setResponseHttpHeader(key[,value])](#setresponsehttpheaderkeyvalue)
	- [addResponseHttpHeader(key,value)](#addresponsehttpheaderkeyvalue)
	- [execute(handler)](#executehandler)
- [Reference](#reference)

## Installation

```sh
$ npm install @magnetikonline/edgy
```

## What can this do?

Edgy provides the following:

- Generation of Lambda@Edge [event structures](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/lambda-event-structure.html) for the four available request life cycle points (viewer request, origin request, origin response, viewer response).
- Execution of Lambda@Edge functions in a manner _somewhat similar_ to the CloudFront runtime. Both [`async` and older callback style](https://docs.aws.amazon.com/lambda/latest/dg/nodejs-handler.html) handlers are supported.
- Implements various checks and bounds (duck typing) of payloads returned from edge functions, with the [`execute(handler)`](#executehandler) harness function throwing errors for anything deemed to be malformed.
- Captures the executed Lambda@Edge function payload, allowing for further testing and assertions.

## Usage

Edgy provides four core constructors, which directly relate to each of the [four life cycle points](https://docs.aws.amazon.com/lambda/latest/dg/lambda-edge.html) available in a CloudFront request. With an instance created, the desired event structure is then crafted and a supplied Lambda@Edge function executed against it.

### `ViewerRequest()`

An example of crafting a [viewer request](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/lambda-event-structure.html#example-viewer-request) event payload and executing a dummy function against it:

```js
const edgy = require('@magnetikonline/edgy');

async function myTest() {
  const vReq = new edgy.ViewerRequest();
  vReq
    .setClientIp('1.2.3.4')
    .setHttpMethod('PUT')
    .setUri('/path/to/api/route')
    .addRequestHttpHeader('X-Fancy-Header','apples');

  const resp = await vReq.execute(
    // example Lambda@Edge function
    async function(event) {
      return event.Records[0].cf.request;
    }
  );

  console.dir(resp,{ depth: null });

  /*
  {
    clientIp: '1.2.3.4',
    headers: { 'x-fancy-header': [ { key: 'X-Fancy-Header', value: 'apples' } ] },
    method: 'PUT',
    querystring: '',
    uri: '/path/to/api/route'
  }
  */
}
```

Available methods:

- [setDistributionDomainName(name)](#setdistributiondomainnamename)
- [setDistributionId(id)](#setdistributionidid)
- [setRequestId(id)](#setrequestidid)
- [setClientIp(ipAddr)](#setclientipipaddr)
- [setHttpMethod(method)](#sethttpmethodmethod)
- [setQuerystring(qs)](#setquerystringqs)
- [setUri(uri)](#seturiuri)
- [setBody(data[,isTruncated])](#setbodydataistruncated)
- [setRequestHttpHeader(key[,value])](#setrequesthttpheaderkeyvalue)
- [addRequestHttpHeader(key,value)](#addrequesthttpheaderkeyvalue)
- [execute(handler)](#executehandler)

### `OriginRequest()`

An example of crafting a [origin request](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/lambda-event-structure.html#example-origin-request) event payload and executing a dummy function against it:

```js
const edgy = require('@magnetikonline/edgy');

async function myTest() {
  const oReq = new edgy.OriginRequest();
  oReq
    .setClientIp('1.2.3.4')
    .setHttpMethod('POST')
    .setUri('/path/to/api/route')
    .addRequestHttpHeader('X-Fancy-Header','apples')
    .setOriginS3('mybucket.s3.ap-southeast-2.amazonaws.com','ap-southeast-2');

  const resp = await oReq.execute(
    // example Lambda@Edge function
    async function(event) {
      return event.Records[0].cf.request;
    }
  );

  console.dir(resp,{ depth: null });

  /*
  {
    clientIp: '1.2.3.4',
    headers: { 'x-fancy-header': [ { key: 'X-Fancy-Header', value: 'apples' } ] },
    method: 'POST',
    querystring: '',
    uri: '/path/to/api/route',
    origin: {
      s3: {
        authMethod: 'none',
        customHeaders: {},
        domainName: 'mybucket.s3.ap-southeast-2.amazonaws.com',
        path: '',
        region: 'ap-southeast-2'
      }
    }
  }
  */
}
```

Available methods:

- [setDistributionDomainName(name)](#setdistributiondomainnamename)
- [setDistributionId(id)](#setdistributionidid)
- [setRequestId(id)](#setrequestidid)
- [setClientIp(ipAddr)](#setclientipipaddr)
- [setHttpMethod(method)](#sethttpmethodmethod)
- [setQuerystring(qs)](#setquerystringqs)
- [setUri(uri)](#seturiuri)
- [setBody(data[,isTruncated])](#setbodydataistruncated)
- [setRequestHttpHeader(key[,value])](#setrequesthttpheaderkeyvalue)
- [addRequestHttpHeader(key,value)](#addrequesthttpheaderkeyvalue)
- [setOriginCustom(domainName[,path])](#setorigincustomdomainnamepath)
- [setOriginKeepaliveTimeout(timeout)](#setoriginkeepalivetimeouttimeout)
- [setOriginPort(port)](#setoriginportport)
- [setOriginHttps(isHttps)](#setoriginhttpsishttps)
- [setOriginReadTimeout(timeout)](#setoriginreadtimeouttimeout)
- [setOriginSslProtocolList(protocolList)](#setoriginsslprotocollistprotocollist)
- [setOriginS3(domainName[,region][,path])](#setorigins3domainnameregionpath)
- [setOriginOAI(isOAI)](#setoriginoaiisoai)
- [setOriginHttpHeader(key[,value])](#setoriginhttpheaderkeyvalue)
- [addOriginHttpHeader(key,value)](#addoriginhttpheaderkeyvalue)
- [execute(handler)](#executehandler)

### `OriginResponse()`

An example of crafting a [origin response](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/lambda-event-structure.html#lambda-event-structure-response-origin) event payload and executing a dummy function against it:

```js
const edgy = require('@magnetikonline/edgy');

async function myTest() {
  const oRsp = new edgy.OriginResponse();
  oRsp
    .setResponseHttpStatusCode(202)
    .addResponseHttpHeader('X-Fancy-Header','oranges');

  const resp = await oRsp.execute(
    // example Lambda@Edge function
    async function(event) {
      return event.Records[0].cf.response;
    }
  );

  console.dir(resp,{ depth: null });

  /*
  {
    headers: { 'x-fancy-header': [ { key: 'X-Fancy-Header', value: 'oranges' } ] },
    status: '202',
    statusDescription: 'Accepted'
  }
  */
}
```

Available methods:

- [setDistributionDomainName(name)](#setdistributiondomainnamename)
- [setDistributionId(id)](#setdistributionidid)
- [setRequestId(id)](#setrequestidid)
- [setClientIp(ipAddr)](#setclientipipaddr)
- [setHttpMethod(method)](#sethttpmethodmethod)
- [setQuerystring(qs)](#setquerystringqs)
- [setUri(uri)](#seturiuri)
- [setRequestHttpHeader(key[,value])](#setrequesthttpheaderkeyvalue)
- [addRequestHttpHeader(key,value)](#addrequesthttpheaderkeyvalue)
- [setOriginCustom(domainName[,path])](#setorigincustomdomainnamepath)
- [setOriginKeepaliveTimeout(timeout)](#setoriginkeepalivetimeouttimeout)
- [setOriginPort(port)](#setoriginportport)
- [setOriginHttps(isHttps)](#setoriginhttpsishttps)
- [setOriginReadTimeout(timeout)](#setoriginreadtimeouttimeout)
- [setOriginSslProtocolList(protocolList)](#setoriginsslprotocollistprotocollist)
- [setOriginS3(domainName[,region][,path])](#setorigins3domainnameregionpath)
- [setOriginOAI(isOAI)](#setoriginoaiisoai)
- [setOriginHttpHeader(key[,value])](#setoriginhttpheaderkeyvalue)
- [addOriginHttpHeader(key,value)](#addoriginhttpheaderkeyvalue)
- [setResponseHttpStatusCode(code)](#setresponsehttpstatuscodecode)
- [setResponseHttpHeader(key[,value])](#setresponsehttpheaderkeyvalue)
- [addResponseHttpHeader(key,value)](#addresponsehttpheaderkeyvalue)
- [execute(handler)](#executehandler)

### `ViewerResponse()`

An example of crafting a [viewer response](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/lambda-event-structure.html#lambda-event-structure-response-viewer) event payload and executing a dummy function against it:

```js
const edgy = require('@magnetikonline/edgy');

async function myTest() {
  const vRsp = new edgy.ViewerResponse();
  vRsp
    .setResponseHttpStatusCode(304)
    .addResponseHttpHeader('X-Fancy-Header','oranges');

  const resp = await vRsp.execute(
    // example Lambda@Edge function
    async function(event) {
      return event.Records[0].cf.response;
    }
  );

  console.dir(resp,{ depth: null });

  /*
  {
    headers: { 'x-fancy-header': [ { key: 'X-Fancy-Header', value: 'oranges' } ] },
    status: '304',
    statusDescription: 'Not Modified'
  }
  */
}
```

Available methods:

- [setDistributionDomainName(name)](#setdistributiondomainnamename)
- [setDistributionId(id)](#setdistributionidid)
- [setRequestId(id)](#setrequestidid)
- [setClientIp(ipAddr)](#setclientipipaddr)
- [setHttpMethod(method)](#sethttpmethodmethod)
- [setQuerystring(qs)](#setquerystringqs)
- [setUri(uri)](#seturiuri)
- [setRequestHttpHeader(key[,value])](#setrequesthttpheaderkeyvalue)
- [addRequestHttpHeader(key,value)](#addrequesthttpheaderkeyvalue)
- [setResponseHttpStatusCode(code)](#setresponsehttpstatuscodecode)
- [setResponseHttpHeader(key[,value])](#setresponsehttpheaderkeyvalue)
- [addResponseHttpHeader(key,value)](#addresponsehttpheaderkeyvalue)
- [execute(handler)](#executehandler)

## Methods

### `setDistributionDomainName(name)`

### `setDistributionId(id)`

### `setRequestId(id)`

Methods to set properties related to the CloudFront distribution:

```js
const harness = new edgy.EVENT_TYPE_CONSTRUCTOR();
harness
  .setDistributionDomainName('d111111abcdef8.cloudfront.net')
  .setDistributionId('EDFDVBD6EXAMPLE')
  .setRequestId('4TyzHTaYWb1GX1qTfsHhEqV6HUDd_BzoBZnwfnvQc_1oF26ClkoUSEQ==');

/*
{
  Records: [
    {
      cf: {
        config: {
          distributionDomainName: 'd111111abcdef8.cloudfront.net',
          distributionId: 'EDFDVBD6EXAMPLE',
          requestId: '4TyzHTaYWb1GX1qTfsHhEqV6HUDd_BzoBZnwfnvQc_1oF26ClkoUSEQ=='
        }
      }
    }
  ]
}
*/
```

### `setClientIp(ipAddr)`

### `setHttpMethod(method)`

### `setQuerystring(qs)`

### `setUri(uri)`

Methods to set general properties related to the request sent from the client:

```js
const harness = new edgy.EVENT_TYPE_CONSTRUCTOR();
harness
  .setClientIp('203.0.113.178')
  .setHttpMethod('GET')
  .setQuerystring('?key=value')
  .setUri('/path/to/route');

/*
{
  Records: [
    {
      cf: {
        request: {
          clientIp: '203.0.113.178',
          method: 'GET',
          querystring: 'key=value',
          uri: '/path/to/route'
        }
      }
    }
  ]
}
*/
```

### `setBody(data[,isTruncated])`

Adds a collection of request `body` properties. The given `data` will be automatically `base64` encoded:

```js
const harness = new edgy.EVENT_TYPE_CONSTRUCTOR();
harness.setBody('data payload',false);

/*
{
  Records: [
    {
      cf: {
        request: {
          body: {
            action: 'read-only',
            data: 'ZGF0YSBwYXlsb2Fk',
            encoding: 'base64',
            inputTruncated: false
          }
        }
      }
    }
  ]
}
*/
```

### `setRequestHttpHeader(key[,value])`
### `addRequestHttpHeader(key,value)`

Sets/adds HTTP headers to the request payload:

```js
const harness = new edgy.EVENT_TYPE_CONSTRUCTOR();
harness
  .addRequestHttpHeader('User-Agent','curl/8.4.0')
  .addRequestHttpHeader('X-Custom-Header','apples')
  .addRequestHttpHeader('X-Custom-Header','oranges');

/*
{
  Records: [
    {
      cf: {
        request: {
          headers: {
            'user-agent': [ { key: 'User-Agent', value: 'curl/8.4.0' } ],
            'x-custom-header': [
              { key: 'X-Custom-Header', value: 'apples' },
              { key: 'X-Custom-Header', value: 'oranges' }
            ]
          }
        }
      }
    }
  ]
}
*/

harness
  .setRequestHttpHeader('User-Agent','xyz')
  .setRequestHttpHeader('X-Custom-Header'); // remove HTTP header

/*
{
  Records: [
    {
      cf: {
        request: {
          headers: {
            'user-agent': [ { key: 'User-Agent', value: 'xyz' } ]
          }
        }
      }
    }
  ]
}
*/
```

### `setOriginCustom(domainName[,path])`

### `setOriginKeepaliveTimeout(timeout)`

### `setOriginPort(port)`

### `setOriginHttps(isHttps)`

### `setOriginReadTimeout(timeout)`

### `setOriginSslProtocolList(protocolList)`

Methods to define a custom origin property set for the request event payload:

```js
const harness = new edgy.EVENT_TYPE_CONSTRUCTOR();
harness
  .setOriginCustom('example.org','/custom/origin/path')
  .setOriginKeepaliveTimeout(35)
  .setOriginPort(1234)
  .setOriginHttps(true)
  .setOriginReadTimeout(25)
  .setOriginSslProtocolList(['TLSv1.1','TLSv1.2']);

/*
{
  Records: [
    {
      cf: {
        request: {
          origin: {
            custom: {
              customHeaders: {},
              domainName: 'example.org',
              keepaliveTimeout: 35,
              path: '/custom/origin/path',
              port: 1234,
              protocol: 'https',
              readTimeout: 25,
              sslProtocols: [ 'TLSv1.1', 'TLSv1.2' ]
            }
          }
        }
      }
    }
  ]
}
*/
```

### `setOriginS3(domainName[,region][,path])`

### `setOriginOAI(isOAI)`

Methods to define an S3 origin property set for the request event payload:

```js
const harness = new edgy.EVENT_TYPE_CONSTRUCTOR();
harness
  .setOriginS3(
    'mybucket.s3.ap-southeast-2.amazonaws.com',
    'ap-southeast-2',
    '/s3/bucket/path')
  .setOriginOAI(true);

/*
{
  Records: [
    {
      cf: {
        request: {
          origin: {
            s3: {
              authMethod: 'origin-access-identity',
              customHeaders: {},
              domainName: 'mybucket.s3.ap-southeast-2.amazonaws.com',
              path: '/s3/bucket/path',
              region: 'ap-southeast-2'
            }
          }
        }
      }
    }
  ]
}
*/
```

### `setOriginHttpHeader(key[,value])`
### `addOriginHttpHeader(key,value)`

Sets/adds HTTP headers to the origin request payload for [custom](#setorigincustomdomainnamepath) and [S3](#setorigins3domainnameregionpath) targets:

```js
const harness = new edgy.EVENT_TYPE_CONSTRUCTOR();
harness
  .setOriginS3(
    'mybucket.s3.ap-southeast-2.amazonaws.com',
    'ap-southeast-2',
    '/s3/bucket/path')
  .addOriginHttpHeader('X-Custom-Header','apples')
  .addOriginHttpHeader('X-Custom-Header','oranges');

/*
{
  Records: [
    {
      cf: {
        request: {
          origin: {
            s3: {
              customHeaders: {
                'x-custom-header': [
                  { key: 'X-Custom-Header', value: 'apples' },
                  { key: 'X-Custom-Header', value: 'oranges' }
                ]
              }
            }
          }
        }
      }
    }
  ]
}
*/

harness.setOriginHttpHeader('X-Custom-Header'); // remove HTTP header

/*
{
  Records: [
    {
      cf: {
        request: {
          origin: {
            s3: {
              customHeaders: {}
            }
          }
        }
      }
    }
  ]
}
*/
```

### `setResponseHttpStatusCode(code)`
### `setResponseHttpHeader(key[,value])`
### `addResponseHttpHeader(key,value)`

Methods to set properties related to the response received from the upstream CloudFront target:

```js
const harness = new edgy.EVENT_TYPE_CONSTRUCTOR();
harness
  .setResponseHttpStatusCode(304)
  .addResponseHttpHeader('X-Fancy-Header','oranges');

/*
{
  Records: [
    {
      cf: {
        response: {
          headers: {
            'x-fancy-header': [ { key: 'X-Fancy-Header', value: 'oranges' } ]
          },
          status: '304',
          statusDescription: 'Not Modified'
        }
      }
    }
  ]
}
*/
```

### `execute(handler)`

Executes a Lambda@Edge function, passing a constructed event payload. Supports both [`async` and older callback style](https://docs.aws.amazon.com/lambda/latest/dg/nodejs-handler.html) function handlers.

After successful execution:

- A series of validations are performed against the returned payload, verifying _it should_ be a usable response for CloudFront to accept. In _no way_ consider this to be comprehensive or complete - but should catch many obvious malformed payloads.
- Return the transformed payload from the executed Lambda@Edge function, where additional assertions can then be performed.

```js
const harness = new edgy.EVENT_TYPE_CONSTRUCTOR();

// -- construct event payload using instance methods --
// .setHttpMethod()
// .setUri()
// .setQuerystring()
// etc.

// execute function against payload
const resp = await harness.execute(
  // example Lambda@Edge function
  async function(event) {
    return event.Records[0].cf.response;
  }
);
```

## Reference

- [Using AWS Lambda with CloudFront Lambda@Edge](https://docs.aws.amazon.com/lambda/latest/dg/lambda-edge.html)
- [Lambda@Edge event structure](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/lambda-event-structure.html)
- [Restrictions on edge functions](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/edge-functions-restrictions.html)
