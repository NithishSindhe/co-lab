export async function modify_kanban_card({card_type,email,description,connection_pool}) {
    pool = connection_pool
    try{
        if(card_type!=null & email != null & description != null){
            if(card_type.toLowerCase() == 'delete'){
                const sql = 'DELETE FROM kanban WHERE email_address = ? AND status = ? AND description = ?';
                const values = [email, card_type, description]; // Replace with actual values
                const [rows] = await pool.execute(sql, values);
                return true; // Returns true if a row with the ID exists, false otherwise
            }
            const [rows] = await pool.execute('INSERT INTO kanban (status, email_address, description) VALUES (?, ?, ?)', [card_type, email, description]);
            console.log(rows)
            return true; // Returns true if a row with the ID exists, false otherwise
        }
    }
    catch(error){
        console.log(`error could not modify kanban card: ${error}`)
        return false
    }
}

export async function get_kanban({email,connection_pool}) {
    const pool = connection_pool
    try{
        if( email!=null ){
            const [rows] = await pool.execute('select status,description from kanban where TRIM(LOWER(email)) = LOWER(?)', [email]);
            return [rows, true]; // Returns true if a row with the ID exists, false otherwise
        }
        return [[], false]
    }
    catch(error){
        console.log(`error could not get kanban info: ${error}`)
        return [[], false]
    }
}
