import { sql } from "../config/db.js";

export async function getTransactionsByUserId(req, res) {
     try {
        const { user_id } = req.params;
        const transactions = await sql`
        SELECT * FROM transactions
        WHERE user_id = ${user_id}
        ORDER BY updated_at DESC;
        `
    res.status(200).json({
        message: 'Transactions fetched successfully.',
        transactions: transactions // Return the fetched transactions
    });
    } catch (error) {
        console.log('Error fetching transactions:', error);
        return res.status(500).json({ error: 'Internal server error.' });
    }
}

export async function createTransaction(req, res){
    try {
        const { user_id, title, amount, category } = req.body;

        if (!user_id || !title || amount === undefined || !category) {
            return res.status(400).json({ error: 'All fields are required.' });
        }

        const transaction = await sql`
            INSERT INTO transactions (user_id, title, amount, category)
            VALUES (${user_id}, ${title}, ${amount}, ${category})
            RETURNING *;
        `;

        console.log('Transaction created:', transaction[0]);

        res.status(201).json({
            message: 'Transaction created successfully.',
            transaction: transaction[0] // Return the created transaction
        });

    } catch (error) {
        console.log('Error creating transaction:', error);
        return res.status(500).json({ error: 'Internal server error.' });

    }
}

export async function deleteTransactions(req, res){
     try{
            const { id } = req.params;
            if (isNaN(parseInt(id))) {
                return res.status(400).json({ error: 'Invalid transaction ID.' })};
            
            const result = await sql`
                DELETE FROM transactions
                WHERE id = ${id}
                RETURNING *;
            `;
    
            if (result.length === 0) {
                return res.status(404).json({ error: 'Transaction not found.' })};
    
            res.status(200).json({
                message: 'Transaction deleted successfully.',
                transaction: result[0] // Return the deleted transaction
            });
    
        } catch (error) {
            console.log('Error deleting transaction:', error);
            return res.status(500).json({ error: 'Internal server error.' });
        }
}

export async function getSummaryByUserId(req, res){
     try{
        const { user_id } = req.params;
        const balanceResult = await sql`
            SELECT COALESCE(SUM(amount),0) as total_balance FROM transactions WHERE user_id = ${user_id}
        `;

        const incomeResult = await sql`
            SELECT COALESCE(SUM(amount),0) as total_income FROM transactions WHERE user_id = ${user_id} AND amount > 0
        `;

        const expenseResult = await sql`
            SELECT COALESCE(SUM(amount),0) as total_expense FROM transactions WHERE user_id = ${user_id} AND amount < 0
        `;

        res.status(200).json({
            message: 'Summary fetched successfully.',
            summary: {
                total_balance: balanceResult[0].total_balance,
                total_income: incomeResult[0].total_income,
                total_expense: expenseResult[0].total_expense
            }
        });

    } catch (error) {
        console.log('Error fetching summary:', error);
        return res.status(500).json({ error: 'Internal server error.' });
    }
}