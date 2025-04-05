import { nanoid } from "nanoid"

export default () => {
  const id = ref(nanoid());

  return {id};
}