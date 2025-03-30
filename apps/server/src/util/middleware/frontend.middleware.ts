import { FastifyReply, FastifyRequest } from 'fastify';
import { createReadStream, readdirSync } from 'fs';
import mime from 'mime-types';
import { dirname } from 'node:path';
import path from 'path';

const rootDir = path.resolve(dirname(process.argv[1]), 'public');
const resolvePath = (file: string) => path.resolve(rootDir, file);
const staticFiles = (() => {
    try {
        return readdirSync(rootDir).map((file) => `/${file}`);
    } catch (error) {
        if (process.env.NODE_ENV === 'production') {
            console.log(`Error reading static files from ${rootDir}`, error);
        }
        return [];
    }
})();

export const serveFrontend = (req: FastifyRequest['raw'], res: FastifyReply['raw'], next: () => void) => {
    const { url } = req;

    if (url && url.startsWith('/api')) {
        return next();
    } else {
        let filename = 'index.html';
        if (url && staticFiles.some((file) => url.startsWith(file))) {
            filename = url.replace('/', '');
        }
        const filePath = resolvePath(filename);

        const contentType = mime.lookup(filePath) || 'text/html';
        res.setHeader('Content-Type', contentType);

        const fileStream = createReadStream(filePath);
        fileStream.pipe(res);

        // Handle errors in reading the file
        fileStream.on('error', (err) => {
            console.error(err);
            res.statusCode = 500;
            res.end('Error loading frontend');
        });
        return;
    }
};
