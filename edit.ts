import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { StudentService } from '../../service/service';

@Component({
  selector: 'app-edit',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './edit.html',
  styleUrls: ['./edit.css']
})
export class Edit implements OnInit {

  id = '';

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
    today = new Date().toISOString().split('T')[0];

  qualifications: any[] = [
    { degree: '', institution: '' }
  ];

  imageFile: File | null = null;

  bloodGroups = [
    "A+","A-","B+","B-","O+","O-","AB+","AB-","A1B+","A1B-"
  ];

  constructor(
    private api: StudentService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {

    this.id = this.route.snapshot.params['id'];

    this.api.getById(this.id).subscribe((res: any) => {

      this.student = res;

      this.qualifications = res.qualification?.length
        ? res.qualification
        : [{ degree:'', institution:'' }];
    });
  }

  addRow() {
    this.qualifications.push({ degree:'', institution:'' });
  }

  removeRow(i: number) {
    this.qualifications.splice(i, 1);
  }

  onFile(e: any) {
    this.imageFile = e.target.files[0];
  }

  update() {
    const form = new FormData();
    // append basic fields
    Object.keys(this.student).forEach(k => {
      if (k !== 'qualification' && this.student[k] !== null && this.student[k] !== undefined) {
        form.append(k, String(this.student[k]));
      }
    });

    // send qualification as JSON string
    form.append('qualification', JSON.stringify(this.qualifications));

    if (this.imageFile) {
      form.append('image', this.imageFile);
    }

    this.api.update(this.id, form).subscribe(() => {
      alert("Updated successfully");
      this.router.navigate(['/']);
    });
  }
}
