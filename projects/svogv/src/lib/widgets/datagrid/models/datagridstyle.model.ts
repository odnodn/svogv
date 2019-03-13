
export type StyleRules = { [name: string]: string };

export interface DatagridStyles {
  first?: StyleRules;
  middle?: StyleRules;
  last?: StyleRules;
  group?: StyleRules;
  header?: StyleRules;
  footer?: StyleRules;
  actionCell?: StyleRules;
}
