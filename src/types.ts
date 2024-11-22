export type Id = string | number;

export type Column = {
  id: Id;
  title: string;
};

export type Task = {
  id: Id;
  columnId: Id;
  content: string;
};

export type PlaceHolder = {
  id: number;
  title: string;
};

export type Item = {
  id: Id;
  content: string; // This will now store the image URL
  alt?: string; // Alt text for the image
  placeHolderId?: number;
  score: number; // Add this line
};
