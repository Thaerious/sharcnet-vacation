# Logging

This project uses [pino](https://getpino.io/) for logging.

## Setup

```bash
npm install pino pino-pretty
```

## Configuration

Logging behaviour is controlled via environment variables in `.env`:

| Variable   | Values                                      | Default  |
|------------|---------------------------------------------|----------|
| `LOG_LEVEL`  | `silent` `fatal` `error` `warn` `info` `debug` `trace` | `info`   |
| `NODE_ENV`   | `development` \| `production` \| `test`       | —        |

In `development`, logs are printed in a human-readable colourised format via `pino-pretty`.
In `production`, logs are emitted as JSON, suitable for ingestion by log aggregators.

## Log Levels

From least to most verbose:

| Level   | Use for                                      |
|---------|----------------------------------------------|
| `fatal` | Unrecoverable errors — app is about to exit  |
| `error` | Errors that need attention but aren't fatal  |
| `warn`  | Unexpected situations that aren't errors     |
| `info`  | Normal operational events (server start, etc)|
| `debug` | Detailed diagnostic information              |
| `trace` | Very fine-grained, high-volume detail        |

Set `LOG_LEVEL=debug` locally when diagnosing issues. Leave it at `info` in production.

## Usage

```javascript
import logger from "./setupLogger.js";

logger.info("Server started");
logger.warn("Missing optional config value");
logger.error(err, "Database connection failed");
logger.debug({ userId, action }, "User performed action");
```

Structured fields go in the first argument as an object, message goes second.
This keeps logs machine-parseable in production.

## File Output

Pino logs to stdout only. To write logs to a file, redirect at the process level rather
than inside the application — this is faster and keeps I/O out of the app process:

```bash
# Development
node src | pino-pretty

# Production — append to log file
node src >> logs/log.txt

# Both file and terminal
node src | tee -a logs/log.txt | pino-pretty
```

Make sure the `logs/` directory exists before running, or create it in your startup script:

```bash
mkdir -p logs && node src >> logs/log.txt
```

## Verbosity Flag

Pass `--verbose` on the CLI to enable `debug`-level output regardless of `LOG_LEVEL`:

```bash
node src --verbose
```

This is handled in `index.js` after argument parsing.