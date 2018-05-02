export class RestJoin {
    private children: RestJoin[] = [];
    private commands: { [ key: string ]: string } = {};

    constructor( private collection: string ) {}
    
    toString(): string {
        let query = 'c:join=' + this.collection;
        for( let key in this.commands ) {
            query = query + '^' + this.commands[ key ];
        }
        
        if( this.children.length ) {
            console.log( this.children )
            let joins = '';
            this.children.map( join => {
                joins = joins + ( joins ? '^' : '' ) + join.toString();
            } )            
            query = query + '(' + joins + ')';        
        }

        return query;
    }

    private register( key: string, value: string ): RestJoin {
        this.commands[ key ] = ( key + ':' + value );
        return this;
    }

    private registerList( key: string, fields: string[] ): RestJoin {
        return this.register( key, fields.join('\''));
    }

    private registerBoolean( key: string, value: boolean ): RestJoin {
        return this.register( key, ( value ? '1' : '0' ) );
    }

    on( field: string ): RestJoin {
        return this.register( 'on', field );
    }

    to( field: string ): RestJoin {
        return this.register( 'to', field );
    }

    list( isList: boolean ): RestJoin {
        return this.registerBoolean( 'list', isList );
    }

    show( fields: string[] ): RestJoin {
        return this.registerList( 'show', fields );
    }

    hide( fields: string[] ): RestJoin {
        return this.registerList( 'hide', fields );
    }

    injectAt( fieldName: string ): RestJoin {
        return this.register( 'inject_at', fieldName );
    }

    outer( isOuterJoin: boolean ): RestJoin {
        return this.registerBoolean( 'outer', isOuterJoin );
    }

    nest( collection: string, configure: ( child: RestJoin ) => void ): RestJoin {
        let join = new RestJoin( collection );
        configure( join );
        return this;
    }
}
