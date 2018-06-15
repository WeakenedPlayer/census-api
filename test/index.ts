import { Census } from '../dist';
import { catchError, tap } from 'rxjs/operators';
import * as request from 'request';

class errorHttp implements Census.RestApiHttp {
    get( url: string ): Promise<any> {
        return Promise.resolve(
            { 'error': 'Missing Service ID.  A valid Service ID is required for continued api use.  The Service ID s:example is for casual use only.  (http://census.daybreakgames.com/#devSignup)' },
        );
    }
}

class nodeHttp implements Census.RestApiHttp {
    get( url: string ): Promise<any> {
        return new Promise( ( resolve, reject ) => { 
            request( url, ( error, res, body ) => {
                if( error ) {
                    reject( error );
                } 
                resolve( JSON.parse( body ) );
            } );
        } );
    }
}

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
.then( res => {
    console.log( res );
} );
