import { CommonModule } from '@angular/common';
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { StudentService } from '../../service/service';

@Component({
  selector: 'app-preview',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './preview.html',
  styleUrls: ['./preview.css']
})
export class Preview implements OnInit {

  students: any[] = [];

  constructor(
    private api: StudentService,
    private router: Router,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    console.log('Preview loaded — fetching students');

    this.api.getAll().subscribe({
      next: (res: any) => {
        this.students = res;
        console.log('Students:', this.students);
        this.cd.detectChanges();
      },
      error: (err) => console.error('API ERROR:', err)
    });
  }

  getQualification(list: any[]) {
    if (!list || !list.length) return '-';

    const last = list[list.length - 1];
    return `${last.degree} - ${last.institution}`;
  }

  goAdd() {
    this.router.navigate(['/add']);
  }

  goEdit(id: string) {
    this.router.navigate(['/edit', id]);
  }
}
