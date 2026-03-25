import fs from 'fs'
import path from 'path'

type LogLevel = 'error' | 'warn' | 'info'

interface LogEntry {
  timestamp: string
  level: LogLevel
  category: string
  message: string
  details?: unknown
}

function writeLog(entry: LogEntry) {
  if (typeof window !== 'undefined') return // server-side only

  const logPath = path.join(process.cwd(), 'errors.log')
  const line = JSON.stringify(entry) + '\n'

  try {
    fs.appendFileSync(logPath, line, 'utf8')
  } catch {
    console.error('[Logger] Failed to write to errors.log:', entry)
  }
}

export const logger = {
  error(category: string, message: string, details?: unknown) {
    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level: 'error',
      category,
      message,
      details,
    }
    console.error(`[${entry.timestamp}] [ERROR] [${category}] ${message}`, details ?? '')
    writeLog(entry)
  },

  warn(category: string, message: string, details?: unknown) {
    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level: 'warn',
      category,
      message,
      details,
    }
    console.warn(`[${entry.timestamp}] [WARN] [${category}] ${message}`, details ?? '')
    writeLog(entry)
  },

  info(category: string, message: string, details?: unknown) {
    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level: 'info',
      category,
      message,
      details,
    }
    console.info(`[${entry.timestamp}] [INFO] [${category}] ${message}`, details ?? '')
    writeLog(entry)
  },
}
