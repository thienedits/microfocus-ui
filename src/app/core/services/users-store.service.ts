import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { map } from 'rxjs/operators';
import { UsersService } from './users.service';

@Injectable({
    providedIn: 'root',
})
export class UsersStoreService {
    private _users = new BehaviorSubject<any[]>([]);

    readonly users$ = this._users.asObservable();

    constructor(private usersService: UsersService, private auth: AuthService) {
        this.getAll();
    }

    get users(): any[] {
        return this._users.getValue();
    }

    set users(val: any[]) {
        this._users.next(val);
    }

    async getAll() {
        this.users = await this.usersService.getAll().toPromise();
    }

    getById(id: number): Observable<any> {
        return this.users$.pipe(
            map((users) => {
                return users.find((user) => user.id === id);
            })
        );
    }
}
