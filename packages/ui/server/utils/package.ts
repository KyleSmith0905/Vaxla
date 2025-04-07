import { ActiveScript } from "~/utils/packages/types";

export let activeScripts: ActiveScript[] = [];

export let setActiveScripts = (newActiveScripts: ActiveScript[]) => activeScripts = newActiveScripts