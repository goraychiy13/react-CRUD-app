import { MenuFoldOutlined, MenuUnfoldOutlined, TeamOutlined, UserOutlined } from '@ant-design/icons';
import { Drawer, Layout, Menu } from 'antd';
import * as React from 'react';
import { BrowserRouter as Router, Link, Redirect, Route, Switch } from "react-router-dom";
import './App.css';
import EnterpreneurPage from './components/entrepreneur-page/entrepreneur-page';
import { FounderPage } from './components/founders-page/founder-page';
const { Header, Sider } = Layout;

class App extends React.Component {
  state = {
    collapsed: false,
    loading: false
  };

  toggle = () => {
    this.setState({
      collapsed: !this.state.collapsed
    });
  };

  render() {
    return (
      <Layout className="main-layout">
        <Router>
          <Drawer
            title="Админ панель"
            placement="left"
            closable={false}
            onClose={this.toggle}
            visible={this.state.collapsed}
          >
            <div className="logo" />
            <Menu theme="dark" mode="inline" defaultSelectedKeys={['1']}>
              <Menu.Item key="1">
                <UserOutlined />
                <span>Клиенты</span>
                <Link to="/clients" />
              </Menu.Item>
              <Menu.Item key="2">
                <TeamOutlined />
                <span>Учредители</span>
                <Link to="/founders" />
              </Menu.Item>
            </Menu>
          </Drawer>
          <Sider trigger={null} collapsible collapsed={this.state.collapsed} className='sider'>
            <div className="logo" />
            <Menu theme="dark" mode="inline" defaultSelectedKeys={['1']}>
              <Menu.Item key="1">
                <UserOutlined />
                <span>Клиенты</span>
                <Link to="/clients" />
              </Menu.Item>
              <Menu.Item key="2">
                <TeamOutlined />
                <span>Учредители</span>
                <Link to="/founders" />
              </Menu.Item>
            </Menu>
          </Sider>
          <Layout className="site-layout">
            <Header className="site-layout-background" style={{ padding: 0 }}>
              {React.createElement(this.state.collapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
                className: 'trigger',
                onClick: this.toggle,
              })}
            </Header>
            <Switch>
              <Route exact path="/">
                <Redirect to="/clients" />
              </Route>
              <Route path="/clients">
                <EnterpreneurPage />
              </Route>
              <Route path="/founders">
                <FounderPage />
              </Route>
            </Switch>
          </Layout>
        </Router>
      </Layout>
    );
  }
}

export default App;

