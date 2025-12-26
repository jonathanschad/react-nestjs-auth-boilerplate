import * as Sentry from '@sentry/nestjs';
import axios, { isAxiosError } from 'axios';
import pRetry, { AbortError } from 'p-retry';
import Transport, { type TransportStreamOptions } from 'winston-transport';

interface SigNozLogEntry {
    timestamp: number; // in nanoseconds
    severity_text: string;
    severity_number: number;
    attributes: Record<string, unknown>;
    resources: Record<string, unknown>;
    body: string;
}
interface OTelTransportOptions extends TransportStreamOptions {
    otelUrl: string;
    otelHeaders: Record<string, string>;
    environmentName: string;
    hostName: string;
    serviceName: string;
    defaultLevel: string;
}
// Custom OTel HTTP Transport for Winston
export class OTelTransport extends Transport {
    private otelUrl: string;
    private otelHeaders: Record<string, string>;
    private environmentName: string;
    private hostName: string;
    private serviceName: string;
    private defaultLevel: string;

    private logStack: SigNozLogEntry[] = [];
    private interval: NodeJS.Timeout | null;

    constructor(opts: OTelTransportOptions) {
        super(opts);
        this.otelUrl = opts.otelUrl;
        this.otelHeaders = opts.otelHeaders || {};
        this.environmentName = opts.environmentName;
        this.hostName = opts.hostName;
        this.serviceName = opts.serviceName;
        this.defaultLevel = opts.defaultLevel;

        this.interval = setInterval(() => {
            if (this.logStack.length > 0) {
                void this.flush();
            }
        }, 10000);
    }

    public log(
        info: {
            level: string;
            message: string;
            timestamp: string;
            [key: string]: unknown;
        },
        callback?: () => void | Promise<void>,
    ) {
        if (!this.otelUrl) {
            void callback?.();
            return;
        }

        const { level = this.defaultLevel, message, timestamp, ...meta } = info;

        const logEntry: SigNozLogEntry = {
            attributes: {
                ...meta,
            },
            body: message,
            resources: {
                'service.name': this.serviceName,
                'host.name': this.hostName,
                'deployment.environment': this.environmentName,
            },
            severity_number: this.convertLogSeverityToSigNozLog(level),
            severity_text: level.toUpperCase(),
            timestamp: new Date(timestamp).getTime() * 1000000,
        };

        this.logStack.push(logEntry);

        if (this.logStack.length > 100) {
            void this.flush();
        }

        void callback?.();
    }

    private async flush() {
        const logStack = this.logStack;
        this.logStack = [];

        if (logStack.length > 0) {
            try {
                await pRetry(
                    async () => {
                        try {
                            await axios.post(this.otelUrl, logStack, {
                                headers: {
                                    'Content-Type': 'application/json',
                                    ...this.otelHeaders,
                                },
                            });
                        } catch (error) {
                            if (axios.isAxiosError(error)) {
                                // Don't retry on client errors (4xx) except 429 (rate limit)
                                if (
                                    error.response?.status &&
                                    error.response.status >= 400 &&
                                    error.response.status < 500 &&
                                    error.response.status !== 429
                                ) {
                                    // Abort retries for client errors
                                    throw new AbortError(`Client error ${error.response.status}: ${error.message}`);
                                }
                            }

                            // Retry on server errors (5xx), 429, and other errors
                            throw error;
                        }
                    },
                    {
                        retries: 10,
                        factor: 3,
                        minTimeout: 1000,
                        maxTimeout: 300000,
                        randomize: true,
                        onFailedAttempt: (error) => {
                            this.log({
                                level: 'warn',
                                message: `OTel flush failed, attempt ${error.attemptNumber}/${error.attemptNumber + error.retriesLeft}`,
                                extra: {
                                    error: error instanceof Error ? error.message : 'Unknown error',
                                    statusCode: isAxiosError(error) ? error.response?.status : undefined,
                                },
                                timestamp: new Date().toISOString(),
                            });
                        },
                    },
                );
            } catch (err) {
                Sentry.captureException(err, {
                    extra: {
                        logStack,
                        message: 'Failed to flush logs to OTel after all retries',
                    },
                });
            }
        }
    }

    private convertLogSeverityToSigNozLog(level: string): number {
        // 1-4	TRACE	A fine-grained debugging event. Typically disabled in default configurations.
        // 5-8	DEBUG	A debugging event.
        // 9-12	INFO	An informational event. Indicates that an event happened.
        // 13-16	WARN	A warning event. Not an error but is likely more important than an informational event.
        // 17-20	ERROR	An error event. Something went wrong.
        // 21-24	FATAL	A fatal error such as application or system crash.
        switch (level) {
            case 'error':
                return 20;
            case 'warn':
                return 16;
            case 'info':
                return 12;
            case 'debug':
                return 8;
            case 'trace':
                return 4;
            default:
                return 12;
        }
    }

    public close() {
        void this.flush();

        if (this.interval) {
            clearInterval(this.interval);
            this.interval = null;
        }
    }
}
