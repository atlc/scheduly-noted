import Swal from "sweetalert2";

const success = (message: string) => {
    return Swal.fire({
        title: "Success!",
        icon: "success",
        text: message,
        toast: true,
        position: "top-right",
        timer: 4000,
    });
};

const error = (message: string) => {
    return Swal.fire({
        title: "Oh no!",
        icon: "error",
        text: message,
        toast: true,
        position: "top-right",
        timer: 4000,
    });
};

const warn = (message: string) => {
    return Swal.fire({
        title: "Caution!",
        icon: "warning",
        text: message,
        toast: true,
        position: "top-right",
        timer: 4000,
    });
};

export default {
    success,
    error,
    warn,
};
