import {EventEmitter, Injectable, Output} from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class RightSidebarToRelationalalgebraService {

    constructor() {
    }

    @Output() change: EventEmitter<boolean> = new EventEmitter();

    toggle() {
        this.change.emit(true);
    }

}
