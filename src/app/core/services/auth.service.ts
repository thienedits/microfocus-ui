import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class AuthService {
    private _isLoginSubject = new BehaviorSubject<boolean>(false);
    
    readonly isLoggedIn$ = this._isLoginSubject.asObservable();

    constructor() {
        const id = this.id;
        if (id) {
            this._isLoginSubject.next(true);
        }
    }

    login(id: number): void {
        sessionStorage.setItem('userId', String(id));
        this._isLoginSubject.next(true);
    }

    logout(): void {
        sessionStorage.removeItem('userId');
        this._isLoginSubject.next(false);
    }

    get isLoggedIn () {
        return this._isLoginSubject.getValue();
    }

    get id() {
        const id = sessionStorage.getItem('userId');

        return id ? Number(id) : null;
    }
}
