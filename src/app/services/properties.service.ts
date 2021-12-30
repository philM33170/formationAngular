import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Property } from '../interfaces/property';
import { getDatabase, onValue, ref, set, update } from "firebase/database";
import * as firebase from 'firebase/storage';
import { deleteObject, getDownloadURL, uploadBytesResumable } from 'firebase/storage';

@Injectable({
  providedIn: 'root'
})
export class PropertiesService {

  properties: Property[] = []

  propertiesSubject = new Subject<Property[]>();

  constructor() { }

  emitProperties() {
    this.propertiesSubject.next(this.properties);
  }

  saveProperties() {
    const bdd = getDatabase();
    set(ref(bdd, "properties"), this.properties);
  }

  getProperties() {
    const bdd = getDatabase();
    //set(ref(bdd, "properties"), this.properties);
    onValue(ref(bdd, "properties"), (data) => {
      this.properties = data.val() ? data.val() : [];
        this.emitProperties();
    });
  }

  getSingleProperties(id: number) {
    return new Promise<any>((resolve, reject) => {
      const bdd = getDatabase();
      const refDatabase = ref(bdd, "properties/" + id);
      onValue(refDatabase, (data) => {
        resolve(data.val());
      }, (error) => {
        reject(error);
      })
    })
  }

  createProperty(property: Property) {
    this.properties.push(property);
    this.saveProperties();
    this.emitProperties();
  }

  deleteProperty(index: number) {
    this.properties.splice(index, 1);
    this.saveProperties();
    this.emitProperties();
  }

  updateProperty(property: Property, index: number) {
      /*this.properties[index] = property;
      this.saveProperties();
      this.emitProperties();*/
      const bdd = getDatabase();
      update(ref(bdd, "properties/" + index), property).catch((error) => {
        console.error(error);
      })
  }

  uploadFile(file: File) {
      return new Promise<string>((resolve, reject) => {
        const uniqueId = Date.now().toString();
        const storage = firebase.getStorage();
        const storageRef = firebase.ref(storage, "images/properties/" + uniqueId + file.name);
        const upload = uploadBytesResumable(storageRef, file);
        upload.on("state_changed",
                  () => {
                    console.log("Chargement...");
                  }, (error) => {
                    console.error(error);
                    reject(error);
                  }, () => {
                    getDownloadURL(upload.snapshot.ref).then((downloadUrl) => {
                          resolve(downloadUrl);
                    });
                  })
      })
  }

  removeFile(fileLink: string) {
    if(fileLink) {
      const storage = firebase.getStorage();
      const refStorage = firebase.ref(storage, fileLink);
      deleteObject(refStorage)
      .then(() => {
        console.log("File deleted");
      })
      .catch((error) => {
        console.error(error);
      })
    }
  }
}
