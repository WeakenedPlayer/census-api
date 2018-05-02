import { Census } from '../dist';

let query = new Census.RestQuery( 'character' );
query.term.equals( 'character_id', '{id}' );
query.command.join( [ 
    new Census.RestJoinBuilder( 'outfit_member_extended' ),
    new Census.RestJoinBuilder( 'characters_world' ).nest( new Census.RestJoinBuilder('world') )
] );

console.log( query.toString( { id: '5428257774260271201' } ) );
