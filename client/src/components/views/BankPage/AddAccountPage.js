import React, { useState } from 'react';
import { Typography } from 'antd';
import styled from 'styled-components';
import TextField from '@material-ui/core/TextField';
import BankSelectModal from './Modal/BankSelectModal';
import { Button } from 'antd';
import { useSelector } from 'react-redux';
import axios from 'axios';

const { Title } = Typography;
const AccountDiv = styled.div`
    max-width: 500px;
    margin: 2rem auto;
    border: 1px solid #eee;
    background-color: white;
`;

function AddAccountPage() {
    const user = useSelector((state) => state.user);
    const [Modal, setModal] = useState(false);
    const [BankName, setBankName] = useState('');
    const [AccountNumber, setAccountNumber] = useState('');

    const onCancel = () => {
        setModal(false);
    };

    const onConfirm = () => {
        setModal(false);
    };

    const modalHandler = () => {
        setModal(true);
    };

    const bankNameHandler = (value) => {
        setBankName(value);
    };

    const accountNumberHandler = (e) => {
        setAccountNumber(e.currentTarget.value);
    };

    const contentClear = () => {
        setAccountNumber('');
        setBankName('');
    };

    const createAccount = () => {
        const variables = {
            user: user.userData._id,
            bank: BankName,
            accountNumber: AccountNumber,
        };
        axios.post('/api/account/createAccount', variables).then((response) => {
            if (response.data.success) {
                contentClear();
            } else {
                alert('계좌 생성을 실패했습니다.');
            }
        });
    };
    return (
        <React.Fragment>
            <AccountDiv>
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <Title level={2} style={{ letterSpacing: '0.15rem' }}>
                        Create Account
                    </Title>
                </div>
                <div
                    style={{
                        display: 'flex',
                        justifyContent: 'flex-end',
                        paddingTop: '1rem',
                    }}
                >
                    <Button
                        style={{ borderColor: '#fff', marginRight: '1rem' }}
                        onClick={contentClear}
                    >
                        Clear
                    </Button>
                    <Button
                        style={{ borderColor: '#fff', marginRight: '0.5rem' }}
                        onClick={createAccount}
                    >
                        Create
                    </Button>
                </div>
                <form noValidate autoComplete="off">
                    <div style={{ display: 'flex', margin: '5rem 0 2rem' }}>
                        <TextField
                            id="standard-basic"
                            label="Select Bank"
                            onClick={modalHandler}
                            style={{ margin: '0 10px' }}
                            value={BankName || ''}
                        />
                        <TextField
                            id="standard-basic"
                            label="Account Number"
                            style={{ margin: '0 10px', width: '75%' }}
                            onChange={accountNumberHandler}
                        />
                    </div>
                </form>
            </AccountDiv>
            <BankSelectModal
                visible={Modal}
                title="Select Bank"
                onConfirm={onConfirm}
                onCancel={onCancel}
                bankNameHandler={bankNameHandler}
            />
        </React.Fragment>
    );
}

export default AddAccountPage;
