
export async function createUser({userName=null, email=null, password=null, google_id=null, verified_email=null, salt=null, profile_pic=null, connection_pool=null}){
    const pool = connection_pool
    try{
        const [results] = await pool.execute(` INSERT INTO user_info (username, email, password, google_id, verified_email, salt, profile_pic) VALUES (?, ?, ?, ?, ?, ?, ?) `, [userName, email, password, google_id, verified_email, salt, profile_pic]);
        console.log('User created successfully. Inserted row ID:', results.insertId);
        return results.insertId; 
    } 
    catch(error){
        console.error("Error inserting user:", error);
        throw error; // Re-throw the error to be handled by the caller
    }
}

export async function updateGoogleUser({userName=null, email=null, password=null, google_id=null, verified_email=null, salt=null, profile_pic=null, connection_pool=null}){
    const pool = connection_pool
    try{
        const [result] = await pool.execute(`
            UPDATE user_info
            SET username = ?, email = ?, password = ?, google_id = ?, verified_email = ?, salt = ?, profile_pic = ?
            WHERE google_id = ?
        `, [userName, email, password, google_id, verified_email, salt, profile_pic, google_id]);
        if (result.affectedRows === 0) {
            console.log(`No user found with id ${google_id} to update.`);
            return false; // Or throw an error if you prefer
        }
        console.log(`User with id ${google_id} updated successfully.`);
        return true;
    } 
    catch(error){
        console.error("Error updating user info:", error);
        throw error; // Re-throw the error to be handled by the caller
    }
}

export async function checkUserExists({google_id=null, id=null, connection_pool=null}) {
    const pool = connection_pool
    try {
        if(google_id != null){
            const [rows] = await pool.execute('SELECT 1 FROM user_info WHERE google_id = ?', [google_id]);
            console.log(rows)
            return rows.length > 0; // Returns true if a row with the ID exists, false otherwise
        }
        if(id != null){
            const [rows] = await pool.execute('SELECT 1 FROM user_info WHERE id = ?', [id]);
            return rows.length > 0; // Returns true if a row with the ID exists, false otherwise
        }
    } catch (error) {
        console.error("Error checking user existence:", error);
        throw error; // Re-throw the error to be handled by the caller
    }
}
