'use strict';

var tty = require('node:tty');

// eslint-disable-next-line no-warning-comments
// TODO: Use a better method when it's added to Node.js (https://github.com/nodejs/node/pull/40240)
// Lots of optionals here to support Deno.
const hasColors = tty?.WriteStream?.prototype?.hasColors?.() ?? false;

const format = (open, close) => {
	if (!hasColors) {
		return input => input;
	}

	const openCode = `\u001B[${open}m`;
	const closeCode = `\u001B[${close}m`;

	return input => {
		const string = input + ''; // eslint-disable-line no-implicit-coercion -- This is faster.
		let index = string.indexOf(closeCode);

		if (index === -1) {
			// Note: Intentionally not using string interpolation for performance reasons.
			return openCode + string + closeCode;
		}

		// Handle nested colors.

		// We could have done this, but it's too slow (as of Node.js 22).
		// return openCode + string.replaceAll(closeCode, openCode) + closeCode;

		let result = openCode;
		let lastIndex = 0;

		while (index !== -1) {
			result += string.slice(lastIndex, index) + openCode;
			lastIndex = index + closeCode.length;
			index = string.indexOf(closeCode, lastIndex);
		}

		result += string.slice(lastIndex) + closeCode;

		return result;
	};
};
const bold = format(1, 22);
const italic = format(3, 23);
const underline = format(4, 24);
const red = format(31, 39);
const green = format(32, 39);
const yellow = format(33, 39);
const cyan = format(36, 39);
const gray = format(90, 39);
const blueBright = format(94, 39);

function cap(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
function pad(n) {
  return n < 10 ? "0" + n : n.toString();
}
function formatDate(date) {
  const year = date.getFullYear();
  const month = pad(date.getMonth() + 1);
  const day = pad(date.getDate());
  const hours = pad(date.getHours());
  const minutes = pad(date.getMinutes());
  const seconds = pad(date.getSeconds());
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}
var severityValues = /* @__PURE__ */ ((severityValues2) => {
  severityValues2[severityValues2["debug"] = 1] = "debug";
  severityValues2[severityValues2["info"] = 2] = "info";
  severityValues2[severityValues2["warning"] = 3] = "warning";
  severityValues2[severityValues2["error"] = 4] = "error";
  severityValues2[severityValues2["special"] = 5] = "special";
  return severityValues2;
})(severityValues || {});
function severityToColor(severity, text) {
  switch (severity) {
    case "debug":
      return green(text);
    case "info":
      return blueBright(text);
    case "warning":
      return yellow(text);
    case "error":
      return red(text);
    case "special":
      return cyan(underline(text));
    default:
      console.log("Unknown severity " + severity);
      return italic(text);
  }
}
class Logger {
  logColors;
  logLevelInt;
  logSystem;
  logComponent;
  constructor(config, logSystem, logComponent) {
    this.logColors = typeof config?.logColors !== "undefined" ? config.logColors : true;
    this.logLevelInt = severityValues[config?.logLevel || "debug"];
    this.logSystem = logSystem;
    this.logComponent = logComponent;
  }
  log(severity, system, component, text, subcat) {
    if (severityValues[severity] < this.logLevelInt) {
      return;
    }
    let entryDesc = formatDate(/* @__PURE__ */ new Date()) + " [" + system + "]	";
    let logString = "";
    if (this.logColors) {
      entryDesc = severityToColor(severity, entryDesc);
      logString = entryDesc;
      if (component) {
        logString += italic("[" + component + "] ");
      }
      if (subcat) {
        logString += gray(bold("(" + subcat + ") "));
      }
      if (!component) {
        logString += text;
      } else {
        logString += gray(text);
      }
    } else {
      logString = entryDesc;
      if (component) {
        logString += "[" + component + "] ";
      }
      if (subcat) {
        logString += "(" + subcat + ") ";
      }
      logString += text;
    }
    console.log(logString);
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  handleLog(logLevel, ...args) {
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
  debug(...args) {
    this.handleLog("debug", ...args);
  }
  info(...args) {
    this.handleLog("info", ...args);
  }
  warning(...args) {
    this.handleLog("warning", ...args);
  }
  error(...args) {
    this.handleLog("error", ...args);
  }
  special(...args) {
    this.handleLog("special", ...args);
  }
}

exports.Logger = Logger;
exports.severityToColor = severityToColor;
exports.severityValues = severityValues;
