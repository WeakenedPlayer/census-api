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
.join( 'outfit_member', join => {
    join.list( true );
    join.where( 'rank_ordinal', t => {
        t.lessThan( '4' );
    } );
    join.nest( 'character', join => {
        join.show( [ 'name.first' ] );
    } )
    join.show( [ 'rank', 'character_id' ] );
} )

// query
console.log( outfit.toString() );

let api = new Census.RestApi( new nodeHttp() );
api.get( outfit )
.then( res => {
    console.log( JSON.stringify( res ) );
} );
