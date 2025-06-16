export let requestHandler: (options: RequestHandlerOptions) => (req: import("http").IncomingMessage, res: import("http").ServerResponse) => void;
export let reportAggregator: ({ cacheLimit, cacheTTL, exponentialAggregation, target, }: ReportAggregatorOptions) => ({ report, customFields }: {
    report: Record<string, any>;
    customFields?: Record<string, any> | undefined;
}) => void;
