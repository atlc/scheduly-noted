import React, { useEffect } from "react";

const Verify = () => {
    useEffect(() => {
        async function checkEm() {
            const url = new URL(window.location.href);
            const code = url.searchParams.get("code");
            const res = await fetch("http://localhost:3000/auth/email/verify?code=" + code);
            const data = await res.json();
            if (res.ok) {
                alert(data.token);
            } else {
                alert(data.message);
            }
        }
        checkEm();
    }, []);

    return <div>Verify</div>;
};

export default Verify;
