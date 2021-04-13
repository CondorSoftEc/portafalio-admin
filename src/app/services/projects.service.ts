import {Injectable} from '@angular/core';
import {AngularFirestore} from '@angular/fire/firestore';
import {Observable} from 'rxjs';
import {trace} from '@angular/fire/performance';
import {map} from 'rxjs/operators';
import {Project} from '../models/project';

@Injectable({
  providedIn: 'root'
})
export class ProjectsService {

  constructor(private afStore: AngularFirestore) {
  }

  getProjects(): Observable<Project[]> {
    return this.afStore.collection('projects',
      ref => ref.orderBy('name', 'asc')).snapshotChanges().pipe(map(arr => {
        return arr.map(snap => {
          const data = snap.payload.doc.data();
          const id = snap.payload.doc.id;
          // @ts-ignore
          return {id, ...data} as Project;
        });
      }, err => console.log(err)),
      trace('projectsList'));
  }


  getProject(projectId): any {
    return this.afStore.collection('projects').doc(projectId).snapshotChanges().pipe(map(doc => {
        let aux;
        if (doc.payload.exists) {
          const data: any = doc.payload.data();
          const id = doc.payload.id;
          aux = {id, ...data} as Project;
        }
        return aux;
      }, err => console.log(err)),
      trace('projectGet'));
  }


  postProject(project: Project): Promise<any> {
    return this.afStore.collection('projects').add(project);
  }

  updateProject(project: Project): Promise<any> {
    return this.afStore.collection('projects').doc(project.id).update(project);
  }

}
