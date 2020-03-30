import { PlusOutlined } from '@ant-design/icons';
import { Button, Layout, Popconfirm, Table } from 'antd';
import axios from 'axios';
import Moment from 'moment';
import * as React from 'react';
import { Component } from 'react';
import { Client, ClientState, ClientType } from '../../models/client.model';
import { EnterpreneurModal } from '../enterpreneur-modal/enterpreneur-modal';
import './enterpreneur-page.css';

const { Content } = Layout;

class EnterpreneurPage extends Component<{}, ClientState> {
    state = {
        clients: [],
        visible: false,
        currentClientId: null
    };

    columns = [
        {
            title: 'ИНН',
            dataIndex: 'tin',
            key: 'tin',
        },
        {
            title: 'Наименование',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Тип',
            dataIndex: 'type',
            key: 'type',
        },
        {
            title: 'Дата добавления',
            dataIndex: 'createDate',
            key: 'createDate',
        },
        {
            title: 'Дата обновления',
            dataIndex: 'updateDate',
            key: 'updateDate',
        },
        {
            title: 'Действие',
            dataIndex: 'action',
            render: (text, record) => (
                <div>
                    <a onClick={() => this.handleEdit(record.id)}>Изменить</a>&nbsp;
                    <Popconfirm title="Вы действительно хотите удалить эту запись?" onConfirm={() => this.handleDelete(record.id)}>
                        <a>Удалить</a>
                    </Popconfirm>
                </div>
            )
        },
    ];

    handleDelete = (id: number) => {
        axios.delete('/api/Client/'+id).then((res) => {
            this.getClients();
        });
    };
    handleEdit = (id: number) => {
        const currentClient = JSON.parse(JSON.stringify(this.state.clients.find((client: Client) => client.id === id) as Client | undefined));
        if (currentClient) {
            currentClient.type = currentClient.type === ClientType.IPFormated ? [ClientType.IP] : [ClientType.UL];
        }
        this.setState({ currentClientId: currentClient.id });
        this.showModal();
    }
    showModal = () => {
        this.setState({
            visible: true,
        });
    };

    handleOk = () => {
        this.getClients();
        this.setState({ visible: false });
    };

    handleCancel = () => {
        this.setState({ currentClientId: null });
        this.setState({ visible: false });
    };
    componentDidMount() {
        this.getClients();
    }
    getClients() {
        axios.get('/api/Client')
            .then((res: { data: Client[] }) => {
                res.data.forEach((client: Client) => {
                    client.key = client.id;
                    client.type = client.type === 'IP' ? ClientType.IPFormated : ClientType.ULFormated
                    client.createDate = Moment(client.createDate).format('DD.MM.YYYY HH:mm:ss');
                    client.updateDate = Moment(client.updateDate).format('DD.MM.YYYY HH:mm:ss');
                });
                this.setState({ clients: res.data });
            })
    }
    render() {
        return (
            <Content className="page-layout-background">
                <h1>Клиенты</h1>
                <div className="add-btn-container">
                    <Button
                        onClick={this.showModal}
                        icon={<PlusOutlined />}
                        type="primary"
                    >Добавить</Button>
                </div>
                <Table 
                    dataSource={this.state.clients} 
                    columns={this.columns} 
                    loading={this.state.clients.length === 0}
                />
                {this.state.visible ? <EnterpreneurModal
                    visible={this.state.visible}
                    handleCancel={this.handleCancel}
                    handleOk={this.handleOk}
                    clientId={this.state.currentClientId}
                /> : null}
            </Content>
        )
    }
}

export default EnterpreneurPage;
