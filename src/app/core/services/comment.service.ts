import {Injectable} from '@angular/core';
import {Comment} from '../../shared/comment.model';
import {AngularFirestore, AngularFirestoreCollection} from '@angular/fire/firestore';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {DocumentChangeType} from '@angular/fire/firestore/interfaces';

@Injectable()
export class CommentService {

  private _comments: AngularFirestoreCollection<Comment>;

  constructor(private _fbDataBase: AngularFirestore) {
    this._comments = this._fbDataBase.collection('comments');
  }

  get comments(): Observable<Array<Comment>> {
    return this._comments.snapshotChanges().pipe(
      mapComments
    );
    // return this._comments.valueChanges();
  }

  public addComment(c: Comment) {
    return this._comments.add(c);
  }

  public saveComment(c: Comment) {
    return this._comments.doc(c.id).set(c);
  }

  public deleteComment(id: string) {
    return this._comments.doc(id).delete();
  }
}

export const mapComments = map((actions: any[]) => {
  return actions.map( action => {
    const data = action.payload.doc.data() as Comment;
    const id = action.payload.doc.id;
    return { id, ...data };
  });
});
