import { Census } from '../dist';
import { Observable } from 'rxjs';
import * as request from 'request';

class errorHttp implements Census.RestApiHttp {
    get( url: string ): Observable<any> {
        return Observable.of(
            { 'error': 'Missing Service ID.  A valid Service ID is required for continued api use.  The Service ID s:example is for casual use only.  (http://census.daybreakgames.com/#devSignup)' },
        );
    }
}

class nodeHttp implements Census.RestApiHttp {
    get( url: string ): Observable<any> {
        return Observable.create( ( observer => { 
            request( url, ( error, res, body ) => {
                if( error ) {
                    observer.error( error );
                } 
                observer.next( JSON.parse( body ) );
                observer.complete();
            } );
        } ) );
    }
}


let query: Census.RestQuery = new Census.RestQuery( 'character' );
query
.where( 'name.first_lower', t => {
    t.contains( 'abc' );
    t.contains( '123' );
} )
.limit( 10 )
.join( 'outfit_join', 'outfit_member_extended', ( join ) => {} );

console.log( query.toString() );

let api = new Census.RestApi( new nodeHttp() );
api.get( query )
.catch( err => {
    console.error( '-------------------------------------------' );
    console.error( err );
    console.error( '-------------------------------------------' );
    return Observable.never();
} )
.do( res => {
    console.log( res );
} )
.subscribe();

