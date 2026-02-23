export type Guid = string;

export interface Course {
  id: Guid;
  title: string;
  description: string;
  credits: number;
}

export interface Participant {
  id: Guid;
  firstName: string;
  lastName: string;
  email: string;
}
