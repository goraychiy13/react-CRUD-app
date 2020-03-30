import { Button, Cascader, Form, Input, Select } from 'antd';
import { FormInstance } from 'antd/lib/form';
import Modal from 'antd/lib/modal/Modal';
import axios from 'axios';
import * as React from 'react';
import { Component } from 'react';
import { Client } from '../../models/client.model';
import './founder-modal.css';
import { Founder } from '../../models/founder.model';

type FounderModalProps = {
    visible: boolean;
    handleOk: () => void;
    handleCancel: () => void;
    founderId: number | null | undefined;
}

type FounderModalState = {
    loading: boolean;
    clients: Client[];
    clientOpitons: any[];
    currentType: string | null;
}

const layout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 16 },
};

export class FounderModal extends Component<FounderModalProps, FounderModalState> {
    state = {
        loading: false,
        clients: [],
        clientOpitons: [],
        currentType: null
    };
    founder: Founder;
    formRef = React.createRef<FormInstance>();
    onTypeChange = () => {
        this.setState({ currentType: this.formRef.current?.getFieldsValue().type[0] });
    }
    onFinish = (founder: Founder) => {
        if (this.founder) {
            founder.id = this.founder.id;
            this.setState({ loading: true });
            axios.put('/api/Founder/' + this.founder.id, founder).then((res) => {
                this.setState({ loading: false });
                this.props.handleOk();
            });
        } else {
            this.setState({ loading: true });
            axios.post('/api/Founder', founder).then((res) => {
                this.setState({ loading: false });
                this.props.handleOk();
            });
        }
    };
    componentDidMount() {
        if (this.props.founderId) {
            axios.get('/api/Founder/' + this.props.founderId).then((res: { data: Founder }) => {
                this.founder = res.data;
            });
        }
        axios.get('/api/Client').then((res: { data: Client[] }) => {
            this.setState({ clients: res.data });
            const clientOpitons = res.data.map((founder: Client) => {
                return {
                    label: founder.name,
                    value: founder.id
                }
            });
            this.setState({ clientOpitons: clientOpitons });
        });

    }
    render() {
        if (this.state.clientOpitons.length > 0 && (this.props.founderId && this.founder) || !this.props.founderId) {
            return (
                <Modal
                    visible={this.props.visible}
                    title={this.founder ? 'Редактировать учредителя' : 'Добавить учредителя'}
                    onOk={this.props.handleOk}
                    onCancel={this.props.handleCancel}
                    footer={null}
                >
                    <Form
                        labelCol={{ span: 4 }}
                        wrapperCol={{ span: 14 }}
                        layout="horizontal"
                        onFinish={this.onFinish}
                        initialValues={this.founder}
                        ref={this.formRef}
                        {...layout}
                    >
                        <Form.Item
                            label="ИНН"
                            name="tin"
                            rules={[
                                {
                                    required: true,
                                    message: 'Введите ИНН',
                                },
                                {
                                    len: 12,
                                    message: 'Неправильный ИНН'
                                }
                            ]}
                        >
                            <Input type="number" />
                        </Form.Item>
                        <Form.Item
                            label="Наименованиие"
                            name="name"
                            rules={[
                                {
                                    required: true,
                                    message: 'Введите наименование',
                                },
                            ]}
                        >
                            <Input />
                        </Form.Item>
                        <Form.Item
                            label="Клиент"
                            name="clientId"
                            rules={[
                                {
                                    required: true,
                                    message: 'Вам необходимо выбрать клиента',
                                },
                            ]}
                        >
                            <Select
                                placeholder="Выберите клиента"
                                options={this.state.clientOpitons}
                            ></Select>
                        </Form.Item>
                        <div className="ant-modal-footer">
                            <Button
                                key="back"
                                onClick={this.props.handleCancel}
                            >Отмена</Button>
                            <Form.Item>
                                <Button
                                    className="add-btn"
                                    type="primary"
                                    htmlType="submit"
                                    loading={this.state.loading}
                                >Принять</Button>
                            </Form.Item>
                        </div>
                    </Form>
                </Modal>
            )
        } else {
            return null;
        }
    }
}