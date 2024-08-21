import api, { BASE_URL } from "@/repository";

export const passwordForgot = async ({ email }: { email: string }) => {
    const data = await api.post(BASE_URL + "/password/forgot", { email });
    return data.data;
};
export type PasswordChangeTokenDto = {
    token: string;
    password: string;
};
export const passwordChangeToken = async (payload: PasswordChangeTokenDto) => {
    const data = await api.post<{ success: boolean }>(
        BASE_URL + "/password/change-password/token",
        payload
    );
    return data.data;
};

export const passwordForgotTokenValidation = async ({
    token,
}: {
    token: string;
}) => {
    const data = await api.get<{ success: boolean }>(
        BASE_URL + `/password/forgot/validate?token=${token}`
    );
    return data.data.success;
};
