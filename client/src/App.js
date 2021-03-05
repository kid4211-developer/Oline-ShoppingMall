import React, { Suspense } from 'react';
import { Route, Switch } from 'react-router-dom';
import Auth from './hoc/auth';
// pages for this product
import ProductListPage from './ERP/views/ProductListPage/ProductListPage.js';
import LoginPage from './ERP/views/LoginPage/LoginPage.js';
import RegisterPage from './ERP/views/RegisterPage/RegisterPage.js';
import NavBar from './ERP/views/NavBar/NavBar';
import Footer1 from './ERP/views/Footer/Footer1';
import UploadProductPage from './ERP/views/UploadProductPage/UploadProductPage';
import DetailProductPage from './ERP/views/DetailProductPage/DetailProductPage';
import CartPage from './ERP/views/CartPage/CartPage';
import HistoryPage from './ERP/views/HistoryPage/HistoryPage';
import CreatePage from './ERP/views/BlogPage/Sections/CreatePage';
import BlogPage from './ERP/views/BlogPage/BlogPage';
import PostPage from './ERP/views/BlogPage/PostPage';
import LandingPage from './ERP/views/LandingPage/LandingPage';
import MyAccountPage from './ERP/views/BankPage/MyAccountPage';
import AddAccountPage from './ERP/views/BankPage/AddAccountPage';
import TransactionPage from './ERP/views/BankPage/TransactionPage';
import TransferPage from './ERP/views/BankPage/TransferPage';
import CovidPage from './common/API/CovidPage';
//null   Anyone Can go inside
//true   only logged in user can go inside
//false  logged in user can't go inside

function App() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <NavBar />
            <div style={{ paddingTop: '69px', minHeight: 'calc(100vh - 80px)' }}>
                <Switch>
                    <Route exact path="/" component={Auth(LandingPage, null)} />
                    <Route exact path="/Product" component={Auth(ProductListPage, null)} />
                    <Route exact path="/login" component={Auth(LoginPage, false)} />
                    <Route exact path="/register" component={Auth(RegisterPage, false)} />
                    <Route exact path="/product/upload" component={Auth(UploadProductPage, true)} />
                    <Route
                        exact
                        path="/product/:productId"
                        component={Auth(DetailProductPage, null)}
                    />
                    <Route exact path="/user/cart" component={Auth(CartPage, true)} />
                    <Route exact path="/history" component={Auth(HistoryPage, true)} />
                    <Route exact path="/blog/post/:postId" component={Auth(PostPage, true)} />
                    <Route exact path="/blog" component={Auth(BlogPage, true)} />
                    <Route exact path="/blog/create" component={Auth(CreatePage, true)} />
                    <Route exact path="/bank" component={Auth(MyAccountPage, true)} />
                    <Route exact path="/bank/create" component={Auth(AddAccountPage, true)} />
                    <Route exact path="/bank/transfer" component={Auth(TransferPage, true)} />
                    <Route exact path="/bank/transaction" component={Auth(TransactionPage, true)} />
                    <Route exact path="/covid" component={Auth(CovidPage, true)} />
                </Switch>
            </div>
            {/* <Footer /> */}
            <Footer1 />
        </Suspense>
    );
}

export default App;
