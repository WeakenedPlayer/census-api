export interface RestApiHttp {
    get( url: string ): Promise<any>;
}

export module RestType {
    export interface CharacterName {
        'character_id'?: string;
        'name'?: {
            'first': string;
            'first_lower': string;
        };
    }
    
    export interface CharactersWorld {
        'character_id'?: string;
        'world_id'?: string;
    }
    
    export interface Faction {
        'code_tag'?: string;
        'faction_id'?: string;
        'image_id'?: string;
        'image_path'?: string
        'image_set_id'?: string;
        'name'?: {
            'en'?: string;
            'de'?: string;
            'es'?: string;
            'fr'?: string;
            'it'?: string;
        };
        'user_selectable'?: string;
    }
    
    export interface OutfitMemberExtended {
        'alias'?: string;
        'alias_lower'?: string;
        'character_id'?: string;
        'leader_character_id'?: string;
        'member_count'?: string;
        'member_rank'?: string;
        'member_rank_ordinal'?: string;
        'member_since'?: string;
        'member_since_date'?: string;
        'name'?: string;
        'name_lower'?: string;
        'outfit_id'?: string;
        'time_created'?: string;
        'time_created_date'?: string;
    }
    
    export interface World {
        'name'?: {
            'en'?: string;
            'de'?: string;
            'es'?: string;
            'fr'?: string;
            'it'?: string;
        };
        'state'?: string;
        'world_id'?: string;
    }
    
    export interface Character {
        'battle_rank'?: {
            'percent_to_next'?: string;
            'value'?: string;
        };
        'certs'?:　{
            'earned_points'?: string;
            'gifted_points'?: string;
            'spent_points'?: string;
            'available_points'?: string;
            'percent_to_next'?: string;
        };
        'character_id'?: string;
        'daily_ribbon'?: {
            'count'?: string;
            'time'?: string;
            'date'?: string;
        };
        'faction_id'?: string;
        'head_id'?: string;
        'name'?: {
            'first'?: string;
            'first_lower'?: string;
        };
        'prestige_level'?: string;
        'profile_id'?: string;
        'times'?: {
            'creation'?: string;
            'creation_date'?: string;
            'last_login'?: string;
            'last_login_date'?: string;
            'last_save'?: string;
            'last_save_date'?: string;
            'login_count'?: string;
            'minutes_played'?: string;
        }
        'title_id'?: string;
    }
}
