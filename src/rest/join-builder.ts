export class JoinBuilder {
    private query: string = '';
    constructor( private collection: string ){
        this.query = collection;
    }

    private append( key: string, value: string ): JoinBuilder {
        this.query = this.query + '^' + key + ':' + value;
        return this;
    }
    
    private appendList( key: string, fields: string[] ): JoinBuilder {
        return this.append( key, fields.join('\''));
    }
    
    private appendBoolean( key: string, value: boolean ): JoinBuilder {
        return this.append( key, ( value ? '1' : '0' ) );
    }
    
    clear(): void {
        this.query = this.collection;
    }
    
    toString(): string {
        return this.query;
    }
    
    on( field: string ): JoinBuilder {
        return this.append( 'on', field );
    }
    
    to( field: string ): JoinBuilder {
        return this.append( 'to', field );
    }
    
    list( isList: boolean ): JoinBuilder {
        return this.appendBoolean( 'list', isList );
    }
    
    show( fields: string[] ): JoinBuilder {
        return this.appendList( 'show', fields );
    }
    
    hide( fields: string[] ): JoinBuilder {
        return this.appendList( 'hide', fields );
    }
    
    injectAt( fieldName: string ): JoinBuilder {
        return this.append( 'inject_at', fieldName );
    }
    
    // terms() is not implemented

    outer( isOuterJoin: boolean ): JoinBuilder {
        return this.appendBoolean( 'outer', isOuterJoin );
    }

    nest( inner: JoinBuilder | JoinBuilder[] ): JoinBuilder {
        let query: string = '';
        if( inner instanceof Array ) {
            inner.map( i => {
                query = query + ( query ? ',' : '' ) + i.query;
            } );
        } else {
            query = inner.query;
        }
        this.query = '(' + query + ')';
        return this;
    }
}
