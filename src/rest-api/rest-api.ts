import { Observable, Subscriber } from 'rxjs';
import { RestQuery } from './rest-query';
import { RestApiHttp } from './types';

const DEFAULT_ENVIRONMENT = 'ps2:v2';
const DEFAULT_SERVICEID = 'example';
const BASE_URL = 'http://census.daybreakgames.com/s:';

export class RestApi {
    private baseUrl: string;
    constructor( private http: RestApiHttp, serviceId: string = DEFAULT_SERVICEID, private environment = DEFAULT_ENVIRONMENT ) {
        this.baseUrl = BASE_URL + serviceId;
    }
    
    private request(  method: string, query: RestQuery, param: any ): Observable<any[]> {
        if( !param ) {
            param = {};
        }
        let url = [ this.baseUrl,  method, this.environment, query.toString( param ) ].join('/');
        return this.http.get( url ).map( res => {
            if( res[ 'error' ] ) {
                // census api return error
                throw new Error( res[ 'error' ] );
            }
            return res[ query.collection + '_list' ];
        } )
    }
    
    get( query: RestQuery, param?: any ): Observable<any[]> {
        return this.request( 'get', query, param );
    }

    count( query: RestQuery, param?: any ): Observable<any[]> {
        return this.request( 'count', query, param );
    }
}
