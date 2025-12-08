import { NestFactory } from '@nestjs/core';
import { NestFastifyApplication } from '@nestjs/platform-fastify';
import { RawServerDefault } from 'fastify';
import * as fs from 'fs';
import * as path from 'path';
import { AppModule } from '@/app.module';

export const runWithConsoleApp = async (fn: (app: NestFastifyApplication<RawServerDefault>) => Promise<void>) => {
    const app = await NestFactory.create<NestFastifyApplication>(AppModule);

    await fn(app);
};

async function debug(app: NestFastifyApplication<RawServerDefault>): Promise<void> {
    const scriptPath = getScriptPath();

    console.log(`Executing the first matched script: ${scriptPath}`);
    await executeScript(scriptPath, app);
}

function getScriptPath(): string {
    const args = process.argv.slice(2);
    if (args.length === 0) {
        console.error('Please provide a regex pattern as an argument.');
        process.exit(1);
    }

    const pattern = new RegExp(args[0], 'i'); // Case-insensitive matching
    const files = getAllFiles(__dirname);
    const matchedFiles = files.filter((file) => pattern.test(path.basename(file)));

    if (matchedFiles.length > 0) {
        return matchedFiles[0];
    }
    throw new Error(args[0]);
}

function getAllFiles(dir: string): string[] {
    const files = fs.readdirSync(dir);
    let allFiles: string[] = [];
    files.forEach((file) => {
        const filepath = path.join(dir, file);
        if (fs.statSync(filepath).isDirectory()) {
            allFiles = allFiles.concat(getAllFiles(filepath));
        } else {
            allFiles.push(filepath);
        }
    });

    return allFiles;
}

async function executeScript(filePath: string, app: NestFastifyApplication<RawServerDefault>): Promise<void> {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { main } = (await require(filePath)) as {
        main: (app: NestFastifyApplication<RawServerDefault>) => Promise<void>;
    };
    if (typeof main === 'function') {
        await main(app);
    } else {
        throw new Error(
            `${filePath} does not export a main function. Please ensure that you export a function named "main"`,
        );
    }
}

if (require.main === module) {
    try {
        getScriptPath();
    } catch (error) {
        console.log(`No script path found. Please provide a regex pattern as an argument: ${(error as Error).message}`);
        process.exit(1);
    }

    runWithConsoleApp(async (app) => {
        await debug(app);
    }).catch((error) => {
        console.error(error);
        process.exit(1);
    });
}
