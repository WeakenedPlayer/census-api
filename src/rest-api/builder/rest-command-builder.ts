import { RestJoinBuilder } from './rest-join-builder';

export class RestCommandBuilder {
    private command: string = '';
    private concat( str: string ): RestCommandBuilder {
        this.command = this.command + str;
        return
    }
    private append( command: string, param: string ): RestCommandBuilder {
        this.command = this.command + ( this.command ? '&' : '' ) + 'c:' + command + '=' + param;
        return this;
    }
    
    private appendList( command: string, list: string[] ): RestCommandBuilder {
        return this.append( command, list.join(',') );
    }
    
    private appendBoolean( command: string, value: boolean ): RestCommandBuilder {
        return this.append( command, value ? 'true' : 'false' );
    }
    
    clone(): RestCommandBuilder {
        let tmp = new RestCommandBuilder();
        tmp.command = this.command;
        return tmp;
    }

    clear(): void {
        this.command = '';
    }
    
    toString(): string {
        return this.command;
    }
    
    show( fields: string[] ): RestCommandBuilder                  { return this.appendList( 'show', fields ) }
    hide( fields: string[] ): RestCommandBuilder                  { return this.appendList( 'hide', fields ) }
    sort( fields: string[], accending: true ): RestCommandBuilder { return this.appendList( 'sort', fields ).concat( accending ? ':1' : ':-1' ) }
    has( field: string ): RestCommandBuilder                      { return this.append( 'has', field ) }
    resolve( fields: string[] ): RestCommandBuilder               { return this.appendList( 'resolve', fields ) }
    case( value: boolean ): RestCommandBuilder                    { return this.appendBoolean( 'case', value ) }
    limit( value: number ): RestCommandBuilder                    { return this.append( 'limit', String( value ) ) }
    limitPerDB( value: number ): RestCommandBuilder               { return this.append( 'limitPerDB', String( value ) ) }
    join( jb: RestJoinBuilder | RestJoinBuilder[] ): RestCommandBuilder {
        let query: string = '';
        if( jb instanceof Array ) {
            let tmp: string = '';
            jb.map( j => {
                tmp = tmp + ( tmp ? ',' : '' ) + j.toString();
            } );
            query = query + tmp;
        } else {
            query = query + jb.toString();
        }
        this.append( 'join', query );
        return this;
    }
}
