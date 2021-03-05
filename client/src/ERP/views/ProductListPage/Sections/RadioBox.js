import { Radio, Collapse } from 'antd';
import React, { useState } from 'react';
const { Panel } = Collapse;

function RadioBox({ list, handleFilters }) {
    const [Value, setValue] = useState(0);
    const renderRadioBox = () => {
        return (
            list &&
            list.map((value, index) => (
                <Radio key={index} value={value._id}>
                    {value.name}
                </Radio>
            ))
        );
    };

    const handleChange = (e) => {
        setValue(e.target.value);
        handleFilters(e.target.value);
    };

    return (
        <div>
            <Collapse defaultActiveKey={['0']}>
                <Panel header="Price" key="1">
                    <Radio.Group onChange={handleChange} value={Value}>
                        {renderRadioBox()}
                    </Radio.Group>
                </Panel>
            </Collapse>
        </div>
    );
}

export default RadioBox;
