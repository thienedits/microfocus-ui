import { TestBed } from '@angular/core/testing';

import { PostsStoreService } from './posts-store.service';

describe('PostsStoreService', () => {
    beforeEach(() => TestBed.configureTestingModule({}));

    it('should be created', () => {
        const service: PostsStoreService = TestBed.get(PostsStoreService);
        expect(service).toBeTruthy();
    });
});
