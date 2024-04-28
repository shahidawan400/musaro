export interface IUpdateAppLanguage {
  userId: string;
  appLanguage: string;
}

export interface ICreateProfession {
  name: string;
  description: string;
  img: string;
}

export interface IUpdateProfession {
  professionId: string;
  name?: string;
  description?: string;
  img?: string;
}
