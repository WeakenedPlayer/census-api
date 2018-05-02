export class RestTerm {
    private conditions: string[] = [];
    constructor( private field: string ) {}
    private add( modifier: string, value: string ) {
        this.conditions.push( this.field + '=' + modifier + value );
    }

    toString(): string {
        return this.conditions.join( '&' );
    }
    
    equals( value: string ):              void { this.add( '' , value ) }
    lessThan( value: string ):            void { this.add( '<', value ) }
    lessThanOrEqual( value: string ):     void { this.add( '[', value ) }
    greaterThan( value: string ):         void { this.add( '>', value ) }
    greaterThanOrEqual( value: string ):  void { this.add( ']', value ) }
    startWith( value: string ):           void { this.add( '^', value ) }
    contains( value: string ):            void { this.add( '*', value ) }
    not( value: string ):                 void { this.add( '!', value ) }
}
