import winston from 'winston';
import { Injectable, LoggerService, Scope } from '@nestjs/common';

import { OTelTransport } from '@/util/logging/otel.transport';

const originalConsole = {
    log: console.log,
    info: console.info,
    warn: console.warn,
    error: console.error,
};

@Injectable({ scope: Scope.TRANSIENT })
export class WinstonLogger implements LoggerService {
    private winstonInstance: winston.Logger;

    constructor() {
        // Parse OTel headers if provided
        const otelHeaders: Record<string, string> = {};
        if (process.env.LOGGING_OTEL_HEADERS) {
            try {
                // Headers format: "key1=value1,key2=value2"
                process.env.LOGGING_OTEL_HEADERS.split(',').forEach((pair) => {
                    const [key, ...rest] = pair.split('=');
                    const value = rest.join('=');
                    if (key && value) {
                        otelHeaders[key.trim()] = value.trim();
                    }
                });
            } catch (e) {
                console.error('Failed to parse LOGGING_OTEL_HEADERS', e);
            }
        }

        // Create transports array
        const transports: winston.transport[] = [
            new winston.transports.File({
                filename: 'error.log',
                level: 'error',
            }),
            new winston.transports.File({ filename: 'combined.log' }),
            new winston.transports.Console({
                format: winston.format.combine(winston.format.colorize(), winston.format.simple()),
            }),
        ];

        // Add OTel transport if URL is provided
        if (process.env.LOGGING_OTEL_URL) {
            console.log('Adding OTel transport', process.env.LOGGING_OTEL_URL);
            transports.push(
                new OTelTransport({
                    otelUrl: process.env.LOGGING_OTEL_URL,
                    otelHeaders: otelHeaders,
                    level: 'info',
                }),
            );
        }

        // Create Winston logger
        this.winstonInstance = winston.createLogger({
            level: process.env.LOG_LEVEL || 'info',
            format: winston.format.combine(
                winston.format.timestamp(),
                winston.format.errors({ stack: true }),
                winston.format.json(),
            ),
            defaultMeta: {
                service: process.env.ENVIRONMENT_NAME || 'nest-application',
                environment: process.env.NODE_ENV || 'development',
            },
            transports,
        });

        this.overrideConsole();
    }

    log(message: unknown, context?: string) {
        this.winstonInstance.info(String(message), { context });
    }

    error(message: unknown, trace?: string, context?: string) {
        this.winstonInstance.error(String(message), { trace, context });
    }

    warn(message: unknown, context?: string) {
        this.winstonInstance.warn(String(message), { context });
    }

    debug?(message: unknown, context?: string) {
        this.winstonInstance.debug(String(message), { context });
    }

    verbose?(message: unknown, context?: string) {
        this.winstonInstance.verbose(String(message), { context });
    }

    private overrideConsole() {
        console.log = (...args: unknown[]) => {
            this.winstonInstance.info(args.map(String).join(' '), {
                source: 'console.log',
            });
            originalConsole.log(...args);
        };

        console.info = (...args: unknown[]) => {
            this.winstonInstance.info(args.map(String).join(' '), {
                source: 'console.info',
            });
            originalConsole.info(...args);
        };

        console.warn = (...args: unknown[]) => {
            this.winstonInstance.warn(args.map(String).join(' '), {
                source: 'console.warn',
            });
            originalConsole.warn(...args);
        };

        console.error = (...args: unknown[]) => {
            const errorArg = args.find((arg) => arg instanceof Error);
            const message = args
                .filter((arg) => !(arg instanceof Error))
                .map(String)
                .join(' ');
            this.winstonInstance.error(message, {
                error: errorArg,
                source: 'console.error',
            });
            originalConsole.error(...args);
        };
    }

    getWinstonInstance(): winston.Logger {
        return this.winstonInstance;
    }
}
