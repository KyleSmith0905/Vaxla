import netstat, { Options, type ParsedItem } from 'node-netstat';
import findProcess from 'find-process';

const netstatAsync = (opts: Options) =>
  new Promise<ParsedItem[]>((resolve, reject) => {
    const res: ParsedItem[] = []
    netstat(
      {
        ...opts,
        done: err => {
          if (err) return reject(err)
          return resolve(res)
        },
      },
      data => {res.push(data)},
    )
    return res
  })

export default defineEventHandler(async (event) => {
  const processId = parseInt(getQuery<{process: string}>(event).process);

  const stats = {
    netstat: await netstatAsync({
      filter: {
        pid: processId,
      }
    }),
    processStats: await findProcess('pid', processId).then(e => e[0]),
  }

  return stats;
})