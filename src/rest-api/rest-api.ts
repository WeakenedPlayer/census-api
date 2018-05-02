import { Observable, Subscriber } from 'rxjs';
import { RestQuery } from './rest-query';
import { RestApiHttp } from './types';

const DEFAULT_ENVIRONMENT = 'ps2:v2';
const DEFAULT_SERVICEID = 'example';
const BASE_URL = 'http://census.daybreakgames.com/s:';

export class RestApi {
    private baseUrl: string;
    constructor( private http: RestApiHttp, serviceId: string = DEFAULT_SERVICEID, private environment = DEFAULT_ENVIRONMENT ) {
        this.baseUrl = BASE_URL +  serviceId;
    }
    
    private request(  method: string, query: string ): Observable<any> {
        let url = [ this.baseUrl,  method, this.environment, query ].join('/');
        return this.http.get( url );
    }
    
    get( query: string ): Observable<any> {
        return this.request( 'get', query );
    }

    count( query: string ): Observable<any> {
        return this.request( 'count', query );
    }
}
