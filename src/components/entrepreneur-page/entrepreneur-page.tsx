import { PlusOutlined } from '@ant-design/icons';
import { Button, Layout, message, Popconfirm, Table } from 'antd';
import axios from 'axios';
import Moment from 'moment';
import * as React from 'react';
import { Component } from 'react';
import { Client, ClientState, ClientType } from '../../models/client.model';
import { Founder } from '../../models/founder.model';
import { compareByAlph } from '../../utils/utils';
import { EnterpreneurModal } from '../enterpreneur-modal/enterpreneur-modal';
import { Loader } from '../loader/loader';
import './enterpreneur-page.css';
import { EnterpreneurModalLookFounders } from '../enterpreneur-modal/enterpreneur-modal-look-founders';

const { Content } = Layout;

class EnterpreneurPage extends Component<{}, ClientState> {
    state = {
        clients: [],
        visible: false,
        currentClientId: null,
        loading: false
    };

    getTableClients = () => {
        const founders: any = this.state.clients.map((client: Client) => {
            return {
                title: client.type,
                value: client.type
            }
        });
        return founders;
    }

    columns = [
        {
            title: 'ИНН',
            dataIndex: 'tin',
            key: 'tin',
            sorter: (a, b) => {
                return a.tin - b.tin;
            }
        },
        {
            title: 'Наименование',
            dataIndex: 'name',
            key: 'name',
            sorter: (a: Client, b: Client) => compareByAlph(a.name, b.name)
        },
        {
            title: 'Тип',
            dataIndex: 'type',
            key: 'type',
            filters: this.getTableClients(),
            onFilter: (value, record: Client) => record.type?.indexOf(value) === 0,
            sorter: (a: Client, b: Client) => compareByAlph(a.type, b.type)
        },
        {
            title: 'Дата добавления',
            dataIndex: 'createDate',
            key: 'createDate',
            sorter: (a: Founder, b: Founder) => {
                return compareByAlph(a.createDate, b.createDate)
            },
        },
        {
            title: 'Дата обновления',
            dataIndex: 'updateDate',
            key: 'updateDate',
            sorter: (a: Founder, b: Founder) => {
                return compareByAlph(a.createDate, b.createDate)
            },
        },
        {
            title: 'Действие',
            dataIndex: 'action',
            render: (text, record) => (
                <div>
                    <a onClick={() => this.handleEdit(record.id)}>Изменить</a>&nbsp;
                    <Popconfirm title="Вы действительно хотите удалить эту запись?" onConfirm={() => this.handleDelete(record.id)}>
                        <a>Удалить</a>
                    </Popconfirm>&nbsp;
                    {/* <a onClick={() => this.showModal()}>Посмотреть учредителей</a> */}
                </div>
            )
        },
    ];

    handleDelete = (id: number) => {
        axios.delete('/api/Client/' + id).then((res) => {
            this.getClients();
        })
            .catch((error) => {
                message.error('Ошибка сервера. Обратитесь к администратору в случае повторения.');
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

    changeLoading = () => {
        if (this.state) {
            this.setState({
                loading: !this.state.loading
            });
        }
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
                const filterNames = res.data.map((client: Client) => {
                    return client.type
                })
                const uniqfilterNames = Array.from(new Set(filterNames));
                this.columns[2].filters = uniqfilterNames.map((filterName) => {
                    return {
                        text: filterName,
                        value: filterName
                    }
                });
                this.setState({ clients: res.data });
            })
            .catch((error) => {
                message.error('Ошибка сервера. Обратитесь к администратору в случае повторения.');
            });
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
                <div className="table-wrap">
                    <Table
                        dataSource={this.state.clients}
                        columns={this.columns}
                        loading={this.state.clients.length === 0}
                    />
                </div>
                {this.state.visible ? <EnterpreneurModal
                    visible={this.state.visible}
                    handleCancel={this.handleCancel}
                    handleOk={this.handleOk}
                    clientId={this.state.currentClientId}
                    changeLoading={this.changeLoading}
                /> : null}
                {/* {this.state.visible ? <EnterpreneurModalLookFounders
                    visible={this.state.visible}
                    handleCancel={this.handleCancel}
                    handleOk={this.handleOk}
                    clientId={this.state.currentClientId}
                    changeLoading={this.changeLoading}
                /> : null} */}
                <Loader loading={this.state.loading} />
            </Content>
        )
    }
}

export default EnterpreneurPage;
