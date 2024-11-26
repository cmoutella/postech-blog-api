import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
  UseInterceptors,
  UsePipes,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { LoggingInterceptor } from '../../../shared/interceptors/logging.interceptor';
import { AuthGuard } from '../../../shared/guards/auth.guard';

import { z } from 'zod';
import { ZodValidationPipe } from 'src/shared/pipe/zod-validation.pipe';
import { StudentService } from '../services/student.service';

const createStudentSchema = z.object({
  name: z.string(),
});

type CreateStudent = z.infer<typeof createStudentSchema>;

const updateStudentSchema = z.object({
  name: z.string().optional(),
  grades: z.array(z.number()).optional(),
});

type UpdateStudent = z.infer<typeof updateStudentSchema>;

const addGradeToStudentSchema = z.object({
  grade: z.number().optional(),
});

type AddGradeToStudent = z.infer<typeof addGradeToStudentSchema>;

@ApiTags('student')
@UseInterceptors(LoggingInterceptor)
@Controller('student')
export class StudentController {
  constructor(private readonly studentService: StudentService) {}

  @UsePipes(new ZodValidationPipe(createStudentSchema))
  @Post()
  async createStudent(@Body() { name }: CreateStudent) {
    return await this.studentService.createStudent(name);
  }

  @Get()
  async getAllStudents(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return await this.studentService.getAllStudents(page, limit);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Get('/id/:id')
  async getById(@Param('id') id: string) {
    const s = await this.studentService.getById(id);
    return s;
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Get('/id/grade/:id')
  async addGrade(
    @Param('id') id: string,
    @Body(new ZodValidationPipe(addGradeToStudentSchema))
    data: AddGradeToStudent,
  ) {
    const s = await this.studentService.addGrade(id, data.grade);
    return s;
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Put(':id')
  async updatePost(
    @Param('id') id: string,
    @Body(new ZodValidationPipe(updateStudentSchema)) updateData: UpdateStudent,
  ) {
    return await this.studentService.updateStudent(id, updateData);
  }

  @ApiBearerAuth()
  @Delete(':id')
  async deleteUser(@Param('id') id: string) {
    await this.studentService.deleteStudent(id);
  }
}
