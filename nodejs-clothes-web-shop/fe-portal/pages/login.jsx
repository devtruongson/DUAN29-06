import { swtoast } from '@/mixins/swal.mixin';
import axios from 'axios';
import Router from 'next/router';
import { useEffect, useRef, useState } from 'react';

import Heading from '@/components/Heading';
import { homeAPI } from '@/config';
import useAdminStore from '@/store/adminStore';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const emailRef = useRef();
    const passwordRef = useRef();

    const isLoggedIn = useAdminStore((state) => state.isLoggedIn);
    const setAdminLogin = useAdminStore((state) => state.setAdminLogin);

    useEffect(() => {
        if (isLoggedIn) {
            Router.back();
        }
    }, [isLoggedIn]);

    useEffect(() => {
        emailRef.current.focus();
    }, []);

    const handleLogin = async (e) => {
        e.preventDefault();
        if (!email) {
            swtoast.fire({ text: 'Please enter your email' });
            emailRef.current.focus();
            return;
        }

        if (!password) {
            swtoast.fire({ text: 'Please enter your password' });
            passwordRef.current.focus();
            return;
        }

        try {
            const response = await axios.post(homeAPI + '/admin/login', {
                email: email,
                password: password
            });

            setAdminLogin(response.data);

            setEmail('');
            setPassword('');
            swtoast.success({ text: 'Đăng nhập thành công' });
            Router.push('/');
        } catch (error) {
            swtoast.error({
                text: 'Email or Password is wrong!'
            });
            console.log(error);
        }
    };
    return (
        <div className="login-page position-fixed d-flex justity-content-center align-items-center">
            <div className="login-box">
                <Heading title="Đăng nhập" />
                <form action="" onSubmit={handleLogin}>
                    <div className="w-100">
                        <input
                            placeholder="Email"
                            className="w-100"
                            type="email"
                            ref={emailRef}
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <div className="w-100">
                        <input
                            placeholder="Password"
                            className="w-100"
                            type="password"
                            ref={passwordRef}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    <button className="login-btn w-100">Submit</button>
                </form>
            </div>
        </div>
    );
};

export default LoginPage;
