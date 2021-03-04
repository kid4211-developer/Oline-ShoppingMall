import React, { useState } from 'react';
import { Typography, Icon, Input, Button, Form, message } from 'antd';
import './css/TransferPage.css';
import { Grid, TextField } from '@material-ui/core';
import styled from 'styled-components';
import BankSelectModal from './Modal/BankSelectModal';
import { useDispatch, useSelector } from 'react-redux';
import { transfer } from '../../../_actions/user_actions';
import { Formik } from 'formik';
import * as Yup from 'yup';

const { Title } = Typography;

const TransferMainDiv = styled.div`
    max-width: 500px;
    height: 100%;
    margin: 2rem auto;
    text-align: center;
    border: 2px solid #e5e5e5;
    border-radius: 8px;
    background-color: #ffffff;
    box-shadow: 0 0 20px rgba(0, 0, 0, 0.2);
`;

const TransferInfoDiv = styled.div`
    max-width: 450px;
    height: 120px;
    margin: 3rem auto 2rem;
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

    const [ToBankName, setToBankName] = useState('');
    const [FromBankName, setFromBankName] = useState('');

    const [Type, setType] = useState('');
    const [Modal, setModal] = useState(false);
    const [formErrorMessage, setFormErrorMessage] = useState('');

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

    const contentClear = () => {
        setToBankName('');
        setFromBankName('');
    };

    return (
        <Formik
            initialValues={{
                fromBankName: '',
                fromAccountNumber: '',
                toBankName: '',
                toAccountNumber: '',
                amount: '',
            }}
            validationSchema={Yup.object().shape({
                fromBankName: Yup.string().required('Bank is required'),
                fromAccountNumber: Yup.string()
                    .required('Account Number is required')
                    .matches(/^[0-9]+$/, 'Must be only digits')
                    .min(13, 'Account Number must be at least 13 char'),
                toBankName: Yup.string().required('Bank is required'),
                toAccountNumber: Yup.string()
                    .required('Account Number is required')
                    .matches(/^[0-9]+$/, 'Must be only digits')
                    .min(13, 'Account Number must be at least 13 char'),
                amount: Yup.string()
                    .required('Please enter the amount.')
                    .matches(/^[0-9]+$/, 'Must be only digits'),
            })}
        >
            {(props) => {
                const {
                    values,
                    touched,
                    errors,
                    dirty,
                    isSubmitting,
                    handleChange,
                    handleBlur,
                    handleSubmit,
                    handleReset,
                } = props;
                const reset = () => {
                    contentClear();
                    handleReset();
                };
                const onTransfer = () => {
                    if (
                        !ToBankName ||
                        !FromBankName ||
                        !values.fromAccountNumber ||
                        !values.toAccountNumber ||
                        !values.amount
                    ) {
                        return alert('빈칸 항목을 채워 주세요!');
                    }
                    setTimeout(() => {
                        let variables = {
                            userName: user.userData.name,
                            user: user.userData._id,
                            userImage: user.userData.image,
                            fromBankName: FromBankName,
                            toBankName: ToBankName,
                            fromAccountNumber: values.fromAccountNumber,
                            toAccountNumber: values.toAccountNumber,
                            amount: values.amount,
                        };

                        dispatch(transfer(variables))
                            .then((response) => {
                                if (response.payload.success) {
                                    history.push('/bank');
                                } else {
                                    setFormErrorMessage(response.payload.message);
                                }
                            })
                            .catch((err) => {
                                console.log(err);
                                setFormErrorMessage('Check out your Account or Password again');
                            });
                    }, 500);
                };
                return (
                    <>
                        <TransferMainDiv>
                            <Title level={3} style={{ marginTop: '1rem' }}>
                                Account Transfer
                            </Title>

                            <form onSubmit={handleSubmit}>
                                <TransferInfoDiv>
                                    <InfoNameDiv>From</InfoNameDiv>
                                    <div style={{ display: 'flex', marginTop: '1.5rem' }}>
                                        <Form.Item required>
                                            <TextField
                                                id="fromBankName"
                                                label="Select Bank"
                                                style={{
                                                    margin: '0 20px',
                                                    width: '100px',
                                                }}
                                                onClick={() => modalHandler('From')}
                                                value={FromBankName || ''}
                                                autoComplete="off"
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                className={
                                                    errors.fromBankName && touched.fromBankName
                                                        ? 'text-input error'
                                                        : 'text-input'
                                                }
                                            />
                                            {errors.fromBankName &&
                                                touched.fromBankName &&
                                                !FromBankName && (
                                                    <div
                                                        className="input-feedback"
                                                        style={{ margin: '0 20px' }}
                                                    >
                                                        {errors.fromBankName}
                                                    </div>
                                                )}
                                        </Form.Item>
                                        <Form.Item required>
                                            <TextField
                                                id="fromAccountNumber"
                                                label="Account Number"
                                                style={{ margin: '0 20px 0 50px', width: '200px' }}
                                                value={values.fromAccountNumber}
                                                autoComplete="off"
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                className={
                                                    errors.fromAccountNumber &&
                                                    touched.fromAccountNumber
                                                        ? 'text-input error'
                                                        : 'text-input'
                                                }
                                            />
                                            {errors.fromAccountNumber && touched.fromAccountNumber && (
                                                <div
                                                    className="input-feedback"
                                                    style={{ margin: '0' }}
                                                >
                                                    {errors.fromAccountNumber}
                                                </div>
                                            )}
                                        </Form.Item>
                                    </div>
                                </TransferInfoDiv>
                                <TransferInfoDiv>
                                    <InfoNameDiv>To</InfoNameDiv>
                                    <div style={{ display: 'flex', marginTop: '1.5rem' }}>
                                        <Form.Item required>
                                            <TextField
                                                id="toBankName"
                                                label="Select Bank"
                                                style={{
                                                    margin: '0 20px',
                                                    width: '100px',
                                                }}
                                                onClick={() => modalHandler('to')}
                                                value={ToBankName || ''}
                                                autoComplete="off"
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                className={
                                                    errors.toBankName && touched.toBankName
                                                        ? 'text-input error'
                                                        : 'text-input'
                                                }
                                            />
                                            {errors.toBankName &&
                                                touched.toBankName &&
                                                !ToBankName && (
                                                    <div
                                                        className="input-feedback"
                                                        style={{ margin: '0 20px' }}
                                                    >
                                                        {errors.toBankName}
                                                    </div>
                                                )}
                                        </Form.Item>
                                        <Form.Item required>
                                            <TextField
                                                id="toAccountNumber"
                                                label="Account Number"
                                                style={{ margin: '0 20px 0 50px', width: '200px' }}
                                                value={values.toAccountNumber}
                                                autoComplete="off"
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                className={
                                                    errors.toAccountNumber &&
                                                    touched.toAccountNumber
                                                        ? 'text-input error'
                                                        : 'text-input'
                                                }
                                            />
                                            {errors.toAccountNumber && touched.toAccountNumber && (
                                                <div
                                                    className="input-feedback"
                                                    style={{ margin: '0' }}
                                                >
                                                    {errors.toAccountNumber}
                                                </div>
                                            )}
                                        </Form.Item>
                                    </div>
                                </TransferInfoDiv>
                                <TransferInfoDiv>
                                    <InfoNameDiv>Amount</InfoNameDiv>
                                    <div style={{ display: 'flex', marginTop: '1.5rem' }}>
                                        <Form.Item required>
                                            <Grid
                                                container
                                                alignItems="flex-end"
                                                style={{ marginLeft: '1rem' }}
                                            >
                                                <Grid item style={{ fontSize: '20px' }}>
                                                    ￦
                                                </Grid>
                                                <Grid item>
                                                    <TextField
                                                        style={{
                                                            marginLeft: '0.75rem',
                                                            width: '375px',
                                                        }}
                                                        id="amount"
                                                        label="Remittance Amount"
                                                        autoComplete="off"
                                                        value={values.amount}
                                                        onChange={handleChange}
                                                        onBlur={handleBlur}
                                                        className={
                                                            errors.amount && touched.amount
                                                                ? 'text-input error'
                                                                : 'text-input'
                                                        }
                                                    />
                                                </Grid>
                                                {errors.amount && touched.amount && (
                                                    <div
                                                        className="input-feedback"
                                                        style={{ margin: 'auto' }}
                                                    >
                                                        {errors.amount}
                                                    </div>
                                                )}
                                            </Grid>
                                        </Form.Item>
                                    </div>
                                </TransferInfoDiv>
                                {formErrorMessage && (
                                    <label>
                                        <p
                                            style={{
                                                color: '#ff0000bf',
                                                fontSize: '1rem',
                                                border: '1px solid',
                                                margin: 'auto',
                                                borderRadius: '7px',
                                                width: '60%',
                                                marginBottom: '2rem',
                                                padding: '0.5rem 0rem',
                                            }}
                                        >
                                            {formErrorMessage}
                                        </p>
                                    </label>
                                )}
                                <Form.Item>
                                    <Button
                                        type="primary"
                                        htmlType="submit"
                                        className="login-form-button"
                                        style={{ minWidth: '25%', marginRight: '2rem' }}
                                        disabled={isSubmitting}
                                        onClick={reset}
                                    >
                                        Reset
                                    </Button>
                                    <Button
                                        type="primary"
                                        htmlType="submit"
                                        className="login-form-button"
                                        style={{ minWidth: '25%', marginLeft: '2rem' }}
                                        disabled={isSubmitting}
                                        onClick={onTransfer}
                                    >
                                        Transfer
                                    </Button>
                                </Form.Item>
                            </form>
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
            }}
        </Formik>
    );
}

export default TransferPage;
