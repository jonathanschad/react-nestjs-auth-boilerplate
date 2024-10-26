import { useMutation } from "react-query";

import { getUsers } from "@/repository/healthcheck";

export const Healthcheck = () => {
    const getUsersMutatiuon = useMutation({
        mutationFn: getUsers,
    });
    return (
        <div>
            <button onClick={() => getUsersMutatiuon.mutate()}>Get Users</button>
        </div>
    );
};
