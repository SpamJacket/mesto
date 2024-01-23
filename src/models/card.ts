import { Schema, model, Types } from "mongoose";
import { isURL, isLength } from "validator";

interface Card {
  name: string;
  link: string;
  owner: Types.ObjectId;
  likes: Types.ObjectId[];
  createdAt: Date;
}

const cardSchema = new Schema<Card>(
  {
    name: {
      type: String,
      required: true,
      minlength: 2,
      maxlength: 30,
      validate: {
        validator: (v: string) => isLength(v, { min: 2, max: 30 }),
        message: () => "Длина названия должна быть от 2 до 30 символов",
      },
    },
    link: {
      type: String,
      required: true,
      validate: {
        validator: (v: string) => isURL(v),
        message: (props) => `${props.value} не является ссылкой`,
      },
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    likes: [
      {
        type: Schema.Types.ObjectId,
        ref: "user",
        default: [],
      },
    ],
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { versionKey: false }
);

export default model<Card>("card", cardSchema);
