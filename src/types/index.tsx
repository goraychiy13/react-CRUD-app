
export interface StoreState {
    languageName: string;
    enthusiasmLevel: number;
}

export interface TableColumn {
    title: string;
    dataIndex: string;
    key: string;
    render?: () => Element
}