import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "react-query";
import * as apiClient from '../api/api-client';
import { useAppContext } from "../contexts/AppContext";
import { Link, useNavigate } from "react-router-dom";

export type LoginFormData = {
    email: string;
    password: string;
}

const Login = () => {
    const { showToast } = useAppContext();
    const queryClient = useQueryClient();
    const navigate = useNavigate();

    const { 
        register, 
        formState: { errors },
        handleSubmit
    } = useForm<LoginFormData>();

    const mutation = useMutation(apiClient.login, {
        onSuccess: async () => {
            await queryClient.invalidateQueries("validateToken");
            showToast({ message: "Login successful", type: "SUCCESS" });
            navigate("/");
        },
        onError: (error: Error) => {
            showToast({ message: error.message, type: "ERROR" });
        }
    });

    const onSubmit = handleSubmit((data) => {
        mutation.mutate(data)
    })

    return (
        <form className="flex flex-col gap-5" onSubmit={onSubmit}>
            <h2 className="text-3xl font-bold">Login</h2>
            <label className="text-gray-700 text-sm font-bold flex-1">
                Email
                <input
                    type="email"
                    className="border rounded w-full py-1 px-2 font-normal"
                    { ...register("email", { required: "This field is required" })}
                />
                { errors.email && (
                    <span className="text-red-500">{ errors.email.message }</span>
                )}
            </label>
            <label className="text-gray-700 text-sm font-bold flex-1">
                Password
                <input
                    type="password"
                    className="border rounded w-full py-1 px-2 font-normal"
                    { ...register("password", { 
                        required: "This field is required",
                    })}
                />
                { errors.password && (
                    <span className="text-red-500">{ errors.password.message }</span>
                )}
            </label>
            <span className="flex items-center justify-between">
                <span className="text-sm">
                    Don't have an account?{" "}
                    <Link to="/register" className="underline">
                        Register
                    </Link>
                </span>
                <button 
                    type="submit"
                    className="bg-blue-600 text-white p-2 font-bold hover:bg-blue-500 text-xl"
                >
                    Login
                </button>
            </span>
        </form>
    );
};

export default Login;