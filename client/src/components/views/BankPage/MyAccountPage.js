import React, { useEffect, useState } from 'react';
import { Button } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import MyAccountList from './MyAccountList';
import { removeAccount } from '../../../_actions/user_actions';
import styled from 'styled-components';

const AccountListDiv = styled.div`
    margin: 1rem auto;
    dispaly: inline-block;
    width: 750px;
    box-shadow: 0 0 20px rgba(0, 0, 0, 0.2);
`;

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
            <AccountListDiv>
                <MyAccountList accountList={AccountList} accountDelete={deleteAccount} />
            </AccountListDiv>
        </>
    );
}

export default MyAccountPage;
