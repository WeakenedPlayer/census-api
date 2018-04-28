export class QueryBuilder {
    private query: string = '';
    private append( field: string, modifier: string, value: string ): QueryBuilder {
        this.query = this.query + ( this.query ? '&' : '' ) + field + '=' + modifier + value;
        return this;
    }

    clear(): void {
        this.query = '';
    }
    
    toString(): string {
        return this.query;
    }

    equals( field: string, value: string ):             QueryBuilder{ return this.append( field, '', value  ) }
    lessThan( field: string, value: string ):           QueryBuilder{ return this.append( field, '<', value ) }
    lessThanOrEqual( field: string, value: string ):    QueryBuilder{ return this.append( field, '[', value ) }
    greaterThan( field: string, value: string ):        QueryBuilder{ return this.append( field, '>', value ) }
    greaterThanOrEqual( field: string, value: string ): QueryBuilder{ return this.append( field, ']', value ) }
    startWith( field: string, value: string ):          QueryBuilder{ return this.append( field, '^', value ) }
    contains( field: string, value: string ):           QueryBuilder{ return this.append( field, '*', value ) }
    not( field: string, value: string ):                QueryBuilder{ return this.append( field, '!', value ) }
}
