import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ICategoryRequest } from '../../interfaces/category/category.interface';
import { 
  CollectionReference, 
  DocumentData, 
  DocumentReference, 
  Firestore, 
  addDoc, 
  collection, 
  collectionData, 
  deleteDoc, 
  doc, 
  docData, 
  updateDoc
} from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  private categoryCollection!: CollectionReference<DocumentData>;

  constructor(
    private afs: Firestore
  ) { 
    this.categoryCollection = collection(this.afs, 'categories');
  }

  getAll(): Observable<DocumentData[]> {
    return collectionData(this.categoryCollection, { idField: 'id' });
  }

  getOne(id: string): Observable<DocumentData> {
    const categoryDocumentReference = doc(this.afs, `categories/${id}`);
    return docData(categoryDocumentReference, { idField: 'id' });
  }

  create(category: ICategoryRequest): Promise<DocumentReference<DocumentData>> {
    return addDoc(this.categoryCollection, category);
  }

  update(category: ICategoryRequest, id: string): Promise<void> {
    const categoryDocumentReference = doc(this.afs, `categories/${id}`);
    return updateDoc(categoryDocumentReference, { ...category });
  }

  delete(id: string): Promise<void> {
    const categoryDocumentReference = doc(this.afs, `categories/${id}`);
    return deleteDoc(categoryDocumentReference);
  }

}
