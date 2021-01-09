import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { BehaviorSubject, Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { map } from 'rxjs/operators';
import { PostAction } from './posts.model';
import { PostsService } from './posts.service';

@Injectable({
    providedIn: 'root',
})
export class PostsStoreService {
    private _posts = new BehaviorSubject<any[]>([]);
    private _postAction = new BehaviorSubject<PostAction>(undefined);

    readonly posts$ = this._posts.asObservable();
    readonly postAction$ = this._postAction.asObservable();

    constructor(private postsService: PostsService, private auth: AuthService) {
        this.getAll();
    }

    get posts(): any[] {
        return this._posts.getValue();
    }

    set posts(val: any[]) {
        this._posts.next(val);
    }

    set postAction(val: PostAction) {
        this._postAction.next(val);
    }

    async getAll() {
        this.posts = await this.postsService.getAll().toPromise();
    }

    addPost(post) {
        const posts = this.posts;
        const len = posts.length + 1;

        const p = {
            id: len,
            userId: this.auth.id,
            title: post.title,
            body: post.body,
        };

        this.posts = [p, ...posts];
        this.postAction = 'new';
    }

    deletePost(post) {
        const posts = this.posts;
        let count = 1;
        const newArr = posts
            .filter(({ id }) => id !== post.id)
            .map((post) => {
                post.id = count;
                count++;
                return post;
            })
            .sort((a, b) => b.id - a.id);

        this.posts = newArr;
        this.postAction = 'delete';
    }

    updatePost(post) {
        const posts = this.posts;
        const index = posts.findIndex(({ id }) => id == post.id);

        const p = {
            id: post.id,
            userId: this.auth.id,
            title: post.title,
            body: post.body,
        };

        const newArr = Object.assign([], posts, { [index]: p });

        this.posts = newArr;
        this.postAction = 'update';
    }

    getById(id: number): Observable<any> {
        return this.posts$.pipe(
            map((posts) => {
                if (id < 1) {
                    return { title: '', body: '', id: 0, userId: this.auth.id };
                }
                return posts.find((post) => post.id === id);
            })
        );
    }

    dismiss() {
        this.postAction = undefined;
    }
}
