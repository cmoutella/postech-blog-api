import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { InterfacePost } from './models/post.interface';
import mongoose, { HydratedDocument } from 'mongoose';

export type PostDocument = HydratedDocument<Post>;

@Schema()
export class Post implements InterfacePost {
  @Prop({ type: mongoose.Schema.Types.ObjectId })
  id?: string;
  @Prop()
  title: string;
  @Prop()
  text: string;
  @Prop()
  keyWords: string[];
}

export const PostSchema = SchemaFactory.createForClass(Post);
