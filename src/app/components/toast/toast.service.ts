import {Injectable} from '@angular/core';
import {Toast} from './toast.model';
import {ResultSet} from '../data-view/models/result-set.model';

@Injectable({
    providedIn: 'root'
})
export class ToastService {

    public toasts: Map<string, Toast> = new Map<string, Toast>();

    //public toastEvent: BehaviorSubject<Map<Date, Toast>> = new BehaviorSubject<Map<Date, Toast>>( new Map<Date, Toast>() );

    constructor() {
    }

    private setToast(t: Toast) {
        this.toasts.set(t.hash, t);
        //this.toastEvent.next(this.toasts);
        if (t.delay > 0) {
            setTimeout(() => {
                this.toasts.delete(t.hash);
                //this.toastEvent.next(this.toasts);
            }, t.delay * 1000);
        }
    }

    /**
     * Generate a toast message
     * @param title Title of the message
     * @param message Message
     * @param generatedQuery Generated query
     * @param delay After how many seconds the message should fade out. The message will be displayed permanently if delay = 0
     * @param type Set the type of the message, e.g. 'bg-success', 'bg-warning', 'bg-danger'
     */
    private generateToast(title: string, message: string, generatedQuery: string, delay: number, type: String = '') {
        const t: Toast = new Toast(title, message, generatedQuery, delay, type);
        this.setToast(t);
    }

    /**
     * Generate a success toast message
     * @param message Message
     * @param generatedQuery Generated query that can be copied to the clipboard
     * @param title Title of the message, default: 'success'. If null, it will be set to 'success'
     * @param duration Optional. Set the duration of the toast message. Default: NORMAL
     */
    success(message: string, generatedQuery: string = null, title = 'success', duration: ToastDuration = ToastDuration.NORMAL) {
        if (!title) {
            title = 'success';
        }
        this.generateToast(title, message, generatedQuery, duration.valueOf(), 'bg-success');
    }

    /**
     * Generate a warning toast message. Use this method for errors caught by the UI.
     * @param message Message
     * @param title Title of the message, default: 'warning'. If null, it will be set to 'warning'
     * @param duration Optional. Set the duration of the toast message. Default LONG
     */
    warn(message: string, title = 'warning', duration: ToastDuration = ToastDuration.LONG) {
        if (!title) {
            title = 'warning';
        }
        this.generateToast(title, message, null, duration.valueOf(), 'bg-warning');
    }

    /**
     * Generate a error toast message. Use this method for uncaught errors from the backend.
     * @param message Message
     * @param title Title of the message, default: 'error'. If null, it will be set to 'error'
     * @param duration Optional. Set the duration of the toast message. Default LONG
     */
    error(message: string, title = 'error', duration: ToastDuration = ToastDuration.LONG) {
        if (!title) {
            title = 'error';
        }
        this.generateToast(title, message, null, duration.valueOf(), 'bg-danger');
    }

    /**
     * Generate an warning toast message. Use this method for ResultSets containing an error message (and optionally an exception with Stacktrace)
     * If the ResultSet contains a StackTrace, it will appear in a modal when clicking on the toast message
     * @param result ResultSet with the error message
     * @param message Additional message to the exception message (optional)
     * @param title Title of the message, default: 'error'. If null, it will be set to 'error'
     * @param duration Optional. Set the duration of the toast message. Default LONG
     */
    exception(result: ResultSet, message: string = null, title = 'error', duration = ToastDuration.LONG) {
        let msg = result.error;
        if (message) {
            if (message.endsWith(' ')) {
                msg = message + msg;
            } else {
                msg = message + ' ' + msg;
            }
        }
        if (!title) {
            title = 'error';
        }
        const t: Toast = new Toast(title, msg, result.generatedQuery, duration, 'bg-warning');
        if (result.exception) {
            t.setException(result.exception);
        }
        this.setToast(t);
    }

    deleteToast(key) {
        this.toasts.delete(key);
        //this.toastEvent.next( this.toasts );
    }

}

/**
 * Duration of a toast message
 * INFINITE: will only close when the user clicks on it
 * SHORT: for a very short notice
 * NORMAL: the default for success messages
 * LONG: a longer message, default for warning and error messages
 */
export enum ToastDuration {
    INFINITE = 0,
    SHORT = 2,
    NORMAL = 5,
    LONG = 10
}
