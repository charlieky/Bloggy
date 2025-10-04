import { FileSystemCache } from 'next/dist/server/lib/incremental-cache/file-system-cache';

// eslint-disable-next-line import/no-anonymous-default-export
export default function (ctx) {
  return new FileSystemCache({
    flushToDisk: true,
    serverDistDir: ctx.serverDistDir
  });
}
