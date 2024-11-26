import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InterfaceStudent } from '../schemas/models/student.interface';
import { StudentRepository } from '../repositories/student.repository';
import { Student } from '../schemas/student.schema';
import { InterfaceList } from 'src/modules/posts-collection/schemas/models/post.interface';

@Injectable()
export class StudentService {
  constructor(private readonly studentRepository: StudentRepository) {}

  async createStudent(name: string): Promise<InterfaceStudent> {
    if (!name) {
      throw new BadRequestException('Username or password missing');
    }

    return await this.studentRepository.createStudent({
      name: name,
      grades: [],
    });
  }

  async getAllStudents(
    page?: number,
    limit?: number,
  ): Promise<InterfaceList<InterfaceStudent[]>> {
    return await this.studentRepository.getAllStudents(page, limit);
  }

  async getById(id: string): Promise<Student> {
    const student = await this.studentRepository.getById(id);
    if (!student) throw new NotFoundException();
    return student;
  }

  async addGrade(id: string, grade: number): Promise<Student> {
    const student = await this.addGrade(id, grade);
    if (!student) throw new NotFoundException();
    return student;
  }

  async updateStudent(
    id: string,
    data: Partial<InterfaceStudent>,
  ): Promise<Student> {
    return await this.studentRepository.updateStudent(id, data);
  }

  async deleteStudent(id: string): Promise<void> {
    const student = await this.studentRepository.getById(id);
    if (!student) throw new NotFoundException();
    await this.studentRepository.deleteStudent(id);
  }
}
