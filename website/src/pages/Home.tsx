import { useMutation } from "react-query";

import { logout } from "@/repository/login";

export const Home = () => {
    const logoutMutatiuon = useMutation({
        mutationFn: logout,
        onSuccess: (data) => {
            console.log(data);
        },
    });
    return (
        <div>
            Logged IN
            <button onClick={() => logoutMutatiuon.mutate()}>Logout</button>
        </div>
    );
};
