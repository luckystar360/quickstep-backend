import responses from "../responses";

export const account = {
  "/accounts/get-user/:phoneId": {
    get: {
      tags: ["Account"],
      summary: "Get user with phoneId",
      description: "Get user with phoneId",
      operationId: "getUser",
      parameters: [
        {
          name: "phoneId",
          in: "path",
          description: "Truyền vào phoneId",
          require: true,
        },
      ],
      security: [
        {
          JWT: [],
        },
      ],
      responses,
    },
  },
  "/accounts/get-users/:ids": {
    get: {
      tags: ["Account"],
      summary: "Get list users with list userid",
      description: "Get list users with list userid",
      operationId: "getUsers",
      parameters: [
        {
          name: "ids",
          in: "path",
          description: "Truyền vào 1 chuỗi các userId, ngăn cách bởi dấu phẩy",
          require: true,
        },
      ],
      security: [
        {
          JWT: [],
        },
      ],
      responses,
    },
  },
  "/accounts/create-user": {
    post: {
      tags: ["Account"],
      summary: "Create a new user with phoneId",
      description:
        "Create a new user with phoneId",
      operationId: "createUser",
      parameters: [
        {
          name: "body",
          in: "body",
          description: "Truyền vào phoneId, type là trackee hoặc tracker",
          required: true,
          schema: {
            $ref: "#/definitions/createUser",
          },
        },
      ],
      responses,
    },
  },
  // //Create a new account
  // "/accounts/create": {
  //   post: {
  //     tags: ["Account"],
  //     summary: "Create a new account",
  //     description:
  //       "Register a new account to be able to access all services of Quick Step",
  //     operationId: "createAccount",
  //     parameters: [
  //       {
  //         name: "body",
  //         in: "body",
  //         description: "Create a new app account",
  //         required: true,
  //         schema: {
  //           $ref: "#/definitions/create",
  //         },
  //       },
  //     ],
  //     responses,
  //   },
  // },

  // //Login to account
  // "/accounts/login": {
  //   post: {
  //     tags: ["Account"],
  //     summary: "Login an account",
  //     description: "Login into already existing account",
  //     operationId: "loginAccount",
  //     parameters: [
  //       {
  //         name: "body",
  //         in: "body",
  //         description: "Login an account",
  //         required: true,
  //         schema: {
  //           $ref: "#/definitions/login",
  //         },
  //       },
  //     ],
  //     responses,
  //   },
  // },

  // //Verify account
  // "/accounts/verify-account": {
  //   post: {
  //     tags: ["Account"],
  //     summary: "Verify account",
  //     description: "Verify created account by using OTP",
  //     operationId: "verifyAccount",
  //     parameters: [
  //       {
  //         name: "body",
  //         in: "body",
  //         description: "Verify an account by entering the OTP and email",
  //         required: true,
  //         schema: {
  //           $ref: "#/definitions/verify",
  //         },
  //       },
  //     ],
  //     responses,
  //   },
  // },

  // //Resend otp
  // "/accounts/resend-otp": {
  //   post: {
  //     tags: ["Account"],
  //     summary: "Resend OTP",
  //     description: "Resending OTP on email if not received or expired",
  //     operationId: "resendOTP",
  //     parameters: [
  //       {
  //         name: "body",
  //         in: "body",
  //         description: "Resending OTP on email if not received or expired",
  //         required: true,
  //         schema: {
  //           $ref: "#/definitions/resend-otp",
  //         },
  //       },
  //     ],
  //     responses,
  //   },
  // },

  // //Getting all acounts
  // "/accounts": {
  //   get: {
  //     tags: ["Account"],
  //     summary: "All accounts",
  //     description: "Getting all registered accounts",
  //     operationId: "getAccounts",
  //     security: [
  //       {
  //         JWT: [],
  //       },
  //     ],
  //     responses,
  //   },
  // },
};

export const accountDefinitions = {
  createUser: {
    type: "object",
    properties: {
      phoneId: {
        type: "string",
        required: true,
        default: "123456abcd",
      },
      type: {
        type: "string",
        required: true,
        default: "trackee",
      },
    },
  },

  // create: {
  //   type: "object",
  //   properties: {
  //     phoneId: {
  //       type: "string",
  //       required: true,
  //       default: "123456abcd",
  //     },
  //     email: {
  //       type: "string",
  //       required: true,
  //       default: "aimendayambaje25@gmail.com",
  //     },
  //     password: {
  //       type: "string",
  //       required: true,
  //       default: "aimelive@123",
  //     },
  //   },
  // },

  // login: {
  //   type: "object",
  //   properties: {
  //     email: {
  //       type: "string",
  //       required: true,
  //       default: "aimendayambaje25@gmail.com",
  //     },
  //     password: {
  //       type: "string",
  //       required: true,
  //     },
  //   },
  // },

  // verify: {
  //   type: "object",
  //   properties: {
  //     email: {
  //       type: "string",
  //       required: true,
  //       default: "aimendayambaje25@gmail.com",
  //     },
  //     otp: {
  //       type: "number",
  //       required: true,
  //       default: 1827,
  //     },
  //   },
  // },

  // "resend-otp": {
  //   type: "object",
  //   properties: {
  //     email: {
  //       type: "string",
  //       required: true,
  //       default: "aimendayambaje25@gmail.com",
  //     },
  //   },
  // },
};
