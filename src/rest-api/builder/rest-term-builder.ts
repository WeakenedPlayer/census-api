import * as format from 'string-format';

export class RestTermBuilder {
    private term: string = '';
    private append( field: string, modifier: string, value: string ): RestTermBuilder {
        this.term = this.term + ( this.term ? '&' : '' ) + field + '=' + modifier + value;
        return this;
    }

    clone(): RestTermBuilder {
        let tmp = new RestTermBuilder();
        tmp.term = this.term;
        return tmp;
    }

    clear(): void {
        this.term = '';
    }

    toString(): string {
        return this.term;
    }

    equals( field: string, value: string ):             RestTermBuilder{ return this.append( field, '', value  ) }
    lessThan( field: string, value: string ):           RestTermBuilder{ return this.append( field, '<', value ) }
    lessThanOrEqual( field: string, value: string ):    RestTermBuilder{ return this.append( field, '[', value ) }
    greaterThan( field: string, value: string ):        RestTermBuilder{ return this.append( field, '>', value ) }
    greaterThanOrEqual( field: string, value: string ): RestTermBuilder{ return this.append( field, ']', value ) }
    startWith( field: string, value: string ):          RestTermBuilder{ return this.append( field, '^', value ) }
    contains( field: string, value: string ):           RestTermBuilder{ return this.append( field, '*', value ) }
    not( field: string, value: string ):                RestTermBuilder{ return this.append( field, '!', value ) }
}
