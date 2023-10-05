import React, { useEffect } from "react";
import { GET } from "../services/api";
import LS from "../services/localStorage";

const Verify = () => {
    useEffect(() => {
        async function checkEm() {
            const url = new URL(window.location.href);
            const code = url.searchParams.get("code");
            const type = url.searchParams.get("type");
            GET(`http://localhost:3000/auth/email/verify?code=${code}&type=${type}`).then((data) => {
                if (data.token) LS.setToken(data.token);
            });
        }
        checkEm();
    }, []);

    return <div>Verify</div>;
};

export default Verify;
