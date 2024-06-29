import { useRouter } from "next/router";
import { useEffect, useState } from "react";

import useCustomerStore from "@/store/customerStore";

const Auth = ({ children }) => {
    const router = useRouter();
    const isLoggedIn = useCustomerStore((state) => state.isLoggedIn);
    const [isFirstLoading, setIsFirstLoading] = useState(true);

    useEffect(() => {
        if (!isFirstLoading && !isLoggedIn) {
            router.push("/");
        }
    }, [router, isFirstLoading, isLoggedIn]);

    useEffect(() => setIsFirstLoading(false), []);

    return isLoggedIn ? children : null;
}

export default Auth;
