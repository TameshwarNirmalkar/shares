import { AppState } from '@redux-store/store';

export const isLoading = (state: AppState) => state.users.isLoading;
export const userListState = (state: AppState) => state.users.userList;
export const userDetailsState = (state: AppState) => state.users.userDetails;

// export const productFilterSelector = createSelector([productCollection, (productList, selectedId: any[]) => selectedId], (productList, selectedId) => {
//     return productList.filter((el: any) => selectedId.includes(String(el.id)));
// });

// export const searchSelector = createSelector(
//     [productCollection, (products, title) => title],
//     (products, title) => {
//         return products.filter((el: any) => el.title.toLowerCase().indexOf(title) !== -1);
//     }
// );

// export const selectedItemsSelectorPath = createSelector([selectedItems1], (memoItem) => memoItem
//     .map((el: any) => el.id)
//     .toString()
//     .replaceAll(",", "/"));

// export const selectedIdsSelector = createSelector([selectedItems1], (memoItem) => memoItem.map((el: any) => el.id));
// export const totalPriceSelector = createSelector([selectedItems1], (memoItem) => memoItem.reduce((acc: number, ite: any) => acc + ite.price, 0));

