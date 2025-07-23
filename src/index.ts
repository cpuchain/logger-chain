import { green, blueBright, yellow, red, cyan, italic, underline, bold, gray } from 'yoctocolors';

function cap(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

function pad(n: number): string {
    return n < 10 ? '0' + n : n.toString();
}

function formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = pad(date.getMonth() + 1); // Months are zero indexed
    const day = pad(date.getDate());
    const hours = pad(date.getHours());
    const minutes = pad(date.getMinutes());
    const seconds = pad(date.getSeconds());
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

export enum severityValues {
    debug = 1,
    info = 2,
    warning = 3,
    error = 4,
    special = 5,
}

export type LogLevel = keyof typeof severityValues;

export function severityToColor(severity: LogLevel, text: string) {
    switch (severity) {
        case 'debug':
            return green(text);
        case 'info':
            return blueBright(text);
        case 'warning':
            return yellow(text);
        case 'error':
            return red(text);
        case 'special':
            return cyan(underline(text));
        default:
            console.log('Unknown severity ' + severity);
            return italic(text);
    }
}

export interface LoggerConfig {
    logLevel?: LogLevel;
    logColors?: boolean;
}

export class Logger {
    private logColors: boolean;
    private logLevelInt: number;
    private logSystem?: string;
    private logComponent?: string;

    constructor(config?: LoggerConfig, logSystem?: string, logComponent?: string) {
        this.logColors = typeof config?.logColors !== 'undefined' ? config.logColors : true;
        this.logLevelInt = severityValues[config?.logLevel || 'debug'];
        this.logSystem = logSystem;
        this.logComponent = logComponent;
    }

    private log(
        severity: LogLevel,
        system: string,
        component: string | undefined,
        text: string,
        subcat?: string,
    ) {
        if (severityValues[severity] < this.logLevelInt) {
            return;
        }

        let entryDesc = formatDate(new Date()) + ' [' + system + ']\t';

        let logString = '';

        if (this.logColors) {
            entryDesc = severityToColor(severity, entryDesc);
            logString = entryDesc;

            if (component) {
                logString += italic('[' + component + '] ');
            }

            if (subcat) {
                logString += gray(bold('(' + subcat + ') '));
            }

            if (!component) {
                logString += text;
            } else {
                logString += gray(text);
            }
        } else {
            logString = entryDesc;

            if (component) {
                logString += '[' + component + '] ';
            }

            if (subcat) {
                logString += '(' + subcat + ') ';
            }

            logString += text;
        }

        console.log(logString);
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    private handleLog(logLevel: LogLevel, ...args: any[]) {
        const logSystem = this.logSystem;
        const logComponent = this.logComponent;

        if (!logSystem && args.length === 1) {
            return this.log(logLevel, cap(logLevel), logComponent, args[0]);
        }
        if (!logSystem && args.length === 2) {
            return this.log(logLevel, args[0], logComponent, args[1]);
        }
        if (logSystem && args.length === 1) {
            return this.log(logLevel, logSystem, logComponent, args[0]);
        }
        if (logSystem && args.length === 2) {
            return this.log(logLevel, logSystem, args[0], args[1]);
        }
        if (args.length === 3) {
            return this.log(logLevel, args[0], args[1], args[2]);
        }

        return this.log(logLevel, args[0], args[1], args[2], args[3]);
    }

    debug(...args: string[]) {
        this.handleLog('debug', ...args);
    }
    info(...args: string[]) {
        this.handleLog('info', ...args);
    }
    warning(...args: string[]) {
        this.handleLog('warning', ...args);
    }
    error(...args: string[]) {
        this.handleLog('error', ...args);
    }
    special(...args: string[]) {
        this.handleLog('special', ...args);
    }
}
