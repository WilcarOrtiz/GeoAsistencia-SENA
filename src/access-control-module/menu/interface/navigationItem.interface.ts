export interface INavigationItem {
  id: string;
  name: string;
  route: string | null;
  icon: string | null;
  order_index: number;
  children: INavigationItem[];
}
