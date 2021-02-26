import React from 'react';
import styled from 'styled-components';
import { Avatar, Typography } from 'antd';
import { useSelector } from 'react-redux';
import moment from 'moment';

const { Title } = Typography;
const TransactionMainDiv = styled.div`
    max-width: 400px;
    height: 100%;
    margin: 2rem auto;
    text-align: center;
    border: 2px solid #e5e5e5;
    border-radius: 8px;
    background-color: #ffffff;
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
    left: -10rem;
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
    padding-left: 6rem;
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

function TransactionPage() {
    const user = useSelector((state) => state.user);

    function numberWithCommas(num) {
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    }

    const renderTransaction = () =>
        user.userData.transfers &&
        user.userData.transfers.map((item, index) => {
            console.log('작동확인', item.type);
            if (item.type === 'send') {
                return (
                    <React.Fragment key={index}>
                        <AvatarDiv>
                            <Avatar size={48} src={item.toImage} />
                        </AvatarDiv>
                        <SectionDiv>
                            <DateDiv>{moment(item.date).format('YY.MM.DD')}</DateDiv>
                            <InfoDiv>
                                <LeftBlock>
                                    <div>{item.toName}</div>
                                    <div>
                                        {item.toBank}&nbsp;/&nbsp;
                                        {moment(item.date).format('hh:mm a')}
                                    </div>
                                </LeftBlock>
                                <div style={{ float: 'right' }}>
                                    <RigthSendInfo>
                                        <div>-{numberWithCommas(item.amount)}&nbsp;원</div>
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
                            <Avatar size={48} src={item.fromImage} />
                        </AvatarDiv>
                        <SectionDiv>
                            <DateDiv>{moment(item.date).format('YY.MM.DD')}</DateDiv>
                            <InfoDiv>
                                <LeftBlock>
                                    <div>{item.fromName}</div>
                                    <div>
                                        {item.fromBank}&nbsp;/&nbsp;
                                        {moment(item.date).format('hh:mm a')}
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
            <div>{user.userData && user.userData.transfers ? renderTransaction() : ''}</div>
            <br />
            <br />
            <br />
        </TransactionMainDiv>
    );
}

export default TransactionPage;
