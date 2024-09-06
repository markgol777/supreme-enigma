import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
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
import { IProductResponse } from '../../interfaces/product/product.interface';
import { IOrderRequest } from '../../interfaces/order/order.interface';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  public changeBasket = new Subject<boolean>;
  private orderCollection!: CollectionReference<DocumentData>;

  constructor(
    private afs: Firestore
  ) { 
    this.orderCollection = collection(this.afs, 'orders');
  }

  addToBasket(product: IProductResponse): void {
    let basket: Array<IProductResponse> = [];
    if(localStorage.length > 0 && localStorage.getItem('tomatina_basket')) {
      basket = JSON.parse(localStorage.getItem('tomatina_basket') as string);
      const index = basket.findIndex(prod => prod.id === product.id);
      if(index > -1) {
        basket[index].count += product.count;
      } else {
        basket.push(product);
      }
    } else {
      basket.push(product);
    }
    localStorage.setItem('tomatina_basket', JSON.stringify(basket));
    this.changeBasket.next(true);
  }

  getAll(): Observable<DocumentData[]> {
    return collectionData(this.orderCollection, { idField: 'id' });
  }

  getAllByStatus(): Observable<DocumentData[]> {
    const productCollectionByStatus = query(collection(this.afs, 'orders'), where('status', '==', 'Замовлено'));
    return collectionData(productCollectionByStatus, { idField: 'id' });
  } 

  getAllByUser(userId: string): Observable<DocumentData[]> {
    const productCollectionByStatus = query(collection(this.afs, 'orders'), where('userId', '==', userId));
    return collectionData(productCollectionByStatus, { idField: 'id' });
  } 

  // getOne(id: string): Observable<DocumentData> {
  //   const orderDocumentReference = doc(this.afs, `orders/${id}`);
  //   return docData(orderDocumentReference, { idField: 'id' });
  // }

  create(order: IOrderRequest): Promise<DocumentReference<DocumentData>> {
    return addDoc(this.orderCollection, order);
  }

  update(order: IOrderRequest, id: string): Promise<void> {
    const orderDocumentReference = doc(this.afs, `orders/${id}`);
    return updateDoc(orderDocumentReference, { ...order });
  }

  // delete(id: string): Promise<void> {
  //   const orderDocumentReference = doc(this.afs, `orders/${id}`);
  //   return deleteDoc(orderDocumentReference);
  // }

}
