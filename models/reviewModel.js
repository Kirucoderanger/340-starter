const pool = require("../database/"); 

/*async function addReview(vehicle_id, account_id, review_text, rating) {
    const sql = `
        INSERT INTO reviews (vehicle_id, account_id, review_text, rating)
        VALUES ($1,$2,$3,$4) RETURNING *
    `;
    const [result] = await pool.query(sql, [vehicle_id, account_id, review_text, rating]);
    return result;

   
    
}*/


// Add a new review
async function addReview(vehicle_id, account_id, review_text, rating) {
    const sql = `
        INSERT INTO public.reviews (vehicle_id, account_id, review_text, rating)
        VALUES ($1, $2, $3, $4)
        RETURNING review_id
    `;
    const result = await pool.query(sql, [vehicle_id, account_id, review_text, rating]);
    return result.rows[0]; // returns the inserted review_id
}

/*async function getReviewsByVehicle(vehicle_id) {
    const sql = `
        SELECT r.*, a.account_firstname, a.account_lastname 
        FROM public.reviews r
        JOIN account a ON r.account_id = a.account_id
        WHERE r.vehicle_id = ?
        ORDER BY r.created_at DESC
    `;
    //const [rows] = await pool.execute(sql, [vehicle_id]);
    //return rows;
    const result = await pool.query(sql, [vehicle_id]);
    return result.rowCount
    //const result = await pool.query(sql, [classification_name])
    //return result.rowCount 
}
*/
async function getReviewsByVehicle(vehicle_id) {
    const sql = `
        SELECT r.*, a.account_firstname, a.account_lastname
        FROM public.reviews r
        JOIN public.account a ON r.account_id = a.account_id
        WHERE r.vehicle_id = $1
        ORDER BY r.created_at DESC
    `;
    //const [rows] = await pool.query(sql, [vehicle_id]); // use query, not execute
    //return rows;
    const result = await pool.query(sql, [vehicle_id]);
    //return result.rowCount
    return result.rows;
}


module.exports = { addReview, getReviewsByVehicle };
