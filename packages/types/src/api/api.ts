import { authContract, passwordContract, signupContract } from './auth/auth.api';
import { fileContract } from './file/file.api';
import { miscContract } from './misc/misc.api';
import { userContract } from './user/user.api';

export const api = {
    auth: authContract,
    password: passwordContract,
    signup: signupContract,
    user: userContract,
    file: fileContract,
    misc: miscContract,
};

export type AppContract = typeof api;
