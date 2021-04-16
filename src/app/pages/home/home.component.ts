import {Component, OnDestroy, OnInit} from '@angular/core';
import {Project} from '../../models/project';
import {ProjectsService} from '../../services/projects.service';
import {Subscription} from 'rxjs';
import {Router} from '@angular/router';
import {Categories} from '../../enums/categories.enum';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {

  projects: Array<Project> = [];
  sub: Subscription;

  searchText = '';

  categories = Categories;

  constructor(private projectsService: ProjectsService,
              private router: Router) {
  }

  newProject(): void {
    this.router.navigate(['/main/editar/proyecto']);
  }

  editProject(projectId): void {
    this.router.navigate(['/main/editar/proyecto', {projectId}]);
  }

  ngOnInit(): void {
    this.sub = this.projectsService.getProjects().subscribe(data => {
      this.projects = data;
    });
  }

  ngOnDestroy(): void {
    if (this.sub) {
      this.sub.unsubscribe();
    }
  }

}
