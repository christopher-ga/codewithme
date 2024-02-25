const {pool2} = require('../../database.cjs')

exports.userLogIn = async (req, res) => {
    let username = req.body.data.username;
    let userID = req.body.data.id;

    try {
        const query = await pool2.query('INSERT INTO users(username, "userID") VALUES($1, $2)', [username, userID])
        console.log(username, userID, 'added to db');
        res.send('user add successfully');
    } catch (err) {
        console.log('error at userlogin route');
        console.log(err.message);
    }

}

exports.checkAccess = async (req, res) => {
    const username= req.query.username;
    const pageID = req.query.pageID;

    console.log(pageID, username);

    try {
        let {rows} = await pool2.query(`SELECT username, title FROM pages WHERE "pageID"=$1`, [pageID])
        let secondCheck = true;

        if (rows[0].username === username) {
            res.json({access: "Permitted", title: rows[0].title})
            console.log('permitted');
            secondCheck = false
        }

        if (secondCheck) {
            let {rows} = await pool2.query(`SELECT owner_username, title, share_with_username FROM share_pages WHERE page_id=$1`, [pageID])
            console.log(rows);
            if (rows[0] && rows[0].share_with_username === username) {
                res.json({access: "Permitted", title: rows[0].title})
            } else res.json("Denied")
        }

    } catch (err) {
        console.log(err);
        res.status(500).json('err checking access')
    }
}

exports.getUserPages = async (req, res) => {
    let userID = req.query.userID;

    try {
        const {rows} = await pool2.query('SELECT title, "pageID", time_created FROM pages WHERE' +
            ' "userID"' +
            ' = $1', [userID])



        res.json(rows)
    } catch (err) {
        console.log("getuserpages route error:", err.message);
    }
}