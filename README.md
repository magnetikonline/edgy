# Edgy

[![Test](https://github.com/magnetikonline/edgy/actions/workflows/test.yaml/badge.svg)](https://github.com/magnetikonline/edgy/actions/workflows/test.yaml)

Npm module providing a harness for authoring unit or integration tests against Node.js based AWS CloudFront [Lambda@Edge](https://docs.aws.amazon.com/lambda/latest/dg/lambda-edge.html) functions.

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
	- [setRequestBody(data[,isTruncated])](#setrequestbodydataistruncated)
	- [addRequestHttpHeader(key,value)](#addrequesthttpheaderkeyvalue)
	- [setRequestOriginCustom(domainName[,path])](#setrequestorigincustomdomainnamepath)
	- [setRequestOriginKeepaliveTimeout(timeout)](#setrequestoriginkeepalivetimeouttimeout)
	- [setRequestOriginPort(port)](#setrequestoriginportport)
	- [setRequestOriginHttps(isHttps)](#setrequestoriginhttpsishttps)
	- [setRequestOriginReadTimeout(timeout)](#setrequestoriginreadtimeouttimeout)
	- [setRequestOriginSslProtocolList(protocolList)](#setrequestoriginsslprotocollistprotocollist)
	- [setRequestOriginS3(domainName[,region][,path])](#setrequestorigins3domainnameregionpath)
	- [setRequestOriginOAI(isOAI)](#setrequestoriginoaiisoai)
	- [addRequestOriginHttpHeader(key,value)](#addrequestoriginhttpheaderkeyvalue)
	- [setResponseHttpStatusCode(code)](#setresponsehttpstatuscodecode)
	- [addResponseHttpHeader(key,value)](#addresponsehttpheaderkeyvalue)
	- [execute(handler)](#executehandler)
- [Reference](#reference)

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
    // example edge function
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
- [setRequestBody(data[,isTruncated])](#setrequestbodydataistruncated)
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
    .setRequestOriginS3('mybucket.s3.ap-southeast-2.amazonaws.com','ap-southeast-2');

  const resp = await oReq.execute(
    // example edge function
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
        path: '/',
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
- [setRequestBody(data[,isTruncated])](#setrequestbodydataistruncated)
- [addRequestHttpHeader(key,value)](#addrequesthttpheaderkeyvalue)
- [setRequestOriginCustom(domainName[,path])](#setrequestorigincustomdomainnamepath)
- [setRequestOriginKeepaliveTimeout(timeout)](#setrequestoriginkeepalivetimeouttimeout)
- [setRequestOriginPort(port)](#setrequestoriginportport)
- [setRequestOriginHttps(isHttps)](#setrequestoriginhttpsishttps)
- [setRequestOriginReadTimeout(timeout)](#setrequestoriginreadtimeouttimeout)
- [setRequestOriginSslProtocolList(protocolList)](#setrequestoriginsslprotocollistprotocollist)
- [setRequestOriginS3(domainName[,region][,path])](#setrequestorigins3domainnameregionpath)
- [setRequestOriginOAI(isOAI)](#setrequestoriginoaiisoai)
- [addRequestOriginHttpHeader(key,value)](#addrequestoriginhttpheaderkeyvalue)
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
    // example edge function
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
- [addRequestHttpHeader(key,value)](#addrequesthttpheaderkeyvalue)
- [setRequestOriginCustom(domainName[,path])](#setrequestorigincustomdomainnamepath)
- [setRequestOriginKeepaliveTimeout(timeout)](#setrequestoriginkeepalivetimeouttimeout)
- [setRequestOriginPort(port)](#setrequestoriginportport)
- [setRequestOriginHttps(isHttps)](#setrequestoriginhttpsishttps)
- [setRequestOriginReadTimeout(timeout)](#setrequestoriginreadtimeouttimeout)
- [setRequestOriginSslProtocolList(protocolList)](#setrequestoriginsslprotocollistprotocollist)
- [setRequestOriginS3(domainName[,region][,path])](#setrequestorigins3domainnameregionpath)
- [setRequestOriginOAI(isOAI)](#setrequestoriginoaiisoai)
- [addRequestOriginHttpHeader(key,value)](#addrequestoriginhttpheaderkeyvalue)
- [setResponseHttpStatusCode(code)](#setresponsehttpstatuscodecode)
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
    // example edge function
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
- [addRequestHttpHeader(key,value)](#addrequesthttpheaderkeyvalue)
- [setResponseHttpStatusCode(code)](#setresponsehttpstatuscodecode)
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

### `setRequestBody(data[,isTruncated])`

Adds a collection of request `body` properties. The given `data` will be base64 encoded automatically:

```js
const harness = new edgy.EVENT_TYPE_CONSTRUCTOR();
harness.setRequestBody('data payload',false);

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

### `addRequestHttpHeader(key,value)`

Adds HTTP header items to the request payload:

```js
const harness = new edgy.EVENT_TYPE_CONSTRUCTOR();
harness
  .addRequestHttpHeader('User-Agent','curl/7.66.0')
  .addRequestHttpHeader('X-Custom-Header','apples');

/*
{
  Records: [
    {
      cf: {
        request: {
          headers: {
            'user-agent': [ { key: 'User-Agent', value: 'curl/7.66.0' } ],
            'x-custom-header': [ { key: 'X-Custom-Header', value: 'apples' } ]
          }
        }
      }
    }
  ]
}
*/
```

### `setRequestOriginCustom(domainName[,path])`

### `setRequestOriginKeepaliveTimeout(timeout)`

### `setRequestOriginPort(port)`

### `setRequestOriginHttps(isHttps)`

### `setRequestOriginReadTimeout(timeout)`

### `setRequestOriginSslProtocolList(protocolList)`

Methods to define a custom origin property set for the request event payload:

```js
const harness = new edgy.EVENT_TYPE_CONSTRUCTOR();
harness
  .setRequestOriginCustom('example.org','/custom/origin/path')
  .setRequestOriginKeepaliveTimeout(35)
  .setRequestOriginPort(1234)
  .setRequestOriginHttps(true)
  .setRequestOriginReadTimeout(25)
  .setRequestOriginSslProtocolList(['TLSv1.1','TLSv1.2']);

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

### `setRequestOriginS3(domainName[,region][,path])`

### `setRequestOriginOAI(isOAI)`

Methods to define an S3 origin property set for the request event payload:

```js
const harness = new edgy.EVENT_TYPE_CONSTRUCTOR();
harness
  .setRequestOriginS3(
    'mybucket.s3.ap-southeast-2.amazonaws.com',
    'ap-southeast-2',
    '/s3/bucket/path')
  .setRequestOriginOAI(true);

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

### `addRequestOriginHttpHeader(key,value)`

Adds HTTP header items to the request origin event payload for both [custom](#setrequestorigincustomdomainnamepath) and [s3](#setrequestorigins3domainnameregionpath) targets:

```js
const harness = new edgy.EVENT_TYPE_CONSTRUCTOR();
harness
  .setRequestOriginS3(
    'mybucket.s3.ap-southeast-2.amazonaws.com',
    'ap-southeast-2',
    '/s3/bucket/path')
  .addRequestOriginHttpHeader('X-Custom-Header','apples')
  .addRequestOriginHttpHeader('X-Custom-Header','oranges');

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
```

### `setResponseHttpStatusCode(code)`

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

- High level validations are performed against returned payload, verifying it should _at a minimum_ pass as a usable response by CloudFront. This should in _no way_ be considered comprehensive/complete, but should help catch obvious malformed payload cases.
- Return the transformed payload from the executed Lambda@Edge function, allowing for additional assertions to be performed.

```js
const harness = new edgy.EVENT_TYPE_CONSTRUCTOR();

// --- construct Lambda@Edge event payload using instance methods ---
// .setHttpMethod()
// .setUri()
// .setQuerystring()
// etc.

// execute function against payload
const resp = await vRsp.execute(
  // example edge function
  async function(event) {
    return event.Records[0].cf.response;
  }
);
```

## Reference

- [Using AWS Lambda with CloudFront Lambda@Edge](https://docs.aws.amazon.com/lambda/latest/dg/lambda-edge.html)
- [Lambda@Edge event structure](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/lambda-event-structure.html)
- [Restrictions on edge functions](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/edge-functions-restrictions.html)
