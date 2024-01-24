import { Model, Schema, Types, model } from "mongoose";
import { isEmail, isLength, isURL } from "validator";
import bcrypt from "bcryptjs";
import AuthError from "../errors/auth-err";

export interface IUser {
  email: string;
  password: string;
  name: string;
  about: string;
  avatar: string;
  _id: Types.ObjectId;
}

interface UserModel extends Model<IUser> {
  findUserByCredentials(
    // eslint-disable-next-line no-unused-vars
    email: string,
    // eslint-disable-next-line no-unused-vars
    password: string
  ): Promise<IUser | AuthError>;
}

const userSchema = new Schema<IUser>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      validate: {
        validator: (v: string) => isEmail(v),
        message: (props) => `${props.value} не является адресом почты`,
      },
    },
    password: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      minlength: 2,
      maxlength: 30,
      validate: {
        validator: (v: string) => isLength(v, { min: 2, max: 30 }),
        message: () => "Длина имени должна быть от 2 до 30 символов",
      },
      default: "Жак-Ив Кусто",
    },
    about: {
      type: String,
      minlength: 2,
      maxlength: 200,
      validate: {
        validator: (v: string) => isLength(v, { min: 2, max: 200 }),
        message: () => "Слишком длинное или слишком короткое",
      },
      default: "Исследователь",
    },
    avatar: {
      type: String,
      validate: {
        validator: (v: string) => isURL(v),
        message: (props) => `${props.value} не является ссылкой`,
      },
      default:
        "https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png",
    },
  },
  {
    versionKey: false,
    statics: {
      async findUserByCredentials(email: string, password: string) {
        return this.findOne({ email }).then((user) => {
          if (!user) {
            return Promise.reject(
              new AuthError("Неправильные почта или пароль")
            );
          }

          return bcrypt.compare(password, user.password).then((matched) => {
            if (!matched) {
              return Promise.reject(
                new AuthError("Неправильные почта или пароль")
              );
            }

            return user;
          });
        });
      },
    },
  }
);

export default model<IUser, UserModel>("user", userSchema);
