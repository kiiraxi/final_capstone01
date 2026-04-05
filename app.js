require('dotenv').config(); 
const PORT = process.env.PORT || 5000
const crypto = require("crypto"); 
const express = require('express');
const app = express();
const path = require('path');

app.use(express.static(path.join(__dirname, 'public')));


app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs'); // change if you use pug or hbs

const multer = require('multer');
app.set("view engine", "ejs");


app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const Tesseract = require('tesseract.js');
const fs = require('fs');
const sharp = require("sharp");


const axios = require("axios");
const cors = require("cors");


app.use(cors());
app.use(express.json());


//----- SESSION SET UP -------
const session = require('express-session');
app.use(session({
    secret: "your_secret_key",
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true, 
        secure: process.env.NODE_ENV === 'production' 
    }
}));

// -----  Middleware Definitions -----

const isLoggedIn = (req, res, next) => {
    if (req.session.user) {
        return next();
    }
    res.redirect('/login.html');
};


const isNotLoggedIn = (req, res, next) => {
    if (req.session.user) {
        return res.redirect('/form.html'); 
    }
    next();
}


app.get('/login.html', isNotLoggedIn, (req, res) => {
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    res.sendFile(path.join(__dirname, 'public', 'login.html'));
});


app.get('/register.html', isNotLoggedIn, (req, res) => {
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    res.sendFile(path.join(__dirname, 'public', 'register.html'));
});


//all file in upload folder
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

//------- MULTER SETUP ------------- 
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, 'public/uploads');
    fs.mkdirSync(uploadPath, { recursive: true }); 
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage }); 


app.get('/auth.html', isLoggedIn, (req, res) => {
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    if (!req.session.otp) {
        return res.redirect('/form.html');
    }
    res.sendFile(path.join(__dirname, 'public', 'auth.html'));
});

app.get('/userhomepage.html', isLoggedIn, (req, res) => {
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
  
    res.sendFile(path.join(__dirname, 'public', 'userhomepage.html'));
  });
  
  
  app.get('/useraboutpage.html', isLoggedIn, (req, res) => {
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
  
    res.sendFile(path.join(__dirname, 'public', 'userhomepage.html'));
  });


  app.get('/userservicepage.html', isLoggedIn, (req, res) => {
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
  
    res.sendFile(path.join(__dirname, 'public', 'userhomepage.html'));
  });

  app.get("/logout", (req, res) => {
    req.session.destroy(err => {
      if (err) {
        console.error("Logout Error:", err);
        return res.status(500).send("Logout failed");
      }
      res.setHeader('Cache-Control', 'no-store');
      res.redirect('/login.html');
    });
  });
  
  


app.get('/form.html', isLoggedIn, (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'form.html'));
});

app.get('/ptrform.html', isLoggedIn, (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'ptrform.html'));
});

app.get('/corporation.html', isLoggedIn, (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'corporation.html'));
});




app.use(express.static("public"));

const bcrypt = require('bcryptjs');
const conn = require('./conn.js');

//-------- Nodemailer Setup -------
const nodemailer = require('nodemailer');
const transporter = nodemailer.createTransport({
    service: 'gmail', 
    secure: true,      
    port: 465,        
    auth: {
        user: process.env.EMAIL_USER, 
        pass: process.env.EMAIL_PASS  
    }
});

// ----- email transporter --------
transporter.verify((error, success) => {
    if (error) {
        console.error("Error verifying transporter:", error);
    } else {
        console.log("Email transporter is ready to send messages!");
    }
});


//----- LOGIN ------

app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).send('Email and password are required.');
    }

    const sql = 'SELECT ID,FIRST_NAME, LAST_NAME, PASSWORD FROM register WHERE EMAIL_ADDRESS = ?'; 
    conn.query(sql, [email], async (err, results) => {
        if (err) {
            console.error("Database error:", err);
            return res.status(500).send("Server error");
        }

        if (results.length === 0) {
            return res.send('<script>alert("Invalid email or password."); window.location.href="/login.html";</script>');
        }

        const userId = results[0].ID; 
        const storedPassword = results[0].PASSWORD;
        const firstname = results[0].FIRST_NAME;
        const lastname = results[0].LAST_NAME;

        try {
            let isMatch = false;
            if (storedPassword.startsWith("$2a$")) {
                isMatch = await bcrypt.compare(password, storedPassword);
            } else {
                isMatch = (password === storedPassword);
                if (isMatch) {
                    const newHashedPassword = await bcrypt.hash(password, 10);
                    const updateQuery = 'UPDATE register SET PASSWORD = ? WHERE EMAIL_ADDRESS = ?';
                    conn.query(updateQuery, [newHashedPassword, email], (err) => {
                        if (err) {
                            console.error("Password update error:", err);
                        }
                    });
                }
            }

            if (!isMatch) {
                return res.send('<script>alert("Invalid email or password."); window.location.href="/login.html";</script>');
            }


            req.session.userId = userId;
            req.session.user = {
              id: userId,
              email,
              firstname,
              lastname
              
            };
       
            const otp = Math.floor(100000 + Math.random() * 900000).toString();


            req.session.otp = {
                code: otp,
                expires: Date.now() + 5 * 60 * 1000 
            };


            const mailOptions = {
                from: process.env.EMAIL_USER,
                to: email,
                subject: 'Your OTP Code',
                html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
                    <h1 style="color: #333;">Hello,</h1>
                    <p style="font-size: 16px; color: #555;">
                        We have received a request to verify your identity. Your One-Time Password (OTP) code is:
                    </p>
                    <p style="font-size: 24px; font-weight: bold; color: #4CAF50; margin: 20px 0; text-align: center;">
                        ${otp}
                    </p>
                    <p style="font-size: 16px; color: #555;">
                        This code will expire in <strong>5 minutes</strong>. Please use it promptly to complete your verification process.<strong>DO NOT SHARE YOUR CODE TO ANYONE.</strong>
                    </p>
                    <p style="font-size: 16px; color: #555;">
                        If you did not request this, please disregard this email.
                    </p>
                    <p style="font-size: 16px; color: #555;">
                        Best regards,<br>
                        <strong>Cedula Admin Team</strong>
                    </p>
                </div>`
            };
            


            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    console.error("Error sending OTP email:", error);
                    return res.status(500).send("Error sending OTP email.");
                }
                console.log("OTP email sent:", info.response);


                return res.redirect('/auth.html');
            });
        } catch (error) {
            console.error('Password comparison or OTP error:', error);
            return res.status(500).send("Server error");
        }
    });
});




// ------- REGISTER ------
app.post('/register', upload.single('id_file'), async (req, res) => {
    const { first_name, last_name, email, password, con_pass, id_number } = req.body;
    const id_file = req.file;

    if (!first_name || !last_name || !email || !password || !con_pass || !id_file || !id_number) {
        return res.status(400).send('All fields are required.');
    }

    if (password !== con_pass) {
        return res.status(400).send('Passwords do not match.');
    }

    try {
        //OCR  extract text from uploaded ID 
        const result = await Tesseract.recognize(id_file.path, 'eng');
        const extractedText = result.data.text.toLowerCase();

        console.log(' Extracted OCR Text:\n', extractedText); 

        // Check if name and ID number are match
        const fullNameMatch = extractedText.includes(first_name.toLowerCase()) && extractedText.includes(last_name.toLowerCase());
        const idNumberMatch = extractedText.includes(id_number.toLowerCase());

        if (!fullNameMatch || !idNumberMatch) {
           
            fs.unlinkSync(id_file.path);
            return res.status(400).send('ID verification unsuccessful. The credentials provided do not match.');
        }
        

        //check if email already exists
        const checkEmailQuery = 'SELECT * FROM register WHERE EMAIL_ADDRESS = ?';
        conn.query(checkEmailQuery, [email], async (err, results) => {
            if (err) {
                console.error("Database error:", err);
                return res.status(500).send("An error occurred.");
            }

            if (results.length > 0) {
                fs.unlinkSync(id_file.path); 
                return res.status(400).send('Email already registered.');
            }

            const hashedPassword = await bcrypt.hash(password, 10);
            const sql = 'INSERT INTO register (FIRST_NAME, LAST_NAME, EMAIL_ADDRESS, PASSWORD, id_file) VALUES (?, ?, ?, ?, ?)';

            conn.query(sql, [first_name, last_name, email, hashedPassword, id_file.filename, id_number], (err) => {
                if (err) {
                    console.error("Database error:", err);
                    return res.status(500).send("An error occurred.");
                }
                res.redirect('/login.html');
            });
        });

    } catch (err) {
        console.error("OCR or registration error:", err);
        return res.status(500).send("Internal server error during ID verification.");
    }
});

//-------- OTP Verification -------
app.post('/auth', (req, res) => {
    const { otp } = req.body;
    if (!req.session.otp || !otp || Date.now() > req.session.otp.expires) {
        return res.status(400).send("OTP expired");
    }
    
    if (otp === req.session.otp.code) {
        
        req.session.otp = null;
        return res.send("OTP verified");
    } else {
        return res.status(400).send("Invalid OTP");
    }
});

// ----- Home Route -----
app.get('/', async (req, res) => {
    try {
        const sql = 'SELECT id, firstname, lname FROM form';
        conn.query(sql, (err, result) => {
            if (err) {
                console.error(err);
                return res.status(500).send("Server error");
            }
            res.render('index', { users: result.rows }); // <-- pass result.rows
        });
    } catch (error) {
        console.error(error);
        res.status(500).send("Server error");
    }
});
app.get('/view-details/:id', async (req, res) => {
    const userId = req.params.id; 
    try {
        const sql = 'SELECT * FROM form WHERE id = ?';
        conn.query(sql, [userId], (err, rows) => {
            if (err) {
                console.error(err);
                return res.status(500).send("Server error");
            }
            if (rows.length > 0) {
                res.render('view-details', { user: rows[0] }); 
            } else {
                res.status(404).send("Data not found");
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).send("Server error");
    }
});

// ---- Automaticall fill-up users name&lastname on form from acc registration ---- 
app.get('/api/user', (req, res) => {
    if (!req.session.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
  
    
    const { firstname, lastname} = req.session.user;
    res.json({ firstname, lastname});
  });
  


// ----- INDIVIDUAL TAX FORM -----
app.post("/form", upload.single("myfile"), async (req, res) => {
  const {
    lname, firstname, middlename, citizenship, address, gender, civil_status,
    birth_place, birth_date, height, weight, profession, tin, gross_receipt,
    annual_income, real_property_income, total_taxable, interest, ctc_amount,
    place_issue, date_issue, signature_data
  } = req.body;

  const file = req.file;
  const imagePath = file ? "uploads/" + file.filename : null;

 
  let signatureFilePath = null;
  if (signature_data && signature_data.startsWith("data:image/")) {
    try {
      const base64Data = signature_data.replace(/^data:image\/\w+;base64,/, "");
      const fileName = `signature_${Date.now()}.png`;
      const dir = path.join(__dirname, "uploads", "signatures");

      
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }

      
      signatureFilePath = path.join("uploads/signatures", fileName);
      fs.writeFileSync(path.join(__dirname, signatureFilePath), base64Data, "base64");

      console.log("✅ Signature saved at:", signatureFilePath);
    } catch (err) {
      console.error("❌ Error saving signature:", err);
      return res.status(500).send(`
        <script>
          alert("Error saving signature. Please try again.");
          window.location.href = "/form.html";
        </script>
      `);
    }
  }


  if (
    !lname || !firstname || !middlename || !citizenship || !address ||
    !gender || !civil_status || !birth_place || !birth_date ||
    !place_issue || !date_issue || !signatureFilePath
  ) {
    return res.status(400).send(`
      <script>
        alert("All required fields must be provided, including signature.");
        window.location.href = "/form.html";
      </script>
    `);
  }

  
  const validCivilStatuses = ["Single", "Married", "Divorced", "Widowed"];
  if (!validCivilStatuses.includes(civil_status)) {
    return res.status(400).send(`
      <script>
        alert("Invalid Civil Status value. Please select a valid option.");
        window.location.href = "/form.html";
      </script>
    `);
  }

  //  Check session
  const userId = req.session.userId;
  if (!userId) {
    return res.status(400).send(`
      <script>
        alert("User session not found. Please log in again.");
        window.location.href = "/login.html";
      </script>
    `);
  }

  // Prevent multiple submissions per month
  const checkQuery = `
    SELECT id FROM form 
    WHERE USER_ID = ? 
    AND YEAR(DATE_ISSUED) = YEAR(CURDATE()) 
    AND MONTH(DATE_ISSUED) = MONTH(CURDATE())
  `;

  conn.query(checkQuery, [userId], (err, results) => {
    if (err) {
      console.error("Error checking existing request:", err);
      return res.status(500).send(`
        <script>
          alert("Database error. Please try again later.");
          window.location.href = "/form.html";
        </script>
      `);
    }

    if (results.length > 0) {
      return req.session.destroy(() => {
        res.send(`
          <script>
            alert("You can only submit one request per month. You have been logged out.");
            window.location.href = "/login.html";
          </script>
        `);
      });
    }

    const reference_number = `CTC-${crypto.randomInt(100000, 999999)}`;
    const insertQuery = `
      INSERT INTO form (
        reference_number, LAST_NAME, FIRST_NAME, MIDDLE_NAME, CITIZENSHIP, ADDRESS, 
        GENDER, CIVIL_STATUS, PLACE_BIRTH, DATE_BIRTH, HEIGHT, WEIGHT, PBO, TIN_NUMBER, 
        SIGNATURE, GRB, AGI, RPI, TTA, INTEREST, AMOUNT, PLACE_ISSUE, DATE_ISSUED, STATUS, USER_ID
      ) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'Pending', ?)
    `;

    conn.query(
      insertQuery,
      [
        reference_number, lname, firstname, middlename, citizenship, address,
        gender, civil_status, birth_place, birth_date, height, weight, profession,
        tin, signatureFilePath, gross_receipt, annual_income, real_property_income,
        total_taxable, interest, ctc_amount, place_issue, date_issue, userId,
      ],
      (err) => {
        if (err) {
          console.error("SQL Error:", err.sqlMessage);
          return res.status(500).send(`
            <script>
              alert("An error occurred while submitting your request. Please try again.");
              window.location.href = "/form.html";
            </script>
          `);
        }

        
        req.session.destroy(() => {
          res.send(`
            <script>
              alert("Thank you for filling up the form. Please wait for the admin to approve your request.");
              window.location.href = "/userhomepage.html";
            </script>
          `);
        });
      }
    );
  });
});





/// ----- PTR FORM -----
app.post("/ptrform", upload.single('myfile'), (req, res) => {
  const {
    place_issue, date_issue, lname, firstname, middlename, suffix, address,
    contact_number, email, profession, registered_date, expiration_date, prc_num
  } = req.body;

  const file = req.file;
  const imagePath = file ? file.path : null;

  // Validation
  if (!place_issue || !date_issue || !lname || !firstname || !middlename || !address ||
      !contact_number || !email || !profession || !registered_date || !expiration_date || !prc_num || !file) {
    return res.status(400).send(`
      <script>
        alert("All required fields including file must be provided.");
        window.location.href = "/ptrform.html";
      </script>
    `);
  }

  const userId = req.session.userId;
  if (!userId) {
    return res.status(400).send(`
      <script>
        alert("User session not found. Please log in again.");
        window.location.href = "/login.html";
      </script>
    `);
  }

  const insertQuery = `
    INSERT INTO ptrform 
    (PLACE_ISSUED, DATE_ISSUED, LAST_NAME, FIRST_NAME, MIDDLE_NAME, SUFFIX, ADDRESS, CONTACT_NUM,
     EMAIL, PROFESSION, REGISTERED_DATE, EX_DATE, PRC_NUM, IMAGE, STATUS, USER_ID)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'Pending', ?)
  `;

  conn.query(insertQuery, [
    place_issue, date_issue, lname, firstname, middlename, suffix, address, contact_number,
    email, profession, registered_date, expiration_date, prc_num, file.filename, userId
  ], (err, result) => {
    if (err) {
      console.error("Insert error:", err);
      return res.status(500).send(`
        <script>
          alert("An error occurred while submitting your PTR form. Please try again.");
          window.location.href = "/ptrform.html";
        </script>
      `);
    }

    res.send(`
      <script>
        alert("PTR form submitted successfully! Please wait for approval.");
        window.location.href = "/userhomepage.html";
      </script>
    `);
  });
});

//---- CORP FORM ----
app.post("/corporation", (req, res) => {
    const {
        place_issue, date_issue, company_name, address, place_incorp, date_registration, oganization,
        tin, real_property, gross_receipt, total_taxable, interest, ctc_amount
    } = req.body;

 
    if (!place_issue || !date_issue || !company_name || !address || !place_incorp || !date_registration || !oganization) {
        return res.status(400).send(`
            <script>
                alert("All required fields must be provided.");
                window.location.href = "/corporation.html";
            </script>
        `);
    }

    const userId = req.session.userId;
    if (!userId) {
        return res.status(400).send(`
            <script>
                alert("User session not found. Please log in again.");
                window.location.href = "/login.html";
            </script>
        `);
    }

function toNumber(value) {
    if (!value) return 0;
    return parseFloat(String(value).replace(/,/g, '')) || 0;
}

const safeTin = tin || null;
const safeRealProperty = toNumber(real_property);
const safeGrossReceipt = toNumber(gross_receipt);
const safeTotalTaxable = toNumber(total_taxable);
const safeInterest = toNumber(interest);
const safeCtcAmount = toNumber(ctc_amount);


    const insertQuery = `
    INSERT INTO corporation 
    (USER_ID, PLACE_ISSUED, DATE_ISSUED, COMPANY_NAME, ADDRESS, PLACE_INCORPORATION, DATE_REGISTRATION, ORGANIZATION, TIN, REAL_PROPERTY, GROSS_RECEIPT,
     TOTAL_TAXABLE, INTEREST, CTC_AMOUNT, STATUS)
    VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?, 'Pending')
`;

conn.query(insertQuery, [
    userId, place_issue, date_issue, company_name, address, place_incorp, date_registration, oganization,
    safeTin, safeRealProperty, safeGrossReceipt, safeTotalTaxable, safeInterest, safeCtcAmount
], (err, result) => {
    if (err) {
        console.error("Insert error:", err);
        return res.status(500).send(`
            <script>
                alert("An error occurred while submitting your PTR form. Please try again.");
                window.location.href = "/corporation.html";
            </script>
        `);
    }

    req.session.destroy((err) => {
        if (err) {
            console.error("Session destroy error:", err);
            return res.status(500).send(`
                <script>
                    alert("Logout failed. Please try again.");
                    window.location.href = "/index.html";
                </script>
            `);
        }

        res.send(`
            <script>
                alert("Corporation form submitted successfully! Please wait for approval.");
                window.location.href = "/userhomepage.html";
            </script>
        `);
    });
});

});
// Middleware to check admin session
    function isAdmin(req, res, next) {
        if (!req.session.admin) {
            return res.redirect("/adminlogin");
        }
        next();
    }

    // Middleware to prevent caching after logout
    function preventBack(req, res, next) {
        res.header("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
        res.header("Pragma", "no-cache");
        res.header("Expires", "0");
        next();
    }

    // Admin Login Route

    app.post("/adminlogin", (req, res) => {
        const { username, password } = req.body;

        const adminUsername = process.env.ADMIN_USER || "admin";
        const adminPassword = process.env.ADMIN_PASS || "password123"; 

        if (username === adminUsername && password === adminPassword) {
            req.session.regenerate(err => {
                if (err) {
                    console.error("Session Error:", err);
                    return res.status(500).send("Login failed");
                }
                req.session.admin = { username };
                res.redirect("/admin");
            });
        } else {
            res.send(`
                <script>
                    alert("Invalid credentials. Please try again.");
                    window.location.href = "/adminlogin.html";
                </script>
            `);
        }
    });

//  Admin Dashboard
app.get("/admin", isAdmin, (req, res) => {
  const pendingQuery = `
    SELECT id, USER_ID, FIRST_NAME, LAST_NAME, CERTIFICATE_TYPE, 
           DATE_FORMAT(DATE_ISSUED, '%Y-%m-%d') AS DATE_ISSUED, STATUS, 
           'form' AS source 
    FROM form WHERE STATUS = 'Pending'
    UNION ALL
    SELECT id, USER_ID, FIRST_NAME, LAST_NAME, CERTIFICATE_TYPE, 
           DATE_FORMAT(DATE_ISSUED, '%Y-%m-%d') AS DATE_ISSUED, STATUS, 
           'ptrform' AS source 
    FROM ptrform WHERE STATUS = 'Pending'
    UNION ALL
    SELECT id, USER_ID, COMPANY_NAME AS FIRST_NAME, '' AS LAST_NAME, CERTIFICATE_TYPE, 
           DATE_FORMAT(DATE_ISSUED, '%Y-%m-%d') AS DATE_ISSUED, STATUS, 
           'corporation' AS source 
    FROM corporation WHERE STATUS = 'Pending'
  `;


  const approvedQuery = `
  SELECT id, USER_ID, FIRST_NAME, LAST_NAME, CERTIFICATE_TYPE, 
         DATE_FORMAT(DATE_ISSUED, '%Y-%m-%d') AS DATE_ISSUED, STATUS, PAYMENT_STATUS,
         'form' AS source 
  FROM form WHERE STATUS = 'Approved'
  UNION ALL
  SELECT id, PRC_NUM AS USER_ID, FIRST_NAME, LAST_NAME, CERTIFICATE_TYPE, 
         DATE_FORMAT(DATE_ISSUED, '%Y-%m-%d') AS DATE_ISSUED, STATUS, 'N/A' AS PAYMENT_STATUS,
         'ptrform' AS source 
  FROM ptrform WHERE STATUS = 'Approved'
  UNION ALL
  SELECT id, USER_ID, COMPANY_NAME AS FIRST_NAME, '' AS LAST_NAME, CERTIFICATE_TYPE, 
         DATE_FORMAT(DATE_ISSUED, '%Y-%m-%d') AS DATE_ISSUED, STATUS, PAYMENT_STATUS,
         'corporation' AS source 
  FROM corporation WHERE TRIM(STATUS) = 'Approved'
`;


  
  const rejectedQuery = `
    SELECT id, USER_ID, FIRST_NAME, LAST_NAME, CERTIFICATE_TYPE, 
           DATE_FORMAT(DATE_ISSUED, '%Y-%m-%d') AS DATE_ISSUED, STATUS, 
           'form' AS source 
    FROM form WHERE STATUS = 'Rejected'
    UNION ALL
    SELECT id, PRC_NUM AS USER_ID, FIRST_NAME, LAST_NAME, CERTIFICATE_TYPE, 
           DATE_FORMAT(DATE_ISSUED, '%Y-%m-%d') AS DATE_ISSUED, STATUS, 
           'ptrform' AS source 
    FROM ptrform WHERE STATUS = 'Rejected'
    UNION ALL
    SELECT id, USER_ID, COMPANY_NAME AS FIRST_NAME, '' AS LAST_NAME, CERTIFICATE_TYPE, 
           DATE_FORMAT(DATE_ISSUED, '%Y-%m-%d') AS DATE_ISSUED, STATUS, 
           'corporation' AS source 
    FROM corporation WHERE TRIM(STATUS) = 'Rejected'
  `;

  const issuedQuery = `
    SELECT id, USER_ID, FIRST_NAME, LAST_NAME, CERTIFICATE_TYPE, 
           DATE_FORMAT(DATE_ISSUED, '%Y-%m-%d') AS DATE_ISSUED,
           STATUS, PAYMENT_STATUS, 
           'form' AS source 
    FROM form WHERE STATUS IN ('Issued', 'Done')
    UNION ALL
    SELECT id, PRC_NUM AS USER_ID, FIRST_NAME, LAST_NAME, CERTIFICATE_TYPE,
           DATE_FORMAT(DATE_ISSUED, '%Y-%m-%d') AS DATE_ISSUED,
           STATUS, 'N/A' AS PAYMENT_STATUS, 
           'ptrform' AS source 
    FROM ptrform WHERE STATUS IN ('Issued', 'Done')
    UNION ALL
    SELECT id, USER_ID, COMPANY_NAME AS FIRST_NAME, '' AS LAST_NAME, 
           CERTIFICATE_TYPE, DATE_FORMAT(DATE_ISSUED, '%Y-%m-%d') AS DATE_ISSUED,
           STATUS, PAYMENT_STATUS, 
           'corporation' AS source 
    FROM corporation WHERE STATUS IN ('Issued', 'Done')
    UNION ALL
    SELECT id, USER_ID, FIRST_NAME, LAST_NAME, CERTIFICATE_TYPE,
           DATE_FORMAT(DATE_ISSUED, '%Y-%m-%d') AS DATE_ISSUED,
           STATUS, PAYMENT_STATUS, 
           'issued_cedula' AS source
    FROM issued_cedula WHERE STATUS IN ('Issued', 'Done')
  `;

  conn.query(pendingQuery, (err1, results1) => {
    if (err1) {
      console.error("Error fetching pending applications:", err1);
      return res.status(500).send("Error retrieving pending applications");
    }

    conn.query(approvedQuery, (err2, results2) => {
      if (err2) {
        console.error("Error fetching approved applications:", err2);
        return res.status(500).send("Error retrieving approved applications");
      }

      conn.query(rejectedQuery, (err3, results3) => {
        if (err3) {
          console.error("Error fetching rejected applications:", err3);
          return res.status(500).send("Error retrieving rejected applications");
        }

        conn.query(issuedQuery, (err4, issuedResults) => {
          if (err4) {
            console.error("Error fetching issued applications:", err4);
            return res.status(500).send("Error retrieving issued applications");
          }

         
          res.render("admin", {
            sampledata: results1,
            approvedData: results2,
            rejectedData: results3,
            issuedData: issuedResults,
            action: "list",
          });
        });
      });
    });
  });
});



    // Admin Stats Route
    app.get('/admin/stats', isAdmin, (req, res) => {
    const totalUsersQuery = "SELECT COUNT(*) AS totalUsers FROM register";

    const pendingQuery = `
        SELECT COUNT(*) AS count FROM (
            SELECT STATUS FROM form WHERE STATUS = 'Pending'
            UNION ALL
            SELECT STATUS FROM ptrform WHERE STATUS = 'Pending'
             UNION ALL
            SELECT STATUS FROM corporation WHERE STATUS = 'Pending'
        ) AS combined_pending
    `;

    const approvedQuery = `
        SELECT COUNT(*) AS count FROM (
            SELECT STATUS FROM form WHERE STATUS = 'Approved'
            UNION ALL
            SELECT STATUS FROM ptrform WHERE STATUS = 'Approved'
            UNION ALL
            SELECT STATUS FROM corporation WHERE STATUS = 'Pending'
        ) AS combined_approved
    `;

    const rejectedQuery = `
        SELECT COUNT(*) AS count FROM (
            SELECT STATUS FROM form WHERE STATUS = 'Rejected'
            UNION ALL
            SELECT STATUS FROM ptrform WHERE STATUS = 'Rejected'
            UNION ALL
            SELECT STATUS FROM corporation WHERE STATUS = 'Pending'
        ) AS combined_rejected
    `;

    conn.query(totalUsersQuery, (err1, result1) => {
        if (err1) {
            console.error("Error fetching total users:", err1);
            return res.status(500).json({ error: "Error fetching total users" });
        }

        conn.query(pendingQuery, (err2, result2) => {
            if (err2) {
                console.error("Error fetching pending applications:", err2);
                return res.status(500).json({ error: "Error fetching pending applications" });
            }

            conn.query(approvedQuery, (err3, result3) => {
                if (err3) {
                    console.error("Error fetching approved applications:", err3);
                    return res.status(500).json({ error: "Error fetching approved applications" });
                }

                conn.query(rejectedQuery, (err4, result4) => {
                    if (err4) {
                        console.error("Error fetching rejected applications:", err4);
                        return res.status(500).json({ error: "Error fetching rejected applications" });
                    }

                    res.json({
                        totalUsers: result1[0].totalUsers,
                        pendingReservations: result2[0].count,
                        approvedCedula: result3[0].count,
                        rejectedCedula: result4[0].count
                    });
                });
            });
        });
    });
});


    // Approve User Request
app.get("/approve/:id", isAdmin, (req, res) => {
  const formId = req.params.id;

  
  const findTableQuery = `
    SELECT 'form' AS source, USER_ID FROM form WHERE id = ?
    UNION
    SELECT 'ptrform' AS source, USER_ID FROM ptrform WHERE id = ?
    UNION
    SELECT 'corporation' AS source, USER_ID FROM corporation WHERE id = ?
  `;

  conn.query(findTableQuery, [formId, formId, formId], (err, sourceResult) => {
    if (err) {
      console.error(" Error checking form source:", err);
      return res.status(500).send("Error checking request source.");
    }

    if (sourceResult.length === 0) {
      console.warn("⚠️ No matching application found for ID:", formId);
      return res.status(404).send("Application not found.");
    }

    const { source, USER_ID } = sourceResult[0];

    
    let fetchUserQuery = "";
    if (source === "form" || source === "ptrform") {
      fetchUserQuery = `
        SELECT r.EMAIL_ADDRESS, r.FIRST_NAME, r.LAST_NAME
        FROM register r
        JOIN ${source} f ON f.USER_ID = r.ID
        WHERE f.id = ?
      `;
    } else if (source === "corporation") {
      fetchUserQuery = `
        SELECT u.EMAIL_ADDRESS, c.COMPANY_NAME AS FIRST_NAME, '' AS LAST_NAME
        FROM corporation c
        JOIN register u ON c.USER_ID = u.ID
        WHERE c.id = ?
      `;
    }

    conn.query(fetchUserQuery, [formId], (err, userResult) => {
      if (err) {
        console.error(" Database Error:", err);
        return res.status(500).send("Error fetching user details.");
      }

      if (userResult.length === 0) {
        console.warn(" User not found in register table for form ID:", formId);
        return res.status(404).send("User not found in register table.");
      }

      const { EMAIL_ADDRESS, FIRST_NAME, LAST_NAME } = userResult[0];

      
      const approveQuery = `UPDATE ${source} SET STATUS = 'Approved' WHERE id = ?`;

      conn.query(approveQuery, [formId], (err, updateResult) => {
        if (err) {
          console.error(" Approval Error:", err);
          return res.status(500).send("Error approving request.");
        }

        if (updateResult.affectedRows === 0) {
          console.error(" No rows updated for:", source, "ID:", formId);
          return res.status(400).send("No record updated — invalid ID or table mismatch.");
        }

       

        //  Send email
        const transporter = nodemailer.createTransport({
          service: "gmail",
          auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
          },
        })

                const paymentLink = `http://localhost:5000/payment?ref=${formId}`;


                const mailOptions = {
                    from: process.env.EMAIL_USER,
                    to: EMAIL_ADDRESS,
                    subject: "Cedula Request Approved",
                    html: `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px; background-color: #f9f9f9;">
                        <p style="font-size: 16px; color: #333;">Dear <strong>${FIRST_NAME} ${LAST_NAME}</strong>,</p> 
                    
                        <p style="font-size: 16px; color: #555;">
                            We are pleased to inform you that your <strong>Cedula</strong> request has been 
                            <span style="color: green; font-weight: bold;">approved</span>.
                        </p>
                    
                        <p style="font-size: 16px; color: #555;">
                            You may now proceed with one of the following options:
                        </p>

                        <div style="margin: 15px 0;">
                            <a href="${paymentLink}" style="background-color: #007bff; color: white; padding: 10px 15px; border-radius: 5px; text-decoration: none;">💳 Pay Online</a>
                        </div>

                        <p style="font-size: 16px; color: #555;">
                            Or visit the <strong>Municipal Hall of Leon</strong> to pay over the counter and collect your Cedula within 
                            <strong>1–2 business days</strong>. Please bring this email as proof of your approved request.
                        </p>

                        <p style="font-size: 16px; color: #555;">
                            If you have any questions or need further assistance, feel free to contact us.
                        </p>
                    
                        <p style="font-size: 16px; color: #333;">Best regards,</p>
                        <p style="font-size: 16px; font-weight: bold; color: #333;">Leon Treasury Office</p>
                    </div>
                    `,
                };

                transporter.sendMail(mailOptions, (emailErr, info) => {
                    if (emailErr) {
                        console.error("Email Sending Error:", emailErr);
                    } else {
                        console.log(`Approval email sent to ${EMAIL_ADDRESS}:`, info.response);
                    }
                });

                async function sendPaymentConfirmation(email, name, ref) {
  try {
    await transporter.sendMail({
      from: `"Municipal Treasurer’s Office" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Payment Received - Cedula Application",
      html: `
        <div style="font-family: Arial, sans-serif; padding: 16px;">
          <p>Dear <b>${name}</b>,</p>
          <p>We have received your payment for your Cedula Application (Ref No: <b>${ref}</b>).</p>
          <p>You may now proceed to claim your Cedula at the Municipal Hall of Leon.</p>
          <p>Thank you for using our Online Payment system!</p>
          <br>
          <p>— <b>Municipal Treasurer’s Office</b></p>
        </div>
      `,
    });
    console.log(` Payment confirmation email sent to ${email}`);
  } catch (err) {
    console.error(" Error sending payment email:", err);
  }
}

                res.redirect("/admin");
            });
        });
    });
});

    

// Reject User Request
app.get("/reject/:id", isAdmin, (req, res) => {
    const formId = req.params.id;

    const findTableQuery = `
        SELECT 'form' AS source, USER_ID FROM form WHERE id = ?
        UNION
        SELECT 'ptrform' AS source, USER_ID FROM ptrform WHERE id = ?
        UNION
        SELECT 'corporation' AS source, USER_ID FROM corporation WHERE id = ?
    `;

    conn.query(findTableQuery, [formId, formId, formId], (err, sourceResult) => {
        if (err) {
            console.error("Error checking form source:", err);
            return res.status(500).send("Error checking request source.");
        }

        if (sourceResult.length === 0) {
            return res.status(404).send("Application not found.");
        }

        const { source, USER_ID } = sourceResult[0];
        let fetchUserQuery = "";

        
        if (source === "form" || source === "ptrform") {
            fetchUserQuery = `
                SELECT r.EMAIL_ADDRESS, r.FIRST_NAME, r.LAST_NAME
                FROM register r
                JOIN ${source} f ON f.USER_ID = r.ID
                WHERE f.id = ?
            `;
        } else if (source === "corporation") {
            fetchUserQuery = `
                SELECT u.EMAIL_ADDRESS, c.COMPANY_NAME AS FIRST_NAME, '' AS LAST_NAME
                FROM corporation c
                JOIN register u ON c.USER_ID = u.ID
                WHERE c.id = ?
            `;
        }

        conn.query(fetchUserQuery, [formId], (err, userResult) => {
            if (err) {
                console.error("Database Error:", err);
                return res.status(500).send("Error fetching user details.");
            }

            if (userResult.length === 0) {
                return res.status(404).send("User not found in register table.");
            }

            const { EMAIL_ADDRESS, FIRST_NAME, LAST_NAME } = userResult[0];

            // Reject the request
            const rejectQuery = `UPDATE ${source} SET STATUS = 'Rejected' WHERE id = ?`;
            conn.query(rejectQuery, [formId], (err) => {
                if (err) {
                    console.error("Rejection Error:", err);
                    return res.status(500).send("Error rejecting request.");
                }


               
                const transporter = nodemailer.createTransport({
                    service: "gmail",
                    auth: {
                        user: process.env.EMAIL_USER,
                        pass: process.env.EMAIL_PASS,
                    },
                });

                const mailOptions = {
                    from: process.env.EMAIL_USER,
                    to: EMAIL_ADDRESS,
                    subject: "Cedula Request Rejected",
                    html: `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px; background-color: #f9f9f9;">
                        <p style="font-size: 16px; color: #333;">Dear <strong>${FIRST_NAME} ${LAST_NAME}</strong>,</p> 
                    
                        <p style="font-size: 16px; color: #555;">
                            We regret to inform you that your <strong>Cedula</strong> request has been 
                            <span style="color: red; font-weight: bold;">rejected</span>.
                        </p>
                    
                        <p style="font-size: 16px; color: #555;">
                            If you believe there was an issue with your application or if you need more information regarding the rejection, 
                            please contact our support team for clarification. We're here to assist you.
                        </p>
                    
                        <p style="font-size: 16px; color: #555;">
                            You can reach us by replying to this email or visiting our office during business hours.
                        </p>
                    
                        <p style="font-size: 16px; color: #333;">Best regards,</p>
                        <p style="font-size: 16px; font-weight: bold; color: #333;">Leon Treasury Office</p>
                    </div>
                    `,
                };

                transporter.sendMail(mailOptions, (emailErr, info) => {
                    if (emailErr) {
                        console.error("Email Sending Error:", emailErr);
                    } else {
                        console.log(`Rejection email sent to ${EMAIL_ADDRESS}:`, info.response);
                    }
                });

                res.redirect("/admin");
            });
        });
    });
});


// PAYMENT PAGE
app.get("/payment", (req, res) => {
    const ref = req.query.ref;


    const query = `
        SELECT AMOUNT AS amount FROM form WHERE ID = ?
        UNION
        SELECT CTC_AMOUNT AS amount FROM corporation WHERE ID = ?
        
    `;

    conn.query(query, [ref, ref, ref], (err, results) => {
        if (err) {
            console.error("Error fetching payment amount:", err);
            return res.status(500).send("Error loading payment page.");
        }

        const amount = results.length > 0 ? results[0].amount : 0;
        res.render("payment", { ref, amount });
    });
});


const PAYMONGO_SECRET = "sk_test_mBaysuTbJgDspq6hqTo1i2ZH";




//create payment 
app.post("/create-payment", async (req, res) => {
  const { amount, email, name, ref } = req.body; 
  
  console.log("incoming corporation payment request:", req.body);

  if (amount < 100 || amount > 1000) {
    return res.status(400).json({ error: "Amount must be between ₱100 and ₱1000." });
  }

  try {
    console.log(" Sending request to PayMongo...");

    const response = await axios.post(
  "https://api.paymongo.com/v1/links",
  {
    data: {
      attributes: {
        amount: amount * 100,
        description: `Cedula Payment (form:${ref})`,
        remarks: `Organization: ${name}`,
        payment_method_types: ["gcash"],
        redirect: {
          success: "http://localhost:5000/payment-success",
          failed: "http://localhost:5000/payment-failed",
        },
      },
    },
  },
  {
    auth: {
      username: PAYMONGO_SECRET,
      password: "",
    },
  }
);


    console.log(" PayMongo response:", response.data);

    const paymentLink = response.data.data.attributes.checkout_url;
    res.json({ link: paymentLink });
  } catch (err) {
    console.error("PayMongo ERROR:", err.response?.data || err.message);
    res.status(500).json({
      error: "Error creating payment link",
      details: err.response?.data || err.message,
    });
  }
});





//webhook
app.post("/webhook", async (req, res) => {
  try {
    console.log(" Webhook received:", JSON.stringify(req.body, null, 2));

    const event = req.body;
    const attributes = event.data?.attributes || {};
    const payment = attributes.data?.attributes || {}; 
    const metadata = payment.metadata || {};

    let recordId = metadata.id;

    if (!recordId) {
      const description = payment.description || "";
      const match = description.match(/\(form:(\d+)\)/i);
      if (match) {
        recordId = match[1];
      }
    }

    if (!recordId) {
      console.warn("⚠️ Missing form ID — skipping update.");
      return res.sendStatus(200); 
    }

    const paymentStatus = payment.status || "unpaid";
    const paymentMethod = payment.source?.type || "unknown";
    const paymentRef = payment.id || "test_ref";
    const paymentDate = payment.paid_at
      ? new Date(payment.paid_at * 1000)
      : new Date();

 
    if (paymentStatus === "paid") {
      console.log(` Payment successful for form ID ${recordId}`);

      await conn.query(
        `UPDATE form 
         SET PAYMENT_STATUS = ?, PAYMENT_METHOD = ?, PAYMENT_REFERENCE = ?, PAYMENT_DATE = ?
         WHERE ID = ?`,
        ["Paid", paymentMethod, paymentRef, paymentDate, recordId]
      );

      console.log(` Database updated for form ID ${recordId}`);
    } else {
      console.log(` Payment not completed yet (status: ${paymentStatus})`);
    }

    res.sendStatus(200);
  } catch (err) {
    console.error(" Webhook error:", err);
    res.sendStatus(500);
  }
});

// view form
app.get('/form-details/:id', isAdmin, (req, res) => {
    const id = req.params.id;
    console.log("FORM ID:", id);

    conn.query("SELECT * FROM form WHERE ID = ?", [id], (err, results) => {
    if (err) {
        console.error("Error fetching form:", err);
        return res.status(500).send("Server error.");
    }

    if (results.length === 0) {
        return res.send("No data found");
    }

    const formData = results[0];

   
    if (formData.IMAGE && Buffer.isBuffer(formData.IMAGE)) {
        formData.IMAGE = formData.IMAGE.toString(); 
    }

    res.render("form-details", { data: formData });
});

});



  // view ptrform
app.get('/ptrform-details/:id', isAdmin, (req, res) => {
    const id = req.params.id;
    console.log("PTRFORM ID:", id);

    conn.query("SELECT * FROM ptrform WHERE ID = ?", [id], (err, results) => {
    if (err) {
        console.error("Error fetching ptrform:", err);
        return res.status(500).send("Server error.");
    }

    if (results.length === 0) {
        return res.send("No data found");
    }

    const formData = results[0];

   
    if (formData.IMAGE && Buffer.isBuffer(formData.IMAGE)) {
        formData.IMAGE = formData.IMAGE.toString(); 
    }

    res.render("ptrform-details", { data: formData });
});

});

// view corporation
app.get('/corporation-details/:id', isAdmin, (req, res) => {
    const id = req.params.id;

    const query = 'SELECT * FROM corporation WHERE id = ?';

    conn.query(query, [id], (err, results) => { 
        if (err) {
            console.error('Error fetching corporation details:', err);
            return res.status(500).send('Server error');
        }

        if (results.length === 0) {
            return res.status(404).send('Corporation record not found');
        }

        res.render('corporation-details', { data: results[0] });
    });
});

    // Logout Admin with preventBack middleware

    app.get("/logout", preventBack, (req, res) => {
        req.session.destroy(err => {
            if (err) {
                console.error("Logout Error:", err);
                return res.status(500).send("Logout failed");
            }
           
            res.redirect("/adminlogin");
        });
    });


    app.post('/logout', (req, res) => {
        req.session.destroy(err => {
            if (err) {
                return res.status(500).send("Logout failed");
            }

            // Prevent back navigation
            res.setHeader('Cache-Control', 'no-store');  
            res.setHeader('Pragma', 'no-cache');
            res.setHeader('Expires', '0');

         
            res.redirect('/index.html'); 
        });
    });

   
// DELETE 
app.delete('/delete/:id', (req, res) => {
  const del_id = req.params.id;


  const findTableQuery = `
    SELECT 'form' AS source FROM form WHERE id = ?
    UNION ALL
    SELECT 'ptrform' AS source FROM ptrform WHERE id = ?
    UNION ALL
    SELECT 'corporation' AS source FROM corporation WHERE id = ?
    LIMIT 1
  `;

  conn.query(findTableQuery, [del_id, del_id, del_id], (err, sourceResult) => {
    if (err) {
      console.error("Error checking source table:", err);
      return res.status(500).json({ success: false, message: "Error checking record source." });
    }

    if (sourceResult.length === 0) {
      return res.json({ success: false, message: "Record not found." });
    }

    const { source } = sourceResult[0];
    const deleteQuery = `DELETE FROM ${source} WHERE id = ?`;

    conn.query(deleteQuery, [del_id], (err, result) => {
      if (err) {
        console.error("Error deleting data:", err);
        return res.status(500).json({ success: false, message: "Database error." });
      }

      if (result.affectedRows > 0) {
        console.log(`✅ Deleted record ${del_id} from ${source} table`);
        res.json({ success: true });
      } else {
        res.json({ success: false, message: "Record not found." });
      }
    });
  });
});



app.get("/mark-done/:source/:id", (req, res) => {
  const { source, id } = req.params;
  console.log(" /mark-done route triggered:", req.params);

  let tableName = "";
  if (source === "form") tableName = "form";
  else if (source === "ptrform") tableName = "ptrform";
  else if (source === "corporation") tableName = "corporation";
  else return res.status(400).send("Invalid source.");

  
  const selectQuery = `SELECT * FROM ${tableName} WHERE id = ?`;
  conn.query(selectQuery, [id], (err, result) => {
    if (err) {
      console.error("❌ Database error:", err);
      return res.status(500).send("Database error.");
    }
    if (result.length === 0) return res.status(404).send("Record not found.");

    const data = result[0];

    const insertQuery = `
      INSERT INTO issued_cedula 
      (USER_ID, FIRST_NAME, LAST_NAME, CERTIFICATE_TYPE, DATE_ISSUED, PAYMENT_STATUS, STATUS)
      VALUES (?, ?, ?, ?, NOW(), ?, 'Issued')
    `;

    conn.query(insertQuery, [
      data.USER_ID || data.PRC_NUM, 
      data.FIRST_NAME || data.COMPANY_NAME, 
      data.LAST_NAME || null,
      data.CERTIFICATE_TYPE,
      data.PAYMENT_STATUS || 'Paid'
    ], (err2) => {
      if (err2) {
        console.error("❌ Error inserting into issued_cedula:", err2);
        return res.status(500).send("Error inserting issued data.");
      }

      //  Update the original record’s status to Issued
      const updateQuery = `UPDATE ${tableName} SET STATUS = 'Issued' WHERE id = ?`;
      conn.query(updateQuery, [id], (err3) => {
        if (err3) {
          console.error("❌ Error updating status:", err3);
          return res.status(500).send("Error updating status.");
        }

        console.log(`✅ Record ${id} marked as Issued and added to issued_cedula`);
        res.redirect("/admin");
      });
    });
  });
});


app.get("/done-cedula", (req, res) => {
  db.query(doneQuery, (err, results) => {
    if (err) return res.status(500).send("Database error.");
    res.render("doneCedula", { results });
  });
});




    // TAX REPORT
app.get('/taxreport', (req, res) => {
    const sql = `
        SELECT 
            MONTH(CREATED_AT) AS month_num,
            DATE_FORMAT(CREATED_AT, '%M') AS month,
            SUM(amount) AS total
        FROM form
        WHERE status = 'Approved'
        GROUP BY MONTH(CREATED_AT)
        ORDER BY MONTH(CREATED_AT)
    `;

    conn.query(sql, (err, results) => {
        if (err) {
            console.error("Error fetching tax report:", err);
            return res.status(500).send("Server error");
        }

        const allMonths = [
            'January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'
        ];

        const monthMap = {};
        results.forEach(row => {
            monthMap[row.month] = row.total;
        });

        const taxData = allMonths.map((month) => ({
            month,
            total: monthMap[month] || 0
        }));

        res.render('taxreport', { taxData });
    });
});

    

    //Update Data

    app.post('/updateform/:id', (req, res) => {
        const id = req.params.id;  
        const lname = req.body.lname;
        const firstname = req.body.firstname;
        const middlename = req.body.middlename;
        const citizenship = req.body.citizenship;
        const address = req.body.address;
        const gender = req.body.gender;
        const civil_status = req.body.civil_status;
        const birth_place = req.body.birth_place;
        const birth_date = req.body.birth_date;
        const height = req.body.height;
        const weight = req.body.weight;
        const profession = req.body.profession;
        const tin = req.body.tin;
        const gross_receipt = req.body.gross_receipt;
        const annual_income = req.body.annual_income;
        const real_property_income = req.body.real_property_income;
        const total_taxable = req.body.total_taxable;
        const ctc_amount = req.body.ctc_amount;
    
        // Update SQL query 
        const update = `UPDATE form SET 
            LAST_NAME = "${lname}", 
            FIRST_NAME = "${firstname}",
            MIDDLE_NAME = "${middlename}",
            CITIZENSHIP = "${citizenship}",
            ADDRESS = "${address}",
            GENDER = "${gender}",
            CIVIL_STATUS = "${civil_status}",
           PLACE_BIRTH = "${birth_place}",
            DATE_BIRTH = "${birth_date}",
            HEIGHT = "${height}",
            WEIGHT = "${weight}",
            PBO = "${profession}",
            TIN_NUMBER = "${tin}",
            GRB = "${gross_receipt}",
           AGI = "${annual_income}",
            RPI = "${real_property_income}",
            TTA = "${total_taxable}",
            AMOUNT = "${ctc_amount}"
            WHERE id = "${id}"`;
    
       
    conn.query(update, (err, result) => {
        if (err) throw err;

        res.send(`
            <script>
        alert("Data updated successfully!");
        window.location.href ="/admin";
        </script>
        `);

        });
    });
    
    

// Server Listener
    app.listen(5000, () => {
        console.log(` Server is running on port `);
    });
