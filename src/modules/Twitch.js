import tmi from "tmi.js";
import { Emote } from "./Emote.js";

const CHANNEL = "manzdev";

const WIDTH = innerWidth;
const HEIGHT = innerHeight;

let emoteList = [];

export const client = new tmi.Client({
  channels: [CHANNEL]
});

client.connect();

const clearInactiveEmotes = () => {
  emoteList = emoteList.filter(emote => emote.live);
  console.log(emoteList);
};

setInterval(() => clearInactiveEmotes(), 5000);

client.on("message", (channel, tags, message, self) => {
  if (!tags.emotes) { return; }

  const emotes = Object.keys(tags.emotes);
  const emoteDict = emotes.map(id => ({
    id,
    times: tags.emotes[id].length
  }));

  emoteDict.forEach(({ id, times }) => {
    for (let i = 0; i < times; i++) {
      const x = Math.floor(Math.random() * WIDTH); // TODO: add offset (sticky emotes)
      const y = Math.floor(Math.random() * HEIGHT);
      const emote = new Emote(id, x, y);
      emote.addToWall();
      emoteList.push(emote);
    }
  });
});
