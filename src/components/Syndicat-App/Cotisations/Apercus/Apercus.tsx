"use client";

import React from "react";
import {Eye, EyeOff} from "lucide-react";
import { useTranslation } from "react-i18next";


export interface Transaction {
    id: number;
    description: string;
    amount: number;
    type: 'income' | 'expense';
}

export const Apercus: React.FC = () => {
    const { t } = useTranslation();
    const [showBalance, setShowBalance] = React.useState<boolean>(false);
    const financialData = {
        balance: 150000,
        income: 50000,
        expenses: 30000,
        membershipFees: 45000,
        donations: 5000,
    };
    const recentTransactions: Transaction[] = [
        { id: 1, description: t("cotisations_mensuelles"), amount: 15000, type: 'income' },
        { id: 2, description: t("frais_de_location_de_salle"), amount: -500, type: 'expense' },
        { id: 3, description: t("don_de_soutien"), amount: 1000, type: 'income' },
        { id: 4, description: t("achat_de_fournitures_de_bureau"), amount: -200, type: 'expense' },
        { id: 5, description: t("remboursement_de_frais"), amount: -150, type: 'expense' },
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold mb-4">{t("solde_actuel")}</h3>
                <div className="flex items-center justify-between">
                    <span className="text-3xl font-bold">
                        {showBalance
                            ? `${financialData.balance.toLocaleString()} €`
                            : '••••••• €'
                        }
                    </span>
                    <button
                        onClick={() => setShowBalance(!showBalance)}
                        className="text-blue-600 hover:text-blue-800"
                        aria-label={showBalance ? t("masquer_le_solde") : t("afficher_le_solde")}
                    >
                        {showBalance ? <EyeOff /> : <Eye />}
                    </button>
                </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold mb-4">{t("revenus_vs_depenses")}</h3>
                <div className="flex justify-between items-center">
                    <div>
                        <p className="text-green-600">{t("revenus")}</p>
                        <p className="text-2xl font-semibold">{financialData.income.toLocaleString()} €</p>
                    </div>
                    <div>
                        <p className="text-red-600">{t("depenses")}</p>
                        <p className="text-2xl font-semibold">{financialData.expenses.toLocaleString()} €</p>
                    </div>
                </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md md:col-span-2">
                <h3 className="text-lg font-semibold mb-4">{t("transactions_recentes")}</h3>
                <ul className="space-y-3">
                    {recentTransactions.map(transaction => (
                        <li key={transaction.id} className="flex justify-between items-center border-b pb-2">
                            <span>{transaction.description}</span>
                            <span className={transaction.type === 'income' ? 'text-green-600' : 'text-red-600'}>
                                {transaction.type === 'income' ? '+' : '-'}{Math.abs(transaction.amount).toLocaleString()} €
                            </span>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default Apercus;


