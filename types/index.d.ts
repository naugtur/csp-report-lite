declare module "src/report" {
    namespace _exports {
        export { ReportAggregatorOptions };
    }
    namespace _exports {
        /**
         * @param {ReportAggregatorOptions} options
         */
        function reportAggregator({ cacheLimit, cacheTTL, exponentialAggregation, target, }: ReportAggregatorOptions): ({ report, customFields }: {
            report: Record<string, any>;
            customFields?: Record<string, any> | undefined;
        }) => void;
    }
    export = _exports;
    type ReportAggregatorOptions = {
        /**
         * - maximum number of reports to keep in memory
         */
        cacheLimit?: number | undefined;
        /**
         * - time in milliseconds to keep reports in memory
         */
        cacheTTL?: number | undefined;
        /**
         * - aggregation strategy to use
         */
        exponentialAggregation?: string | undefined;
        /**
         * - function to call with the aggregated report
         */
        target?: ((data: {
            key?: string;
            count?: number;
            report: Record<string, any>;
            [k: string]: any;
        }) => void) | undefined;
    };
}
declare module "src/requestHandler" {
    namespace _exports {
        export { ReportAggregatorOptions, RequestHandlerSpecificOptions, RequestHandlerOptions };
    }
    namespace _exports {
        /**
         * @param {RequestHandlerOptions} options
         * @returns {(req: import('http').IncomingMessage, res: import('http').ServerResponse) => void}
         */
        function requestHandler(options: RequestHandlerOptions): (req: import("http").IncomingMessage, res: import("http").ServerResponse) => void;
    }
    export = _exports;
    type ReportAggregatorOptions = import("src/report").ReportAggregatorOptions;
    type RequestHandlerSpecificOptions = {
        /**
         * Maximum number of bytes allowed in the request body (to avoid DoS, but accept long reports)
         */
        maxBytes?: number | undefined;
        /**
         * Function to call for logging errors (as opposed to writing the reports)
         */
        logger?: ((err: any) => void) | undefined;
        /**
         * Function to extract custom fields from the request before processing. Default extracts user-agent.
         */
        beforeReport?: ((req: import("http").IncomingMessage) => Record<string, any>) | undefined;
    };
    type RequestHandlerOptions = ReportAggregatorOptions & RequestHandlerSpecificOptions;
}
declare module "index" {
    export let requestHandler: (options: RequestHandlerOptions) => (req: import("http").IncomingMessage, res: import("http").ServerResponse) => void;
    export let reportAggregator: ({ cacheLimit, cacheTTL, exponentialAggregation, target, }: ReportAggregatorOptions) => ({ report, customFields }: {
        report: Record<string, any>;
        customFields?: Record<string, any> | undefined;
    }) => void;
}
