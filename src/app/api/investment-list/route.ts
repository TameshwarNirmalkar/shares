import connectMongoDB from "@db/connection/db-connection";
import InterestModel from "@db/models/interests";
import StakeholdersModel from "@db/models/stakeholders";
import * as jose from "jose";
import { NextRequest, NextResponse } from "next/server";

const SECRET_KEY: string | undefined = process.env.JWT_SECERT_KEY;

type Investment = {
    total_investment: number;
    total_interest: number;
}

export async function GET(request: NextRequest) {
    const geth = request.headers.get("authorization");
    const secret = new TextEncoder().encode(SECRET_KEY);
    const hasBearer = geth?.split(" ") as string[];

    if (geth && hasBearer[0] !== "Bearer") {
        return NextResponse.json({ message: "Bearer not found" }, { status: 403 });
    } else if (!hasBearer[1]) {
        return NextResponse.json({ message: "Authorize token is not defined" }, { status: 403 });
    } else {
        try {

            const { payload } = await jose.jwtVerify(`${hasBearer[1]}`, secret);
            await connectMongoDB();
            const my_investment_list = await InterestModel.find({ uuid: payload?.id });
            const my_client_investment_list = await StakeholdersModel.find({ uuid: payload?.id });

            const my_total_investment: Investment = my_investment_list.reduce((acc, ite) => {
                return {
                    total_investment: acc.total_investment + ite.amount,
                    total_interest: acc.total_interest + ite.calculated_amount
                };
            }, { total_investment: 0, total_interest: 0 });

            const my_client_total_investment: Investment = my_client_investment_list.reduce((acc, ite) => {
                return {
                    total_investment: acc.total_investment + ite.principle_amount,
                    total_interest: acc.total_interest + (ite.principle_amount * (ite.percentage / 100))
                };
            }, { total_investment: 0, total_interest: 0 });

            const consolidate_investment: Investment = {
                total_investment: (my_total_investment.total_investment + my_client_total_investment.total_investment),
                total_interest: (my_total_investment.total_interest + my_client_total_investment.total_interest)
            }

            return NextResponse.json({ my_investment_list, my_client_investment_list, my_total_investment, my_client_total_investment, consolidate_investment, success: true }, { status: 200 });
        } catch (error: any) {
            return NextResponse.json({ message: error.toString(), code: error.code, success: false }, { status: 403 });
        }
    }
}