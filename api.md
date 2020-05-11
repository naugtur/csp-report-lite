## Typedefs

<dl>
<dt><a href="#AggregatedReport">AggregatedReport</a> : <code>Object</code></dt>
<dd><p>Aggregated Report</p>
</dd>
<dt><a href="#TargetCallback">TargetCallback</a> : <code>function</code></dt>
<dd><p>Target Callback - the function accepting the aggregated report</p>
</dd>
<dt><a href="#HandlerOptions">HandlerOptions</a> : <code>Object</code></dt>
<dd><p>Handler options</p>
</dd>
<dt><a href="#AggrOptions">AggrOptions</a> : <code>Object</code></dt>
<dd><p>Aggregator options</p>
</dd>
<dt><a href="#RequestHandler">RequestHandler</a> : <code>function</code></dt>
<dd><p>Request Handler</p>
</dd>
<dt><a href="#AcceptReport">AcceptReport</a> : <code>function</code></dt>
<dd><p>Accept Report</p>
</dd>
</dl>

<a name="AggregatedReport"></a>

## AggregatedReport : <code>Object</code>
Aggregated Report

**Kind**: global typedef  
**Properties**

| Name | Type |
| --- | --- |
| key | <code>string</code> | 
| count | <code>number</code> | 
| report | <code>Object</code> | 
| userAgent | <code>string</code> | 

<a name="TargetCallback"></a>

## TargetCallback : <code>function</code>
Target Callback - the function accepting the aggregated report

**Kind**: global typedef  

| Param | Type |
| --- | --- |
| aggregatedReport | [<code>AggregatedReport</code>](#AggregatedReport) | 

<a name="HandlerOptions"></a>

## HandlerOptions : <code>Object</code>
Handler options

**Kind**: global typedef  
**Properties**

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| maxBytes | <code>number</code> | <code>50000</code> |  |
| logger | <code>function</code> |  | logger function, defaults to console.log |
| target | [<code>TargetCallback</code>](#TargetCallback) |  | function accepting the aggregated report |
| cacheLimit | <code>number</code> | <code>10000</code> |  |
| cacheTTL | <code>number</code> | <code>86400000</code> |  |
| exponentialAggregation | <code>boolean</code> | <code>true</code> |  |

<a name="AggrOptions"></a>

## AggrOptions : <code>Object</code>
Aggregator options

**Kind**: global typedef  
**Properties**

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| target | [<code>TargetCallback</code>](#TargetCallback) |  | function accepting the aggregated report |
| cacheLimit | <code>number</code> | <code>10000</code> |  |
| cacheTTL | <code>number</code> | <code>86400000</code> |  |
| exponentialAggregation | <code>boolean</code> | <code>true</code> |  |

<a name="RequestHandler"></a>

## RequestHandler : <code>function</code>
Request Handler

**Kind**: global typedef  

| Param | Type |
| --- | --- |
| req | <code>Request</code> | 
| res | <code>Response</code> | 

<a name="AcceptReport"></a>

## AcceptReport : <code>function</code>
Accept Report

**Kind**: global typedef  

| Param | Type |
| --- | --- |
| reportInput | <code>ReportInput</code> | 

