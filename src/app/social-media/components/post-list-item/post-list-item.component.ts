import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Post} from "../../models/post.model";

@Component({
  selector: 'app-post-list-item',
  templateUrl: './post-list-item.component.html',
  styleUrls: ['./post-list-item.component.scss']
})
export class PostListItemComponent implements OnInit{
// component présentateur/done
// ne doit pas contenir de logique

  @Input() post!: Post;
  @Output() postCommented = new EventEmitter<{comment:string, postId: number}>()

  tempUser = {firstName: 'Amandine', lastName: 'Monardo'};

  constructor() {
  }
  ngOnInit() {
  }

  onNewComment(comment: string) {
    this.postCommented.emit({comment, postId:this.post.id});
  }
}
