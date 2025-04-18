import winston from 'winston';
import { Injectable, LoggerService, Scope } from '@nestjs/common';

const originalConsole = {
    log: console.log,
    info: console.info,
    warn: console.warn,
    error: console.error,
};

@Injectable({ scope: Scope.TRANSIENT })
export class WinstonLogger implements LoggerService {
    private winstonInstance: winston.Logger;

    // Inject the Winston instance or create it here
    constructor() {
        // You can reuse your createLogger logic here or pass an instance
        this.winstonInstance = winston.createLogger({
            level: process.env.LOG_LEVEL || 'info',
            format: winston.format.combine(
                winston.format.timestamp(),
                winston.format.errors({ stack: true }), // Good practice to include stack traces
                winston.format.json(),
            ),
            defaultMeta: { service: process.env.ENVIRONMENT_NAME }, // Optional: Add service context
            transports: [
                new winston.transports.File({
                    filename: 'error.log',
                    level: 'error',
                }),
                new winston.transports.File({ filename: 'combined.log' }),
                new winston.transports.Console({
                    format: winston.format.combine(
                        winston.format.colorize(),
                        winston.format.simple(), // Or winston.format.prettyPrint() for dev
                    ),
                }),
            ],
        });

        // --- Console Override Logic ---
        // It's generally better to handle console overrides separately
        // or avoid them if possible, letting NestJS and Winston manage logging.
        // If you MUST override, do it carefully after logger setup.
        this.overrideConsole();
    }

    log(message: unknown, context?: string) {
        // NestJS's default log maps to 'info' level in Winston
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

    // --- Optional: Console Override Method ---
    private overrideConsole() {
        // Important Fix: Use spread (...) operator for args
        console.log = (...args: unknown[]) => {
            this.winstonInstance.info(args.map(String).join(' '), {
                source: 'console.log',
            });
            originalConsole.log.apply(console, args); // Preserve original behavior
        };

        console.info = (...args: unknown[]) => {
            this.winstonInstance.info(args.map(String).join(' '), {
                source: 'console.info',
            });
            originalConsole.info.apply(console, args);
        };

        console.warn = (...args: unknown[]) => {
            this.winstonInstance.warn(args.map(String).join(' '), {
                source: 'console.warn',
            });
            originalConsole.warn.apply(console, args);
        };

        console.error = (...args: unknown[]) => {
            // Log the error object correctly if present
            const errorArg = args.find((arg) => arg instanceof Error);
            const message = args
                .filter((arg) => !(arg instanceof Error))
                .map(String)
                .join(' ');
            this.winstonInstance.error(message, {
                error: errorArg,
                source: 'console.error',
            });
            originalConsole.error.apply(console, args);
        };
    }

    // Expose the raw winston instance if needed elsewhere (optional)
    getWinstonInstance(): winston.Logger {
        return this.winstonInstance;
    }
}
