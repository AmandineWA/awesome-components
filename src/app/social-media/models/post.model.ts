import { Comment } from "../../core/models/comment.model";

export class PostModel {
  id!: number;
  userId!: number;
  title!: string;
  createdDate!: string;
  content!: string;
  comments!: Comment[];
}
