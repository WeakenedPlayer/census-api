import { Census } from '../dist';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import * as request from 'request';

class errorHttp implements Census.RestApiHttp {
    get( url: string ): Observable<any> {
        return of(
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
    t.contains( 'partyofo' );
} )
.limit( 3 )
.join( 'w', 'characters_world', join => {
    join.nest( 'wj', 'world' );
} )
.join( 'o', 'outfit_member_extended', ( join ) => {
    join.show( [ 'name', 'alias' ] );
} )
.join( 'f', 'faction' );

console.log( query.toString() );

let api = new Census.RestApi( new nodeHttp() );
api.get( query )
.pipe( tap( res => {
        console.log( res );
} ) )
.subscribe();

