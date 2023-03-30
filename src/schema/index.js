export const typeDefs = `#graphql
  type Folder {
    id: ID,
    name: String,
    createdAt: String,
    author: Author,
    notes: [Note]
  }

  type Note {
    id: ID,
    content: String
  }

  type Author {
    uid: ID,
    name: String
  }

  type Query {
    folders: [Folder],
    folder(folderId: ID): Folder,
    note(noteId: ID): Note,
  }

  type Mutation {
    register(uid: ID, name: String): Author,
    addFolder(name: String!): Folder,
    deleteFolder(id: ID!): Folder,
    addNote(folderId: ID!): Note,
    updatedNote(id: ID!, content: String): Note
    deleteNote(id: ID!): Note
  }
`;
