import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { concatMap, switchMap, takeUntil } from 'rxjs/operators';
import { AuthService } from 'src/app/core/services/auth.service';
import { PostsStoreService } from 'src/app/core/services/posts-store.service';
import { UsersStoreService } from 'src/app/core/services/users-store.service';

@Component({
    selector: 'app-post',
    templateUrl: './post.component.html',
    styleUrls: ['./post.component.scss'],
})
export class PostComponent implements OnInit, OnDestroy {
    onDestroy$ = new Subject<void>();
    isLoggedIn$: Observable<boolean>;
    user$: Observable<any>;
    postForm: FormGroup;
    isNewPost: boolean;

    constructor(
        private usersStoreService: UsersStoreService,
        private postsStoreService: PostsStoreService,
        private auth: AuthService,
        private router: Router,
        private route: ActivatedRoute
    ) {
        this.isLoggedIn$ = this.auth.isLoggedIn$;
        this.user$ = this.usersStoreService.getById(this.auth.id);
        this.postForm = new FormGroup({
            id: new FormControl(null),
            userId: new FormControl(null),
            title: new FormControl('', {
                validators: [Validators.required, Validators.minLength(1)],
                asyncValidators: [],
            }),
            body: new FormControl('', {
                validators: [Validators.required, Validators.minLength(1)],
                asyncValidators: [],
            }),
        });

        this.route.paramMap
            .pipe(
                concatMap((params: ParamMap) => {
                    const id = Number(params.get('postId'));
                    this.isNewPost = id === 0 ? true : false;

                    return this.postsStoreService.getById(id);
                }),
                takeUntil(this.onDestroy$)
            )
            .subscribe((post) => {
                if (post) {
                    this.postForm.patchValue(post);
                }
            });

        this.postForm.valueChanges.subscribe((val) => {});
    }

    ngOnInit() {}

    ngOnDestroy() {
        this.onDestroy$.next();
    }

    onSubmit() {
        const post = this.postForm.value;
        if (this.isNewPost) {
            this.postsStoreService.addPost(post);
        } else {
            this.postsStoreService.updatePost(post);
        }
        this.postForm.markAsPristine();
        this.router.navigate(['/']);
    }

    deletePost() {
        if (confirm('Are you sure you want to delete this post?')) {
            const post = this.postForm.value;
            this.postsStoreService.deletePost(post);
            this.router.navigate(['/']);
        }
    }

    get title() {
        return this.postForm.get('title');
    }

    get message() {
        return this.postForm.get('body');
    }

    get saveDisabled() {
        return !this.postForm.valid || !this.isDirty;
    }

    get isDirty() {
        return this.postForm.dirty;
    }
}
