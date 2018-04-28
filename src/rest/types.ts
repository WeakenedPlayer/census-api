import { Observable } from 'rxjs';
export interface IRestApiHttp {
    get( url: string ): Observable<any>;
}
