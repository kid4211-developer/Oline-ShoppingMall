import React, { useEffect, useState } from 'react';
import { Button } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import MyAccountList from './MyAccountList';
import { removeAccount } from '../../../_actions/user_actions';

function MyAccountPage() {
    const dispatch = useDispatch();
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
    };

    useEffect(() => {
        if (user.userData) {
            requestAccount();
        }
    }, [user.userData]);

    const deleteAccount = (accounts) => {
        dispatch(removeAccount(accounts)).then((response) => {
            if (response.payload.success) {
                requestAccount();
            } else {
                alert('계좌 삭제에 실패했습니다.');
            }
        });
    };

    return (
        <>
            <div style={{ maxWidth: '500px', margin: '2rem auto', textAlign: 'center' }}>
                <Button onClick={requestAccount}> Load My Accounts</Button>
            </div>
            <MyAccountList accountList={AccountList} accountDelete={deleteAccount} />
        </>
    );
}

export default MyAccountPage;
