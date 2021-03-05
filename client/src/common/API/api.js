import axios from './cors';

export const getCovidInfo = (key) =>
    axios.get(
        `/openapi/service/rest/Covid19/getCovid19SidoInfStateJson?serviceKey=${key.serviceKey}&pageNo=1&numOfRows=10&startCreateDt=${key.startCreateDt}&endCreateDt=${key.endCreateDt}`
    );
