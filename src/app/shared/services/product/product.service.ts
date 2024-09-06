import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IProductRequest } from '../../interfaces/product/product.interface';
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
  query, 
  updateDoc, 
  where
} from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private productCollection!: CollectionReference<DocumentData>;

  constructor(
    private afs: Firestore
  ) { 
    this.productCollection = collection(this.afs, 'products');
  }

  getAll(): Observable<DocumentData[]> {
    return collectionData(this.productCollection, { idField: 'id' });
  }

  getAllByCategory(name: string): Observable<DocumentData[]> {
    const productCollectionById = query(collection(this.afs, 'products'), where('category.path', '==', name));
    return collectionData(productCollectionById, { idField: 'id' });
  }

  getOne(id: string): Observable<DocumentData> {
    const productDocumentReference = doc(this.afs, `products/${id}`);
    return docData(productDocumentReference, { idField: 'id' });
  }

  create(product: IProductRequest): Promise<DocumentReference<DocumentData>> {
    return addDoc(this.productCollection, product);
  }

  update(product: IProductRequest, id: string): Promise<void> {
    const productDocumentReference = doc(this.afs, `products/${id}`);
    return updateDoc(productDocumentReference, { ...product });
  }

  delete(id: string): Promise<void> {
    const productDocumentReference = doc(this.afs, `products/${id}`);
    return deleteDoc(productDocumentReference);
  }

}
