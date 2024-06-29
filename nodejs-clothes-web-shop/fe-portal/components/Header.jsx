import useAdminStore from '@/store/adminStore';
import { LogoutOutlined, UserOutlined } from '@ant-design/icons';
import { Button } from 'antd';

const Header = (props) => {
    const setAdminLogout = useAdminStore((state) => state.setAdminLogout);
    const adminInfo = useAdminStore((state) => state.adminInfo);

    const handleLogOut = () => {
        setAdminLogout();
    };

    return (
        <div className="header d-flex align-items-center justify-content-between">
            <h6 className="title-header">{props.title}</h6>
            <div className="account-box d-flex justify-content-between">
                <div className="user-icon-box position-relative">
                    <Button
                        className="d-flex align-items-center justify-content-center"
                        type=""
                        icon={<UserOutlined />}
                        ghost="true"
                        danger="true"
                        style={{
                            border: '1.5px solid #000'
                        }}
                    >
                        {adminInfo.email}
                    </Button>
                </div>
                <div className="logout-box">
                    <Button
                        className="btn btn-dark d-flex align-items-center justify-content-center"
                        type=""
                        icon={<LogoutOutlined />}
                        danger="true"
                        style={{ backgroundColor: '#000' }}
                        onClick={handleLogOut}
                    >
                        Đăng xuất
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default Header;
