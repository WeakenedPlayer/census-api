import { JoinBuilder } from './join-builder';

export class CommandBuilder {
    private command: string = '';
    private concat( str: string ): CommandBuilder {
        this.command = this.command + str;
        return
    }
    private append( command: string, param: string ): CommandBuilder {
        this.command = this.command + ( this.command ? ',' : '' ) + 'c:' + command + '=' + param;
        return this;
    }
    
    private appendList( command: string, list: string[] ): CommandBuilder {
        return this.append( command, list.join(',') );
    }
    
    private appendBoolean( command: string, value: boolean ): CommandBuilder {
        return this.append( command, value ? 'true' : 'false' );
    }

    clear(): void {
        this.command = '';
    }
    
    toString(): string {
        return this.command;
    }
    
    show( fields: string[] ): CommandBuilder                  { return this.appendList( 'show', fields ) }
    hide( fields: string[] ): CommandBuilder                  { return this.appendList( 'hide', fields ) }
    sort( fields: string[], accending: true ): CommandBuilder { return this.appendList( 'sort', fields ).concat( accending ? ':1' : ':-1' ) }
    has( field: string ): CommandBuilder                      { return this.append( 'has', field ) }
    resolve( fields: string[] ): CommandBuilder               { return this.appendList( 'resolve', fields ) }
    case( value: boolean ): CommandBuilder                    { return this.appendBoolean( 'case', value ) }
    limit( value: number ): CommandBuilder                    { return this.append( 'limit', String( value ) ) }
    limitPerDB( value: number ): CommandBuilder               { return this.append( 'limitPerDB', String( value ) ) }
    join( jb: JoinBuilder | JoinBuilder[] ): CommandBuilder {
        let query: string = 'c:join=';
        if( jb instanceof Array ) {
            let tmp: string = '';
            jb.map( j => {
                tmp = tmp + ( tmp ? ',' : '' ) + j.toString();
            } );
            query = query + tmp;
        } else {
            query = query + jb.toString();
        }
        return this;
    }
}
