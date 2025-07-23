export declare enum severityValues {
	debug = 1,
	info = 2,
	warning = 3,
	error = 4,
	special = 5
}
export type LogLevel = keyof typeof severityValues;
export declare function severityToColor(severity: LogLevel, text: string): string;
export interface LoggerConfig {
	logLevel?: LogLevel;
	logColors?: boolean;
}
export declare class Logger {
	private logColors;
	private logLevelInt;
	private logSystem?;
	private logComponent?;
	constructor(config?: LoggerConfig, logSystem?: string, logComponent?: string);
	private log;
	private handleLog;
	debug(...args: string[]): void;
	info(...args: string[]): void;
	warning(...args: string[]): void;
	error(...args: string[]): void;
	special(...args: string[]): void;
}

export {};
