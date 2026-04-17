export type Section = {
  id: string;
  title: string;
  content: string;
  partId: string;
};

export type Part = {
  id: string;
  title: string;
  sections: Section[];
};
