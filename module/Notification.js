const path = require("path");
const {
  PATHS: { MODEL, LIB },
} = require("config");
const { io } = require(path.join(LIB, "Server"));
const { Subscriber, Events } = require(path.join(MODEL, "Redis", "notification"));

io.on("connection", socket => {
  console.log(`Notificaiton ${socket.id} connected`);

  let { campaign_uuids } = socket.handshake.query;
  try {
    campaign_uuids = JSON.parse(campaign_uuids);
  } catch (err) {
    console.log("campaign_uuids not in JSON format");
    campaign_uuids = new Set();
  }

  if (Array.isArray(campaign_uuids)) {
    campaign_uuids = new Set(campaign_uuids);
    for (const campaign_uuid of campaign_uuids) {
      if (typeof campaign_uuid == "string") {
        socket.join(campaign_uuid);
      } else {
        campaign_uuids.delete(campaign_uuid);
      }
    }
  }

  socket.on(Events.SUBSCRIBE, new_campaign_uuids => {
    try {
      new_campaign_uuids = JSON.parse(new_campaign_uuids);
    } catch (err) {
      console.log("new_campaign_uuids not in JSON format");
    }

    if (Array.isArray(new_campaign_uuids)) {
      for (const campaign_uuid of new_campaign_uuids) {
        if (typeof campaign_uuid == "string" && !campaign_uuids.has(campaign_uuid)) {
          socket.join(campaign_uuid);
          campaign_uuids.add(campaign_uuid);
        }
      }
    }
  });

  socket.on("disconnect", _ => {
    console.log(`Notificaiton ${socket.id} disconnected`)
  })
});

Subscriber.subscribe(Events.VOTE);

// Publisher.publish("vote", JSON.stringify({
//   campaign_uuid: id,
//   options: {
//     option1: votes1,
//     option2: votes2,
//   }
// }));
Subscriber.on("message", function (channel, message) {
  switch (channel) {
    case Events.VOTE:
      message = JSON.parse(message);
      const { campaign_uuid } = message;
      io.to(campaign_uuid).emit(Events.VOTE, message);
      break;
  }
});