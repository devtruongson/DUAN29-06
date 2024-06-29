import Link from 'next/link';
import { useRouter } from 'next/router';
import { memo } from 'react';

import { sidebar } from '@/data/accountInforData';
import { swalert, swtoast } from '@/mixins/swal.mixin';
import customerService from '@/services/customerService';
import useCustomerStore from '@/store/customerStore';

const AccountSidebar = () => {
    const router = useRouter();
    const urlPath = router.pathname;
    const setCustomerLogout = useCustomerStore((state) => state.setCustomerLogout);

    return (
        <div className="account-sidebar">
            <div className="title">Thông tin khách hàng</div>
            <div className="sidebar-items">
                {sidebar &&
                    sidebar.map((item, index) => {
                        if (item.href === urlPath) {
                            return (
                                <Link
                                    key={index}
                                    className="sidebar-item d-block border-radius active"
                                    href={item.href}
                                >
                                    {item.text}
                                </Link>
                            );
                        } else if (urlPath.startsWith('/get-order/') && item.href === '/account/orders') {
                            return (
                                <Link
                                    key={index}
                                    className="sidebar-item d-block border-radius active"
                                    href={item.href}
                                >
                                    {item.text}
                                </Link>
                            );
                        } else {
                            return (
                                <Link
                                    key={index}
                                    className="sidebar-item d-block border-radius"
                                    href={item.href}
                                >
                                    {item.text}
                                </Link>
                            );
                        }
                    })}
                {
                    <Link
                        className="sidebar-item d-block border-radius"
                        href="#"
                        onClick={() => {
                            swalert
                                .fire({
                                    allowOutsideClick: false,
                                    allowEscapeKey: false,
                                    showCancelButton: true,
                                    showLoaderOnConfirm: true,
                                    preConfirm: async () => {
                                        try {
                                            await customerService.logout();
                                            return { isError: false };
                                        } catch (error) {
                                            console.log(error);
                                            return { isError: true };
                                        }
                                    },
                                    title: 'Đăng xuất',
                                    icon: 'warning',
                                    text: 'Bạn muốn đăng xuất?',
                                })
                                .then(async (result) => {
                                    if (result.isConfirmed && !result.value?.isError) {
                                        setCustomerLogout();
                                        swtoast.success({ text: 'Đăng xuất thành công!' });
                                    } else if (result.isConfirmed && result.value?.isError) {
                                        setCustomerLogout();
                                        swtoast.success({ text: 'Đăng xuất thành công!' });
                                    }
                                });
                        }}
                    >
                        Đăng xuất
                    </Link>
                }
            </div>
        </div>
    );
};

export default memo(AccountSidebar);
