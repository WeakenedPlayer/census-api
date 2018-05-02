import { RestTerm } from './rest-term';
import { RestJoin } from './rest-join';

export class RestQuery {
    private terms: { [ field: string ]: RestTerm } = {};
    private commands: { [command:string]: string } = {};
    private joins: { [id: string]: RestJoin } = {};

    constructor( private _collection: string ) {}

    // ------------------------------------------------------------------------
    // accessor
    // ------------------------------------------------------------------------
    toString(): string {
        let tmp: string[] = [];
        for( let field in this.terms ) {
            tmp.push( this.terms[ field ].toString() );
        }
        
        for( let cmd in this.commands ) {
            tmp.push( this.commands[ cmd ] );
        }
        
        for( let id in this.joins ) {
            tmp.push( this.joins[ id ].toString() );
        }
        
        let query = this._collection + '/?' + tmp.join( '&' );
        return query;
    }
    
    get collection(): string {
        return this._collection;
    }
    
    // ------------------------------------------------------------------------
    // term
    // ------------------------------------------------------------------------
    where( field: string, configure: ( term: RestTerm ) => void ): RestQuery {
        let term = new RestTerm( field );
        configure( term );
        this.terms[ field ] = term;
        return this;
    }
    
    // ------------------------------------------------------------------------
    // join
    // ------------------------------------------------------------------------
    join( id: string, collection: string, configure: ( join: RestJoin ) => void ): RestQuery {
        if( !id || !collection ) {
            throw new Error( 'JoinId and/or Collection are not specified.' );
        }
        let join = new RestJoin( collection );
        configure( join );
        this.joins[ id ] = join;
        return this;
    }
    
    removeJoin( id: string ): void {
        if( this.joins[ id ] ) {
            delete this.joins[ id ];
        }
    }
    
    removeAllJoins(): void {
        this.joins = {};
    }
    
    // ------------------------------------------------------------------------
    // command
    // ------------------------------------------------------------------------
    private register( command: string, param: string ): RestQuery {
        this.commands[ command ] = 'c:' + command + '=' + param;
        return this;
    }
    
    private registerList( command: string, list: string[], suffix: string = '' ): RestQuery {
        return this.register( command, list.join(',') + suffix );
    }
    
    private registerBoolean( command: string, value: boolean ): RestQuery {
        return this.register( command, value ? 'true' : 'false' );
    }
    
    show( fields: string[] ): RestQuery                  { return this.registerList( 'show', fields ) }
    hide( fields: string[] ): RestQuery                  { return this.registerList( 'hide', fields ) }
    sort( fields: string[], accending: true ): RestQuery { return this.registerList( 'sort', fields, ( accending ? ':1' : ':-1' ) ) }
    has( field: string ): RestQuery                      { return this.register( 'has', field ) }
    case( value: boolean ): RestQuery                    { return this.registerBoolean( 'case', value ) }
    limit( value: number ): RestQuery                    { return this.register( 'limit', String( value ) ) }
    limitPerDB( value: number ): RestQuery               { return this.register( 'limitPerDB', String( value ) ) }
}

