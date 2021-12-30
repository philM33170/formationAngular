import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { PropertiesService } from 'src/app/services/properties.service';
import * as bootstrap from 'bootstrap';
import { Property } from '../../interfaces/property';

@Component({
  selector: 'app-admin-properties',
  templateUrl: './admin-properties.component.html',
  styleUrls: ['./admin-properties.component.css']
})
export class AdminPropertiesComponent implements OnInit {

  propertiesForm: FormGroup;
  propertiesSubscription: Subscription;
  properties: Property[] = [];
  indexToRemove: number;
  indexToUpdate: number;
  editMode = false;
  photoUploading = false;
  photoUploaded = false;
  photosAdded: any[] = [];

  constructor(private formBuilder: FormBuilder, private propertiesService : PropertiesService) { }

  ngOnInit(): void {
    this.initPropertiesForm();
    this.propertiesService.propertiesSubject.subscribe({
      next: (data: Property[]) => this.properties = data,
      error: (e) => console.log(e),
      complete: () => console.log("Observable complete !")
    })
    this.propertiesService.getProperties();
    this.propertiesService.emitProperties();
  }

  initPropertiesForm() {
    this.propertiesForm = this.formBuilder.group({
      title: ["", Validators.required],
      category: ["", Validators.required],
      surface: ["", Validators.required],
      rooms: ["", Validators.required],
      description: "",
      price: ["", Validators.required],
      sold: ""
    })
  }
  onSubmitPropertiesForm() {
    //const newProperty: Property = this.propertiesForm.value;
    const newProperty: Property = {
      title: this.propertiesForm.get("title").value,
      category: this.propertiesForm.get("category").value,
      surface: this.propertiesForm.get("surface").value,
      rooms: this.propertiesForm.get("rooms").value,
      description: this.propertiesForm.get("description").value,
      price: this.propertiesForm.get("price").value,
      sold: this.propertiesForm.get("sold").value ? this.propertiesForm.get("sold").value : false,
      photos: this.photosAdded ? this.photosAdded : []
    }

    if(this.editMode) {
      this.propertiesService.updateProperty(newProperty, this.indexToUpdate);
    } else {
      this.propertiesService.createProperty(newProperty);
    }
    let myModal = document.getElementById("propertiesFormModal");
    let modal = bootstrap.Modal.getInstance(myModal);
    modal.hide();
  }

  resetForm() {
    this.editMode = false;
    this.propertiesForm.reset();
    this.photosAdded = [];
  }

  onDeleteProperty(index: number) {
    let myModal = document.getElementById("deletePropertyModal");
    let md = new bootstrap.Modal(document.getElementById("deletePropertyModal"));
    md.show(myModal);
    this.indexToRemove = index;
  }

  onConfirmDeleteProperty() {
    this.properties[this.indexToRemove].photos.forEach(
      (photo) => {
        this.propertiesService.removeFile(photo);
      }
    )
    this.propertiesService.deleteProperty(this.indexToRemove);
    let myModal = document.getElementById("deletePropertyModal");
    let modal = bootstrap.Modal.getInstance(myModal);
    modal.hide();
  }

  onEditProperty(property: Property) {
    this.editMode = true;
    let myModal = document.getElementById("propertiesFormModal");
    let md = new bootstrap.Modal(document.getElementById("propertiesFormModal"));
    md.show(myModal);
    this.propertiesForm.get("title").setValue(property.title);
    this.propertiesForm.get("category").setValue(property.category);
    this.propertiesForm.get("surface").setValue(property.surface);
    this.propertiesForm.get("rooms").setValue(property.rooms);
    this.propertiesForm.get("description").setValue(property.description ? property.description : "");
    this.propertiesForm.get("price").setValue(property.price);
    this.propertiesForm.get("sold").setValue(property.sold);
    this.photosAdded = property.photos ? property.photos : [];
    const index = this.properties.findIndex((propertyEl) => {
      if(propertyEl === property) {
        return true;
      }
    })
    this.indexToUpdate = index;
  }

  onUploadFile(event: any) {
    this.photoUploading = true;
    this.propertiesService.uploadFile(event.target.files[0])
                          .then((url: string) => {
                            this.photosAdded.push(url);
                            this.photoUploading = false;
                            setTimeout(() => {
                              this.photoUploaded = false;
                            }, 5000);
                          })
  }

  onRemoveAddedPhoto(index: number) {
    this.propertiesService.removeFile(this.photosAdded[index]);
    this.photosAdded.splice(index, 1);
  }
}


