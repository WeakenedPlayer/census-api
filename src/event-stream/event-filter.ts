export class EventFilter {
    static filterByWorld( worlds: string[] ): EventFilter { return new EventFilter( [], worlds ) }
    static filterByCharacter( characterIds: string[] ): EventFilter { return new EventFilter( characterIds, [] ) }

    constructor( public readonly characterIds: string[] = [],
                 public readonly worlds: string[] = [] ) {}
}
