import { Injectable } from '@angular/core';
import { CanDeactivate } from '@angular/router';
import { PostComponent } from './post.component';

@Injectable({ providedIn: 'root' })
export class PostDeactivateGuard implements CanDeactivate<PostComponent> {
    constructor() {}

    canDeactivate(component: PostComponent) {
        if (component.isDirty) {
            //show modal
            if (confirm('You have unsaved changes! If you leave, your changes will be lost.')) {
                return true;
            } else {
                return false;
            }
        }

        return true;
    }
}
