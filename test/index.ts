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

//let query: Census.RestQuery = new Census.RestQuery( 'character' );
//query
//.where( 'name.first_lower', t => {
//    t.contains( 'partyofo' );
//} )
//.limit( 3 )
//.join( 'w', 'characters_world', join => {
//    join.nest( 'wj', 'world' );
//} )
//.join( 'o', 'outfit_member_extended', ( join ) => {
//    join.show( [ 'name', 'alias' ] );
//} )
//.join( 'f', 'faction' );

let outfit: Census.RestQuery = new Census.RestQuery( 'outfit' );
outfit
.where( 'outfit_id', t => {
    t.contains( '37512998641471064' );
} )
.join( 'character', ( join ) =>{
    join.on( 'leader_character_id' );
    join.to( 'character_id' );
    join.nest( 'faction' );
    join.nest( 'characters_world', ( join ) => {
        join.nest( 'world' );
    } );

});

console.log( outfit.toString() );

let api = new Census.RestApi( new nodeHttp() );
api.get( outfit )
.pipe( tap( res => {
        console.log( res );
} ) )
.subscribe();

