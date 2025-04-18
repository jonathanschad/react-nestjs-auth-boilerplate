import axios from 'axios';
import Transport, { TransportStreamOptions } from 'winston-transport';
import * as Sentry from '@sentry/nestjs';

interface OTelTransportOptions extends TransportStreamOptions {
    otelUrl: string;
    otelHeaders: Record<string, string>;
}
// Custom OTel HTTP Transport for Winston
export class OTelTransport extends Transport {
    private otelUrl: string;
    private otelHeaders: Record<string, string>;

    constructor(opts: OTelTransportOptions) {
        super(opts);
        this.otelUrl = opts.otelUrl;
        this.otelHeaders = opts.otelHeaders || {};
        this.level = opts.level || 'info';
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
        const logEntry = {
            timestamp: timestamp || new Date().toISOString(),
            severity: level.toUpperCase(),
            body: message,
            attributes: {
                ...meta,
                service_name: process.env.ENVIRONMENT_NAME || 'nest-application',
            },
        };

        axios
            .post(this.otelUrl, logEntry, {
                headers: {
                    'Content-Type': 'application/json',
                    ...this.otelHeaders,
                },
            })
            .then((response) => {
                callback();
            })
            .catch((err) => {
                Sentry.captureException(err);
                callback();
            });
    }
}
