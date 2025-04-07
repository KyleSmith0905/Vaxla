import findProcess from 'find-process';

export default defineEventHandler(async (event) => {
  const port = getQuery<{port: string}>(event).port;

  if (port) {
    return findProcess('port', port);
  }
  else {
    return findProcess('name', '', true)
  }
})