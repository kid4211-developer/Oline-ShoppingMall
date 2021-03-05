import React, { useState } from 'react';
import { message, Typography } from 'antd';
import styled from 'styled-components';
import TextField from '@material-ui/core/TextField';
import BankSelectModal from './Modal/BankSelectModal';
import { Button } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { addAccount } from '../../_actions/user_actions';

const { Title } = Typography;
const MainDiv = styled.div`
    max-width: 500px;
    height: 100%;
    margin: 2rem auto;
    text-align: center;
    border: 2px solid #e5e5e5;
    border-radius: 8px;
    background-color: #ffffff;
    box-shadow: 0 0 20px rgba(0, 0, 0, 0.2);
`;

const CreateDiv = styled.div`
    max-width: 450px;
    height: 100%;
    margin: 3rem auto 2rem;
    border: 2px solid #e5e5e5;
    border-radius: 8px;
`;

const InfoDiv = styled.div`
    position: relative;
    display: inline-block;
    background-color: #ffffff;
    margin-top: -1rem;
    margin-left: 1rem;
    font-size: 1.2rem;
    padding: 0 0.7rem;
    float: left;
`;
function AddAccountPage() {
    const dispatch = useDispatch();
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
        if (!BankName || !AccountNumber) {
            return alert('빈칸 항목을 채워 주세요.');
        }

        dispatch(addAccount(variables)).then((response) => {
            if (response.payload.success) {
                console.log('계좌생성 성공');
                message.success('Created a account successfully');
                setTimeout(() => {
                    contentClear();
                }, 2000);
            } else {
                alert('계좌 생성을 실패했습니다.');
            }
        });
    };

    return (
        <React.Fragment>
            <MainDiv>
                <div style={{ textAlign: 'center', margin: '2rem 0 2rem' }}>
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
                <CreateDiv>
                    <InfoDiv>Information</InfoDiv>

                    <TextField
                        label="Select Bank"
                        onClick={modalHandler}
                        value={BankName || ''}
                        style={{
                            width: '85%',
                            margin: '1rem 0',
                        }}
                    />
                    <TextField
                        label="Account Number"
                        onChange={accountNumberHandler}
                        value={AccountNumber}
                        style={{ width: '85%', margin: '1.5rem 0' }}
                    />
                </CreateDiv>
            </MainDiv>
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
