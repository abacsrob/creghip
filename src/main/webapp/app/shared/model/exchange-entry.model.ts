export interface IExchangeEntry {
    id?: number;
    description?: string;
}

export class ExchangeEntry implements IExchangeEntry {
    constructor(public id?: number, public description?: string) {}
}
