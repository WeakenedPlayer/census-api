import { Observable } from 'rxjs';
import { Response, Event, IWebsocket } from './types';
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
    private subscription$: Observable<Response.Subscription>;

    //-------------------------------------------------------------------------
    // _serviceMessage より派生 ペイロードを返す
    //-------------------------------------------------------------------------
    private _event$: Observable<any>;
    private recentCharacterIds$: Observable<Response.RecentCharacterIds>;

    //-------------------------------------------------------------------------
    // _event より派生
    //-------------------------------------------------------------------------
    private _achievementEarned$: Observable<Event.AchievementEarned>;
    private _battleRankUp$: Observable<Event.BattleRankUp>;
    private _death$: Observable<Event.Death>;
    private _itemAdded$: Observable<Event.ItemAdded>;
    private _skillAdded$: Observable<Event.SkillAdded>;
    private _vehicleDestroy$: Observable<Event.VehicleDestroy>;
    private _gainExperience$: Observable<Event.GainExperience>;
    private _playerFacilityCapture$: Observable<Event.PlayerFacilityCapture>;
    private _playerFacilityDefend$: Observable<Event.PlayerFacilityDefend>;
    private _continentLock$: Observable<Event.ContinentLock>;
    private _continentUnlock$: Observable<Event.ContinentUnlock>;
    private _facilityControl$: Observable<Event.FacilityControl>;
    private _metagameEvent$: Observable<Event.MetagameEvent>;
    private _playerLogin$: Observable<Event.PlayerLogin>;
    private _playerLogout$: Observable<Event.PlayerLogout>;

    //-------------------------------------------------------------------------
    //  Getter
    //-------------------------------------------------------------------------
    get serviceMessage$(): Observable<any> { return this._serviceMessage$ }
    get connectionStateChanged$(): Observable<boolean> { return this._connectionStateChanged$ }
    get serviceStateChanged$(): Observable<boolean> { return this._serviceStateChanged$ }
    get heartbeat$(): Observable<any> { return this._heartbeat$ }
    
    get event$(): Observable<any> { return this._event$ }
    get achievementEarned$(): Observable<Event.AchievementEarned> { return this._achievementEarned$ }
    get battleRankUp$(): Observable<Event.BattleRankUp> { return this._battleRankUp$ }
    get death$(): Observable<Event.Death> { return this._death$ }
    get itemAdded$(): Observable<Event.ItemAdded> { return this._itemAdded$ }
    get skillAdded$(): Observable<Event.SkillAdded> { return this._skillAdded$ }
    get vehicleDestroy$(): Observable<Event.VehicleDestroy> { return this._vehicleDestroy$ }
    get gainExperience$(): Observable<Event.GainExperience> { return this._gainExperience$ }
    get playerFacilityCapture$(): Observable<Event.PlayerFacilityCapture> { return this._playerFacilityCapture$ }
    get playerFacilityDefend$(): Observable<Event.PlayerFacilityDefend> { return this._playerFacilityDefend$ }
    get continentLock$(): Observable<Event.ContinentLock> { return this._continentLock$ }
    get continentUnlock$(): Observable<Event.ContinentUnlock> { return this._continentUnlock$ }
    get facilityControl$(): Observable<Event.FacilityControl> { return this._facilityControl$ }
    get metagameEvent$(): Observable<Event.MetagameEvent> { return this._metagameEvent$ }
    get playerLogin$(): Observable<Event.PlayerLogin> { return this._playerLogin$ }
    get playerLogout$(): Observable<Event.PlayerLogout> { return this._playerLogout$ }


    constructor( private ws: IWebsocket ) {
        //---------------------------------------------------------------------
        // connectable に変換する (複数のsubscriberが存在するため) 
        //---------------------------------------------------------------------
        this.message$ = this.ws.message$.publish().refCount();

        //-------------------------------------------------------------------------
        // _message より派生
        //-------------------------------------------------------------------------
        this._serviceMessage$ = this.typeFilter( 'serviceMessage' ).publish().refCount();
        this._connectionStateChanged$ = this.typeFilter( 'connectionStateChanged' ).publish().refCount();
        this._serviceStateChanged$ = this.typeFilter( 'serviceStateChanged' ).publish().refCount();
        this._heartbeat$ = this.typeFilter( 'heartbeat' ).publish().refCount();
        this.subscription$ = this.message$.filter( msg => msg[ 'subscription' ] );
        //---------------------------------------------------------------------
        
        //---------------------------------------------------------------------
        // event系のメッセージ( payloadにevent_nameを持つことが条件 )
        //---------------------------------------------------------------------
        this._event$ = this.filterServiceMessage( 'event_name' ).publish().refCount();
        this.recentCharacterIds$ = this.filterServiceMessage( 'recent_character_id_count' ).publish().refCount();

        //---------------------------------------------------------------------
        // 個別のイベント
        //---------------------------------------------------------------------
        this._achievementEarned$ = this.filterEvent( 'AchievementEarned' ).publish().refCount();
        this._battleRankUp$ = this.filterEvent( 'BattleRankUp' ).publish().refCount();
        this._death$ = this.filterEvent( 'Death' ).publish().refCount();
        this._itemAdded$ = this.filterEvent( 'ItemAdded' ).publish().refCount();
        this._skillAdded$ = this.filterEvent( 'SkillAdded' ).publish().refCount();
        this._vehicleDestroy$ = this.filterEvent( 'VehicleDestroy' ).publish().refCount();
        this._gainExperience$ = this.filterEvent( 'GainExperience' ).publish().refCount();
        this._playerFacilityCapture$ = this.filterEvent( 'PlayerFacilityCapture' ).publish().refCount();
        this._playerFacilityDefend$ = this.filterEvent( 'PlayerFacilityDefend' ).publish().refCount();
        this._continentLock$ = this.filterEvent( 'ContinentLock' ).publish().refCount();
        this._continentUnlock$ = this.filterEvent( 'ContinentUnlock' ).publish().refCount();
        this._facilityControl$ = this.filterEvent( 'FacilityControl' ).publish().refCount();
        this._metagameEvent$ = this.filterEvent( 'MetagameEvent' ).publish().refCount();
        this._playerLogin$ = this.filterEvent( 'PlayerLogin' ).publish().refCount();
        this._playerLogout$ = this.filterEvent( 'PlayerLogout' ).publish().refCount();
    }
    //-------------------------------------------------------------------------
    // _message を type で分類する
    //-------------------------------------------------------------------------
    private typeFilter( typeName: string ): Observable<any> {
        return this.message$
        .filter( msg => msg[ 'type' ] && msg[ 'type' ] === typeName );
    }

    //-------------------------------------------------------------------------
    // _serviceMessage$ をペイロードに含まれる要素で分類する
    // 同時にPayloadを抽出する
    //-------------------------------------------------------------------------
    private filterServiceMessage( memberName: string ): Observable<any> {
        return this._serviceMessage$
        .map( msg => msg.payload )
        .filter( payload => payload[ memberName ] )
    }
    
    //-------------------------------------------------------------------------
    // _event をイベント名で分類する
    //-------------------------------------------------------------------------
    private filterEvent( eventName: string ): Observable<any> {
        return this._event$
        .filter( payload => payload[ 'event_name' ] === eventName );
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
            'characters': filter.characters,
            'worlds': filter.worlds,
            'logicalAndCharactersWithWorlds': ( logicalAnd ? 'true' : 'false' )
        } );
    }
    
    //-------------------------------------------------------------------------
    // subscriptionの応答を待つ
    //-------------------------------------------------------------------------
    private waitForSubscribe(): Promise<Response.Subscription> {
        return this.subscription$
        .take( 1 )
        .toPromise();
    }

    //-------------------------------------------------------------------------
    // 通知対象のイベントを追加する
    //-------------------------------------------------------------------------
    addEvent( events: string[], filter: EventFilter, logicalAnd: boolean = false ): Promise<Response.Subscription> {
        this.sendSubscribeCommand( 'subscribe', events, filter, logicalAnd );
        return this.waitForSubscribe(); 
    }
    
    //-------------------------------------------------------------------------
    // イベントを通知対象から除外する
    //-------------------------------------------------------------------------
    removeEvent( events: string[], filter: EventFilter, logicalAnd: boolean = false ): Promise<Response.Subscription> {
        this.sendSubscribeCommand( 'clearSubscribe', events, filter, logicalAnd );
        return this.waitForSubscribe(); 
    }

    //-------------------------------------------------------------------------
    // イベントの通知を停止する
    //-------------------------------------------------------------------------
    removeAllEvent(): Promise<Response.Subscription> {
        this.sendCommand( 'clearSubscribe', { 'all': 'true' } );
        return this.waitForSubscribe(); 
    }
    
    //-------------------------------------------------------------------------
    // recentCharacterIds* の応答を待つ
    //-------------------------------------------------------------------------
    private waitRecentCharacterIds(): Promise<Response.RecentCharacterIds> {
        return this.recentCharacterIds$
        .take( 1 )
        .toPromise();
    }

    //-------------------------------------------------------------------------
    // ログイン中のユーザ数とIDリストを取得する
    //-------------------------------------------------------------------------
    getRecentCharacterIds(): Promise<Response.RecentCharacterIds> {
        this.sendCommand( 'recentCharacterIds' );
        return this.waitRecentCharacterIds();
    }

    //-------------------------------------------------------------------------
    // ログイン中のユーザ数を取得する
    //-------------------------------------------------------------------------
    getRecentCharacterIdsCount(): Promise<Response.RecentCharacterIds> {
        this.sendCommand( 'recentCharacterIdsCount' );
        return this.waitRecentCharacterIds();
    }
}
