const express = require("express");
const mysql = require("mysql");
const cors = require("cors");

const crypto = require("crypto");
const https = require("https");
const axios = require("axios");

const app = express();
app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "luanvan",
});

// test momo:
// NGUYEN VAN A
// 9704 0000 0000 0018
// 03/07
// OTP

//MOMO
app.post("/api/hoadon", (req, res) => {
  const {
    HinhThucMua,
    SoLuong,
    Gia,
    NgayDatHang,
    TrangThaiGiao,
    DiaChiNhan,
    MaSanPham,
    MaKhachHang,
    MaGioSanPham,
    MaTrangThaiThanhToan,
  } = req.body;

  if (
    !HinhThucMua ||
    !SoLuong ||
    !Gia ||
    !NgayDatHang ||
    !TrangThaiGiao ||
    !DiaChiNhan ||
    !MaSanPham ||
    !MaKhachHang ||
    !MaGioSanPham ||
    !MaTrangThaiThanhToan
  ) {
    return res.status(400).json({ error: "Thiếu thông tin cần thiết." });
  }

  const insertInvoiceQuery = `
    INSERT INTO hoadon (HinhThucMua, SoLuong, Gia, NgayDatHang, TrangThaiGiao, DiaChiNhan, MaSanPham, MaKhachHang, MaGioSanPham, MaTrangThaiThanhToan)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(
    insertInvoiceQuery,
    [
      HinhThucMua,
      SoLuong,
      Gia,
      NgayDatHang,
      TrangThaiGiao,
      DiaChiNhan,
      MaSanPham,
      MaKhachHang,
      MaGioSanPham,
      MaTrangThaiThanhToan,
    ],
    (err, result) => {
      if (err) {
        console.error("Database error:", err);
        return res
          .status(500)
          .json({ error: "Có lỗi xảy ra khi lưu hóa đơn." });
      }

      const createNewCartQuery = "INSERT INTO giohang (MaKhachHang) VALUES (?)";
      db.query(createNewCartQuery, [MaKhachHang], (createErr, createResult) => {
        if (createErr) {
          console.error("Error creating new cart:", createErr);
          return res
            .status(500)
            .json({ error: "Có lỗi xảy ra khi tạo giỏ hàng mới." });
        }

        const newMaGioHang = createResult.insertId;

        res.status(200).json({
          message: "Giỏ hàng mới đã được tạo thành công.",
          MaGioHangMoi: newMaGioHang,
        });
      });
    }
  );
});

//hoadon
app.post("/api/hoadon", (req, res) => {
  const {
    HinhThucMua,
    SoLuong,
    Gia,
    NgayDatHang,
    TrangThaiGiao,
    DiaChiNhan,
    MaSanPham,
    MaKhachHang,
    MaGioSanPham,
    MaTrangThaiThanhToan,
  } = req.body;

  // In ra tất cả dữ liệu nhận được từ frontend
  console.log("Received data from frontend:", req.body);

  // Kiểm tra dữ liệu đầu vào
  if (
    !HinhThucMua ||
    !SoLuong ||
    !Gia ||
    !NgayDatHang ||
    !TrangThaiGiao ||
    !DiaChiNhan ||
    !MaSanPham ||
    !MaKhachHang ||
    !MaGioSanPham ||
    !MaTrangThaiThanhToan
  ) {
    console.log("Error: Missing required fields.");
    return res.status(400).json({ error: "Thiếu thông tin cần thiết." });
  }

  if (SoLuong <= 0) {
    console.log("Error: Invalid quantity.");
    return res.status(400).json({ error: "Số lượng không hợp lệ." });
  }

  if (Gia <= 0) {
    console.log("Error: Invalid price.");
    return res.status(400).json({ error: "Giá không hợp lệ." });
  }

  // Kiểm tra địa chỉ nhận có độ dài hợp lệ
  if (DiaChiNhan.length > 100) {
    console.log("Error: Invalid address length.");
    return res
      .status(400)
      .json({ error: "Địa chỉ nhận quá dài (tối đa 100 ký tự)." });
  }

  const insertInvoiceQuery = `
    INSERT INTO hoadon (HinhThucMua, SoLuong, Gia, NgayDatHang, TrangThaiGiao, DiaChiNhan, MaSanPham, MaKhachHang, MaGioSanPham, MaTrangThaiThanhToan)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  // In câu truy vấn SQL để kiểm tra
  console.log("Insert Query:", insertInvoiceQuery);
  console.log("Received data:", req.body); // Log dữ liệu nhận được
  // Đảm bảo rằng các trường trong req.body có giá trị hợp lệ
  if (!req.body.HinhThucMua || !req.body.SoLuong || !req.body.Gia) {
    return res.status(400).json({ error: "Thiếu dữ liệu cần thiết." });
  }
  db.query(
    insertInvoiceQuery,
    [
      HinhThucMua,
      SoLuong,
      Gia,
      NgayDatHang,
      TrangThaiGiao,
      DiaChiNhan,
      MaSanPham,
      MaKhachHang,
      MaGioSanPham,
      MaTrangThaiThanhToan,
    ],
    (err, result) => {
      if (err) {
        console.error("Database error:", err);
        return res
          .status(500)
          .json({ error: "Có lỗi xảy ra khi lưu hóa đơn." });
      }

      const createNewCartQuery = "INSERT INTO giohang (MaKhachHang) VALUES (?)";

      // In câu truy vấn SQL khi tạo giỏ hàng mới
      console.log("Create New Cart Query:", createNewCartQuery);

      db.query(createNewCartQuery, [MaKhachHang], (createErr, createResult) => {
        if (createErr) {
          console.error("Error creating new cart:", createErr);
          return res
            .status(500)
            .json({ error: "Có lỗi xảy ra khi tạo giỏ hàng mới." });
        }

        const newMaGioHang = createResult.insertId;
        console.log("New Cart Created with ID:", newMaGioHang);
        res.status(200).json({
          message: "Giỏ hàng mới đã được tạo thành công.",
          MaGioHangMoi: newMaGioHang,
        });
      });
    }
  );
});

// API lấy MaGioHang lớn nhất
app.get("/api/cart/max", (req, res) => {
  const query = "SELECT MAX(MaGioHang) AS maxMaGioHang FROM gio_sanpham";

  db.query(query, (err, results) => {
    if (err) {
      console.error("Lỗi khi truy vấn MySQL:", err);
      res.status(500).json({ message: "Lỗi server" });
    } else {
      if (results.length > 0) {
        res.json({ maxMaGioHang: results[0].maxMaGioHang });
      } else {
        res.status(404).json({ message: "Không tìm thấy giỏ hàng nào" });
      }
    }
  });
});

// API thêm sản phẩm vào giỏ hàng
app.post("/api/cart/add", (req, res) => {
  console.log("Received request body:", req.body); // Kiểm tra dữ liệu nhận được
  const { MaKhachHang, MaSanPham, SoLuong } = req.body;

  if (!MaKhachHang || !MaSanPham || !SoLuong) {
    return res.status(400).json({ error: "Thiếu thông tin cần thiết" });
  }

  // Bước 1: Kiểm tra xem khách hàng đã có giỏ hàng chưa
  const checkCartQuery = "SELECT MaGioHang FROM giohang WHERE MaKhachHang = ? "; // Kiểm tra giỏ hàng đang hoạt động

  db.query(checkCartQuery, [MaKhachHang], (err, result) => {
    if (err) {
      console.error("Lỗi khi kiểm tra giỏ hàng:", err);
      return res
        .status(500)
        .json({ error: "Có lỗi xảy ra khi kiểm tra giỏ hàng" });
    }

    let MaGioHang;

    if (result.length === 0) {
      // Nếu khách hàng chưa có giỏ hàng, tạo một giỏ hàng mới
      const createCartQuery =
        "INSERT INTO giohang (MaKhachHang, TrangThaiGioHang) VALUES (?, 'active')";

      db.query(createCartQuery, [MaKhachHang], (err, result) => {
        if (err) {
          console.error("Lỗi khi tạo giỏ hàng mới:", err);
          return res
            .status(500)
            .json({ error: "Có lỗi xảy ra khi tạo giỏ hàng" });
        }

        MaGioHang = result.insertId; // Lấy MaGioHang vừa tạo
        // Sau khi tạo giỏ hàng mới, thêm sản phẩm vào giỏ hàng
        addProductToCart(MaSanPham, SoLuong, MaGioHang, res);
      });
    } else {
      // Nếu khách hàng đã có giỏ hàng, sử dụng MaGioHang hiện tại
      MaGioHang = result[0].MaGioHang;
      // Thêm sản phẩm vào giỏ hàng hiện tại
      addProductToCart(MaSanPham, SoLuong, MaGioHang, res);
    }
  });
});

// Lấy sản phẩm trong giỏ hàng
app.get("/api/cart/:maGioHang", (req, res) => {
  const { maGioHang } = req.params;
  const sql = `
    SELECT gs.MaGioSanPham, sp.TenSanPham, gs.SoLuong, gs.Gia
    FROM gio_sanpham gs
    JOIN sanpham sp ON gs.MaSanPham = sp.MaSanPham
    WHERE gs.MaGioHang = ?
  `;
  db.query(sql, [maGioHang], (err, result) => {
    if (err) {
      console.error("Lỗi khi lấy sản phẩm trong giỏ hàng:", err);
      return res.status(500).json({ error: "Có lỗi khi lấy giỏ hàng." });
    }

    return res.status(200).json(result);
  });
});

// Xóa SP ở Giỏ Hàng
app.delete("/api/cart/remove/:maGioSanPham", (req, res) => {
  const { maGioSanPham } = req.params;
  const sql = "DELETE FROM gio_sanpham WHERE MaGioSanPham = ?";
  db.query(sql, [maGioSanPham], (err, result) => {
    if (err) return res.status(500).json(err);
    return res.json({ message: "Sản phẩm đã được xóa khỏi giỏ hàng" });
  });
});

// cập nhật số lượng sản phẩm trong giỏ hàng -- Cart()
app.put("/api/cart/update", (req, res) => {
  const { MaGioSanPham, SoLuong } = req.body;

  if (SoLuong < 1) {
    return res.status(400).json({ message: "Số lượng phải lớn hơn 0" });
  }
  const updateSql = `
    UPDATE gio_sanpham 
    SET SoLuong = ? 
    WHERE MaGioSanPham = ?
  `;
  db.query(updateSql, [SoLuong, MaGioSanPham], (err, result) => {
    if (err) {
      console.error("Lỗi khi cập nhật số lượng:", err);
      return res
        .status(500)
        .json({ message: "Lỗi server khi cập nhật số lượng" });
    }

    if (result.affectedRows === 0) {
      return res
        .status(404)
        .json({ message: "Không tìm thấy sản phẩm trong giỏ hàng" });
    }

    res.status(200).json({ message: "Cập nhật số lượng thành công" });
  });
});

// Lấy giỏ hàng cho khách hàng
app.post("/api/cart/add", (req, res) => {
  console.log("Received request body:", req.body); // Kiểm tra dữ liệu nhận được
  const { MaKhachHang, MaSanPham, SoLuong } = req.body;

  if (!MaKhachHang || !MaSanPham || !SoLuong) {
    return res.status(400).json({ error: "Thiếu thông tin cần thiết" });
  }

  // Bước 1: Kiểm tra xem khách hàng đã có giỏ hàng chưa
  const checkCartQuery = "SELECT MaGioHang FROM giohang WHERE MaKhachHang = ?"; // Kiểm tra giỏ hàng đang hoạt động

  db.query(checkCartQuery, [MaKhachHang], (err, result) => {
    if (err) {
      console.error("Lỗi khi kiểm tra giỏ hàng:", err);
      return res
        .status(500)
        .json({ error: "Có lỗi xảy ra khi kiểm tra giỏ hàng" });
    }

    let MaGioHang;

    if (result.length === 0) {
      // Nếu khách hàng chưa có giỏ hàng, tạo một giỏ hàng mới
      const createCartQuery =
        "INSERT INTO giohang (MaKhachHang, TrangThaiGioHang) VALUES (?, 'active')";

      db.query(createCartQuery, [MaKhachHang], (err, result) => {
        if (err) {
          console.error("Lỗi khi tạo giỏ hàng mới:", err);
          return res
            .status(500)
            .json({ error: "Có lỗi xảy ra khi tạo giỏ hàng" });
        }

        MaGioHang = result.insertId; // Lấy MaGioHang vừa tạo
        // Sau khi tạo giỏ hàng mới, thêm sản phẩm vào giỏ hàng
        addProductToCart(MaSanPham, SoLuong, MaGioHang, res);
      });
    } else {
      // Nếu khách hàng đã có giỏ hàng, sử dụng MaGioHang hiện tại
      MaGioHang = result[0].MaGioHang;
      // Thêm sản phẩm vào giỏ hàng hiện tại
      addProductToCart(MaSanPham, SoLuong, MaGioHang, res);
    }
  });
});

// Hàm thêm sản phẩm vào giỏ hàng
app.post("/api/cart/add", (req, res) => {
  const { MaKhachHang, MaSanPham, SoLuong } = req.body;

  if (!MaKhachHang || !MaSanPham || !SoLuong) {
    return res.status(400).json({ error: "Thiếu thông tin cần thiết" });
  }

  const checkCartQuery =
    "SELECT MaGioHang FROM giohang WHERE MaKhachHang = ? AND TrangThaiGioHang = 'active'";

  db.query(checkCartQuery, [MaKhachHang], (err, result) => {
    if (err) {
      console.error("Lỗi khi kiểm tra giỏ hàng:", err);
      return res
        .status(500)
        .json({ error: "Có lỗi xảy ra khi kiểm tra giỏ hàng" });
    }

    let MaGioHang;

    if (result.length === 0) {
      const createCartQuery =
        "INSERT INTO giohang (MaKhachHang, TrangThaiGioHang) VALUES (?, 'active')";
      db.query(createCartQuery, [MaKhachHang], (err, createResult) => {
        if (err) {
          console.error("Lỗi khi tạo giỏ hàng mới:", err);
          return res
            .status(500)
            .json({ error: "Có lỗi xảy ra khi tạo giỏ hàng" });
        }

        MaGioHang = createResult.insertId;
        addProductToCart(MaSanPham, SoLuong, MaGioHang, res);
      });
    } else {
      MaGioHang = result[0].MaGioHang;
      addProductToCart(MaSanPham, SoLuong, MaGioHang, res);
    }
  });
});

// Hàm thêm sản phẩm vào giỏ hàng
function addProductToCart(MaSanPham, SoLuong, MaGioHang, res) {
  // Bước 2: Lấy giá của sản phẩm từ cơ sở dữ liệu
  const getProductPriceQuery = "SELECT Gia FROM sanpham WHERE MaSanPham = ?";

  db.query(getProductPriceQuery, [MaSanPham], (err, result) => {
    if (err) {
      console.error("Lỗi khi lấy giá sản phẩm:", err);
      return res
        .status(500)
        .json({ error: "Có lỗi xảy ra khi lấy giá sản phẩm" });
    }

    if (result.length === 0) {
      return res.status(404).json({ error: "Sản phẩm không tồn tại" });
    }

    const Gia = result[0].Gia; // Lấy giá từ kết quả truy vấn

    // Bước 3: Thêm sản phẩm vào giỏ hàng
    const addToCartQuery =
      "INSERT INTO gio_sanpham (MaSanPham, SoLuong, Gia, MaGioHang) VALUES (?, ?, ?, ?)";

    db.query(
      addToCartQuery,
      [MaSanPham, SoLuong, Gia, MaGioHang],
      (addErr, addResult) => {
        if (addErr) {
          console.error("Lỗi khi thêm sản phẩm vào giỏ hàng:", addErr);
          return res
            .status(500)
            .json({ error: "Có lỗi xảy ra khi thêm sản phẩm" });
        }

        res.status(200).json({
          message: "Sản phẩm đã được thêm vào giỏ hàng.",
          MaGioHang: MaGioHang,
        });
      }
    );
  });
}

//KhachHang
app.get("/api/customer/:maKhachHang", (req, res) => {
  const { maKhachHang } = req.params;
  const sql = "SELECT HoTen, Email, sdt FROM khachhang WHERE MaKhachHang = ?";

  db.query(sql, [maKhachHang], (err, result) => {
    if (err) {
      console.error("Lỗi khi lấy thông tin khách hàng:", err);
      return res
        .status(500)
        .json({ message: "Lỗi server khi lấy thông tin khách hàng!" });
    }

    if (result.length === 0) {
      return res.status(404).json({ message: "Khách hàng không tồn tại!" });
    }
    return res.status(200).json(result[0]);
  });
});

// Chi Nhánh
app.get("/chinhanh", (req, res) => {
  const sql = "SELECT * FROM chinhanh";
  db.query(sql, (err, data) => {
    if (err) return res.json(err);
    return res.json(data);
  });
});

// Sản phẩm
app.get("/sanpham", (req, res) => {
  const sql = "SELECT * FROM sanpham";
  db.query(sql, (err, data) => {
    if (err) return res.json(err);
    return res.json(data);
  });
});

app.get("/loai-sanpham", (req, res) => {
  const sql = "SELECT DISTINCT Loai FROM sanpham";
  db.query(sql, (err, data) => {
    if (err) return res.json(err);
    return res.json(data);
  });
});

app.get("/sanpham/:maSanPham", (req, res) => {
  const { maSanPham } = req.params;
  const sql = "SELECT * FROM sanpham WHERE MaSanPham = ?";
  db.query(sql, [maSanPham], (err, data) => {
    if (err) return res.json(err);
    return res.json(data[0]);
  });
});

app.get("/detail-orther", (req, res) => {
  const sql = "SELECT * FROM sanpham ORDER BY RAND() LIMIT 3";
  db.query(sql, (err, data) => {
    if (err) return res.json(err);
    return res.json(data);
  });
});

app.get("/same-products/:maSanPham", (req, res) => {
  const maSanPham = req.params.maSanPham;
  const sql =
    "SELECT * FROM sanpham WHERE Loai = (SELECT Loai FROM sanpham WHERE MaSanPham = ?) AND MaSanPham != ? LIMIT 5";
  db.query(sql, [maSanPham, maSanPham], (err, data) => {
    if (err) return res.json(err);
    return res.json(data);
  });
});

// TEST SERVER
app.get("/", (re, res) => {
  return res.json("From Backend Side");
});

app.listen(8081, () => {
  console.log("listening");
});
