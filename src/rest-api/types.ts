import { Observable } from 'rxjs';
export interface RestApiHttp {
    get( url: string ): Observable<any>;
}
