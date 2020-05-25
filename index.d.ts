import { RequestListener } from "http";

/**
 * Aggregated Report
 */
declare type AggregatedReport = {
    key: string;
    count: number;
    report: any;
    userAgent: string;
};

/**
 * Target Callback - the function accepting the aggregated report
 */
declare type TargetCallback = (aggregatedReport: AggregatedReport) => void;

/**
 * Handler options
 * @property logger - logger function, defaults to console.log
 * @property target - function accepting the aggregated report
 */
declare interface HandlerOptions {
    beforeReport: (req: any) => any;
    maxBytes: number;
    logger: (...params: any[]) => any;
    target: TargetCallback;
    cacheLimit: number;
    cacheTTL: number;
    exponentialAggregation: string;
};

/**
 * Aggregator options
 * @property target - function accepting the aggregated report
 */
declare interface AggrOptions {
    target: TargetCallback;
    cacheLimit: number;
    cacheTTL: number;
    exponentialAggregation: string;
};

/**
 * Accept Report
 */
declare type AcceptReport = (reportInput: ReportInput) => void;

declare module "csp-report-lite" {
    export function requestHandler(options: HandlerOptions): RequestListener;
    export function reportAggregator(options: AggrOptions): AcceptReport;
}

/**
 * Request handler compatible with Node's http .reateServer 
 */
export function requestHandler(options: HandlerOptions): RequestListener;
export function reportAggregator(options: AggrOptions): AcceptReport;