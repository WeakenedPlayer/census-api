import { Observable, Subscriber } from 'rxjs';
import { QueryBuilder } from './query-builder';
import { CommandBuilder } from './command-builder';
import { IRestApiHttp } from './types';

const DEFAULT_ENVIRONMENT = 'ps2:v2';
const DEFAULT_SERVICEID = 'example';
const BASE_URL = 'http://census.daybreakgames.com/s:';

export class RestApiQuery {
    private _body = new QueryBuilder();
    private _command = new CommandBuilder();

    get body(): QueryBuilder { return this._body; }
    get command(): CommandBuilder { return this._command; }
    
    constructor( private collection: string ) {}
    
    toString(): string {
        let query = [ this._body.toString(), this._command.toString() ].join('&');
        return this.collection + ( query ? '?' + query : '' );  
    }
}

export class RestApi {
    private baseUrl: string;
    constructor( private http: IRestApiHttp, serviceId: string = DEFAULT_SERVICEID, private environment = DEFAULT_ENVIRONMENT ) {
        this.baseUrl = BASE_URL +  serviceId;
    }
    
    private request( method: string, query: RestApiQuery ): Promise<any> {
        let queryString: string;
    
        if( !query ) {
            throw new Error( 'No query specified.' );
        }
        
        queryString = query.toString();
        if( !queryString ) {
            throw new Error( 'Query string is empty.' );
        }
        
        let url = [ this.baseUrl,  method, this.environment,query.toString() ].join('/');
        return this.http.get( url );
    }
    
    get( query: RestApiQuery ): Promise<any> {
        return this.request( 'get', query );
    }

    count( query: RestApiQuery ): Promise<any> {
        return this.request( 'count', query );
    }
}
