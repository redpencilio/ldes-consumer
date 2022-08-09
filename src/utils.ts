import { LDES_RELATION_PATH } from "./constants";
import { Member } from "./consumer";
import * as RDF from "rdf-js";

export function extractTimeStamp(member: Member): Date {
  const timeStamp: RDF.Quad | undefined = member.quads.find(
    (quadObj) => quadObj.predicate.value === LDES_RELATION_PATH
  );
  if(!timeStamp){
    throw new Error(`Could not extract timestamp from member: ${member.id.value}`);
  }
  return toDate(timeStamp.object as RDF.Literal);
}

export function toDate(node: RDF.Literal): Date {
  const timeString = node.value.split("^^")[0];
  return new Date(timeString);
}
