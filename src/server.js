import { app } from './app.js';
import { config } from './config.js';
import { pool } from './db.js';

const server = app.listen(config.port, () => {
  console.info(`Server berjalan di http://localhost:${config.port}`);
});

let isShuttingDown = false;

async function shutdown(signal) {
  if (isShuttingDown) return;
  isShuttingDown = true;
  console.info(`${signal} received; closing server`);

  const forceExit = setTimeout(() => {
    console.error('Shutdown timed out');
    process.exit(1);
  }, 10_000);
  forceExit.unref();

  server.close(async (error) => {
    try {
      await pool.end();
      if (error) throw error;
      clearTimeout(forceExit);
      process.exitCode = 0;
    } catch (closeError) {
      console.error('Error while shutting down:', closeError.message);
      process.exitCode = 1;
    }
  });
}

process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));
