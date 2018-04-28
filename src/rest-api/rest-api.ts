import { Observable, Subscriber } from 'rxjs';
import { RestQueryBuilder, RestCommandBuilder } from './builder';
import { RestApiHttp } from './types';

const DEFAULT_ENVIRONMENT = 'ps2:v2';
const DEFAULT_SERVICEID = 'example';
const BASE_URL = 'http://census.daybreakgames.com/s:';

export class RestApi {
    private baseUrl: string;
    constructor( private http: RestApiHttp, serviceId: string = DEFAULT_SERVICEID, private environment = DEFAULT_ENVIRONMENT ) {
        this.baseUrl = BASE_URL +  serviceId;
    }
    
    private request(  method: string, collection: string,query: RestQueryBuilder, command: RestCommandBuilder ): Observable<any> {
        let body = [ query.toString(), command.toString() ].join('&');
        let queryString = collection + ( body ? '?' + body : '' );
        let url = [ this.baseUrl,  method, this.environment, queryString ].join('/');
        return this.http.get( url );
    }
    
    get( collection: string, query: RestQueryBuilder, command: RestCommandBuilder ): Observable<any> {
        return this.request( 'get', collection, query, command );
    }

    count( collection: string, query: RestQueryBuilder, command: RestCommandBuilder ): Observable<any> {
        return this.request( 'count', collection, query, command );
    }
}
