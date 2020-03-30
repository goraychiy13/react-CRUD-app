import { PlusOutlined } from '@ant-design/icons';
import { Button, Layout, Popconfirm, Table } from 'antd';
import axios from 'axios';
import Moment from 'moment';
import * as React from 'react';
import { Founder, FounderState } from '../../models/founder.model';
import './founder-page.css';
import { Client } from '../../models/client.model';
import { FounderModal } from '../founder-modal/founder-modal';

const { Content } = Layout;

export class FounderPage extends React.Component<{}, FounderState> {
    state = {
        founders: [],
        visible: false,
        currentFounderId: null,
        clients: []
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
            title: 'Клиент',
            dataIndex: 'clientName',
            key: 'clientName',
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
        axios.delete('/api/Founder/'+id).then((res) => {
            this.getFounders();
        });
    };
    handleEdit = (id: number) => {
        const currentFounder = JSON.parse(JSON.stringify(this.state.founders.find((founder: Founder) => founder.id === id) as Founder | undefined));
        this.setState({ currentFounderId: currentFounder.id });
        this.showModal();
    }
    showModal = () => {
        this.setState({
            visible: true,
        });
    };

    handleOk = () => {
        this.getFounders();
        this.setState({ visible: false });
    };

    handleCancel = () => {
        this.setState({ currentFounderId: null });
        this.setState({ visible: false });
    };
    componentDidMount() {
        this.getClients();
    }
    getClients() {
        axios.get('/api/Client')
            .then((res: { data: Client[] }) => {
                this.setState({ clients: res.data });
                this.getFounders();
            })
    }
    getFounders() {
        axios.get('/api/Founder')
            .then((res: { data: Founder[] }) => {
                res.data.forEach((founder: Founder) => {
                    founder.key = founder.id;
                    const client = this.state.clients.find((client: Client) => client.id === founder.clientId) as Client | undefined;
                    if (client) {
                        founder.clientName = client.name
                    }
                    founder.createDate = Moment(founder.createDate).format('DD.MM.YYYY HH:mm:ss');
                    founder.updateDate = Moment(founder.updateDate).format('DD.MM.YYYY HH:mm:ss');
                });
                this.setState({ founders: res.data });
            })
    }
    render() {
        return (
            <Content className="page-layout-background">
                <h1>Учредители</h1>
                <div className="add-btn-container">
                    <Button
                        onClick={this.showModal}
                        icon={<PlusOutlined />}
                        type="primary"
                    >Добавить</Button>
                </div>
                <Table 
                    dataSource={this.state.founders} 
                    columns={this.columns}
                    loading={this.state.founders.length === 0}
                />
                {this.state.visible ? <FounderModal
                    visible={this.state.visible}
                    handleCancel={this.handleCancel}
                    handleOk={this.handleOk}
                    founderId={this.state.currentFounderId}
                /> : null}
            </Content>
        )
    }
}
