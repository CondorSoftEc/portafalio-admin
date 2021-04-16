import {Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {ProjectsService} from '../../services/projects.service';
import {Project} from '../../models/project';
import {Subscription} from 'rxjs';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {AlertService} from '../../_alert';
import {AuthenticationService} from '../../services/authentication.service';
import {Categories} from '../../enums/categories.enum';
import {finalize} from 'rxjs/operators';
import {ImagesService} from '../../services/images.service';
import {Icons} from '../../enums/icons.enum';

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
    references: [],
    tech: [],
    captures: [],
    type: null,
    image: null,
  } as Project;

  sub: Subscription;

  projectForm;


  options = {
    autoClose: true,
    keepAfterRouteChange: true
  };

  auxTech;
  auxAchievement;
  auxReference;
  auxCapture;

  logged = false;

  categories = Categories;
  icons = Icons;


  @ViewChild('imgInput')
  imgInput: ElementRef;
  fileForm = new FormData();
  maxSize = 25;
  uploadProgress = 0;
  upload = false;

  imageCategory: string;

  constructor(private route: ActivatedRoute,
              private projectsService: ProjectsService,
              protected alertService: AlertService,
              private authService: AuthenticationService,
              private imagesService: ImagesService,
              private router: Router) {
    this.projectForm = new FormGroup({
      name: new FormControl(this.project.name, Validators.required),
      description: new FormControl(this.project.description),
      url: new FormControl(this.project.url),
      category: new FormControl(this.project.type),
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

  get category(): any {
    return this.projectForm.get('category');
  }


  removeTech(index): void {
    this.project.tech.splice(index, 1);
  }

  removeAchievement(index): void {
    this.project.achievements.splice(index, 1);
  }

  removeReference(index): void {
    this.project.references.splice(index, 1);
  }

  removeCapture(index): void {
    this.project.captures.splice(index, 1);
  }

  saveProject(data): void {
    this.project.name = data.name;
    this.project.url = data.url;
    this.project.description = data.description;
    this.project.type = data.category;
    this.updateData();
  }

  setAuxTech(): void {
    this.auxTech = {
      name: null,
      url: null,
    };
  }

  setReference(): void {
    this.auxReference = {
      icon: null,
      url: null,
    };
  }


  addTech(): void {
    this.project.tech.push(this.auxTech);
  }

  addAchievement(): void {
    this.project.achievements.push(this.auxAchievement);
  }

  addReference(): void {
    this.project.references.push(this.auxReference);
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
          // this.router.navigate(['/main']);
        });
      } else {
        this.projectsService.postProject(this.project).then(() => {
          this.alertService.success('Proyecto actualizado', this.options);
          // this.router.navigate(['/main']);
        });
      }
    } else {
      this.alertService.info('Logeate para actualizar el proyecto', this.options);
    }
  }

  setImageCategory(category): void {
    this.imageCategory = category;
    this.imagesService.category = category;
    if (this.imageCategory === 'captures') {
      this.auxCapture = {
        image: null,
        thumbImage: null,
        alt: null,
        title: null,
      };
    }
  }

  fileChange(event): void {
    if (event.target.files.length > 0) {
      const size = (event.target.files[0].size / 1024) / 1024;
      if (size < this.maxSize) {
        this.fileForm.append('archivo', event.target.files[0], event.target.files[0].name);
        this.uploadFile();
      } else {
        window.alert(`La imagen supera el tamaño maximo permitido de ${this.maxSize} Mb`);
      }
    }
  }

  resetImgInput(): void {
    this.imgInput.nativeElement.value = '';
  }

  addCapture(): void {
    this.project.captures.push(this.auxCapture);
    this.updateData();
  }

  uploadFile(): void {
    const file = this.fileForm.get('archivo');
    if (file) {
      this.upload = true;
      this.imagesService.uploadImage(file)
        .percentageChanges().pipe(
        finalize(() => {
          this.imagesService.postImage();
          this.imagesService.getMainImage(this.imagesService.newImage.name).then((url) => {
            if (this.imageCategory === 'general') {
              this.project.image = url;
              this.imagesService.getIcon(this.imagesService.newImage.name).then((iconUrl) => {
                this.project.icon = iconUrl;
                this.upload = false;
                this.resetImgInput();
              });
            }
            if (this.imageCategory === 'captures') {
              this.auxCapture.image = url;
              this.imagesService.getIcon(this.imagesService.newImage.name).then((thumbUrl) => {
                this.auxCapture.thumbImage = thumbUrl;
                this.upload = false;
                this.resetImgInput();
              });
            }
          });
        })
      ).subscribe(percent => {
        // console.log(percent);
        if (percent !== 0) {
          this.uploadProgress = (percent / 100);
        }
      });
    } else {
      console.log('Selecciona un archivo valido');
    }
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      if (params.get('projectId')) {
        this.sub = this.projectsService.getProject(params.get('projectId')).subscribe(data => {
          if (data) {
            this.project = {...this.project, ...data};
            console.log('Project ', data);
            this.name.setValue(this.project.name);
            this.description.setValue(this.project.description);
            this.url.setValue(this.project.url);
            this.category.setValue(this.project.type);
          }
        });
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
