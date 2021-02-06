const { ApolloServer, gql } = require("apollo-server-lambda");
const faunadb = require("faunadb");
const query = faunadb.query;

const typeDefs = gql`
  type Query {
    websites: [Website]
  }
  type Mutation {
    addWebsite(name: String, link: String): Website
    deleteWebsite(id: String): Website
    updateWebsite(id: String, name: String, link: String): Website
  }
  type Website {
    id: String
    name: String
    link: String
  }
`;

const client = new faunadb.Client({
  secret: 'fnAD-9S3PmACAa8u1WwUBLdRIX1_MiWgicvDXIy7',
});

const resolvers = {
  Query: {
    websites: async () => {
      var result = await client.query(
        query.Map(
          query.Paginate(query.Documents(query.Collection("Bookmarks"))),
          query.Lambda((x) => query.Get(x))
        )
      );
      const websites = result.data.map((website) => ({
        id: website.ref.id,
        name: website.data.name,
        link: website.data.link,
      }));

      return websites;
    },
  },
  Mutation: {
    addWebsite: async (_, { name, link }) => {
      const item = {
        data: { name: name, link: link },
      };

      try {
        const result = await client.query(
          query.Create(query.Collection("Bookmarks"), item)
        );
        console.log("result", result);

        return {
          name: result.data.name,
          link: result.data.link,
          id: result.ref.id,
        };
      } catch (error) {
        console.log("Error", error);
        return {
          name: "error",
          link: "null",
          id: "-1",
        };
      }
    },

    deleteWebsite: async (_, { id }) => {
      try {
        const result = await client.query(
          query.Delete(query.Ref(query.Collection("Bookmarks"), id))
        );
        console.log("result", result);

        return {
          name: result.data.name,
          link: result.data.link,
          id: result.ref.id,
        };
      } catch (error) {
        console.log("Error", error);
        return {
          name: "error",
          link: "null",
          id: "-1",
        };
      }
    },

    updateWebsite: async (_, { id, name, link }) => {
      const item = {
        data: { name: name, link: link },
      };

      try {
        const result = await client.query(
          query.Update(query.Ref(query.Collection("Bookmarks"), id), item)
        );
        console.log("result", result);

        return {
          name: result.data.name,
          link: result.data.link,
          id: result.ref.id,
        };
      } catch (error) {
        console.log("Error", error);
        return {
          name: "error",
          link: "null",
          id: "-1",
        };
      }
    },
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
  playground: true,
  introspection: true,
});

exports.handler = server.createHandler();