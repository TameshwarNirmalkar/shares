import { AppState } from '@redux-store/store';
import { createEntityAdapter, createSlice, EntityId, EntityState, PayloadAction } from '@reduxjs/toolkit';
import { addTransactionAction, getTransactionCollectionAction } from './action';

interface TransactionHistoryCollection {
    uuid: string;
    _id: string;
    investment_date: Date;
    amount: number;
}

interface PaymentHistoryCollection {
    _id: string;
    uuid: string;
    interest_date: Date;
    amount: number;
}

interface TransactionHistoryStateI {
    isLoading: boolean;
    errorMsg: string | null;
    transaction_history: EntityState<TransactionHistoryCollection, EntityId>,
    payment_history: EntityState<PaymentHistoryCollection, EntityId>
}

const transactionHistoryAdapter = createEntityAdapter<TransactionHistoryCollection, EntityId>({
    selectId: (his: TransactionHistoryCollection) => his._id,
    sortComparer: (a: TransactionHistoryCollection, b: TransactionHistoryCollection) => a.uuid.localeCompare(b.uuid)
});

const paymentHistoryAdapter = createEntityAdapter<PaymentHistoryCollection, EntityId>({
    selectId: (phis: PaymentHistoryCollection) => phis._id,
    sortComparer: (a: PaymentHistoryCollection, b: PaymentHistoryCollection) => a.uuid.localeCompare(b.uuid)
});


const transactionHistorySlice = createSlice({
    name: 'TRANSACTION_HISTORY_SLICE',
    initialState: {
        isLoading: false,
        errorMsg: '',
        transaction_history: transactionHistoryAdapter.getInitialState({}),
        payment_history: paymentHistoryAdapter.getInitialState({})
    },
    reducers: {
        // masterInvestmentAdded: transactionHistoryAdapter.addOne,
        // masterInvestmentUpdate: transactionHistoryAdapter.updateOne,
        // masterInvestmentRemove: transactionHistoryAdapter.removeOne,
        // transactionHistoryAddOne: (state: any, action: PayloadAction<any>) => {
        //     console.log("Reducer: ", state);
        //     console.log("Action: ", action);

        //     transactionHistoryAdapter.addOne(state, action.payload)
        // },
    },
    extraReducers(builder) {
        builder.addCase(getTransactionCollectionAction.pending, (state: any) => {
            state.isLoading = true;
        }).addCase(getTransactionCollectionAction.fulfilled, (state: any, action: PayloadAction<any>) => {
            state.isLoading = false;
            transactionHistoryAdapter.upsertMany(state, action.payload.transaction_history)
        }).addCase(addTransactionAction.fulfilled, (state: TransactionHistoryStateI, action: PayloadAction<any>) => {
            transactionHistoryAdapter.addOne(state.transaction_history, action.payload);
        })
    }
});

export const {
    selectAll: selectAllTransactionHistory,
    selectById: selectTransactionHistoryById,
} = transactionHistoryAdapter.getSelectors((state: AppState) => state.allHistory.transaction_history);

export const {
    selectAll: selectAllPaymentHistory,
    selectById: selectPaymentHistoryById
} = paymentHistoryAdapter.getSelectors((state: AppState) => state.allHistory.payment_history);


// export const { transactionHistoryAddOne } = transactionHistorySlice.actions;

export default transactionHistorySlice.reducer;


