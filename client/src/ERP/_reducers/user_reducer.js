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
} from '../_actions/types';

export default function (state = {}, action) {
    switch (action.type) {
        case REGISTER_USER:
            return { ...state, register: action.payload };
        case LOGIN_USER:
            return { ...state, loginSucces: action.payload };
        case AUTH_USER:
            return { ...state, userData: action.payload };
        case LOGOUT_USER:
            return { ...state };
        case ADD_TO_CART:
            console.log('ADD_TO_CART', action.payload);
            return { ...state, userData: { ...state.userData, cart: action.payload } }; //server - router에서 send()를 통해 보내는 값 = action.payload(=userInfo.cart)
        case GET_CART_ITEMS:
            return { ...state, cartDetail: action.payload };
        case REMOVE_CART_ITEM:
            return {
                ...state,
                cartDetail: action.payload.productInfo,
                userData: {
                    ...state.userData,
                    cart: action.payload.cart,
                },
            };
        case ON_SUCCESS_BUY:
            return {
                ...state,
                cartDetail: action.payload.cartDetail,
                userData: { ...state.userData, cart: action.payload.cart },
            };
        case ON_SUCCESS_TRANSFER:
            return {
                ...state,
                userData: {
                    ...state.userData,
                    transfers: action.payload.transfers,
                },
            };
        case ADD_TO_ACCOUNT:
            return {
                ...state,
                userData: {
                    ...state.userData,
                    accounts: action.payload.accountInfo,
                },
            };
        case REMOVE_TO_ACCOUNT:
            return {
                ...state,
                userData: {
                    ...state.userData,
                    accounts: action.payload.accounts,
                },
            };
        default:
            return state;
    }
}
