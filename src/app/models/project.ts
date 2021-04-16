export class Project {
  id: string;
  name: string;
  url: string;
  description: string;
  achievements: Array<any>; // name description
  tech: Array<any>; // name url
  icon: string; // una imagen 300x250
  image: string; // imagen general 1200x1000
  type: string; // usar enum
  references: Array<any>; // icon url
  captures: Array<any>; //  image (1200x1000) thumbImage (300x250) alt title
}
