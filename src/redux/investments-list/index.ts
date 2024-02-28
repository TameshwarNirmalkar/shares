import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { getInvestmentsCollectionAction } from './action';

interface InvestmentListCollection {
    uuid: string;
    _id: number;
    investment_name: string;
    amount: number;
    interest_date: string;
    investment_date: Date;
    percentage: number;
    calculated_amount: number;
}

interface MyClientInvestmentCollection {
    _id: string;
    uuid: string,
    full_name: string,
    email: string,
    phone: number,
    principle_amount: number,
    percentage: number,
    interest_date: Date
}

interface InvestmentListStateI {
    isLoading: boolean;
    errorMsg: string | null;
    my_investment_list: InvestmentListCollection[];
    my_client_investment_list: MyClientInvestmentCollection[];
    my_total_investment: any;
    my_client_total_investment: any;
    consolidate_investment: any;
    profit_from_client: number;
}

// const investmentListAdapter = createEntityAdapter<InvestmentListCollection, EntityId>({
//     selectId: (invest: InvestmentListCollection) => invest._id,
//     sortComparer: (a: InvestmentListCollection, b: InvestmentListCollection) => a.full_name.localeCompare(b.full_name)
// });

// const myInvestmentListAdapter = createEntityAdapter<InvestmentListCollection, EntityId>({
//     selectId: (myinvestment: InvestmentListCollection) => myinvestment._id,
//     sortComparer: (a: InvestmentListCollection, b: InvestmentListCollection) => a.interest_date.localeCompare(b.interest_date)
// });
// const myClientinvestmentListAdapter = createEntityAdapter<MyClientInvestmentCollection, EntityId>({
//     selectId: (client_investment: MyClientInvestmentCollection) => client_investment._id,
//     sortComparer: (a: MyClientInvestmentCollection, b: MyClientInvestmentCollection) => a.full_name.localeCompare(b.full_name)
// });

const investmentListSlice = createSlice({
    name: 'INVESTMENT_LIST_SLICE',
    initialState: {
        isLoading: false,
        errorMsg: '',
        my_investment_list: [],
        my_client_investment_list: [],
        my_total_investment: null,
        my_client_total_investment: null,
        consolidate_investment: null,
        profit_from_client: 0
    },
    reducers: {
        updateProfitClient: (state: InvestmentListStateI, action: PayloadAction<number>) => {
            state.profit_from_client = action.payload;
        }
    },
    extraReducers(builder) {
        builder.addCase(getInvestmentsCollectionAction.pending, (state: any) => {
            state.isLoading = true;
        }).addCase(getInvestmentsCollectionAction.fulfilled, (state: InvestmentListStateI, action: PayloadAction<InvestmentListStateI>) => {
            state.isLoading = false;
            state.my_investment_list = action.payload.my_investment_list;
            state.my_client_investment_list = action.payload.my_client_investment_list;
            state.my_total_investment = action.payload.my_total_investment;
            state.my_client_total_investment = action.payload.my_client_total_investment;
            state.consolidate_investment = action.payload.consolidate_investment;
            // state.profit_from_client = action.payload.profit_from_client
        })
    }
});

export const { updateProfitClient } = investmentListSlice.actions;

export default investmentListSlice.reducer;


