import { InterfaceList } from 'src/modules/posts-collection/schemas/models/post.interface';
import { InterfaceStudent } from '../schemas/models/student.interface';
import { Student } from '../schemas/student.schema';

export abstract class StudentRepository {
  abstract createStudent(
    newStudent: InterfaceStudent,
  ): Promise<InterfaceStudent>;
  abstract getAllStudents(
    page?: number,
    limit?: number,
  ): Promise<InterfaceList<InterfaceStudent[]>>;
  abstract getById(id: string): Promise<Student>;
  abstract addGrade(id: string, grade: number);
  abstract updateStudent(
    id: string,
    data: Partial<InterfaceStudent>,
  ): Promise<InterfaceStudent>;
  abstract deleteStudent(id: string): Promise<void>;
}
