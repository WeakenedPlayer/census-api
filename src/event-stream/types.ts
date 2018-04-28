import { Observable } from 'rxjs';

//-----------------------------------------------------------------------------
// Census API Websocket abstraction
//-----------------------------------------------------------------------------
export interface EventStreamWebsocket {
    message$: Observable<any>;
    send( data: any ): void;
}

//-----------------------------------------------------------------------------
// Event payload
// type definition from http://census.daybreakgames.com/
//-----------------------------------------------------------------------------
export module EventType {
    export interface AchievementEarned {
        event_name: string,
        character_id: string,
        timestamp: string,
        world_id: string,
        achievement_id: string,
        zone_id: string
    }
    
    export interface BattleRankUp {
        battle_rank: string,
        character_id: string,
        event_name: string,
        timestamp: string,
        world_id: string,
        zone_id: string
    }
    
    export interface Death {
        attacker_character_id: string,
        attacker_fire_mode_id: string,
        attacker_loadout_id: string,
        attacker_vehicle_id: string,
        attacker_weapon_id: string,
        character_id: string,
        character_loadout_id: string,
        event_name: string,
        is_critical: string,
        is_headshot: string,
        timestamp: string,
        vehicle_id: string,
        world_id: string,
        zone_id: string
    }

    export interface ItemAdded {
        character_id: string,
        context: string,
        event_name: string,
        item_count: string,
        item_id: string,
        timestamp: string,
        world_id: string,
        zone_id: string
    }

    export interface SkillAdded {
        character_id: string,
        event_name: string,
        skill_id: string,
        timestamp: string,
        world_id: string,
        zone_id: string
    }
    
    export interface VehicleDestroy {
        attacker_character_id: string,
        attacker_loadout_id: string,
        attacker_vehicle_id: string,
        attacker_weapon_id: string,
        character_id: string,
        event_name: string,
        facility_id: string,
        faction_id: string,
        timestamp: string,
        vehicle_id: string,
        world_id: string,
        zone_id: string
    }
    
    export interface GainExperience {
        amount: string,
        character_id: string,
        event_name: string,
        experience_id: string,
        loadout_id: string,
        other_id: string,
        timestamp: string,
        world_id: string,
        zone_id: string
    }

    export interface PlayerFacilityCapture {
        character_id: string,
        event_name: string,
        facility_id: string,
        outfit_id: string,
        timestamp: string,
        world_id: string,
        zone_id: string
    }
    
    export interface PlayerFacilityDefend {
        character_id: string,
        event_name: string,
        facility_id: string,
        outfit_id: string,
        timestamp: string,
        world_id: string,
        zone_id: string
    }

    export interface ContinentLock {
        event_name: string,
        timestamp: string,
        world_id: string,
        zone_id: string,
        triggering_faction: string,
        previous_faction: string,
        vs_population: string,
        nc_population: string,
        tr_population: string,
        metagame_event_id: string,
        event_type: string
    }
    
    export interface ContinentUnlock {
        event_name: string,
        timestamp: string,
        world_id: string,
        zone_id: string,
        triggering_faction: string,
        previous_faction: string,
        vs_population: string,
        nc_population: string,
        tr_population: string,
        metagame_event_id: string,
        event_type: string
    }
    
    export interface FacilityControl {
        event_name: string,
        timestamp: string,
        world_id: string,
        old_faction_id: string,
        outfit_id: string,
        new_faction_id: string,
        facility_id: string,
        duration_held: string,
        zone_id: string
    }
    
    export interface MetagameEvent {
        event_name: string,
        experience_bonus: string,
        faction_nc: string,
        faction_tr: string,
        faction_vs: string,
        metagame_event_id: string,
        metagame_event_state: string,
        timestamp: string,
        world_id: string,
        zone_id: string
    }
    
    export interface PlayerLogin {
        character_id: string,
        event_name: string,
        timestamp: string,
        world_id: string
    }
    
    export interface PlayerLogout {
        character_id: string,
        event_name: string,
        timestamp: string,
        world_id: string
    }
}

//-----------------------------------------------------------------------------
// Response from Census API
//-----------------------------------------------------------------------------
export module EventResponse {
    export interface RecentCharacterIds {
        recent_character_id_count: string;
        recent_character_id_list?: string[]; 
    }

    // subscription:
    export interface Subscription {
        characterCount: string,
        eventNames: string[],
        logicalAndCharactersWithWorlds: string,
        worlds: string[]
    }
}
