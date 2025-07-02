// Simple logger utility for server/client use
// Usage: logger.info('message'), logger.error('error message'), etc.

interface Logger {
  info: (...args: unknown[]) => void;
  error: (...args: unknown[]) => void;
  warn: (...args: unknown[]) => void;
  debug: (...args: unknown[]) => void;
}

const format = (level: string, ...args: unknown[]) => {
  const timestamp = new Date().toISOString();
  return [`[${timestamp}] [${level.toUpperCase()}]`, ...args];
};

export const logger: Logger = {
  info: (...args) => {
    console.info(...format('info', ...args));
  },
  error: (...args) => {
    console.error(...format('error', ...args));
  },
  warn: (...args) => {
    console.warn(...format('warn', ...args));
  },
  debug: (...args) => {
    if (process.env.NODE_ENV !== 'production') {
      console.debug(...format('debug', ...args));
    }
  },
};

// getLogger: returns a logger with a label included in every log
export const getLogger = (label: string): Logger => {
  const withLabel = (level: string, ...args: unknown[]) => {
    return format(level, `[${label}]`, ...args);
  };
  return {
    info: (...args) => {
      console.info(...withLabel('info', ...args));
    },
    error: (...args) => {
      console.error(...withLabel('error', ...args));
    },
    warn: (...args) => {
      console.warn(...withLabel('warn', ...args));
    },
    debug: (...args) => {
      if (process.env.NODE_ENV !== 'production') {
        console.debug(...withLabel('debug', ...args));
      }
    },
  };
};
