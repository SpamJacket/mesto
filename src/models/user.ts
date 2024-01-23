import { Schema, model } from "mongoose";
import { isLength, isURL } from "validator";

interface User {
  name: string;
  about: string;
  avatar: string;
}

const userSchema = new Schema<User>(
  {
    name: {
      type: String,
      required: true,
      minlength: 2,
      maxlength: 30,
      validate: {
        validator: (v: string) => isLength(v, { min: 2, max: 30 }),
        message: () => "Длина имени должна быть от 2 до 30 символов",
      },
    },
    about: {
      type: String,
      required: true,
      minlength: 2,
      maxlength: 200,
      validate: {
        validator: (v: string) => isLength(v, { min: 2, max: 200 }),
        message: () => "Слишком длинное или слишком короткое",
      },
    },
    avatar: {
      type: String,
      required: true,
      validate: {
        validator: (v: string) => isURL(v),
        message: (props) => `${props.value} не является ссылкой`,
      },
    },
  },
  { versionKey: false }
);

export default model<User>("user", userSchema);
