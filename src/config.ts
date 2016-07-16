var configJson = <IConfigState>require('./config.json');


export interface IConfigState {
    version: string
    revision: string
    revisionShort: string
    branch: string
}

export function config(state: IConfigState = configJson, action: any) : IConfigState {
    switch (action.type) {
        default:
            return configJson;
    }
}

export default config;