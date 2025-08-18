import bcrypt from "bcryptjs";

// salt + hash password
export const saltAndHashPassword = (password: string): string => {
  const saltRounds = 10;
  const salt = bcrypt.genSaltSync(saltRounds);
  const hash = bcrypt.hashSync(password, salt);

  // 해싱된 패스워드 리턴
  return hash;
};

// DB에 있는 비밀번호와 입력받은 비밀번호 비교
export const comparePassword = (
  password: string,
  hashedPassword: string
): boolean => {
  // 비교결과 반환
  return bcrypt.compareSync(password, hashedPassword);
};
