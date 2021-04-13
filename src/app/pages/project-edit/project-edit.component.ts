import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {ProjectsService} from '../../services/projects.service';
import {Project} from '../../models/project';
import {Subscription} from 'rxjs';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {AlertService} from '../../_alert';
import {AuthenticationService} from '../../services/authentication.service';

@Component({
  selector: 'app-project-edit',
  templateUrl: './project-edit.component.html',
  styleUrls: ['./project-edit.component.scss']
})
export class ProjectEditComponent implements OnInit, OnDestroy {

  project: Project = {
    name: '',
    url: '',
    description: '',
    achievements: [],
    tech: [],
  } as Project;

  sub: Subscription;

  projectForm;

  edit = false;

  options = {
    autoClose: true,
    keepAfterRouteChange: true
  };

  auxTech;
  auxAchievement;

  logged = false;

  constructor(private route: ActivatedRoute,
              private projectsService: ProjectsService,
              protected alertService: AlertService,
              private authService: AuthenticationService) {
    this.projectForm = new FormGroup({
      name: new FormControl(this.project.name, Validators.required),
      description: new FormControl(this.project.description),
      url: new FormControl(this.project.url),
    });
  }

  get name(): any {
    return this.projectForm.get('name');
  }

  get description(): any {
    return this.projectForm.get('description');
  }

  get url(): any {
    return this.projectForm.get('url');
  }

  enableEdit(): void {
    this.edit = !this.edit;
    if (this.edit) {
      this.name.setValue(this.project.name);
      this.description.setValue(this.project.description);
      this.url.setValue(this.project.url);
    }
  }

  removeBadge(index): void {
    this.project.tech.splice(index, 1);
  }

  removeAchievement(index): void {
    this.project.achievements.splice(index, 1);
  }

  saveProject(data): void {
    this.project.name = data.name;
    this.project.url = data.url;
    this.project.description = data.description;
    this.updateData();
    this.enableEdit();
  }

  setAuxTech(): void {
    this.auxTech = {
      name: null,
      link: null,
    };
  }


  addTech(): void {
    this.project.tech.push(this.auxTech);
  }

  addAchievement(): void {
    this.project.achievements.push(this.auxAchievement);
  }

  setAchievement(): void {
    this.auxAchievement = {
      name: null,
      description: null,
    };
  }


  updateData(): void {
    if (this.logged) {
      if ('id' in this.project) {
        this.projectsService.updateProject(this.project).then(() => {
          this.alertService.success('Proyecto actualizado', this.options);
        });
      } else {
        this.projectsService.postProject(this.project).then(() => {
          this.alertService.success('Proyecto actualizado', this.options);
        });
      }
    } else {
      this.alertService.info('Logeate para actualizar el proyecto', this.options);
    }
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      // console.log(params.get('projectId'));
      if (params.get('projectId')) {
        this.sub = this.projectsService.getProject(params.get('projectId')).subscribe(data => {
          if (data) {
            this.project = data;
          }
        });
      } else {
        this.edit = true;
      }
    });

    if (this.authService.authState) {
      this.logged = true;
    }
  }

  ngOnDestroy(): void {
    if (this.sub) {
      this.sub.unsubscribe();
    }
  }

}
