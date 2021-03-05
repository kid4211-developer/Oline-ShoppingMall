import React, { useEffect, useState } from 'react';
import CovidContainer from './CovidContainer';
import * as api from './api';
import moment from 'moment';

function CovidComponent() {
    const [Result, setResult] = useState([]);
    const [Number, setNumber] = useState(0);

    const dateHandler = (value) => {
        setNumber(value);
    };
    useEffect(() => {
        async function covidAPI() {
            let startday = new Date();
            const startDate = moment(startday.setDate(startday.getDate() - Number - 7))
                .format('YYYY MM DD')
                .replace(/(\s*)/g, '');

            let Endday = new Date();
            const endDate = moment(Endday.setDate(Endday.getDate() - Number))
                .format('YYYY MM DD')
                .replace(/(\s*)/g, '');
            console.log('startDate', startDate);
            console.log('endDate', endDate);

            let variables = {
                serviceKey:
                    'jcyFsL%2BV5flatTz%2FlilxTxdS6k5kwoSVKrZmuAZAR%2BR46loLK7JBl3nzMZAlSUh%2BKbHwkeps3QfpH5gqaxNPOA%3D%3D',
                startCreateDt: startDate,
                endCreateDt: endDate,
            };
            const {
                data: {
                    response: {
                        body: {
                            items: { item },
                        },
                    },
                },
            } = await api.getCovidInfo(variables);

            const gnFilter = item.reverse().filter((result) => result.gubun === '경남');
            const gnResult = gnFilter.map((gn) => {
                return {
                    x: moment(gn.createDt).format('YY/MM/DD'),
                    y: gn.incDec,
                };
            });

            const seoulFilter = item.filter((result) => result.gubun === '서울');
            const seoulResult = seoulFilter.map((seoul) => {
                return {
                    x: moment(seoul.createDt).format('YY/MM/DD'),
                    y: seoul.incDec,
                };
            });

            const totalFilter = item.filter((result) => result.gubun === '합계');
            const totalResult = totalFilter.map((total) => {
                return {
                    x: moment(total.createDt).format('YY/MM/DD'),
                    y: total.incDec,
                };
            });

            const result = [
                { id: 'Total', color: 'hsl(240, 70%, 50%)', data: totalResult },
                { id: 'Seoul', color: 'hsl(60, 20%, 50%)', data: seoulResult },
                { id: 'GyeongNam', color: 'hsl(240, 70%, 50%)', data: gnResult },
            ];

            setResult(result);
        }

        covidAPI();
    }, [Number]);

    return (
        <React.Fragment>
            <CovidContainer data={Result} dateHandler={dateHandler} number={Number} />
        </React.Fragment>
    );
}

export default CovidComponent;
