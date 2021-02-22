import React from 'react';
import { ReactComponent as Logo } from './logo.svg';
import './Footer.css';
import { Icon } from 'antd';

function Footer1() {
    return (
        <div className="body__container">
            <footer className="section">
                <div className="inner clearfix">
                    <ul className="site-links float--right" style={{ listStyle: 'none' }}>
                        <li>
                            <a href="#!">Oracle</a>
                        </li>
                        <li>
                            <a href="#!">MySQL</a>
                        </li>
                        <li>
                            <a href="#!">Spring</a>
                        </li>
                        <li>
                            <a href="#!">Spring Boot</a>
                        </li>
                        <li>
                            <a href="#!">JPA</a>
                        </li>
                        <li>
                            <a href="#!">Ibatis</a>
                        </li>
                        <li>
                            <a href="#!">Mybatis</a>
                        </li>
                    </ul>
                    <ul className="site-links float--left" style={{ listStyle: 'none' }}>
                        <li>© 2021 Seoul IT - Academy</li>
                        <li>
                            <a href="#!">JAVA</a>
                        </li>
                        <li>
                            <a href="#!">JavaScript</a>
                        </li>
                        <li>
                            <a href="#!">JSP</a>
                        </li>
                        <li>
                            <a href="#!">Python</a>
                        </li>
                    </ul>
                    <a href="#!" className="logo">
                        <Logo />
                    </a>
                </div>
            </footer>
        </div>
    );
}

export default Footer1;
