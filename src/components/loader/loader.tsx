import { Spin } from 'antd';
import * as React from 'react';
import './loader.css';

interface LoaderState {
    loading: boolean;
}

export class Loader extends React.Component<LoaderState, {}> {
    render() {
        return (
            <div className={`loader ${this.props.loading === true ? 'active': ''}`}>
                <Spin size="large" />
            </div>
        )
    }
}
