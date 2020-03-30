import { Founder } from "./founder.model";

export enum ClientType {
    IP = 'IP',
    UL = 'UL',
    IPFormated = 'Индивидуальный предприниматель',
    ULFormated = 'Юридическое лицо',
}

export interface Client {
    key?: number;
    id: number;
    tin: string;
    type: ClientType;
    name: string;
    createDate: string;
    updateDate: string;
    founders: any[] | any;
}

export type ClientState = {
    clients: Client[];
    visible: boolean;
    currentClientId: number | null | undefined;
}