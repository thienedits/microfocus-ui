import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root',
})
export class PostsService {
    private API_URL = environment.API_URL;

    constructor(private http: HttpClient) {}

    getAll(): Observable<any[]> {
        return this.http.get<any[]>(`${this.API_URL}/posts`).pipe(
            map((data) => {
                return data.sort((a, b) => b.id - a.id);
            })
        );
    }
}
