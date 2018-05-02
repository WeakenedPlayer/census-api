export class RestJoinBuilder {
    private query: string = '';
    constructor( private collection: string ){
        this.query = collection;
    }

    private append( key: string, value: string ): RestJoinBuilder {
        this.query = this.query + '^' + key + ':' + value;
        return this;
    }
    
    private appendList( key: string, fields: string[] ): RestJoinBuilder {
        return this.append( key, fields.join('\''));
    }
    
    private appendBoolean( key: string, value: boolean ): RestJoinBuilder {
        return this.append( key, ( value ? '1' : '0' ) );
    }

    clone(): RestJoinBuilder {
        let tmp = new RestJoinBuilder( this.collection );
        tmp.query = this.query;
        return tmp;
    }
    
    clear(): void {
        this.query = this.collection;
    }
    
    toString(): string {
        return this.query;
    }
    
    on( field: string ): RestJoinBuilder {
        return this.append( 'on', field );
    }
    
    to( field: string ): RestJoinBuilder {
        return this.append( 'to', field );
    }
    
    list( isList: boolean ): RestJoinBuilder {
        return this.appendBoolean( 'list', isList );
    }
    
    show( fields: string[] ): RestJoinBuilder {
        return this.appendList( 'show', fields );
    }
    
    hide( fields: string[] ): RestJoinBuilder {
        return this.appendList( 'hide', fields );
    }
    
    injectAt( fieldName: string ): RestJoinBuilder {
        return this.append( 'inject_at', fieldName );
    }
    
    // terms() is not implemented

    outer( isOuterJoin: boolean ): RestJoinBuilder {
        return this.appendBoolean( 'outer', isOuterJoin );
    }

    nest( inner: RestJoinBuilder | RestJoinBuilder[] ): RestJoinBuilder {
        let query: string = '';
        if( inner instanceof Array ) {
            inner.map( i => {
                query = query + ( query ? '\'' : '' ) + i.query;
            } );
        } else {
            query = inner.query;
        }
        this.query = this.query + '(' + query + ')';
        return this;
    }
}
