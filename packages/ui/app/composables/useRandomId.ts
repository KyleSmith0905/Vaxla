import { nanoid } from "nanoid"

export const useRandomId = () => {
  const id = ref(nanoid());

  return {id};
}