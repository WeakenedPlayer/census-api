export interface IRestApiHttp {
    get( url: string ): Promise<any>;
}
