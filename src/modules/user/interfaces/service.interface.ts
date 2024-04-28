export interface IUserService {
  create(createUserDto: any): Promise<any>;
  findAll(): any;
  findOne(id: number): any;
  update(id: number, updateUserDto: any): any;
  remove(id: number): any;
}
