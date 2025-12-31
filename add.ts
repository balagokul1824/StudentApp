import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { StudentService } from '../../service/service';

@Component({
  selector: 'app-add',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './add.html',
  styleUrls: ['./add.css']
})
export class Add {

  submitted = false;

  student: any = {
    name: '',
    dob: '',
    gender: '',
    mobile: '',
    email: '',
    bloodGroup: '',
    nationality: '',
    physicallyChallenged: ''
  };

  qualifications = [
    { degree: '', institution: '' }
  ];

  imageFile: any;

  today = new Date().toISOString().split('T')[0];

  bloodGroups = ['A+','A-','B+','B-','O+','O-','AB+','AB-'];

  constructor(private api: StudentService, private router: Router) {}

  addRow() {
    this.qualifications.push({ degree: '', institution: '' });
  }

  removeRow(i: number) {
    this.qualifications.splice(i, 1);
  }

  onFile(e: any) {
    this.imageFile = e.target.files[0];
  }

  submit() {

    this.submitted = true;

    if (!this.student.name ||
        !this.student.dob ||
        !this.student.gender ||
        !this.student.mobile ||
        this.student.mobile.length !== 10) {
      return;
    }

    for (let q of this.qualifications) {
      if (!q.degree || !q.institution) return;
    }

    const form = new FormData();

    Object.keys(this.student).forEach(k => {
      form.append(k, this.student[k]);
    });

    form.append('qualification', JSON.stringify(this.qualifications));

    if (this.imageFile) form.append('image', this.imageFile);

    this.api.create(form).subscribe(() => {
      this.router.navigate(['/']);
    });
  }
}
