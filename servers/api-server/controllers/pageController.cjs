const {pool} = require('../../database.cjs');
const {nanoid} = require("nanoid");

exports.createPage = async (req, res) => {
    let userId = req.body.userID;
    const username = req.body.username
    let pageTitle = "Untitled";
    let createdTime = new Date();
    let pageID = nanoid(10);
    let content = ''

    try {
        const query = await pool.query('INSERT INTO pages("userID", title, content, "pageID", time_created,' +
            ' username)' +
            ' VALUES($1, $2, $3, $4, $5, $6)',
            [userId, pageTitle, content, pageID, createdTime, username]);
        console.log('inserted page');
        res.json({pageID, currentContent: " ", msg: "inserted message"});
    } catch (err) {
        res.status(500).json({msg: "Error inserting page"});
        console.log(err.message);
    }
}

exports.getPage = async (req, res) => {
    let userID = req.query.userId;
    let pageTitle = req.query.pageTitle;

    try {
        const {rows} = await pool.query('SELECT * FROM pages WHERE "userID" = $1 AND title=$2', [userID, pageTitle]);

        res.json(rows[0]);

    } catch (err) {
        console.log(err.msg);
        res.status(500).json("oops error");
    }
}

exports.deletePage = async (req, res) => {
    let pageID = req.query.pageId
    console.log('got request with this id', pageID)

    try {
        const query = await pool.query(`DELETE FROM pages WHERE "pageID" = $1`, [pageID]);
        res.json('complete');
    } catch (err) {
        console.log(err)
        res.status(500).json('oops something happened when deleting content..');
    }
}

exports.sharePage = async (req, res) => {
    const pageID = req.query.pageID;
    const ownerUsername = req.query.ownerusername;
    const shareUsername = req.query.shareusername


    try {
        const query = await pool.query(`INSERT INTO share_pages(page_id, share_with_username, owner_username) VALUES ($1, $2, $3)`, [pageID, shareUsername, ownerUsername])
        res.json('page shared');
    } catch (err) {
        console.log(err)
        res.status(500).json('err')
    }
}

exports.getSharedPages = async (req, res) => {
    const username = req.query.username

    try {
        const {rows} = await pool.query(`SELECT * from share_pages WHERE share_with_username=$1`, [username]);
        res.json(rows)
    } catch (err) {
        console.log(err);
        res.status(500).json('err getting shared pages')
    }
}

exports.savePageContent = async (req, res) => {
    let pageID = req.body.pageId;
    let content = req.body.currentEditorContent;
    let pageTitle = req.body.pageTitle;

    let timeUpdated = new Date();


    try {
        console.log(pageID, content, pageTitle);
        const query = await pool.query('UPDATE pages SET content=$1 WHERE "pageID"=$2', [content, pageID]);
        res.json({message: 'Page content updated successfully'});

    } catch (err) {
        console.log(err);
        res.status(500).json('oops girl something happened when saving..');
    }

}

exports.getPageContent = async (req, res) => {
    let pageID = req.query.pageId;
    try {
        const {rows} = await pool.query(`SELECT content from pages WHERE "pageID" = $1`, [pageID]);
        res.json(rows[0].content);
    } catch (err) {
        console.log(err);
        res.status(500).json('oops girl something happened when getting content..');

    }
}

exports.saveTitle = async (req, res) => {
    const title = req.body.title;
    const pageID = req.body.roomId;

    console.log('save title request with', title, pageID)
    try {
        const query = await pool.query(`UPDATE pages SET title=$1 WHERE "pageID"=$2`, [title, pageID])
        const query2 = await pool.query('UPDATE share_pages SET title=$1 WHERE page_id=$2', [title, pageID])

        res.json('updated titles')
    } catch (err) {
        console.log(err)
        res.status(500).json('err saving title')
    }
}