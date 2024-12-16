import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators ,AbstractControl  } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CoreService } from '../core/core.service';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-user-add-edit',
  templateUrl: './user-add-edit.component.html',
  styleUrls: ['./user-add-edit.component.scss'],
})
export class UserAddEditComponent implements OnInit {
  empForm: FormGroup;
  education: string[] = [
    'Undergraduate',
    'Postgraduate',
    'Doctoral',
    'M. Phil',
  ];
  constructor(
    private _fb: FormBuilder,
    private _userService: UserService,
    private _dialogRef: MatDialogRef<UserAddEditComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _coreService: CoreService
  ) {
    this.empForm = this._fb.group({
      firstName: [
        '',
        [
          Validators.required, 
          Validators.minLength(1), 
          Validators.maxLength(25)
        ]
      ],  
      lastName: [
        '',
        [
          Validators.required, 
          Validators.minLength(1), 
          Validators.maxLength(25)
        ]
      ], 
      email: [
        '', 
        [
          Validators.required, 
          Validators.email
        ]
      ],
      dob:  [
        '', 
        [
          Validators.required,
          this.validateDOB // Custom validator to check future dates
        ]
      ],
      gender: '',
      education: ''
    });
  }
  
    // Custom Validator for DOB (No Future Dates)
    validateDOB(control: AbstractControl): { [key: string]: boolean } | null {
      const selectedDate = new Date(control.value);
      const today = new Date();
        if (selectedDate > today) {
        return { futureDate: true }; // Validation error if the date is in the future
      }
      return null; // No validation error
    }

  get formControls() {
    return this.empForm.controls;
  }

  ngOnInit(): void {
    this.empForm.patchValue(this.data);
  }
  onFormSubmit() {
    if (this.empForm.valid) {
      if (this.data) {
        this._userService
          .updateUser(this.data.id, this.empForm.value)
          .subscribe({
            next: (val: any) => {
              this._coreService.openSnackBar('User detail updated!');
              this._dialogRef.close(true);
            },
            error: (err: any) => {
              console.error(err);
            },
          });
      } else {
        this._userService.addUser(this.empForm.value).subscribe({
          next: (val: any) => {
            this._coreService.openSnackBar('User added successfully');
            this._dialogRef.close(true);
          },
          error: (err: any) => {
            console.error(err);
          },
        });
      }
    }
  }
}
