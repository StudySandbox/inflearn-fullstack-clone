import { Account as _Account } from './account';
import { Session as _Session } from './session';
import { User as _User } from './user';
import { VerificationToken as _VerificationToken } from './verification_token';
import { Course as _Course } from './course';
import { Section as _Section } from './section';
import { Lecture as _Lecture } from './lecture';
import { CourseCategory as _CourseCategory } from './course_category';
import { CourseEnrollment as _CourseEnrollment } from './course_enrollment';
import { CourseReview as _CourseReview } from './course_review';
import { CourseQuestion as _CourseQuestion } from './course_question';
import { CourseComment as _CourseComment } from './course_comment';
import { LectureActivity as _LectureActivity } from './lecture_activity';

export namespace PrismaModel {
  export class Account extends _Account {}
  export class Session extends _Session {}
  export class User extends _User {}
  export class VerificationToken extends _VerificationToken {}
  export class Course extends _Course {}
  export class Section extends _Section {}
  export class Lecture extends _Lecture {}
  export class CourseCategory extends _CourseCategory {}
  export class CourseEnrollment extends _CourseEnrollment {}
  export class CourseReview extends _CourseReview {}
  export class CourseQuestion extends _CourseQuestion {}
  export class CourseComment extends _CourseComment {}
  export class LectureActivity extends _LectureActivity {}

  export const extraModels = [
    Account,
    Session,
    User,
    VerificationToken,
    Course,
    Section,
    Lecture,
    CourseCategory,
    CourseEnrollment,
    CourseReview,
    CourseQuestion,
    CourseComment,
    LectureActivity,
  ];
}
