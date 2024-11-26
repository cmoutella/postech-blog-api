import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { StudentRepository } from '../student.repository';
import { InterfaceStudent } from '../../schemas/models/student.interface';
import { Student, StudentDocument } from '../../schemas/student.schema';
import { DEFAULT_LIMIT } from 'src/shared/default/pagination';
import { InterfaceList } from 'src/modules/posts-collection/schemas/models/post.interface';

export class StudentMongooseRepository implements StudentRepository {
  constructor(
    @InjectModel(Student.name) private studentModel: Model<StudentDocument>,
  ) {}

  async createStudent(newUser: InterfaceStudent): Promise<InterfaceStudent> {
    const createStudent = new this.studentModel(newUser);
    const u = await createStudent.save();

    return { id: u._id.toString(), name: u.name, grades: [] };
  }

  async getAllStudents(
    page = 1,
    limit = DEFAULT_LIMIT,
  ): Promise<InterfaceList<InterfaceStudent[]>> {
    const offset = (page - 1) * limit;

    const students = await this.studentModel
      .find()
      .skip(offset)
      .limit(limit)
      .exec()
      .then((res) =>
        res.map((user) => {
          return {
            id: user._id.toString(),
            name: user.name,
            grades: user.grades,
          };
        }),
      );

    const totalStudents = await this.countStudents();

    return {
      data: students,
      totalItems: totalStudents,
      currentPage: page,
      itemsPerPage: limit,
    };
  }

  async getById(id: string): Promise<InterfaceStudent | null> {
    const user = await this.studentModel.findById({ _id: id }).exec();

    const userId = user._id.toString();

    const data = {
      name: user.name,
      grades: user.grades,
      id: userId,
    };

    return data;
  }

  async addGrade(id: string, grade: number): Promise<InterfaceStudent | null> {
    const student = await this.studentModel.findById({ _id: id }).exec();

    if (!student) {
      return null;
    }

    await this.studentModel
      .updateOne(
        { _id: id },
        { ...student, grades: [...student.grades, grade] },
      )
      .exec();

    const studentUpdated = await this.studentModel.findById({ _id: id }).exec();

    const studentId = studentUpdated._id.toString();

    const data = {
      name: studentUpdated.name,
      grades: studentUpdated.grades,
      id: studentId,
    };

    return data;
  }

  async updateStudent(
    id: string,
    data: Partial<InterfaceStudent>,
  ): Promise<InterfaceStudent> {
    const student = await this.studentModel.findById({ _id: id }).exec();

    if (!student) {
      return null;
    }

    await this.studentModel
      .updateOne({ _id: id }, { ...student.toObject(), ...data })
      .exec();

    const studentUpdated = await this.studentModel.findById({ _id: id }).exec();

    const studentId = studentUpdated._id.toString();

    const updated = {
      name: studentUpdated.name,
      grades: studentUpdated.grades,
      id: studentId,
    };

    return updated;
  }

  async deleteStudent(id: string): Promise<void> {
    await this.studentModel.deleteOne({ _id: id }).exec();
  }

  async countStudents(): Promise<number> {
    return await this.studentModel.countDocuments().exec();
  }
}
