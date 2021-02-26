import React, { useState } from 'react';
import { Typography, Button, Form, Input, message } from 'antd';
import './css/TransferPage.css';
import { Grid, TextField } from '@material-ui/core';
import styled from 'styled-components';
import BankSelectModal from './Modal/BankSelectModal';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { transfer } from '../../../_actions/user_actions';

const { Title } = Typography;

const TransferMainDiv = styled.div`
    max-width: 500px;
    height: 100%;
    margin: 2rem auto;
    text-align: center;
    border: 2px solid #e5e5e5;
    border-radius: 8px;
    background-color: #ffffff;
`;

const TransferInfoDiv = styled.div`
    max-width: 450px;
    height: 100px;
    margin: 4rem auto 4rem;
    border: 2px solid #e5e5e5;
    border-radius: 8px;
`;

const InfoNameDiv = styled.div`
    position: relative;
    display: inline-block;
    background-color: #ffffff;
    margin-top: -1rem;
    margin-left: 1rem;
    font-size: 1.2rem;
    padding: 0 0.7rem;
    float: left;
`;

function TransferPage({ history }) {
    const dispatch = useDispatch();
    const user = useSelector((state) => state.user);
    const [Amount, setAmount] = useState('');
    const [ToBankName, setToBankName] = useState('');
    const [FromBankName, setFromBankName] = useState('');
    const [FromAccountNumber, setFromAccountNumber] = useState('');
    const [ToAccountNumber, setToAccountNumber] = useState('');
    const [Type, setType] = useState('');
    const [Modal, setModal] = useState(false);

    const amountHandler = (e) => {
        setAmount(e.currentTarget.value);
    };

    const onCancel = () => {
        setModal(false);
    };

    const onConfirm = () => {
        setModal(false);
    };

    const modalHandler = (type) => {
        setModal(true);
        setType(type);
    };

    const bankNameHandler = (value) => {
        console.log(Type);
        if (Type === 'to') {
            setToBankName(value);
        } else {
            setFromBankName(value);
        }
    };

    const toAccountNumberHandler = (e) => {
        setToAccountNumber(e.currentTarget.value);
    };

    const fromAccountNumberHandler = (e) => {
        setFromAccountNumber(e.currentTarget.value);
    };

    const contentClear = () => {
        setAmount('');
        setToBankName('');
        setFromBankName('');
        setFromAccountNumber('');
        console.log(FromAccountNumber);
        setToAccountNumber('');
    };

    const requestTransfer = () => {
        if (!ToBankName || !FromBankName || !FromAccountNumber || !ToAccountNumber || !Amount) {
            return alert('빈칸 항목을 채워 주세요 ~ !');
        }

        let variables = {
            userName: user.userData.name,
            user: user.userData._id,
            userImage: user.userData.image,
            fromBankName: FromBankName,
            toBankName: ToBankName,
            fromAccountNumber: FromAccountNumber,
            toAccountNumber: ToAccountNumber,
            amount: Amount,
        };

        dispatch(transfer(variables)).then((response) => {
            if (response.payload.success) {
                console.log('계좌이체 성공');
                message.success('Remitted successfully');
                setTimeout(() => {
                    history.push('/bank');
                }, 3000);
            }
        });
    };

    return (
        <>
            <TransferMainDiv>
                <Title level={3} style={{ marginTop: '1rem' }}>
                    Account Transfer
                </Title>
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
                        onClick={requestTransfer}
                    >
                        Transfer
                    </Button>
                </div>
                <TransferInfoDiv>
                    <InfoNameDiv>From</InfoNameDiv>
                    <div style={{ display: 'flex', marginTop: '1.5rem' }}>
                        <TextField
                            id="standard-basic"
                            label="Select Bank"
                            style={{ margin: '0 20px' }}
                            onClick={() => modalHandler('From')}
                            value={FromBankName || ''}
                            autoComplete="off"
                        />
                        <TextField
                            id="standard-basic"
                            label="Account Number"
                            style={{ margin: '0 20px', width: '75%' }}
                            onChange={fromAccountNumberHandler}
                            value={FromAccountNumber}
                            autoComplete="off"
                        />
                    </div>
                </TransferInfoDiv>
                <TransferInfoDiv>
                    <InfoNameDiv>To</InfoNameDiv>
                    <div style={{ display: 'flex', marginTop: '1.5rem' }}>
                        <TextField
                            id="standard-basic"
                            label="Select Bank"
                            style={{ margin: '0 20px' }}
                            onClick={() => modalHandler('to')}
                            value={ToBankName || ''}
                            autoComplete="off"
                        />
                        <TextField
                            id="standard-basic"
                            label="Account Number"
                            style={{ margin: '0 20px', width: '75%' }}
                            onChange={toAccountNumberHandler}
                            value={ToAccountNumber}
                            autoComplete="off"
                        />
                    </div>
                </TransferInfoDiv>
                <TransferInfoDiv>
                    <InfoNameDiv>Amount</InfoNameDiv>
                    <div style={{ display: 'flex', marginTop: '1.5rem' }}>
                        <Grid container alignItems="flex-end" style={{ marginLeft: '1rem' }}>
                            <Grid item style={{ fontSize: '20px' }}>
                                ￦
                            </Grid>
                            <Grid item>
                                <TextField
                                    style={{ marginLeft: '0.75rem', width: '375px' }}
                                    id="input-with-icon-grid"
                                    label="Remittance Amount"
                                    onChange={amountHandler}
                                    value={Amount}
                                    autoComplete="off"
                                />
                            </Grid>
                        </Grid>
                    </div>
                </TransferInfoDiv>
            </TransferMainDiv>
            <BankSelectModal
                visible={Modal}
                title="Select Bank"
                onConfirm={onConfirm}
                onCancel={onCancel}
                bankNameHandler={bankNameHandler}
            />
        </>
    );
}

export default TransferPage;
