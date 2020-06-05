import Pubnub from 'pubnub';
import {convertIdToPubNubKind} from '../utilities/index'


export class aaPubnub {
    constructor(vendorInfo, uuid) {
      this.pubnub = new Pubnub({
        subscribeKey: vendorInfo.SubscriptionKey,
        authKey: vendorInfo.AuthorizationKey,
        uuid: convertIdToPubNubKind(uuid),
        ssl: true,
        keepAlive: true,
        keepAliveSettings: {
          keepAliveMsecs: 4000,
          maxSockets: 100,
          timeout: 0
        }
      })
    }
  }
