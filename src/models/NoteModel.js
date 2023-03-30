import mongoose from "mongoose";

const noteSchema = new mongoose.Schema(
  {
    content: {
      type: String,
    },
    folderId: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export const NoteModel = mongoose.model("Note", noteSchema);
