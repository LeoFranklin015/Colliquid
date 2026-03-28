export function createLogger(module: string) {
  const prefix = `[${module.toUpperCase()}]`;
  return {
    info: (...args: unknown[]) => console.log(new Date().toISOString(), prefix, ...args),
    warn: (...args: unknown[]) => console.warn(new Date().toISOString(), prefix, ...args),
    error: (...args: unknown[]) => console.error(new Date().toISOString(), prefix, ...args),
  };
}
