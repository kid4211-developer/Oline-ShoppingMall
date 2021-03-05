import React from 'react';
import { useSelector } from 'react-redux';

function HistoryPage() {
    const userData = useSelector((state) => state.user.userData);
    console.log('고객정보', userData);
    return (
        <div style={{ width: '80%', margin: '3rem auto' }}>
            <div style={{ textAlign: 'center', letterSpacing: '0.25rem' }}>
                <h1>Transaction History</h1>
            </div>
            <br />
            <table>
                <thead>
                    <tr>
                        <th>Payment Id</th>
                        <th>Product Name</th>
                        <th>Price</th>
                        <th>Quantity</th>
                        <th>Date of Purchase</th>
                    </tr>
                </thead>

                <tbody>
                    {userData &&
                        userData.history.map((item, index) => (
                            <tr key={index}>
                                <td>{item.id}</td>
                                <td>{item.name}</td>
                                <td>{item.price}</td>
                                <td>{item.quantity}</td>
                                <td>{item.dateOfPurchase}</td>
                            </tr>
                        ))}
                </tbody>
            </table>
        </div>
    );
}

export default HistoryPage;
