import { FolderModel } from "../models/FolderModel.js";
import { NoteModel } from "../models/NoteModel.js";
import { AuthorModel } from "../models/AuthorModel.js";

export const resolvers = {
  Folder: {
    author: async ({ authorId }) => {
      const author = await AuthorModel.findOne({ uid: authorId });
      return author;
    },
    notes: async ({ id }) => {
      const notes = await NoteModel.find({
        folderId: id,
      }).sort({
        updatedAt: "desc",
      });
      return notes;
    },
  },
  Query: {
    folders: async (parent, args, context) => {
      const folders = await FolderModel.find({ authorId: context.uid }).sort({
        updatedAt: "desc",
      });
      return folders;
    },
    folder: async (parent, args) => {
      const folderId = args.folderId;
      const folder = await FolderModel.findOne({ _id: folderId });
      return folder;
    },
    note: async (parent, args) => {
      const noteId = args.noteId;
      const note = await NoteModel.findOne({ _id: noteId });
      return note;
    },
  },
  Mutation: {
    register: async (parent, args) => {
      const author = await AuthorModel.findOne({ uid: args.uid });
      if (!author) {
        const newAuthor = await AuthorModel.create(args);
        return newAuthor;
      }
      return author;
    },
    addFolder: async (parent, args, context) => {
      const newFolders = await FolderModel.create({
        ...args,
        authorId: context.uid,
      });
      return newFolders;
    },
    deleteFolder: async (parent, args) => {
      const deleteFolder = await FolderModel.findByIdAndDelete(args.id);
      return deleteFolder;
    },
    addNote: async (parent, args) => {
      const folderId = args.folderId;
      const newNote = await NoteModel.create({
        content: "",
        folderId,
      });
      return newNote;
    },
    updatedNote: async (parent, args) => {
      const updatedNote = await NoteModel.findByIdAndUpdate(args.id, args);
      return updatedNote;
    },

    deleteNote: async (parent, args) => {
      const deleteNote = await NoteModel.findByIdAndDelete(args.id);
      return deleteNote;
    },
  },
};
