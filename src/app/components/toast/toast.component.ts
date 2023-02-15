import {Component, OnInit, ViewChild} from '@angular/core';
import {KeyValue} from '@angular/common';
import {ToastService} from './toast.service';
import {Toast} from './toast.model';
import {ResultException} from '../data-view/models/result-set.model';
import {ModalDirective} from 'ngx-bootstrap/modal';
import {UtilService} from '../../services/util.service';

@Component({
    selector: 'app-toast',
    templateUrl: './toast.component.html',
    styleUrls: ['./toast.component.scss']
})
export class ToastComponent implements OnInit {

    toasts = this._toast.toasts;
    exception: ResultException;
    @ViewChild('stackTraceModal', {static: false}) public stackTraceModal: ModalDirective;

    constructor(
        private _toast: ToastService,
        private _util: UtilService
    ) {
    }

    ngOnInit() {
    }

    closeToast(key) {
        this._toast.deleteToast(key);
        //todo close by swiping:
        //https://stackoverflow.com/questions/22078941/minimum-drag-swipe-distance-with-hammer-js
        //(swipeleft)="closeToast(toast.key)"
    }

    /**
     * show newest toasts before the older ones
     */
    orderToasts(a: KeyValue<string, any>, b: KeyValue<string, any>) {
        return b.value.time - a.value.time;
    }

    getToastClass(toast: Toast) {
        let cssClass = toast.type;
        if (toast.exception) {
            cssClass = cssClass + ' exception';
        }
        return cssClass;
    }

    showStackTraceModal(toast: Toast) {
        if (toast.exception) {
            this.exception = toast.exception;
            this.stackTraceModal.show();
        }
    }

    copyGeneratedQuery(toast: Toast) {
        this._util.clipboard(toast.generatedQuery);
    }

}
