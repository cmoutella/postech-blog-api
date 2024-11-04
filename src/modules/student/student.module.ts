import { Module } from '@nestjs/common';
import { StudentController } from './controllers/student.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Student, StudentSchema } from './schemas/student.schema';
import { StudentRepository } from './repositories/student.repository';
import { StudentMongooseRepository } from './repositories/mongoose/student.mongoose.repository';
import { StudentService } from './services/student.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Student.name, schema: StudentSchema }]),
  ],
  providers: [
    {
      provide: StudentRepository,
      useClass: StudentMongooseRepository,
    },
    StudentService,
  ],
  controllers: [StudentController],
})
export class StudentModule {}
