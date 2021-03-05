import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Avatar, Typography, DatePicker, Switch, Input } from 'antd';
import { useSelector } from 'react-redux';
import moment from 'moment';
import axios from 'axios';
import { SearchOutlined, LoadingOutlined, SwapOutlined, UserOutlined } from '@ant-design/icons';

const { Title } = Typography;
const TransactionMainDiv = styled.div`
    max-width: 500px;
    height: 100%;
    margin: 2rem auto;
    text-align: center;
    border: 2px solid #e5e5e5;
    border-radius: 8px;
    background-color: #ffffff;
    box-shadow: 0 0 20px rgba(0, 0, 0, 0.2);
`;

const SectionDiv = styled.div`
    border-top: 1px solid #e5e5e5;
    border-bottom: 1px solid #e5e5e5;
    maxwidth: 500px;
    margin-top: -1.5rem;
`;

const DateDiv = styled.div`
    position: relative;
    background-color: #ffffff;
    display: inline-block;
    top: -0.6rem;
    left: -8rem;
    padding: 0 10px;
`;

const AvatarDiv = styled.div`
    position: relative;
    top: 4.2rem;
    left: -12rem;
    display: block;
    padding: 0.7rem 0;
    margin-left: 1.5rem;
    display: inline-block;
`;

const InfoDiv = styled.div`
    display: flex;
    justify-content: space-between;
`;

const LeftBlock = styled.div`
    display: block;
    padding-top: 0.8rem;
    padding-left: 8rem;
    text-align: left;
`;

const RigthSendInfo = styled.div`
    padding: 0.8rem 2.5rem 2rem 0;
    color: red;
    text-align: right;
`;

const RightReceiveInfo = styled.div`
    padding: 0.8rem 2.5rem 2rem 0;
    color: gray;
    text-align: right;
`;

const SearchDiv = styled.div`
    cursor: pointer;
    font-size: 22px;
    margin-left: 1rem;
    color: #a9a9a9;
`;

function TransactionPage1() {
    const user = useSelector((state) => state.user);
    const [TransactionList, setTransactionList] = useState([]);
    const [StartDate, setStartDate] = useState('');
    const [EndDate, setEndDate] = useState('');
    const [SearchName, setSearchName] = useState('');
    const [SearchToggle, setSearchToggle] = useState(false);

    function numberWithCommas(num) {
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    }

    useEffect(() => {
        if (user.userData && user.userData._id) {
            let variables = {
                userId: user.userData._id,
            };
            getTransferList(variables);
        }
    }, [user.userData]);

    const getTransferList = (info) => {
        axios.post('/api/account/requestTransaction', info).then((response) => {
            if (response.data.success) {
                console.log('이체내역', response.data.transactionList);
                setTransactionList(response.data.transactionList);
            } else {
                alert('이체 내역 조회를 실패했습니다.');
            }
        });
    };

    const getTransferListByDate = () => {
        if (!StartDate || !EndDate) {
            return alert('조회 날짜를 선택해주세요.');
        }
        let variables = {
            userId: user.userData._id,
            startDate: StartDate,
            endDate: EndDate,
        };
        axios.post('/api/account/getTransferListByDate', variables).then((response) => {
            if (response.data.success) {
                console.log('날짜별 이체 내역 조회', response.data.transactionList);
                setTransactionList(response.data.transactionList);
            } else {
                alert('날짜 조건에 맞는 이체 내역 조회를 실패했습니다.');
            }
        });
    };

    const getTransferListByName = () => {
        if (!SearchName) {
            return alert('조회 이름을 입력해주세요.');
        }
        let variables = {
            userId: user.userData._id,
            searchName: SearchName,
        };
        axios.post('/api/account/getTransferListByName', variables).then((response) => {
            if (response.data.success) {
                console.log('이름별 이체 내역 조회', response.data.list);
                setTransactionList(response.data.list);
            } else {
                alert('날짜 조건에 맞는 이체 내역 조회를 실패했습니다.');
            }
        });
    };

    const startDateHandler = (date) => {
        if (date === null) {
            setStartDate('');
        } else {
            setStartDate(date._d);
        }
    };

    const endDateHandler = (date) => {
        if (date === null) {
            setEndDate('');
        } else {
            setEndDate(date._d);
        }
    };

    const searchMenuHandler = () => {
        setEndDate('');
        setStartDate('');
        setSearchName('');
        setSearchToggle(!SearchToggle);
    };

    const searchNameHandler = (e) => {
        setSearchName(e.currentTarget.value);
    };

    const renderTransaction = () =>
        user.userData &&
        user.userData._id &&
        TransactionList.map((item, index) => {
            if (user.userData._id === item.fromUser._id) {
                return (
                    <React.Fragment key={index}>
                        <AvatarDiv>
                            <Avatar size={48} src={item.toUser.image} />
                        </AvatarDiv>
                        <SectionDiv>
                            <DateDiv>{moment(item.createdAt).format('YY.MM.DD')}</DateDiv>
                            <InfoDiv>
                                <LeftBlock>
                                    <div>{item.toUser.name}</div>
                                    <div>
                                        {item.toBank}&nbsp;/&nbsp;
                                        {moment(item.createdAt).format('hh:mm a')}
                                    </div>
                                </LeftBlock>
                                <div style={{ float: 'right' }}>
                                    <RigthSendInfo>
                                        <div>-&nbsp;{numberWithCommas(item.amount)}&nbsp;원</div>
                                        <div>송금</div>
                                    </RigthSendInfo>
                                </div>
                            </InfoDiv>
                        </SectionDiv>
                    </React.Fragment>
                );
            } else {
                return (
                    <React.Fragment key={index}>
                        <AvatarDiv>
                            <Avatar size={48} src={item.fromUser.image} />
                        </AvatarDiv>
                        <SectionDiv>
                            <DateDiv>{moment(item.createdAt).format('YY.MM.DD')}</DateDiv>
                            <InfoDiv>
                                <LeftBlock>
                                    <div>{item.fromUser.name}</div>
                                    <div>
                                        {item.fromBank}&nbsp;/&nbsp;
                                        {moment(item.createdAt).format('hh:mm a')}
                                    </div>
                                </LeftBlock>
                                <div style={{ float: 'right' }}>
                                    <RightReceiveInfo>
                                        <div>{numberWithCommas(item.amount)}&nbsp;원</div>
                                        <div>입금</div>
                                    </RightReceiveInfo>
                                </div>
                            </InfoDiv>
                        </SectionDiv>
                    </React.Fragment>
                );
            }
        });

    return (
        <TransactionMainDiv>
            <Title level={2} style={{ margin: '1rem 0 2rem' }}>
                Transaction List
            </Title>
            <div style={{ display: 'flex', justifyContent: 'flex-end', margin: '0 2rem 2rem 0' }}>
                <Switch defaultChecked onChange={searchMenuHandler} />
            </div>
            {SearchToggle ? (
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginRight: '2rem' }}>
                    <Input
                        placeholder="Enter the name"
                        prefix={<UserOutlined />}
                        style={{ width: '140px' }}
                        onChange={searchNameHandler}
                    />
                    <SearchDiv>
                        <SearchOutlined onClick={getTransferListByName} />
                    </SearchDiv>
                </div>
            ) : (
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <DatePicker onChange={startDateHandler} />
                    <div style={{ fontSize: '22px', color: '#A9A9A9', margin: '0 0.5rem' }}>
                        <SwapOutlined />
                    </div>
                    <DatePicker onChange={endDateHandler} />

                    <SearchDiv>
                        <SearchOutlined onClick={getTransferListByDate} />
                    </SearchDiv>
                </div>
            )}

            <div>
                {user.userData && user.userData.transfers ? (
                    renderTransaction()
                ) : (
                    <div style={{ fontSize: '40px' }}>
                        <br />
                        <br />
                        <LoadingOutlined />
                    </div>
                )}
            </div>

            <br />
            <br />
            <br />
        </TransactionMainDiv>
    );
}

export default TransactionPage1;
