import axios from 'axios';
import {
    LOGIN_USER,
    REGISTER_USER,
    AUTH_USER,
    LOGOUT_USER,
    ADD_TO_CART,
    GET_CART_ITEMS,
    REMOVE_CART_ITEM,
    ON_SUCCESS_BUY,
    ON_SUCCESS_TRANSFER,
    ADD_TO_ACCOUNT,
    REMOVE_TO_ACCOUNT,
} from './types';
import { USER_SERVER, PRODUCT_SERVER, ACCOUNT_SERVER } from '../components/Config.js';

export function registerUser(dataToSubmit) {
    const request = axios
        .post(`${USER_SERVER}/register`, dataToSubmit)
        .then((response) => response.data);

    return {
        type: REGISTER_USER,
        payload: request,
    };
}

export function loginUser(dataToSubmit) {
    const request = axios
        .post(`${USER_SERVER}/login`, dataToSubmit)
        .then((response) => response.data);

    return {
        type: LOGIN_USER,
        payload: request,
    };
}

export function auth() {
    const request = axios.get(`${USER_SERVER}/auth`).then((response) => response.data);

    return {
        type: AUTH_USER,
        payload: request,
    };
}

export function logoutUser() {
    const request = axios.get(`${USER_SERVER}/logout`).then((response) => response.data);

    return {
        type: LOGOUT_USER,
        payload: request,
    };
}

export function addToCart(id) {
    let body = {
        productId: id,
    };
    const request = axios.post(`${USER_SERVER}/addToCart`, body).then((response) => response.data);

    return {
        type: ADD_TO_CART,
        payload: request,
    };
}

export function getCartItems(cartItems, userCart) {
    const request = axios
        .get(`${PRODUCT_SERVER}/products_by_id?id=${cartItems}&type=array`)
        .then((response) => {
            // CartItems에 해당 하는 정보들을 Product Collection에서 가져온 후에 Quantity 정보를 넣어줌
            userCart.forEach((cartItem) => {
                response.data.forEach((productDetail, index) => {
                    if (cartItem.id === productDetail._id) {
                        response.data[index].quantity = cartItem.quantity;
                    }
                });
            });
            return response.data;
        });

    return {
        type: GET_CART_ITEMS,
        payload: request,
    };
}

export function removeCartItem(productId) {
    const request = axios.get(`${USER_SERVER}/removeFromCart?id=${productId}`).then((response) => {
        //productInfo + cart 정보를 조합하여 CartDetail을 만들어줌
        response.data.cart.forEach((item, index) => {
            response.data.productInfo.forEach((product, index) => {
                if (item.id === product._id) {
                    response.data.productInfo[index].quantity = item.quantity;
                }
            });
        });
        return response.data;
    });

    return {
        type: REMOVE_CART_ITEM,
        payload: request,
    };
}

export function onSuccessBuy(data) {
    const request = axios.post(`${USER_SERVER}/successBuy`, data).then((response) => {
        return response.data;
    });
    return {
        type: ON_SUCCESS_BUY,
        payload: request,
    };
}

export function addAccount(accountInfo) {
    const request = axios.post(`${ACCOUNT_SERVER}/createAccount`, accountInfo).then((response) => {
        return response.data;
    });
    return {
        type: ADD_TO_ACCOUNT,
        payload: request,
    };
}

export function removeAccount(accounts) {
    const request = axios.post(`${ACCOUNT_SERVER}/deleteAccount`, accounts).then((response) => {
        return response.data;
    });
    return {
        type: REMOVE_TO_ACCOUNT,
        payload: request,
    };
}

export function transfer(transferInfo) {
    const request = axios.post(`${ACCOUNT_SERVER}/transfer`, transferInfo).then((response) => {
        return response.data;
    });
    return {
        type: ON_SUCCESS_TRANSFER,
        payload: request,
    };
}
