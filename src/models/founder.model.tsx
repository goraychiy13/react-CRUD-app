import { Client } from "./client.model";

export interface Founder {
    key?: number;
    id: number;
    tin: string;
    name: string;
    clientId: number;
    clientName?: string;
    createDate: string;
    updateDate: string;
}

export type FounderState = {
    founders: Founder[];
    clients: Client[];
    visible: boolean;
    currentFounderId: number | null | undefined;
}