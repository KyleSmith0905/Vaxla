import { execCommandPromise } from "../utils/cli";
import { ScriptStatus } from "~/utils/packages/types";
import { activeProcesses } from "../utils/cli";

export default defineEventHandler(async (event) => {
  const body = (await readBody(event)) as { command: string; id: string };
  const { send } = useServerEvents();
  
  if (activeProcesses[body.id]) {
    send({
      data: {
        id: body.id,
        message: [
          "\x1b[1m| Sending Command",
          `\x1b[36;1mDate    \x1b[0m\x1b[36m${new Date().toISOString()}`,
          `\x1b[36;1mCommand \x1b[0m\x1b[36m${body.command}`,
        ].join("\n"),
        status: ScriptStatus.Opened,
      },
    });

    activeProcesses[body.id].send(body.command);
  } else {
    send({
      data: {
        id: body.id,
        message: [
          "\x1b[1m| Executing Script",
          `\x1b[36;1mDate    \x1b[0m\x1b[36m${new Date().toISOString()}`,
          `\x1b[36;1mCommand \x1b[0m\x1b[36m${body.command}`,
        ].join("\n"),
        status: ScriptStatus.Opened,
        type: 'meta'
      },
    });

    await execCommandPromise(body.command, {
      id: body.id,
      onOutput: (msg) => {
        send({ data: { id: body.id, message: msg.message, type: msg.type } });
      },
    });

    send({
      data: {
        id: body.id,
        message: ["\x1b[1m| Script Killed"].join("\n"),
        status: ScriptStatus.Closed,
        type: 'meta'
      },
    });
  }

  return {};
});
