export interface ITwoKeySingletonRegistry {
    createProxiesForAcquisitions : (
        addresses: string[],
        valuesConversion: number[],
        valuesLogicHandler: any[],
        valuesCampaign: any[],
        currency: string,
        nonSingletonHash: string,
        from: string
    ) => Promise<any>,

}