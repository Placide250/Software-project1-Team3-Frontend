export function isFutureSlot(slot) {
  const now = new Date();

  const currentUtc = Date.UTC(
    now.getUTCFullYear(),
    now.getUTCMonth(),
    now.getUTCDate(),
    now.getUTCHours(),
    now.getUTCMinutes(),
    now.getUTCSeconds()
  );

  const slotTime = new Date(slot.datetime).getTime();

  console.log("SLOT UTC:", new Date(slot.datetime).toUTCString());
  console.log("NOW UTC :", new Date(currentUtc).toUTCString());
  console.log("IS FUTURE:", slotTime >= currentUtc);

  const THIRTY_MINUTES = 30 * 60 * 1000;

  return slotTime + THIRTY_MINUTES >= currentUtc;
}