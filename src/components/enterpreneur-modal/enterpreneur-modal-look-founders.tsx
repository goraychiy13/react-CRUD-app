import { Button, Form, Input, message, Select } from 'antd';
import { FormInstance } from 'antd/lib/form';
import Modal from 'antd/lib/modal/Modal';
import axios from 'axios';
import * as React from 'react';
import { Component } from 'react';
import { Client, ClientType } from '../../models/client.model';
import { Founder } from '../../models/founder.model';
import './enterpreneur-modal.css';

type ClientModalProps = {
    // visible: boolean;
    visibleLook: boolean;
    handleOkLook: () => void;
    handleCancelLook: () => void;
    changeLoading: () => void;
    clientId: Client | null | undefined;
}

type ClientModalState = {
    loading: boolean;
    founders: Founder[];
    founderOpitons: any[];
    currentType: string | null;
}

const layout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 16 },
};

export class EnterpreneurModalLookFounders extends Component<ClientModalProps, ClientModalState> {
    state = {
        loading: false,
        founders: [],
        founderOpitons: [],
        currentType: null
    };
    formRef = React.createRef<FormInstance>();
    client: Client;
    onTypeChange = () => {
        this.setState({ currentType: this.formRef.current?.getFieldsValue().type });
    }
    onFinish = (client: Client) => {
        if (client.founders && client.founders.length > 0) {
            const founders: Founder | undefined[] = [];
            client.founders.forEach((founderId) => {
                const founder: Founder | undefined = this.state.founders.find((founder: Founder) => founder.id === founderId);
                founder ? founders.push(founder): null;
            });
            client.founders = founders;
        } else if (client.founders) {
            const founder: Founder | undefined = this.state.founders.find((founder: Founder) => founder.id === client.founders);
            founder ? client.founders = [founder] : null;
        }
        if (this.client) {
            client.id = this.client.id;
            client.type = ClientType[client.type];
            this.setState({ loading: true });
            this.props.handleOkLook();
        } 
    }

    componentDidMount() {
        if (this.props.clientId) {
            this.props.changeLoading();
            axios.get('/api/Client/' + this.props.clientId).then((res: { data: Client }) => {
                this.props.changeLoading();
                const founders: number[] = res.data.founders.map((founder: Founder) => {
                    return founder.id;
                });
                res.data.founders = res.data.type === ClientType.UL ? founders : founders[0];

                this.client = res.data;
                this.setState({ currentType: this.client.type });
            })
            .catch((error) => {
                message.error('Ошибка сервера. Обратитесь к администратору в случае повторения.');
                this.props.changeLoading();
            });
        }
        axios.get('/api/Founder').then((res: { data: Founder[] }) => {
            this.setState({ founders: res.data });
            const founderOpitons = res.data.map((founder: Founder) => {
                return {
                    label: founder.name,
                    value: founder.id
                }
            });
            this.setState({ founderOpitons: founderOpitons });
        })
        .catch((error) => {
            message.error('Ошибка сервера. Обратитесь к администратору в случае повторения.');
            this.setState({
                loading: false
            });
        });

    }

    render() {
        if (this.state.founderOpitons.length > 0 && (this.props.clientId && this.client) || !this.props.clientId) {
            return (
                <Modal
                    visible={this.props.visibleLook}
                    title={this.client ? 'Посмотреть учредитиелей': ''}
                    onOk={this.props.handleOkLook}
                    onCancel={this.props.handleCancelLook}
                    footer={null}
                >
                    <Form
                        labelCol={{ span: 4 }}
                        wrapperCol={{ span: 14 }}
                        layout="horizontal"
                        onFinish={this.onFinish}
                        initialValues={this.client}
                        ref={this.formRef}
                        {...layout}
                    >
                        <Form.Item
                            label="Учредители"
                            name="founders"
                        >
                            {this.state.currentType === 'UL' ? <Select
                                placeholder="Выберите учредителя в разделе 'Учредители'"
                                mode="multiple"
                                options={this.state.founderOpitons}
                                disabled
                            /> : <Select
                                    placeholder="Выберите учредителя в разделе 'Учредители'"
                                    options={this.state.founderOpitons}
                                    disabled
                                />}
                        </Form.Item>
                        <div className="ant-modal-footer">
                            <Button
                                key="back"
                                onClick={this.props.handleCancelLook}
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