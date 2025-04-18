import axios from 'axios';
import Transport, { TransportStreamOptions } from 'winston-transport';
import { context, Span, TraceFlags } from '@opentelemetry/api';
import * as Sentry from '@sentry/nestjs';

interface SigNozLogEntry {
    timestamp: number; // in nanoseconds
    trace_id: string;
    span_id: string;
    trace_flags: number;
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
}
// Custom OTel HTTP Transport for Winston
export class OTelTransport extends Transport {
    private otelUrl: string;
    private otelHeaders: Record<string, string>;
    private environmentName: string;

    constructor(opts: OTelTransportOptions) {
        super(opts);
        this.otelUrl = opts.otelUrl;
        this.otelHeaders = opts.otelHeaders || {};
        this.environmentName = opts.environmentName;
    }

    log(
        info: {
            level: string;
            message: string;
            timestamp: string;
            [key: string]: unknown;
        },
        callback: () => void,
    ) {
        if (!this.otelUrl) {
            callback();
            return;
        }

        const { level, message, timestamp, ...meta } = info;

        // Prepare log entry in OTLP format
        const activeSpan = context.active().getValue(Symbol.for('OpenTelemetry Context Key SPAN')) as Span | undefined;
        const spanContext = activeSpan?.spanContext();

        const logEntry: SigNozLogEntry = {
            attributes: {
                ...meta,
                service_name: this.environmentName,
            },
            body: message,
            resources: {},
            severity_number: this.convertLogSeverityToSigNozLog(level),
            severity_text: level.toUpperCase(),
            span_id: spanContext?.spanId || '',
            trace_flags: spanContext?.traceFlags || TraceFlags.NONE,
            trace_id: spanContext?.traceId || '',
            timestamp: new Date(timestamp).getTime() * 1000000,
        };

        axios
            .post(this.otelUrl, [logEntry], {
                headers: {
                    'Content-Type': 'application/json',
                    ...this.otelHeaders,
                },
            })
            .then(() => {
                callback();
            })
            .catch((err) => {
                Sentry.captureException(err);
                callback();
            });
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
}
