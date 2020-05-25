# csp-report-lite

A lightweight sink (target) for Content Security Policy `report-uri` reporting that does initial filtering to hopefully report only as much as a human could reasonably read.

Surface:

1. a docker container with an entire server accepting input and logging json to stdout, errors to stderr
2. a request handler for a node server
3. a report aggregator function for doing the logic

More docs coming soon. Typings are available to explain more details

## Usage

See usage example in server.js file

### API
Docs generated using [`docts`](https://github.com/charto/docts)
>
> <a name="api-AggrOptions"></a>
> ### Interface [`AggrOptions`](#api-AggrOptions)
> <em>Aggregator options</em>  
> Source code: [`<>`](http://github.com/naugtur/csp-report-lite/blob/master/index.d.ts#L37-L42)  
>  
> Properties:  
> > **.target** <sup><code>TargetCallback</code></sup>  
> > **.cacheLimit** <sup><code>number</code></sup>  
> > **.cacheTTL** <sup><code>number</code></sup>  
> > **.exponentialAggregation** <sup><code>string</code></sup>  
>
> <a name="api-HandlerOptions"></a>
> ### Interface [`HandlerOptions`](#api-HandlerOptions)
> <em>Handler options</em>  
> Source code: [`<>`](http://github.com/naugtur/csp-report-lite/blob/master/index.d.ts#L23-L31)  
>  
> Properties:  
> > **.beforeReport** <sup><code>(req: any) =&gt; any</code></sup>  
> > **.maxBytes** <sup><code>number</code></sup>  
> > **.logger** <sup><code>(...params: any[]) =&gt; any</code></sup>  
> > **.target** <sup><code>TargetCallback</code></sup>  
> > **.cacheLimit** <sup><code>number</code></sup>  
> > **.cacheTTL** <sup><code>number</code></sup>  
> > **.exponentialAggregation** <sup><code>string</code></sup>  
>
> <a name="api-reportAggregator"></a>
> ### Function [`reportAggregator`](#api-reportAggregator)
> Source code: [`<>`](http://github.com/naugtur/csp-report-lite/blob/master/index.d.ts#L58)  
> > **reportAggregator( )** <sup>&rArr; <code>AcceptReport</code></sup> [`<>`](http://github.com/naugtur/csp-report-lite/blob/master/index.d.ts#L58)  
> > &emsp;&#x25aa; options <sup><code>[AggrOptions](#api-AggrOptions)</code></sup>  
>
> <a name="api-requestHandler"></a>
> ### Function [`requestHandler`](#api-requestHandler)
> <em>Request handler compatible with Node's http .reateServer</em>  
> Source code: [`<>`](http://github.com/naugtur/csp-report-lite/blob/master/index.d.ts#L57)  
> > **requestHandler( )** <sup>&rArr; <code>RequestListener</code></sup> [`<>`](http://github.com/naugtur/csp-report-lite/blob/master/index.d.ts#L57)  
> > &emsp;&#x25aa; options <sup><code>[HandlerOptions](#api-HandlerOptions)</code></sup>  
