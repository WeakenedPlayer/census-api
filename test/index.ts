import { Census } from '../dist';
import { Observable } from 'rxjs';
import * as request from 'request'; // test only 

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

let query = new Census.RestQuery( 'character' );
query.term.equals( 'character_id', '{id}' );
query.command.join( [ 
    new Census.RestJoinBuilder( 'outfit_member_extended' ),
    new Census.RestJoinBuilder( 'characters_world' ).nest( new Census.RestJoinBuilder('world') )
] );

let api = new Census.RestApi( new errorHttp() );
api.get( query, { id: '5428139972582787329' } )
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

