import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subject, combineLatest} from 'rxjs';
import { PostsStoreService } from 'src/app/core/services/posts-store.service';
import { UsersStoreService } from 'src/app/core/services/users-store.service';
import { map, takeUntil, tap} from 'rxjs/operators';
import { AuthService } from 'src/app/core/services/auth.service';
import { PostAction } from 'src/app/core/services/posts.model';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit, OnDestroy {
    private _pageIndex = 0;
    private _postsLength = 0;
    private _pageSize = 10;
    private _page = new Subject<number>();
    private _onDestroy = new Subject<void>();

    isLoggedIn$: Observable<boolean>;
    posts$: Observable<any>;
    postAction$: Observable<PostAction>;
    page$ = this._page.asObservable();
    user$: Observable<any>;

    constructor(
        private usersStoreService: UsersStoreService,
        private postsStoreService: PostsStoreService,
        private auth: AuthService,
    ) {
        this.isLoggedIn$ = auth.isLoggedIn$;
        this.user$ = this.usersStoreService.getById(this.auth.id);
        this.postAction$ = this.postsStoreService.postAction$;
    }

    ngOnInit() {
        // paginated posts data
        this.posts$ = combineLatest(this.page$, this.usersStoreService.users$, this.postsStoreService.posts$).pipe(
            map(([page, users, posts]) => {
                const startIndex = page * this._pageSize;
                const endIndex = (page + 1) * this._pageSize;
                this._postsLength = posts.length;

                // Merge posts with user
                posts = posts.map((post) => {
                    const user = users.find((user) => user.id === post.userId);

                    post = { ...post, user };

                    return post;
                });

                return posts.slice(startIndex, endIndex);
            })
        );

        this.postAction$.pipe(
            tap((action: PostAction) => {
                setTimeout(() => {
                    this.dismissPostAction();
                }, 5000);
            }),
            takeUntil(this._onDestroy),
        ).subscribe();

        setTimeout(() => {
            this.page = 0;
        });
    }

    ngOnDestroy() {
        this._onDestroy.next();
    }

    dismissPostAction() {
        this.postsStoreService.dismiss();
    }

    formatAbsoluteUrl(url: string) {
        if (!url || url === '') {
            return null;
        }
        return 'https://' + url.replace('https://', '').replace('http://', '').replace('://', '');
    }

    next() {
        this._pageIndex++;
        this.page = this._pageIndex;
    }

    prev() {
        this._pageIndex = --this._pageIndex < 0 ? 0 : this._pageIndex--;
        this.page = this._pageIndex;
    }

    getUser(id) {
        return this.users.find((user) => user.id === id);
    }

    logout() {
        this.auth.logout();
    }

    get users() {
        return this.usersStoreService.users;
    }

    get pageIndex() {
        return this._pageIndex;
    }

    set page(val: number) {
        this._page.next(val);
    }

    get lastPage() {
        return Math.ceil(this._postsLength / this._pageSize) - 1;
    }
}
