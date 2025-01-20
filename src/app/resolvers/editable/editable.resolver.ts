import { ResolveFn } from '@angular/router';

export const editableResolver: ResolveFn<boolean> = (route, state) => {
  let editable = route.paramMap.get('editable');
  return editable === 'true';
};
