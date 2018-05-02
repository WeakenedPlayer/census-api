import { RestTermBuilder, RestCommandBuilder, RestJoinBuilder } from './builder';
import * as format from 'string-format';

export { RestJoinBuilder };

export class RestQuery {
    private _term: RestTermBuilder;
    private _command: RestCommandBuilder;

    get term(): RestTermBuilder {
        return this._term;
    }
    
    get command(): RestCommandBuilder {
        return this._command;
    }

    constructor( private collection: string, term?: RestTermBuilder, command?: RestCommandBuilder ) {
        this._term = ( term ? term.clone() : new RestTermBuilder() );
        this._command = ( command ? command.clone() : new RestCommandBuilder() );
    }
    
    clear(): void {
        this._term.clear();
        this._command.clear();
    }
    
    toString( param ?: any ): string {
        let body = [ this._term.toString(), this._command.toString() ].join('&');
        let queryString = this.collection + ( body ? '/?' + body : '/' );

        if( param ) {
            queryString = format( queryString, param );
        }
        return queryString;
    }
}