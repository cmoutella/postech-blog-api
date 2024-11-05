import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { InterfaceUser } from './models/user.interface';

export type UserDocument = HydratedDocument<User>;

@Schema()
export class User implements InterfaceUser {
  @Prop({ type: mongoose.Schema.Types.ObjectId })
  id?: string;
  @Prop()
  username: string;
  @Prop()
  name: string;
  @Prop()
  password: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
