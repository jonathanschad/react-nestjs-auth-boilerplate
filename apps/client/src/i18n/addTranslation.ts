/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/require-await */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* @ts-expect-error - fs is not defined */
import fs from 'fs';
import prettier from 'prettier';
/* @ts-expect-error - process is not defined */
import process from 'process';
/* @ts-expect-error - readline is not defined */
import readline from 'readline';

async function loadPrettierConfig() {
    const prettierrc = JSON.parse(fs.readFileSync('../../.prettierrc', 'utf8'));
    const packageJson = JSON.parse(fs.readFileSync('../../package.json', 'utf8'));

    const prettierConfig = { ...packageJson.prettier, ...prettierrc };
    return prettierConfig;
}

const prettierConfig = loadPrettierConfig();

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

/**
 * This is a Script to add new Translations in alphabetical to the Website
 * execute this script by typing 'node addTranslation' and follow the instructions
 */
const lineReaderQuestionPromise = (question: string) => {
    return new Promise((res, rej) => {
        rl.question(question, (answer: string) => res(answer));
    });
};

function orderKeys(obj: Record<string, string>) {
    return Object.keys(obj)
        .sort(function (a, b) {
            return a.toLowerCase().localeCompare(b.toLowerCase());
        })
        .reduce(
            (acc, key) => ({
                ...acc,
                [key]: obj[key],
            }),
            {},
        );
}
const locales: Record<string, Record<string, Record<string, string>>> = {};
const translationFiles: string[] = [];
const translations: Record<string, string> = {};
let filename = '';

const doesKeyExists = (key: string) => {
    const files: string[] = [];
    for (const lang in locales) {
        translationFiles.forEach((translationFile) => {
            for (const transkey in locales[lang][translationFile]) {
                if (key === transkey && !files.includes(translationFile)) {
                    files.push(translationFile);
                }
            }
        });
    }
    return files;
};
const saveKey = async (key: string) => {
    for (const lang in locales) {
        translations[lang] = (await lineReaderQuestionPromise(`Enter Translation for ${lang}: `)) as string;
    }
    let summary = `\n\nKey: ${key} \n`;
    for (const lang in translations) {
        summary += `\n ${lang}: ${translations[lang]}`;
    }
    console.log(summary + '\n');

    rl.question('Is your input correct? (y/n): ', async (confirm: string) => {
        if (confirm === 'y' || confirm === 'j' || confirm === 'Y' || confirm === 'J') {
            for (const lang in translations) {
                locales[lang][filename][key] = translations[lang];
                fs.writeFileSync(
                    `./${lang}/${filename}.json`,
                    await prettier.format(JSON.stringify(orderKeys(locales[lang][filename])), {
                        semi: false,
                        parser: 'json',
                        ...prettierConfig,
                    }),
                );
            }
        }
        rl.close();
    });
};
const updateIndexFile = async (newFileName: string) => {
    const translationFilesCopy = JSON.parse(JSON.stringify(translationFiles));
    translationFilesCopy.push(newFileName);
    for (const lang in locales) {
        let fileString = '';

        translationFilesCopy.forEach((file: string) => (fileString += `import ${file} from "./${file}.json";\n`));

        fileString += `\n const translations = {`;
        translationFilesCopy.forEach((file: string) => (fileString += `${file},\n`));
        fileString += `} \n export default translations;`;

        fs.writeFileSync(
            `./${lang}/index.ts`,
            await prettier.format(fileString, {
                semi: false,
                parser: 'typescript',
                ...prettierConfig,
            }),
        );
    }
};
const enterNewTranslation = async () => {
    rl.question('\nEnter new Translation key: ', async (key: string) => {
        const keyInFiles = doesKeyExists(key);
        if (keyInFiles.includes(filename as unknown as string)) {
            console.error('The key you entered already exists in the selected File');
            rl.close();
        } else if (keyInFiles.length > 0) {
            console.log('\n The key already exists in the following file(s): ', keyInFiles.toString());
            rl.question('Do you want to continue? (y/n) ', async (yesNo: string) => {
                if (yesNo.toLowerCase() === 'y') await saveKey(key);
                else rl.close();
            });
        } else {
            await saveKey(key);
        }
    });
};
//prettier.getFileInfo("./de.json").then(res=> console.log(res));

fs.readdirSync('./').forEach((file: string) => {
    const stats = fs.statSync(`./${file}`);
    if (file !== 'addTranslation.js' && stats.isDirectory()) {
        locales[file] = {};

        fs.readdirSync(`./${file}/`).forEach((fileDir: string) => {
            if (fileDir.endsWith('.json')) {
                fileDir = fileDir.split('.json')[0];
                if (!translationFiles.includes(fileDir)) translationFiles.push(fileDir);
                locales[file][fileDir] = JSON.parse(fs.readFileSync(`./${file}/${fileDir}.json`, 'utf8'));
            }
        });
    }
});

console.log('Enter the number if the translationfile or enter the name of a new one \n');
translationFiles.forEach((file, index) => console.log(`${index} - ${file}`));

rl.question('\nNumber or new filename: ', async (filenumberLocal: string) => {
    if (isNaN(parseInt(filenumberLocal))) {
        filename = filenumberLocal;
        rl.question(`Are you sure you want to create file "${filenumberLocal}.json?" (y/n) `, async (yesNo: string) => {
            if (yesNo.toLocaleLowerCase() === 'y') {
                for (const lang in locales) locales[lang][filenumberLocal] = {};
                await enterNewTranslation();
                await updateIndexFile(filenumberLocal);
            } else {
                rl.close();
            }
        });
    } else {
        filename = translationFiles[parseInt(filenumberLocal)];
        if (filename) {
            filename = filename.split('.json')[0];

            for (const lang in locales) if (!locales[lang][filename]) locales[lang][filename] = {};
            await enterNewTranslation();
        } else {
            console.log('\n Invalid number');
            rl.close();
        }
    }
});
