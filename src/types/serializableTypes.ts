export interface SerializableObject {
  [key: string]: SerializableTypes;
}

export interface SerializableArray extends Array<SerializableTypes> {}

export type SerializableTypes =
  | string
  | number
  | boolean
  | null
  | SerializableArray
  | SerializableObject;