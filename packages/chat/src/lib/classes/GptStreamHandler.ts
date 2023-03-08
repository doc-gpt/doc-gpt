import { GptStreamResponse } from "../types";

export class GptStreamHandler {
    private _onMessageDelta?: (firstMessageDelta: string, fullChunk: GptStreamResponse) => void;
    private _onError?: (err: string | Error) => void;
    private _onDone?: (stop_reason: string) => void;

    public onMessage(callback: (firstMessageDelta: string, fullChunk: GptStreamResponse) => void): GptStreamHandler {
        this._onMessageDelta = callback;
        return this;
    }

    public onError(callback: (err: string | Error) => void): GptStreamHandler {
        this._onError = callback;
        return this;
    }

    public onDone(callback: (stop_reason: string) => void): GptStreamHandler {
        this._onDone = callback;
        return this;
    }

    /** Internal. Do not use this */
    _notifyMessage(firstMessageDelta: string, fullChunk: GptStreamResponse) {
        if (this._onMessageDelta) this._onMessageDelta(firstMessageDelta, fullChunk);
    }

    /** Internal. Do not use this */
    _notifyError(err: string | Error) {
        if (this._onError) this._onError(err);
    }

    /** Internal. Do not use this */
    _notifyDone(stop_reason: string) {
        if (this._onDone) this._onDone(stop_reason);
    }

}