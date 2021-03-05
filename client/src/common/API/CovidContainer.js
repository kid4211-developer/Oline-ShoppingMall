import React from 'react';
import CovidResultGraph from './CovidResultGraph';
import { Typography, Select } from 'antd';
import styled from 'styled-components';

const { Option } = Select;
const { Title } = Typography;
const MainDiv = styled.div`
    border: 1px solid #e5e5e5;
    max-width: 800px;
    margin: 2rem auto;
    background-color: white;
    text-align: center;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
`;

const DateOptions = [
    { value: 0, label: 'this week' },
    { value: 7, label: '1 week ago' },
    { value: 14, label: '2 weeks ago' },
    { value: 21, label: '3 weeks ago' },
];

function CovidContainer({ data, dateHandler, number }) {
    console.log(data);
    return (
        <MainDiv>
            <Title level={2} style={{ margin: '1rem' }}>
                COVID-19 Board
            </Title>
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginRight: '1rem' }}>
                <Select style={{ width: 120 }} value={number} onChange={dateHandler}>
                    {DateOptions.map((item, index) => (
                        <Option key={index} value={item.value}>
                            {item.label}
                        </Option>
                    ))}
                </Select>
            </div>
            <div style={{ height: '500px', marginRight: '1rem' }}>
                <CovidResultGraph data={data} />
            </div>
        </MainDiv>
    );
}

export default CovidContainer;
