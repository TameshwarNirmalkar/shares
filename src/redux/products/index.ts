import { createEntityAdapter, createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { AppState } from "@redux-store/store";
import { createProductCollectionAction } from './action';

interface ProductCollectionI {
    category: string;
    description: string;
    id: number;
    image: string;
    price: number;
    title: string;
    rating: object;
}

interface ProductStateI {
    selectedItems: any[];
    productCollection: ProductCollectionI[];
    isLoading: boolean;
    clonedData: ProductCollectionI[];
}

const productsAdapter = createEntityAdapter({
    selectId: (product: ProductCollectionI) => product.id,
    sortComparer: (a: any, b: any) => a.title.localeCompare(b.title)
});

const initialState: ProductStateI = productsAdapter.getInitialState({ selectedItems: [], productCollection: [], isLoading: false, clonedData: [] });

const productSlice = createSlice({
    name: 'PRODUCT_SLICE',
    initialState,
    reducers: {
        setIsLoading(state: AppState, action: PayloadAction<boolean>) {
            state.isLoading = action.payload;
        },
        setSelectedItems(state: AppState, action: PayloadAction<ProductCollectionI[]>) {
            state.selectedItems = action.payload;
        },
        setProductCollection(state: AppState, action: PayloadAction<ProductCollectionI[]>) {
            state.productCollection = action.payload;
        },
        setClonedData(state: AppState, action: PayloadAction<ProductCollectionI[]>) {
            state.clonedData = action.payload;
        }
    },
    extraReducers(builder) {
        builder
            .addCase(createProductCollectionAction.pending, (state, action) => {
                state.isLoading = true;
            }).addCase(createProductCollectionAction.fulfilled, (state: AppState, action) => {
                state.isLoading = false;
                state.productCollection = action.payload;
                productsAdapter.upsertMany(state, action.payload);
            });
    }
}) as any;

//getSelectors creates these selectors and we rename them with aliases using destructuring
export const {
    selectAll: selectAllProducts,
    selectById: selectProductById,
    selectIds: selectProductIds
    // Pass in a selector that returns the product slice of state
} = productsAdapter.getSelectors((state: AppState) => state.products);

export const { setSelectedItems, setProductCollection, setIsLoading, setClonedData } = productSlice.actions;
export default productSlice.reducer;

