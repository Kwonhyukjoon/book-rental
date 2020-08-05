const connection = require("../db/mysql_connection");
const moment = require("moment");

// @desc      모든 책 목록 불러오는 API
// @route     GET/api/v1/book?offset=0&limit=25
// @request   offset,limit\

exports.getBooks = async (req, res, next) => {
  let offset = req.query.offset;
  let limit = req.query.limit;
  let query = `select * from book limit ${offset}, ${limit}`;
  console.log(query);
  try {
    [rows, fields] = await connection.query(query);
    let count = rows.length;
    res.status(200).json({ success: true, items: rows, count: count });
  } catch (e) {
    res.status(500).json({ success: false, message: "DB Error", error: e });
  }
};

// @desc    책 1권 대여하기
// @route   POST /api/v1/books
// @request  user_id , book_id , age
// @response success

exports.rentBook = async (req, res, next) => {
  let book_id = req.body.book_id;
  let user_id = req.user.id;
  let age = req.user.age;

  let query = `select * from book where id = ${book_id} and limit_age < ${age}`;
  console.log(query);

  try {
    [rows] = await connection.query(query);
    if (rows.length == 0) {
      res.status(400).json();
      return;
    }
    res.status(200).json({ success: true });
  } catch (e) {
    res.status(500).json({ success: false, e });
  }

  let currentTime = Date.now();
  let limit_date = currentTime + 1000 * 3600 * 24 * 7;
  limit_date = moment(limit_date).format("YYYY-MM-DD HH:mm:ss");
  console.log(limit_date);

  query = `insert into book_rental(limit_date,user_id,book_id) values("${limit_date}",${user_id},${book_id})`;
  console.log(query);
  try {
    [result] = await connection.query(query);
    res.status(200).json({ success: true, result });
  } catch (e) {
    res.status(500).json({ success: true, error: e });
    return;
  }
};

// @desc      내가 대여한 책 목록 불러오는 API
// @route     GET/api/v1/book/me?offset=0&limit=25
// @request   user_id,offset,limit
// @response success

exports.getMyBooks = async (req, res, next) => {
  let user_id = req.user.id;
  let offset = req.query.offset;
  let limit = req.query.limit;

  let query = `select * from book_rental as r join book as b on r.book_id = b.id where user_id = ${user_id} limit ${offset},${limit}`;
  console.log(query);
  try {
    [rows, fields] = await connection.query(query);
    let count = rows.length;
    res.status(200).json({ success: true, items: rows, count: count });
  } catch (e) {
    res.status(500).json({ success: false, message: "DB Error", error: e });
  }
};

// @desc      책 반납하기 API
// @route     DELETE/api/v1/book/return
// @request   user_id,book_id
// @response success

exports.returnBook = async (req, res, next) => {
  let user_id = req.user.id;
  let book_id = req.body.book_id;
  console.log(user_id);
  if (!user_id) {
    res.status(400).json();
    return;
  }

  let query = `delete from book_rental where user_id = ${user_id} and book_id = ${book_id}`;
  console.log(query);

  try {
    [result] = await connection.query(query);
    res.status(200).json({ success: true });
  } catch (e) {
    res.status(500).json();
  }
};
