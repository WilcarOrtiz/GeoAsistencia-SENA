export interface IMenuSystemCreate {
  name: string;
  route?: string;
  icon?: string;
  order_index?: number;
  permission_name: string;
  parent_id?: string;
}
