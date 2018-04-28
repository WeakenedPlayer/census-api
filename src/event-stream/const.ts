export module Constant {
    export const AchievementEarned = 'AchievementEarned';
    export const BattleRankUp = 'BattleRankUp';
    export const Death = 'Death';
    export const ItemAdded = 'ItemAdded';
    export const SkillAdded = 'SkillAdded';
    export const VehicleDestroy = 'VehicleDestroy';
    export const GainExperience = 'GainExperience';
    export const PlayerFacilityCapture = 'PlayerFacilityCapture';
    export const PlayerFacilityDefend = 'PlayerFacilityDefend';
    export const ContinentLock = 'ContinentLock';
    export const ContinentUnlock = 'ContinentUnlock';
    export const FacilityControl = 'FacilityControl';
    export const MetagameEvent = 'MetagameEvent';
    export const PlayerLogin = 'PlayerLogin';
    export const PlayerLogout = 'PlayerLogout';
    
    export function toGainExperienceEventFilter( ids: number[] ): string[] {
        return ids.map( ( id ) => 'GainExperience_experiende_id_' + String( id ) );
    }
    
    export const WorldId: { [ worldName: string ]: string } = {
        'connery': '1',
        'miller':  '10',
        'cobalt':  '13',
        'emerald': '17',
        'jaeger':  '19',
        'briggs':  '25',
        'all': 'all'
    };
    
    export function toWorldNames( names: string[] ): string[] {
        let ids: string[] = [];
        let id: string;
        for( let name of names ) {
            id = WorldId[ name ];
            if( id ) {
                ids.push( id );
            }
        }
        return ids;
    }
}
