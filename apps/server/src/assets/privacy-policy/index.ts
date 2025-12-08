import fs from 'node:fs';
import path from 'node:path';
import { Language } from '@darts/prisma';

const privacyPolicies = new Map<Language, string>();

const privacyPolicyFilesPath = path.join(__dirname, 'files');
Object.values(Language).forEach((language) => {
    const filePath = path.join(privacyPolicyFilesPath, `${language.toLowerCase()}.md`);

    if (fs.existsSync(filePath)) {
        privacyPolicies.set(language, fs.readFileSync(filePath, 'utf8'));
    } else {
        console.error(
            `Privacy policy file for language ${language} does not exist. Please ensure that the file ${filePath} exists. Also check the case of the language in the file name.`,
        );
    }
});

export default privacyPolicies;
