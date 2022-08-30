const { format, createLogger, transports } = require("winston");
const { combine, timestamp, label, printf, prettyPrint } = format;

const logger = createLogger({
    transports: [
      new transports.Console({
        level: 'info'
      }),
      new transports.File({
        filename: '../../logs/warn.log',
        level: 'warn'
      }),
      new transports.File({
        filename: '../../logs/error.log',
        level: 'error'
      })
    ],
    format: combine(
      label({
        label: `Label🏷️`
      }),
      timestamp({
        format: 'MMM-DD-YYYY HH:mm:ss'
      }),
      prettyPrint(),
    //  printf(info => `${info.label} ${info.level}: ${[info.timestamp]} - ${info.message}`),
    )
  })

module.exports = logger