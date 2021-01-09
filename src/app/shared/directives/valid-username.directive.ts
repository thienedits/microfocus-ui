import { AbstractControl, AsyncValidatorFn, ValidationErrors, ValidatorFn } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { debounceTime, map, switchMap, take } from 'rxjs/operators';

export function usernameValidator(users$: Observable<any[]>): AsyncValidatorFn {
    // return (control: AbstractControl): { [key: string]: any } | null => {
    //     console.log(control.value);
    //     console.log(users);
    //     const isValid = users.some((user) => user.username === control.value);
    //     return isValid ? null : { usernameNotValid: { value: control.value } };
    // };
    return (control: AbstractControl): Promise<ValidationErrors | null> | Observable<ValidationErrors | null> => {
        if (!control.valueChanges) {
            return of(null);
        }

        return control.valueChanges.pipe(
            debounceTime(500),
            switchMap(() => users$),
            take(1),
            map((users) => {
                const isValid = users.some((user) => user.username === control.value);

                return isValid ? null : { usernameNotValid: { value: control.value } };
            })
        );
    };
}
