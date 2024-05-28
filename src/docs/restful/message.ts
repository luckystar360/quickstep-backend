import responses from "../responses";

export const message = {
  "/messages/get-rooms/:userId": {
    get: {
      tags: ["Message"],
      summary: "Lấy ra danh sách các room chat của user",
      description: "Lấy ra danh sách các room chat của user",
      operationId: "getRooms",
      parameters: [
        {
          name: "userId",
          in: "path",
          description: "Truyền vào userId",
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
  "/messages/get-message/:roomId": {
    get: {
      tags: ["Message"],
      summary: "Lấy ra danh sách các các tin nhắn trong room",
      description: "Lấy ra danh sách các các tin nhắn trong room",
      operationId: "getMessage",
      parameters: [
        {
          name: "roomId",
          in: "path",
          description: "Truyền vào roomId",
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
};

export const messageDefinitions = {
   
};
