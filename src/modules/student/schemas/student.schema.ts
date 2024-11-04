import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { InterfaceStudent } from './models/student.interface';

export type StudentDocument = HydratedDocument<Student>;

@Schema()
export class Student implements InterfaceStudent {
  @Prop({ type: mongoose.Schema.Types.ObjectId })
  id?: string;
  @Prop()
  name: string;
  @Prop()
  grades: number[];
}

export const StudentSchema = SchemaFactory.createForClass(Student);
