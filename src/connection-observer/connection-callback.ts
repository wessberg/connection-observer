import {ConnectionRecord} from "./connection-record";
import {IConnectionObserver} from "./i-connection-observer";

export type ConnectionCallback = (entries: ConnectionRecord[], observer: IConnectionObserver) => void;
