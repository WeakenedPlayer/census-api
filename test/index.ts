import { Census } from '../dist';

// tiny test
let command = new Census.RestCommandBuilder();
command.limit(10).show( [ 'character_id','name.first' ] );

console.log( command.toString() );
