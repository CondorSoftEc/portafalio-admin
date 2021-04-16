import {Injectable} from '@angular/core';
import {Image} from '../models/image';
import firebase from 'firebase';
import firestore = firebase.firestore;
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {AngularFireStorage} from '@angular/fire/storage';
import {AngularFirestore, AngularFirestoreCollection} from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class ImagesService {

  images: AngularFirestoreCollection;

  constructor(private storage: AngularFireStorage,
              private afStore: AngularFirestore) {
    this.images = this.afStore.collection('images');
  }

  // imageReference: any;
  category = 'general';
  newImage: any;

  uploadImage(image: any): any {
    const randomId = Math.random().toString(36).substring(2);
    const shortName = `${new Date().getTime()}_${randomId}`;
    // console.log(shortName);
    this.newImage = {
      // url: '',
      name: shortName,
      date: this.timestamp,
      category: this.category,
      ref: `${this.category}/${shortName}`
      // ref: this.storage.ref(this.newImage.name)
    };

    // this.imageReference = ;
    return this.storage.upload(this.newImage.ref, image);
  }


  // getMyImages(): Observable<Image[]> {
  //   return this.afStore.collection('images', ref => ref.where('public',
  //     '==', false)).snapshotChanges().pipe(map(arr => {
  //     // console.log(arr);
  //     return arr.map(snap => {
  //       const data = snap.payload.doc.data();
  //       const id = snap.payload.doc.id;
  //       // @ts-ignore
  //       return {id, ...data} as Image;
  //     });
  //   }, err => console.log(err)));
  // }

  postImage(): Promise<any> {
    // console.log('Attempting to save ', this.newImage);
    return this.images.add(this.newImage);
  }

  deleteImage(image: Image): any {
    console.log('Deleting img');
    const localImage = this.storage.ref(image.name);
    localImage.delete().subscribe(data => {
      // this.images.doc(image.id).delete();
    });
  }


  deleteImageRef(imageRef): any {
    this.storage.ref(imageRef).delete().subscribe(data => {
      console.log('delete');
    });
  }

  delay(t, v): any {
    return new Promise((resolve) => {
      setTimeout(resolve.bind(null, v), t);
    });
  }

  getResizedImage(triesRemaining, storageRef): any {
    if (triesRemaining < 0) {
      return Promise.reject('out of tries');
    }
    return storageRef.getDownloadURL().toPromise().then((url) => {
      return url;
    }).catch((error) => {
      switch (error.code) {
        case 'storage/object-not-found':
          // @ts-ignore
          return this.delay(2000).then(() => {
            return this.getResizedImage(triesRemaining - 1, storageRef);
          });
        default:
          console.log(error);
          return Promise.reject(error);
      }
    });
  }

  getResizedImageRef(imageName, size): any {
    const storageRef = this.storage.ref(`/${this.category}/resized/${imageName}_${size}`);
    return this.getResizedImage(10, storageRef);
  }


  getIcon(imageName): any {
    return this.getResizedImageRef(imageName, '300x250');
  }

  getMainImage(imageName): any {
    return this.getResizedImageRef(imageName, '1200x1000');
  }


  get timestamp(): any {
    return firestore.FieldValue.serverTimestamp();
  }

}
