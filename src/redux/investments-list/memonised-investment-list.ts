import { AppState } from '@redux-store/store';

export const isLoading = (state: AppState) => state.investmentList.isLoading;
export const myInvestmentListState = (state: AppState) => state.investmentList.my_investment_list
export const myClientInvestmentListState = (state: AppState) => state.investmentList.my_client_investment_list;
export const consolidateState = (state: AppState) => state.investmentList.consolidate_investment;
export const myTotalInvestmentState = (state: AppState) => state.investmentList.my_total_investment;
export const myClientTotalInvestmentState = (state: AppState) => state.investmentList.my_client_total_investment;
export const profitFromClientState = (state: AppState) => state.investmentList.profit_from_client;

