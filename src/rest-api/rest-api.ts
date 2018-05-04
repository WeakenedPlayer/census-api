import { Observable, Subscriber } from 'rxjs';
import { map } from 'rxjs/operators';
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
    
    private request(  method: string, query: RestQuery ): Observable<any[]> {
        let url = [ this.baseUrl,  method, this.environment, query.toString() ].join('/');
        return this.http.get( url ).pipe( map( res => {
            let err: string = res[ 'error' ] || res[ 'errorMessage' ];
            if( err ) {
                throw new Error( err );
            }
            return res[ query.collection + '_list' ];
        } ) );
    }
    
    get( query: RestQuery ): Observable<any[]> {
        return this.request( 'get', query );
    }

    count( query: RestQuery ): Observable<any[]> {
        return this.request( 'count', query );
    }
}
