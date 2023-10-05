import LS from "./localStorage";
import swal from "./swal";

function fetcher<T>(url: string, method: string = "GET", client_data?: any) {
    return new Promise<T>(async (resolve) => {
        const headers: HeadersInit = {};

        const fetchOptions: RequestInit = {
            method,
            headers,
        };

        const token = LS.getToken();

        if (token) {
            headers["Authorization"] = `Bearer ${token}`;
        }

        if (method === "POST" || method === "PUT") {
            headers["Content-Type"] = "application/json";
            fetchOptions["body"] = JSON.stringify(client_data);
        }

        try {
            const res = await fetch(url, fetchOptions);
            const data = await res.json();
            if (data.message) {
                if (res.ok) {
                    swal.success(data.message);
                } else {
                    swal.error(data.message);
                }
            } else {
                if (res.ok) {
                    resolve(data);
                } else {
                    throw new Error(JSON.stringify(data));
                }
            }
        } catch (error) {
            const err = error as Error;
            swal.error(err.message);
        }
    });
}

export const GET = <T = any>(url: string) => fetcher<T>(url);
export const DELETE = <T = any>(url: string) => fetcher<T>(url, "DELETE");
export const POST = <T = any>(url: string, data: any) => fetcher<T>(url, "POST", data);
export const PUT = <T = any>(url: string, data: any) => fetcher<T>(url, "PUT", data);

