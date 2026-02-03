import winston from 'winston';

const { combine, timestamp, printf, colorize } = winston.format;

const rektFormat = printf(({ level, message, timestamp, ...meta }) => {
  const metaStr = Object.keys(meta).length ? ` ${JSON.stringify(meta)}` : '';
  return `[${timestamp}] [REKT-SHIELD] ${level}: ${message}${metaStr}`;
});

export const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: combine(timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), rektFormat),
  transports: [
    new winston.transports.Console({
      format: combine(colorize(), timestamp({ format: 'HH:mm:ss' }), rektFormat),
    }),
    new winston.transports.File({
      filename: 'logs/rekt-shield.log',
      maxsize: 5242880,
      maxFiles: 5,
    }),
    new winston.transports.File({
      filename: 'logs/threats.log',
      level: 'warn',
      maxsize: 5242880,
    }),
  ],
});
