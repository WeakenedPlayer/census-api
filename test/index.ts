import { Census } from '../dist';

// tiny test

let query = new Census.RestQueryBuilder().equals( 'character_id', '5428176321548975265' )
let join = new Census.RestJoinBuilder( 'outfit' ).on( 'character_id' );
let command = new Census.RestCommandBuilder().join( join );
let collection = 'character';
console.log( command.toString() );