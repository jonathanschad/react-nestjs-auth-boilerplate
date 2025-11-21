import { Injectable, type LoggerService, Scope } from '@nestjs/common';
import winston from 'winston';

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
        if (process.env.OTEL_HEADERS) {
            try {
                // Headers format: "key1=value1,key2=value2"
                process.env.OTEL_HEADERS.split(',').forEach((pair) => {
                    const [key, ...rest] = pair.split('=');
                    const value = rest.join('=');
                    if (key && value) {
                        otelHeaders[key.trim()] = value.trim();
                    }
                });
            } catch (e) {
                console.error('Failed to parse OTEL_HEADERS', e);
            }
        }

        // Create transports array
        const customFormat = winston.format.combine(
            winston.format.timestamp(),
            winston.format.errors({ stack: true }),
            winston.format.colorize(),
            winston.format.printf((info) => {
                const { timestamp, level, message, context, ...rest } = info;

                /* eslint-disable @typescript-eslint/no-base-to-string */
                const contextStr = context
                    ? `[${typeof context === 'object' ? JSON.stringify(context) : String(context)}]`
                    : '';
                /* eslint-enable @typescript-eslint/no-base-to-string */

                const restStr = Object.keys(rest).length ? JSON.stringify(rest) : '';
                // Use ANSI color codes directly
                const gray = '\x1b[90m';
                const cyan = '\x1b[36m';
                const reset = '\x1b[0m';
                return ` ${String(level)} ${cyan}${contextStr}${reset} ${gray}${String(timestamp)}${reset} ${String(message)} ${restStr}`.trim();
            }),
        );

        const transports: winston.transport[] = [
            new winston.transports.Console({
                format: customFormat,
            }),
        ];

        // Add OTel transport if URL is provided
        if (process.env.OTEL_BASE_URL) {
            transports.push(
                new OTelTransport({
                    otelUrl: process.env.OTEL_BASE_URL,
                    otelHeaders: otelHeaders,
                    defaultLevel: 'info',
                    environmentName: process.env.ENVIRONMENT_NAME ?? 'development',
                    hostName: process.env.HOST ?? 'localhost',
                    serviceName: process.env.PROJECT_NAME ?? 'darts',
                    format: winston.format.combine(
                        winston.format.timestamp(),
                        winston.format.errors({ stack: true }),
                        winston.format.json(),
                    ),
                }),
            );
        }

        // Create Winston logger
        this.winstonInstance = winston.createLogger({
            level: process.env.LOG_LEVEL || 'info',
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
            this.winstonInstance.info(this.consoleLogMessageMapper(...args), {
                source: 'console.log',
            });
            originalConsole.log(...args);
        };

        console.info = (...args: unknown[]) => {
            this.winstonInstance.info(this.consoleLogMessageMapper(...args), {
                source: 'console.info',
            });
            originalConsole.info(...args);
        };

        console.warn = (...args: unknown[]) => {
            this.winstonInstance.warn(this.consoleLogMessageMapper(...args), {
                source: 'console.warn',
            });
            originalConsole.warn(...args);
        };

        console.error = (...args: unknown[]) => {
            const errorArg = args.find((arg) => arg instanceof Error);
            const message = this.consoleLogMessageMapper(...args);
            this.winstonInstance.error(message, {
                error: errorArg,
                source: 'console.error',
            });
            originalConsole.error(...args);
        };
    }
    private consoleLogMessageMapper(...args: unknown[]) {
        return args
            .map((arg) => {
                if (arg instanceof Error) {
                    return arg.stack;
                }

                if (typeof arg === 'object' && arg !== null) {
                    return JSON.stringify(arg);
                }

                return String(arg);
            })
            .join(' ');
    }

    getWinstonInstance(): winston.Logger {
        return this.winstonInstance;
    }
}
