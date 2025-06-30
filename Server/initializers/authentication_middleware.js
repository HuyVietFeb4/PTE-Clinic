const { Initializer, api } = require('actionhero');

module.exports = class AuthenticationMiddleware extends Initializer {
  constructor() {
    super();
    this.name = "authenticate";
  }

  async initialize() {
    const authenticate = {
      name: this.name,
      global: true, // Gắn middleware toàn cục

      preProcessor: async (data) => {
        const token =
          data.params.token ||
          data.connection.rawConnection?.req?.headers?.authorization;

        if (!token || token !== "secrettoken123") {
          throw new Error("Unauthorized: Invalid token");
        }

        // Gán user vào context (tùy nhu cầu)
        data.connection.user = { id: 1, name: "admin" };
      },
    };

    api.actions.addMiddleware(authenticate);
  }
};