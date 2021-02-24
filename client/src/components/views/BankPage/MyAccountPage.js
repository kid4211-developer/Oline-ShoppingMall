import React, { useState } from 'react';
import { Typography, Button } from 'antd';
import { useSelector } from 'react-redux';
import axios from 'axios';
import MyAccountList from './MyAccountList';

const { Title } = Typography;
function MyAccountPage() {
    const user = useSelector((state) => state.user);
    const [AccountList, setAccountList] = useState([]);
    const requestAccount = () => {
        let variables = {
            user: user.userData._id,
        };
        axios.post('/api/account/requestAccount', variables).then((response) => {
            if (response.data.success) {
                setAccountList(response.data.accounts);
            } else {
                alert('계좌정보 조회에 실패했습니다.');
            }
        });
        console.log('계좌리스트 조회', AccountList);
    };

    return (
        <>
            <div style={{ maxWidth: '500px', margin: '2rem auto', textAlign: 'center' }}>
                <Button onClick={requestAccount}> Load My Accounts</Button>
            </div>
            <MyAccountList accountList={AccountList} />
        </>
    );
}

export default MyAccountPage;
