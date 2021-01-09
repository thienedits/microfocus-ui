import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/core/services/auth.service';
import { UsersStoreService } from 'src/app/core/services/users-store.service';
import { usernameValidator } from 'src/app/shared/directives/valid-username.directive';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
    loginForm: FormGroup;

    constructor(private usersStoreService: UsersStoreService, private router: Router, private auth: AuthService) {}

    ngOnInit() {
        this.loginForm = new FormGroup({
            name: new FormControl('', {
                validators: [Validators.required],
                asyncValidators: [usernameValidator(this.usersStoreService.users$)],
            }),
        });
    }

    onSubmit() {
        const user = this.users.find((user) => user.username === this.name.value);
        this.auth.login(user.id);
        this.router.navigate(['/']);
    }

    get users() {
        return this.usersStoreService.users;
    }

    get name() {
        return this.loginForm.get('name');
    }
}
