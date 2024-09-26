import { PHDTag, Unit } from "@prisma/client";

export default interface PHDTagExtended extends PHDTag {
  unit: Unit;
}
