import React from 'react';
import { Menu } from 'antd';
const SubMenu = Menu.SubMenu;
const MenuItemGroup = Menu.ItemGroup;

function LeftMenu(props) {
    return (
        <Menu mode={props.mode}>
            <Menu.Item key="mail">
                <a href="/">Home</a>
            </Menu.Item>
            <SubMenu title={<span>Blogs</span>}>
                <MenuItemGroup title="Blog">
                    <Menu.Item key="setting:1">
                        <a href="/blog">Post List</a>
                    </Menu.Item>
                    <Menu.Item key="setting:2">
                        <a href="/blog/create">Post Create</a>
                    </Menu.Item>
                </MenuItemGroup>
            </SubMenu>
            <SubMenu title={<span>Bank</span>}>
                <MenuItemGroup title="Bank">
                    <Menu.Item key="setting:1">
                        <a href="/bank">My Account</a>
                    </Menu.Item>
                    <Menu.Item key="setting:2">
                        <a href="/bank/create">Account Create</a>
                    </Menu.Item>
                    <Menu.Item key="setting:4">
                        <a href="/bank/transfer">Transfer</a>
                    </Menu.Item>
                    <Menu.Item key="setting:5">
                        <a href="/bank/transaction">Transaction</a>
                    </Menu.Item>
                </MenuItemGroup>
            </SubMenu>
        </Menu>
    );
}

export default LeftMenu;
