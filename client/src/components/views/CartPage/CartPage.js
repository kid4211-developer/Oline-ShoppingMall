import { Empty, Result } from 'antd';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getCartItems, onSuccessBuy, removeCartItem } from '../../../_actions/user_actions';
import Paypal from '../../utils/Paypal';
import UserCardBlock from './Sections/UserCardBlock';

function CartPage() {
    const dispatch = useDispatch();
    const user = useSelector((state) => state.user);
    const [Total, setTotal] = useState(0);
    const [ShowTotal, setShowTotal] = useState(false);
    const [ShowSuccess, setShowSuccess] = useState(false);

    useEffect(() => {
        let cartItems = [];
        //redux User-State에 cart 정보가 담겨 있는지
        if (user.userData && user.userData.cart) {
            if (user.userData.cart.length > 0) {
                user.userData.cart.forEach((item) => {
                    cartItems.push(item.id);
                });
                dispatch(getCartItems(cartItems, user.userData.cart)).then((response) => {
                    calculateTotal(response.payload);
                });
            }
        }
    }, [user.userData]);

    const calculateTotal = (cartDetail) => {
        let total = 0;
        cartDetail.map((item) => {
            total += parseInt(item.price, 10) * item.quantity;
        });
        setTotal(total);
        setShowTotal(true);
    };

    const removeFromCart = (productId) => {
        dispatch(removeCartItem(productId)).then((response) => {
            if (response.payload.productInfo.length <= 0) {
                setShowTotal(false);
            }
        });
    };

    const transactionSuccess = (paymentData) => {
        dispatch(
            onSuccessBuy({
                paymentData: paymentData,
                cartDetail: user.cartDetail,
            })
        ).then((response) => {
            if (response.payload.success) {
                setShowTotal(false);
                setShowSuccess(true);
            }
        });
    };
    return (
        <div style={{ width: '85%', margin: '3rem auto' }}>
            <h1 style={{ letterSpacing: '0.25rem' }}>My Cart</h1>
            <div>
                <UserCardBlock products={user.cartDetail} removeItem={removeFromCart} />
            </div>

            {ShowTotal ? (
                <div style={{ marginTop: '3rem' }}>
                    <h2>Total Amount : ${Total}</h2>
                </div>
            ) : ShowSuccess ? (
                <Result status="success" title="Successfully Purchased Items" />
            ) : (
                <>
                    <br />
                    <Empty description="There is no registered product" />
                </>
            )}
            {ShowTotal && <Paypal total={Total} onSuccess={transactionSuccess} />}
        </div>
    );
}

export default CartPage;
