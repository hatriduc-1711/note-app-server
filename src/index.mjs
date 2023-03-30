import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import express from "express";
import * as dotenv from "dotenv";
import http from "http";
import cors from "cors";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import { typeDefs } from "../src/schema/index.js";
import { resolvers } from "../src/resolvers/index.js";
import "./firebase/config.js";
import { getAuth } from "firebase-admin/auth";

dotenv.config();

const app = express();
const httpServer = http.createServer(app);

const server = new ApolloServer({
  typeDefs,
  resolvers,
  plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
});

await server.start();

const authorizationJWT = async (req, res, next) => {
  const authorizationHeader = req.headers.authorization;

  if (authorizationHeader) {
    const accessToken = authorizationHeader.split(" ")[1];

    getAuth()
      .verifyIdToken(accessToken)
      .then((decodedToken) => {
        res.locals.uid = decodedToken.uid;
        next();
      })
      .catch((err) => {
        return res.status(403).json({ message: "Forbidden", error: err });
      });
  } else {
    return res.status(401).json({ message: "Unauthorized" });
  }
};

const corsOptions = {
  origin: ["https://profound-narwhal-854160.netlify.app"],
  allowedHeaders: [
    "Content-Type",
    "Authorization",
    "Access-Control-Allow-Origin",
    "Access-Control-Allow-Methods",
    "Access-Control-Request-Headers",
  ],
  credentials: true,
  enablePreflight: true,
};

app.use(
  "/graphql",
  cors({ origin: process.env.URL_REACT }),
  authorizationJWT,
  bodyParser.json(),
  expressMiddleware(server, {
    context: async ({ req, res }) => {
      return { uid: res.locals.uid };
    },
  })
);

const URI = `mongodb+srv://hatriduc:${process.env.DB_PASSWORD}@cluster0.w2huedz.mongodb.net/?retryWrites=true&w=majority`;
const port = process.env.PORT || 4000;

mongoose
  .connect(URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(async () => {
    console.log("Connected to DB");
    await new Promise((resolve) => httpServer.listen({ port: port }, resolve));
    console.log(`🚀 Server ready at http://localhost:${port}/graphql`);
  });
