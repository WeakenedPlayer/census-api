export class EventFilter {
    constructor( public readonly characters: string[] = [],
                 public readonly worlds: string[] = [] ) {}
}

export class WorldFilter extends EventFilter {
    constructor( worlds: string[] ) {
        super( [], worlds );
    }
}

export class CharacterFilter extends EventFilter {
    constructor( characters: string[] ) {
        super( characters, [] );
    }
}
