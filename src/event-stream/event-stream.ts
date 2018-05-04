import { Observable } from 'rxjs';
import { map, publish, refCount, take, filter } from 'rxjs/operators';
import { EventResponse, EventType, EventStreamWebsocket } from './types';
import { EventFilter } from './event-filter';

export class EventStream {
    private message$: Observable<any>;
    //-------------------------------------------------------------------------
    // _message より派生
    //-------------------------------------------------------------------------
    private _serviceMessage$: Observable<any>;
    private _connectionStateChanged$: Observable<boolean>;
    private _serviceStateChanged$: Observable<boolean>;
    private _heartbeat$: Observable<any>;
    private subscription$: Observable<EventResponse.Subscription>;

    //-------------------------------------------------------------------------
    // _serviceMessage より派生 ペイロードを返す
    //-------------------------------------------------------------------------
    private _event$: Observable<any>;
    private recentCharacterIds$: Observable<EventResponse.RecentCharacterIds>;

    //-------------------------------------------------------------------------
    // _event より派生
    //-------------------------------------------------------------------------
    private _achievementEarned$: Observable<EventType.AchievementEarned>;
    private _battleRankUp$: Observable<EventType.BattleRankUp>;
    private _death$: Observable<EventType.Death>;
    private _itemAdded$: Observable<EventType.ItemAdded>;
    private _skillAdded$: Observable<EventType.SkillAdded>;
    private _vehicleDestroy$: Observable<EventType.VehicleDestroy>;
    private _gainExperience$: Observable<EventType.GainExperience>;
    private _playerFacilityCapture$: Observable<EventType.PlayerFacilityCapture>;
    private _playerFacilityDefend$: Observable<EventType.PlayerFacilityDefend>;
    private _continentLock$: Observable<EventType.ContinentLock>;
    private _continentUnlock$: Observable<EventType.ContinentUnlock>;
    private _facilityControl$: Observable<EventType.FacilityControl>;
    private _metagameEvent$: Observable<EventType.MetagameEvent>;
    private _playerLogin$: Observable<EventType.PlayerLogin>;
    private _playerLogout$: Observable<EventType.PlayerLogout>;

    //-------------------------------------------------------------------------
    //  Getter
    //-------------------------------------------------------------------------
    get serviceMessage$(): Observable<any> { return this._serviceMessage$ }
    get connectionStateChanged$(): Observable<boolean> { return this._connectionStateChanged$ }
    get serviceStateChanged$(): Observable<boolean> { return this._serviceStateChanged$ }
    get heartbeat$(): Observable<any> { return this._heartbeat$ }
    
    get event$(): Observable<any> { return this._event$ }
    get achievementEarned$(): Observable<EventType.AchievementEarned> { return this._achievementEarned$ }
    get battleRankUp$(): Observable<EventType.BattleRankUp> { return this._battleRankUp$ }
    get death$(): Observable<EventType.Death> { return this._death$ }
    get itemAdded$(): Observable<EventType.ItemAdded> { return this._itemAdded$ }
    get skillAdded$(): Observable<EventType.SkillAdded> { return this._skillAdded$ }
    get vehicleDestroy$(): Observable<EventType.VehicleDestroy> { return this._vehicleDestroy$ }
    get gainExperience$(): Observable<EventType.GainExperience> { return this._gainExperience$ }
    get playerFacilityCapture$(): Observable<EventType.PlayerFacilityCapture> { return this._playerFacilityCapture$ }
    get playerFacilityDefend$(): Observable<EventType.PlayerFacilityDefend> { return this._playerFacilityDefend$ }
    get continentLock$(): Observable<EventType.ContinentLock> { return this._continentLock$ }
    get continentUnlock$(): Observable<EventType.ContinentUnlock> { return this._continentUnlock$ }
    get facilityControl$(): Observable<EventType.FacilityControl> { return this._facilityControl$ }
    get metagameEvent$(): Observable<EventType.MetagameEvent> { return this._metagameEvent$ }
    get playerLogin$(): Observable<EventType.PlayerLogin> { return this._playerLogin$ }
    get playerLogout$(): Observable<EventType.PlayerLogout> { return this._playerLogout$ }


    constructor( private ws: EventStreamWebsocket ) {
        //---------------------------------------------------------------------
        // connectable に変換する (複数のsubscriberが存在するため) 
        //---------------------------------------------------------------------
        this.message$ = this.ws.message$.pipe( publish(), refCount() );

        //-------------------------------------------------------------------------
        // _message より派生
        //-------------------------------------------------------------------------
        this._serviceMessage$ = this.typeFilter( 'serviceMessage' ).pipe( publish(), refCount() );
        this._connectionStateChanged$ = this.typeFilter( 'connectionStateChanged' ).pipe( publish(), refCount() );
        this._serviceStateChanged$ = this.typeFilter( 'serviceStateChanged' ).pipe( publish(), refCount() );
        this._heartbeat$ = this.typeFilter( 'heartbeat' ).pipe( publish(), refCount() );
        this.subscription$ = this.message$.pipe( filter( msg => msg[ 'subscription' ] ) );
        //---------------------------------------------------------------------
        
        //---------------------------------------------------------------------
        // event系のメッセージ( payloadにevent_nameを持つことが条件 )
        //---------------------------------------------------------------------
        this._event$ = this.filterServiceMessage( 'event_name' ).pipe( publish(), refCount() );
        this.recentCharacterIds$ = this.filterServiceMessage( 'recent_character_id_count' ).pipe( publish(), refCount() );

        //---------------------------------------------------------------------
        // 個別のイベント
        //---------------------------------------------------------------------
        this._achievementEarned$ = this.filterEvent( 'AchievementEarned' ).pipe( publish(), refCount() );
        this._battleRankUp$ = this.filterEvent( 'BattleRankUp' ).pipe( publish(), refCount() );
        this._death$ = this.filterEvent( 'Death' ).pipe( publish(), refCount() );
        this._itemAdded$ = this.filterEvent( 'ItemAdded' ).pipe( publish(), refCount() );
        this._skillAdded$ = this.filterEvent( 'SkillAdded' ).pipe( publish(), refCount() );
        this._vehicleDestroy$ = this.filterEvent( 'VehicleDestroy' ).pipe( publish(), refCount() );
        this._gainExperience$ = this.filterEvent( 'GainExperience' ).pipe( publish(), refCount() );
        this._playerFacilityCapture$ = this.filterEvent( 'PlayerFacilityCapture' ).pipe( publish(), refCount() );
        this._playerFacilityDefend$ = this.filterEvent( 'PlayerFacilityDefend' ).pipe( publish(), refCount() );
        this._continentLock$ = this.filterEvent( 'ContinentLock' ).pipe( publish(), refCount() );
        this._continentUnlock$ = this.filterEvent( 'ContinentUnlock' ).pipe( publish(), refCount() );
        this._facilityControl$ = this.filterEvent( 'FacilityControl' ).pipe( publish(), refCount() );
        this._metagameEvent$ = this.filterEvent( 'MetagameEvent' ).pipe( publish(), refCount() );
        this._playerLogin$ = this.filterEvent( 'PlayerLogin' ).pipe( publish(), refCount() );
        this._playerLogout$ = this.filterEvent( 'PlayerLogout' ).pipe( publish(), refCount() );
    }
    //-------------------------------------------------------------------------
    // _message を type で分類する
    //-------------------------------------------------------------------------
    private typeFilter( typeName: string ): Observable<any> {
        return this.message$
        .pipe( filter( msg => msg[ 'type' ] && msg[ 'type' ] === typeName ) );
    }

    //-------------------------------------------------------------------------
    // _serviceMessage$ をペイロードに含まれる要素で分類する
    // 同時にPayloadを抽出する
    //-------------------------------------------------------------------------
    private filterServiceMessage( memberName: string ): Observable<any> {
        return this._serviceMessage$
        .pipe( map( msg => msg.payload ),
               filter( payload => payload[ memberName ] ) );
    }
    
    //-------------------------------------------------------------------------
    // _event をイベント名で分類する
    //-------------------------------------------------------------------------
    private filterEvent( eventName: string ): Observable<any> {
        return this._event$
        .pipe( filter( payload => payload[ 'event_name' ] === eventName ) );
    }

    //-------------------------------------------------------------------------
    // コマンドを送信する
    //-------------------------------------------------------------------------
    private sendCommand( action: string, options?: any ): void {
        let command = {
                'service': 'event',
                'action': action,
                ...options
        };
        this.ws.send( command );
    }

    //-------------------------------------------------------------------------
    // subscriptionコマンドを発行する
    //-------------------------------------------------------------------------
    private sendSubscribeCommand( action: string, events: string[], filter: EventFilter, logicalAnd: boolean = false ): void {
        this.sendCommand( action, {
            'eventNames': events,
            'characters': filter.characterIds,
            'worlds': filter.worlds,
            'logicalAndCharactersWithWorlds': ( logicalAnd ? 'true' : 'false' )
        } );
    }
    
    //-------------------------------------------------------------------------
    // subscriptionの応答を待つ
    //-------------------------------------------------------------------------
    private waitForSubscribe(): Promise<EventResponse.Subscription> {
        return this.subscription$
        .pipe( take( 1 ) )
        .toPromise();
    }

    //-------------------------------------------------------------------------
    // 通知対象のイベントを追加する
    //-------------------------------------------------------------------------
    addEvent( events: string[], filter: EventFilter, logicalAnd: boolean = false ): Promise<EventResponse.Subscription> {
        this.sendSubscribeCommand( 'subscribe', events, filter, logicalAnd );
        return this.waitForSubscribe(); 
    }
    
    //-------------------------------------------------------------------------
    // イベントを通知対象から除外する
    //-------------------------------------------------------------------------
    removeEvent( events: string[], filter: EventFilter, logicalAnd: boolean = false ): Promise<EventResponse.Subscription> {
        this.sendSubscribeCommand( 'clearSubscribe', events, filter, logicalAnd );
        return this.waitForSubscribe(); 
    }

    //-------------------------------------------------------------------------
    // イベントの通知を停止する
    //-------------------------------------------------------------------------
    removeAllEvent(): Promise<EventResponse.Subscription> {
        this.sendCommand( 'clearSubscribe', { 'all': 'true' } );
        return this.waitForSubscribe(); 
    }
    
    //-------------------------------------------------------------------------
    // recentCharacterIds* の応答を待つ
    //-------------------------------------------------------------------------
    private waitRecentCharacterIds(): Promise<EventResponse.RecentCharacterIds> {
        return this.recentCharacterIds$
        .pipe( take( 1 ) )
        .toPromise();
    }

    //-------------------------------------------------------------------------
    // ログイン中のユーザ数とIDリストを取得する
    //-------------------------------------------------------------------------
    getRecentCharacterIds(): Promise<EventResponse.RecentCharacterIds> {
        this.sendCommand( 'recentCharacterIds' );
        return this.waitRecentCharacterIds();
    }

    //-------------------------------------------------------------------------
    // ログイン中のユーザ数を取得する
    //-------------------------------------------------------------------------
    getRecentCharacterIdsCount(): Promise<EventResponse.RecentCharacterIds> {
        this.sendCommand( 'recentCharacterIdsCount' );
        return this.waitRecentCharacterIds();
    }
}
