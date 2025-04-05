
export default () => {
  const { data: localIp, error } = useFetch('/api/local-ip');

  return {localIp, error};
}