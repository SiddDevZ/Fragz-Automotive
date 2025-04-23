import { Hono } from "hono";
import Stripe from "stripe";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import FormData from "form-data";
import mime from "mime";
import categories from "../../app/data.js";
import axios from "axios";
import * as dotenv from 'dotenv';
import nodemailer from 'nodemailer';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const envFiles = [
  path.join(__dirname, '../.env'),           // Standard .env file (main)
  path.join(__dirname, '../.env.local'),     // Local development fallback
  path.join(__dirname, '../.env.production') // Production fallback
];

let envLoaded = false;
for (const envPath of envFiles) {
  if (fs.existsSync(envPath)) {
    dotenv.config({ path: envPath });
    envLoaded = true;
    break;
  }
}

if (!envLoaded) {
  dotenv.config();
  console.log('No specific .env file found, using default environment');
}

// Initialize email transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER || '',
    pass: process.env.EMAIL_APP_PASSWORD || ''
  }
});

const router = new Hono();
const TEMP_DIR = path.join(__dirname, "../temp");
const SESSIONS_FILE = path.join(__dirname, "../sessions.json");

const MAX_FILE_SIZE = parseInt(process.env.MAX_FILE_SIZE) || 25 * 1024 * 1024;
const VALID_IMAGE_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/gif',
  'image/bmp',
  'image/webp',
  'image/svg+xml',
  'image/tiff'
];

if (!fs.existsSync(TEMP_DIR)) {
  fs.mkdirSync(TEMP_DIR, { recursive: true });
}

function loadProcessedSessions() {
  try {
    if (fs.existsSync(SESSIONS_FILE)) {
      const data = fs.readFileSync(SESSIONS_FILE, 'utf8');

      if (!data || data.trim() === '') {
        console.log('Sessions file exists but is empty, initializing new set');
        fs.writeFileSync(SESSIONS_FILE, '[]', 'utf8');
        return new Set();
      }

      let parsedData;
      try {
        parsedData = JSON.parse(data);
      } catch (e) {
        console.error('Error parsing sessions JSON, initializing new file:', e);
        const backupPath = `${SESSIONS_FILE}.backup-${Date.now()}`;
        fs.copyFileSync(SESSIONS_FILE, backupPath);
        console.log(`Backed up corrupted sessions file to ${backupPath}`);
        
        fs.writeFileSync(SESSIONS_FILE, '[]', 'utf8');
        return new Set();
      }
      
      return new Set(parsedData);
    } else {
      console.log('Sessions file does not exist, initializing new file');
      fs.writeFileSync(SESSIONS_FILE, '[]', 'utf8');
      return new Set();
    }
  } catch (error) {
    console.error('Error loading processed sessions:', error);
    return new Set();
  }
}

function saveProcessedSessions(sessions) {
  try {
    fs.writeFileSync(SESSIONS_FILE, JSON.stringify([...sessions]), 'utf8');
  } catch (error) {
    console.error('Error saving processed sessions:', error);
  }
}

const processedSessions = loadProcessedSessions();

if (!process.env.STRIPE_SECRET_KEY) {
  console.error('ERROR: STRIPE_SECRET_KEY environment variable is not set');
  console.error('Please set STRIPE_SECRET_KEY in your .env.local file');
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Function to generate customer confirmation email template
function generateCustomerEmailTemplate(orderDetails) {
  const { 
    customerName, productName, regNo, amount, paymentDate, 
    address, options, additionalNotes, paymentId
  } = orderDetails;

  // Format options for display
  const optionsHtml = Object.keys(options).length > 0 
    ? Object.entries(options).map(([key, value]) => 
        `<tr>
          <td style="padding: 8px; border-bottom: 1px solid #e0e0e0; font-weight: bold;">${key}</td>
          <td style="padding: 8px; border-bottom: 1px solid #e0e0e0;">${value}</td>
        </tr>`
      ).join('')
    : `<tr><td style="padding: 8px; border-bottom: 1px solid #e0e0e0;" colspan="2">No custom options selected</td></tr>`;

  // Format date for better readability
  const formattedDate = new Date(paymentDate).toLocaleString('en-GB', {
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  return `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Order Confirmation</title>
    <style>
      body {
        font-family: Arial, sans-serif;
        line-height: 1.6;
        color: #333;
        margin: 0;
        padding: 0;
      }
      .container {
        max-width: 600px;
        margin: 0 auto;
        padding: 20px;
      }
      .header {
        background-color: #222;
        padding: 20px;
        text-align: center;
      }
      .header h1 {
        color: #fff;
        margin: 0;
      }
      .content {
        padding: 20px;
        background-color: #f9f9f9;
      }
      .order-details {
        background-color: #fff;
        border-radius: 5px;
        padding: 20px;
        margin-top: 20px;
        box-shadow: 0 2px 5px rgba(0,0,0,0.1);
      }
      .footer {
        text-align: center;
        margin-top: 20px;
        font-size: 12px;
        color: #666;
      }
      .highlight {
        background-color: #f5f5f5;
        padding: 10px;
        border-radius: 5px;
        margin: 15px 0;
      }
      table {
        width: 100%;
        border-collapse: collapse;
      }
      .btn {
        display: inline-block;
        background-color: #222;
        color: #fff;
        padding: 10px 20px;
        text-decoration: none;
        border-radius: 5px;
        margin-top: 15px;
      }
      .thank-you {
        text-align: center;
        font-size: 24px;
        margin: 30px 0 20px;
        color: #2e2e2e;
      }
      .logo {
        max-width: 150px;
        margin-bottom: 15px;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <!-- Logo would go here -->
        <h1>Order Confirmation</h1>
      </div>
      <div class="content">
        <p>Hello ${customerName},</p>
        <p>Thank you for your purchase! We're excited to confirm that your order has been successfully processed.</p>
        
        <div class="highlight">
          Your order for <strong>${productName}</strong> ${regNo ? `for registration <strong>${regNo}</strong>` : ''} has been confirmed.
        </div>

        <div class="order-details">
          <h2>Order Summary</h2>
          <table>
            <tr>
              <td style="padding: 8px; border-bottom: 1px solid #e0e0e0; font-weight: bold;">Order Reference:</td>
              <td style="padding: 8px; border-bottom: 1px solid #e0e0e0;">${paymentId || '-'}</td>
            </tr>
            <tr>
              <td style="padding: 8px; border-bottom: 1px solid #e0e0e0; font-weight: bold;">Date:</td>
              <td style="padding: 8px; border-bottom: 1px solid #e0e0e0;">${formattedDate}</td>
            </tr>
            <tr>
              <td style="padding: 8px; border-bottom: 1px solid #e0e0e0; font-weight: bold;">Total Amount:</td>
              <td style="padding: 8px; border-bottom: 1px solid #e0e0e0;">£${amount.toFixed(2)}</td>
            </tr>
            <tr>
              <td style="padding: 8px; border-bottom: 1px solid #e0e0e0; font-weight: bold;">Shipping Address:</td>
              <td style="padding: 8px; border-bottom: 1px solid #e0e0e0;">${address}</td>
            </tr>
          </table>

          <h3 style="margin-top: 20px;">Product Details</h3>
          <table>
            <tr>
              <td style="padding: 8px; border-bottom: 1px solid #e0e0e0; font-weight: bold;">Product:</td>
              <td style="padding: 8px; border-bottom: 1px solid #e0e0e0;">${productName}</td>
            </tr>
            ${regNo ? `
            <tr>
              <td style="padding: 8px; border-bottom: 1px solid #e0e0e0; font-weight: bold;">Registration Number:</td>
              <td style="padding: 8px; border-bottom: 1px solid #e0e0e0;">${regNo}</td>
            </tr>` : ''}
          </table>

          <h3 style="margin-top: 20px;">Selected Options</h3>
          <table>
            ${optionsHtml}
          </table>

          ${additionalNotes && additionalNotes !== 'None provided' ? `
          <h3 style="margin-top: 20px;">Additional Notes</h3>
          <p>${additionalNotes}</p>` : ''}
        </div>

        <p style="margin-top: 25px;">What happens next?</p>
        <p>Our team is now processing your order. We'll be in touch if we need any additional information or to update you on your order's progress.</p>
        <p>If you have any questions, please don't hesitate to contact us by replying to this email.</p>

        <p class="thank-you">Thank you for your business!</p>
      </div>
      <div class="footer">
        <p>© ${new Date().getFullYear()} Fragz Automotive. All rights reserved.</p>
        <p>Feel free to reply to this email if you need support!</p>
      </div>
    </div>
  </body>
  </html>
  `;
}

async function sendCustomerConfirmationEmail(orderDetails) {
  const { customerEmail, customerName, productName, regNo } = orderDetails;
  
  if (!customerEmail || !transporter.options.auth.user || !transporter.options.auth.pass) {
    console.log('Email sending skipped: Missing email configuration or customer email');
    return false;
  }

  const subject = `Order Confirmation - ${productName}${regNo ? ` (${regNo})` : ''}`;
  const htmlTemplate = generateCustomerEmailTemplate(orderDetails);

  try {
    const info = await transporter.sendMail({
      from: `"Fragz Automotive" <${process.env.EMAIL_USER}>`,
      to: customerEmail,
      subject: subject,
      html: htmlTemplate
    });

    console.log(`Customer confirmation email sent: ${info.messageId}`);
    return true;
  } catch (error) {
    console.error('Error sending customer confirmation email:', error);
    return false;
  }
}

async function sendOwnerNotificationEmail(orderDetails, fileRefs) {
  const { productName, regNo, customerName, customerEmail, customerPhone } = orderDetails;
  const ownerEmail = process.env.OWNER_EMAIL;
  
  if (!ownerEmail || !transporter.options.auth.user || !transporter.options.auth.pass) {
    console.log('Owner notification email skipped: Missing email configuration or owner email');
    return false;
  }

  const ownerEmailHtml = generateOwnerEmailTemplate(orderDetails);

  const mailOptions = {
    from: `"Fragz Automotive System" <${process.env.EMAIL_USER}>`,
    to: ownerEmail,
    subject: `New Order: ${productName}${regNo ? ` - ${regNo}` : ''}`,
    html: ownerEmailHtml,
    attachments: []
  };

  // Add file attachments
  if (fileRefs && fileRefs.length > 0) {
    for (const fileRef of fileRefs) {
      const tempFilePath = path.join(TEMP_DIR, fileRef.tempName);
      
      if (fs.existsSync(tempFilePath)) {
        try {
          const originalFilename = fileRef.tempName.split('-').slice(3).join('-');
          mailOptions.attachments.push({
            filename: originalFilename,
            path: tempFilePath,
            contentType: mime.getType(tempFilePath) || 'application/octet-stream'
          });
        } catch (fileErr) {
          console.error(`Error attaching file ${fileRef.tempName}:`, fileErr);
        }
      }
    }
  }

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(`Owner notification email sent: ${info.messageId}`);
    return true;
  } catch (error) {
    console.error('Error sending owner notification email:', error);
    return false;
  }
}

// Function to generate owner email template
function generateOwnerEmailTemplate(orderDetails) {
  const { 
    customerName, customerEmail, customerPhone, productName, regNo, 
    amount, paymentDate, address, options, additionalNotes, paymentId
  } = orderDetails;

  // Format options for display
  const optionsHtml = Object.keys(options).length > 0 
    ? Object.entries(options).map(([key, value]) => 
        `<tr>
          <td style="padding: 12px; border-bottom: 1px solid #e0e0e0; font-weight: bold; width: 40%;">${key}</td>
          <td style="padding: 12px; border-bottom: 1px solid #e0e0e0;">${value}</td>
        </tr>`
      ).join('')
    : `<tr><td style="padding: 12px; border-bottom: 1px solid #e0e0e0;" colspan="2">No custom options selected</td></tr>`;

  return `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>New Order Notification</title>
    <style>
      body {
        font-family: Arial, sans-serif;
        line-height: 1.6;
        color: #333;
        margin: 0;
        padding: 0;
        background-color: #f7f7f7;
      }
      .container {
        max-width: 700px;
        margin: 0 auto;
        padding: 20px;
      }
      .header {
        background-color: #222;
        padding: 20px;
        text-align: center;
        border-top-left-radius: 5px;
        border-top-right-radius: 5px;
      }
      .header h1 {
        color: #fff;
        margin: 0;
      }
      .content {
        padding: 25px;
        background-color: #fff;
        border-bottom-left-radius: 5px;
        border-bottom-right-radius: 5px;
        box-shadow: 0 2px 5px rgba(0,0,0,0.1);
      }
      .highlight-box {
        background-color: #f8f8f8;
        border-left: 4px solid #222;
        padding: 15px;
        margin: 20px 0;
      }
      table {
        width: 100%;
        border-collapse: collapse;
        margin: 15px 0;
      }
      table.info-table {
        background-color: #fff;
        border-radius: 5px;
        overflow: hidden;
        box-shadow: 0 1px 3px rgba(0,0,0,0.1);
      }
      .section-title {
        font-size: 18px;
        font-weight: bold;
        margin: 25px 0 15px;
        padding-bottom: 8px;
        border-bottom: 1px solid #eee;
      }
      .footer {
        text-align: center;
        margin-top: 20px;
        font-size: 12px;
        color: #666;
      }
      .alert {
        background-color: #f7e3e3;
        border-left: 4px solid #d9534f;
        padding: 12px;
        margin: 15px 0;
      }
      .files-section {
        margin-top: 20px;
        padding: 15px;
        background-color: #f5f5f5;
        border-radius: 5px;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <h1>New Order Notification</h1>
      </div>
      <div class="content">
        <div class="highlight-box">
          <h2 style="margin-top: 0;">${productName}${regNo ? ` - ${regNo}` : ''}</h2>
          <p>A new order has been placed and payment has been received.</p>
        </div>

        <div class="section-title">Order Information</div>
        <table class="info-table">
          <tr>
            <td style="padding: 12px; border-bottom: 1px solid #e0e0e0; font-weight: bold; width: 40%;">Order Reference:</td>
            <td style="padding: 12px; border-bottom: 1px solid #e0e0e0;">${paymentId || session.id}</td>
          </tr>
          <tr>
            <td style="padding: 12px; border-bottom: 1px solid #e0e0e0; font-weight: bold;">Order Date:</td>
            <td style="padding: 12px; border-bottom: 1px solid #e0e0e0;">${new Date(paymentDate).toLocaleString('en-GB')}</td>
          </tr>
          <tr>
            <td style="padding: 12px; border-bottom: 1px solid #e0e0e0; font-weight: bold;">Amount Paid:</td>
            <td style="padding: 12px; border-bottom: 1px solid #e0e0e0;">£${amount.toFixed(2)}</td>
          </tr>
        </table>

        <div class="section-title">Product Details</div>
        <table class="info-table">
          <tr>
            <td style="padding: 12px; border-bottom: 1px solid #e0e0e0; font-weight: bold; width: 40%;">Product:</td>
            <td style="padding: 12px; border-bottom: 1px solid #e0e0e0;">${productName}</td>
          </tr>
          ${regNo ? `
          <tr>
            <td style="padding: 12px; border-bottom: 1px solid #e0e0e0; font-weight: bold;">Registration Number:</td>
            <td style="padding: 12px; border-bottom: 1px solid #e0e0e0;">${regNo}</td>
          </tr>` : ''}
        </table>

        <div class="section-title">Selected Options</div>
        <table class="info-table">
          ${optionsHtml}
        </table>

        <div class="section-title">Customer Information</div>
        <table class="info-table">
          <tr>
            <td style="padding: 12px; border-bottom: a.1px solid #e0e0e0; font-weight: bold; width: 40%;">Name:</td>
            <td style="padding: 12px; border-bottom: 1px solid #e0e0e0;">${customerName}</td>
          </tr>
          <tr>
            <td style="padding: 12px; border-bottom: 1px solid #e0e0e0; font-weight: bold;">Email:</td>
            <td style="padding: 12px; border-bottom: 1px solid #e0e0e0;"><a href="mailto:${customerEmail}">${customerEmail}</a></td>
          </tr>
          <tr>
            <td style="padding: 12px; border-bottom: 1px solid #e0e0e0; font-weight: bold;">Phone:</td>
            <td style="padding: 12px; border-bottom: 1px solid #e0e0e0;">${customerPhone}</td>
          </tr>
          <tr>
            <td style="padding: 12px; border-bottom: 1px solid #e0e0e0; font-weight: bold;">Shipping Address:</td>
            <td style="padding: 12px; border-bottom: 1px solid #e0e0e0;">${address}</td>
          </tr>
        </table>

        ${additionalNotes && additionalNotes !== 'None provided' ? `
        <div class="section-title">Additional Notes</div>
        <div class="highlight-box">
          ${additionalNotes}
        </div>` : ''}

        <div class="files-section">
          <div class="section-title" style="margin-top: 0;">Attachments</div>
          <p>File attachments (if any) are included with this email.</p>
        </div>
      </div>
      <div class="footer">
        <p>© ${new Date().getFullYear()} Fragz Automotive System</p>
      </div>
    </div>
  </body>
  </html>
  `;
}

router.post("*", async (c) => {
  try {

    if (!process.env.STRIPE_SECRET_KEY) {
      return c.json({ message: "Server configuration error: Payment system is not properly configured" }, 500);
    }
    
    const formData = await c.req.formData();

    const captchaToken = formData.get("captchaToken");
    
    if (!captchaToken) {
      return c.json({ message: "CAPTCHA verification failed: No token provided" }, 400);
    }
    
    try {
      const recaptchaResponse = await axios.post(
        process.env.RECAPTCHA_VERIFY_URL,
        null,
        {
          params: {
            secret: process.env.RECAPTCHA_SECRET_KEY,
            response: captchaToken
          }
        }
      );
      
      const { success, score } = recaptchaResponse.data;
      
      if (!success) {
        return c.json({ message: "CAPTCHA verification failed: Invalid token" }, 400);
      }
      
    } catch (captchaError) {
      console.error("Error verifying CAPTCHA:", captchaError);
      return c.json({ message: "CAPTCHA verification failed: Server error" }, 500);
    }

    const productId = formData.get("productId");
    const productName = formData.get("productName");
    const price = formData.get("price");
    const quantity = formData.get("quantity") || "1";
    const regNo = formData.get("regNo") || "";
    const categorySlug = formData.get("categorySlug") || "";
    const productSlug = formData.get("productSlug") || "";

    const category = categories.find(cat => cat.slug === categorySlug);
    if (!category) {
      console.error(`Category not found for slug: ${categorySlug}`);
      return c.json({ message: "Invalid product category" }, 400);
    }

    const product = category.products.find(prod => prod.slug === productSlug);
    if (!product) {
      console.error(`Product not found for slug: ${productSlug} in category: ${categorySlug}`);
      return c.json({ message: "Invalid product" }, 400);
    }

    const backendPriceString = product.price.replace(/[^\d.-]/g, '');
    const backendPrice = parseFloat(backendPriceString);
    if (isNaN(backendPrice)) {
        console.error(`Invalid backend price format for product ${productSlug}: ${product.price}`);
        return c.json({ message: "Internal server error: Invalid product price configuration" }, 500);
    }

    const frontendPriceString = price.replace(/[^\d.-]/g, '');
    const frontendPrice = parseFloat(frontendPriceString);
    if (isNaN(frontendPrice)) {
        console.error(`Invalid frontend price format received after sanitization: ${price}`);
        return c.json({ message: "Invalid price format provided" }, 400);
    }

    if (Math.abs(backendPrice - frontendPrice) > 0.01) {
        console.warn(`Price mismatch for product ${productSlug}. Frontend: ${frontendPrice}, Backend: ${backendPrice}`);
        return c.json({ message: "Price mismatch detected. Please refresh and try again." }, 400);
    }

    const options = {};
    for (const [key, value] of formData.entries()) {
      if (key.startsWith("options[") && key.endsWith("]")) {
        const optionName = key.substring(8, key.length - 1);
        options[optionName] = value;
      }
    }

    const files = {};
    for (const [key, value] of formData.entries()) {
      if (key.startsWith("files[") && key.endsWith("]") && value instanceof File) {
        const optionName = key.substring(6, key.length - 1);
        
        if (value.size > MAX_FILE_SIZE) {
          return c.json({ 
            message: `File ${value.name} exceeds the maximum size limit of 25MB.` 
          }, 400);
        }
        
        if (!VALID_IMAGE_TYPES.includes(value.type)) {
          return c.json({ 
            message: `Invalid file type for ${value.name}. Only image files are allowed.` 
          }, 400);
        }
        
        const fileBuffer = await value.arrayBuffer();
        const fileName = `product-${productId}-${Date.now()}-${value.name}`;
        const filePath = path.join(TEMP_DIR, fileName);
        
        fs.writeFileSync(filePath, Buffer.from(fileBuffer));
        
        files[optionName] = {
          name: value.name,
          tempName: fileName,
          type: value.type,
          path: filePath
        };
      }
    }

    const unitAmount = Math.round(backendPrice * 100);

    const parsedQuantity = parseInt(quantity);
    const finalQuantity = !isNaN(parsedQuantity) && parsedQuantity > 0 ? parsedQuantity : 1;

    const metadata = {
      productId: productId || '',
      productName: productName || '',
      regNo: regNo || '',
      categorySlug: categorySlug || '',
      productSlug: productSlug || ''
    };

    Object.entries(options).forEach(([key, value]) => {
      metadata[`option_${key}`] = value;
    });

    Object.entries(files).forEach(([key, fileInfo], index) => {
      metadata[`file_${index}`] = fileInfo.tempName;
      metadata[`fileOption_${index}`] = key;
    });

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{
        price_data: {
          currency: 'gbp',
          product_data: {
            name: productName || 'Unnamed Product',
            metadata
          },
          unit_amount: unitAmount,
        },
        quantity: finalQuantity,
      }],
      mode: 'payment',
      success_url: process.env.SUCCESS_URL,
      cancel_url: process.env.CANCEL_URL,
      phone_number_collection: {
        enabled: true,
      },
      shipping_address_collection: {
        allowed_countries: ['GB'],
      },
      custom_fields: [
        {
          key: 'additional_notes',
          label: {
            type: 'custom',
            custom: 'Additional Notes (Optional)',
          },
          type: 'text',
          optional: true,
        },
      ],
      metadata
    });
    
    return c.json({ url: session.url });
    
  } catch (error) {
    console.error('Error creating checkout session:', error);
    return c.json({ message: "Error creating checkout: " + error.message }, 500);
  }
});

router.get("/success", async (c) => {
  try {
    const sessionId = c.req.query("session_id");
    
    if (!sessionId) {
      return c.json({ message: "Session ID is required" }, 400);
    }

    if (processedSessions.has(sessionId)) {
      return c.json({
        success: true,
        message: "Payment was already processed",
        alreadyProcessed: true,
      });
    }

    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: [
        "line_items",
        "customer",
        "shipping",
        "payment_intent",
        "custom_fields",
      ],
    });
    
    if (session.payment_status !== "paid") {
      return c.json({ 
        success: false, 
        message: "Payment not completed" 
      }, 400);
    }
    
    const customerDetails = session.customer_details || {};
    const shippingDetails = session.shipping || {};
    const shippingAddress = customerDetails.address || shippingDetails.address || {};
    const customerName = customerDetails.name || shippingDetails.name || "Not provided";
    const customerPhone = customerDetails.phone || "Not provided";
    const customerEmail = customerDetails.email || "Not provided";

    const metadata = session.metadata || {};
    const { productName, regNo, productId, categorySlug, productSlug } = metadata;

    const parsedOptions = {};
    Object.entries(metadata).forEach(([key, value]) => {
      const match = key.match(/^option_(.+)$/);
      if (match) {
        parsedOptions[match[1]] = value;
      }
    });
    
    const fileRefs = [];
    Object.entries(metadata).forEach(([key, value]) => {
      const fileMatch = key.match(/^file_(\d+)$/);
      const optionMatch = key.match(/^fileOption_(\d+)$/);
      
      if (fileMatch) {
        const index = fileMatch[1];
        const optionName = metadata[`fileOption_${index}`] || `file${index}`;
        
        fileRefs.push({
          tempName: value,
          optionName: optionName,
          index: parseInt(index)
        });
      }
    });
    
    let missingRequiredFiles = false;
    if (fileRefs.length > 0) {

      let existingFileCount = 0;
      for (const fileRef of fileRefs) {
        const tempFilePath = path.join(TEMP_DIR, fileRef.tempName);
        if (fs.existsSync(tempFilePath)) {
          existingFileCount++;
        }
      }
      
      if (existingFileCount === 0) {
        console.log(`Session ${sessionId} has missing files, treating as already processed`);
        
        processedSessions.add(sessionId);
        saveProcessedSessions(processedSessions);
        
        return c.json({
          success: true,
          message: "Payment was already processed",
          alreadyProcessed: true,
        });
      }
    }
    
    const formattedAddress = [
      shippingAddress.line1,
      shippingAddress.line2,
      shippingAddress.city,
      shippingAddress.state,
      shippingAddress.postal_code,
      shippingAddress.country
    ].filter(Boolean).join(", ");
    
    const additionalNotes = session.custom_fields?.find(
      field => field.key === 'additional_notes'
    )?.text?.value || "None provided";
    
    const embedFields = [
      { name: "Product Name", value: `\`\`\`${productName || "-"}\`\`\``, inline: true },
      { name: "Registration Number", value: `\`\`\`${regNo || "-"}\`\`\``, inline: true },
      { name: "Options", value: `\`\`\`${Object.keys(parsedOptions).length > 0 ? 
          Object.entries(parsedOptions).map(([k,v]) => `${k}: ${v}`).join(", ") : 
          "None"}\`\`\``, inline: false },
      { name: "Payment ID", value: `\`\`\`${session.payment_intent?.id || session.id}\`\`\``, inline: true },
      { name: "Payment Date", value: `\`\`\`${new Date(session.created * 1000).toLocaleString()}\`\`\``, inline: true },
      { name: "Amount", value: `\`\`\`£${(session.amount_total / 100).toFixed(2)}\`\`\``, inline: true },
      { name: "Quantity", value: `\`\`\`${session.line_items?.data[0]?.quantity || 1}\`\`\``, inline: true },
      { name: "Customer Name", value: `\`\`\`${customerName}\`\`\``, inline: true },
      { name: "Customer Email", value: `\`\`\`${customerEmail}\`\`\``, inline: true },
      { name: "Customer Phone", value: `\`\`\`${customerPhone}\`\`\``, inline: true },
      { name: "Shipping Address", value: `\`\`\`${formattedAddress}\`\`\``, inline: false },
      { name: "Additional Notes", value: `\`\`\`${additionalNotes}\`\`\``, inline: false }
    ];
    
    const webhookData = {
      embeds: [
        {
          title: `New Registration Payment: ${regNo || "-"}`,
          color: 5814783,
          fields: embedFields,
          description: Object.keys(parsedOptions).length > 0 ? 
            `**Selected Options:**\n${Object.entries(parsedOptions)
              .map(([k,v]) => `${k}: **${v}**`).join("\n")}` : 
            "No additional options selected",
          timestamp: new Date().toISOString(),
          footer: {
            text: "Fragz Payment System",
          },
        },
      ],
    };

    const orderDetails = {
      id: session.id,
      paymentId: session.payment_intent?.id || session.id,
      amount: session.amount_total / 100,
      customerEmail: customerEmail,
      customerName: customerName,
      customerPhone: customerPhone,
      quantity: session.line_items?.data[0]?.quantity || 1,
      address: formattedAddress,
      regNo: regNo,
      options: parsedOptions,
      productName: productName,
      paymentDate: new Date(session.created * 1000).toISOString(),
      additionalNotes: additionalNotes
    };

    try {
      if (fileRefs.length > 0) {
        const formData = new FormData();
        formData.append("payload_json", JSON.stringify(webhookData));

        let uploadedFileCount = 0;
        
        for (const fileRef of fileRefs) {
          const tempFilePath = path.join(TEMP_DIR, fileRef.tempName);
          
          if (fs.existsSync(tempFilePath)) {
            try {
              const fileContent = fs.readFileSync(tempFilePath);
              const originalFilename = fileRef.tempName.split('-').slice(3).join('-');
              const fileType = mime.getType(tempFilePath) || 'application/octet-stream';
              
              formData.append(`file${uploadedFileCount}`, fileContent, {
                filename: originalFilename,
                contentType: fileType,
              });
              
              webhookData.embeds[0].fields.push({
                name: `File: ${fileRef.optionName}`,
                value: `\`\`\`${originalFilename}\`\`\``,
                inline: true,
              });
              
              uploadedFileCount++;
            } catch (fileErr) {
              console.error(`Error processing file ${fileRef.tempName}:`, fileErr);
            }
          }
        }
        
        if (uploadedFileCount > 0) {
          const webhookResponse = await fetch(process.env.DISCORD_WEBHOOK_URL, {
            method: "POST",
            body: formData.getBuffer ? formData.getBuffer() : formData,
            headers: formData.getHeaders ? formData.getHeaders() : {},
          });
          
          if (!webhookResponse.ok) {
            const errorText = await webhookResponse.text();
            console.error("Discord webhook failed:", webhookResponse.status, errorText);
          } else {
            console.log("Discord webhook sent successfully with files");
          }
        } else {
          const webhookResponse = await fetch(process.env.DISCORD_WEBHOOK_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(webhookData),
          });
          
          if (!webhookResponse.ok) {
            const errorText = await webhookResponse.text();
            console.error("Discord webhook failed:", webhookResponse.status, errorText);
          } else {
            console.log("Discord webhook sent successfully");
          }
        }
      } else {
        const webhookResponse = await fetch(process.env.DISCORD_WEBHOOK_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(webhookData),
        });
        
        if (!webhookResponse.ok) {
          const errorText = await webhookResponse.text();
          console.error("Discord webhook failed:", webhookResponse.status, errorText);
        } else {
          console.log("Discord webhook sent successfully");
        }
      }
    } catch (webhookError) {
      console.error("Error sending Discord webhook:", webhookError);
    }

    // 2. Send customer confirmation email
    try {
      const customerEmailSent = await sendCustomerConfirmationEmail(orderDetails);
      if (customerEmailSent) {
        console.log(`Customer confirmation email sent for session ${sessionId}`);
      } else {
        console.log(`Failed to send customer confirmation email for session ${sessionId}`);
      }
    } catch (emailError) {
      console.error("Error sending customer email:", emailError);
    }

    // 3. Send owner notification email with attachments
    try {
      const ownerEmailSent = await sendOwnerNotificationEmail(orderDetails, fileRefs);
      if (ownerEmailSent) {
        console.log(`Owner notification email sent for session ${sessionId}`);
      } else {
        console.log(`Failed to send owner notification email for session ${sessionId}`);
      }
    } catch (emailError) {
      console.error("Error sending owner email:", emailError);
    }

    // 4. Clean up temp files after all notifications are sent
    if (fileRefs.length > 0) {
      for (const fileRef of fileRefs) {
        const tempFilePath = path.join(TEMP_DIR, fileRef.tempName);
        if (fs.existsSync(tempFilePath)) {
          try {
            fs.unlinkSync(tempFilePath);
            console.log(`Deleted temp file: ${tempFilePath}`);
          } catch (cleanupErr) {
            console.error(`Error deleting temp file ${tempFilePath}:`, cleanupErr);
          }
        }
      }
    }

    // Mark session as processed
    processedSessions.add(sessionId);
    saveProcessedSessions(processedSessions);
    
    // Return the success response
    return c.json({
      success: true,
      message: "Payment successful",
      session: {
        id: session.id,
        amount: session.amount_total / 100,
        customerEmail: customerEmail,
        quantity: session.line_items?.data[0]?.quantity || 1,
        address: formattedAddress,
        regNo: regNo,
        options: parsedOptions,
        customerName: customerName,
        customerPhone: customerPhone,
        productName: productName,
        paymentDate: new Date(session.created * 1000).toISOString(),
        additionalNotes: additionalNotes
      },
    });
    
  } catch (err) {
    console.error("Failed to process successful checkout: ", err);
    return c.json({ 
      success: false, 
      message: "Error processing payment confirmation", 
      error: err.message 
    }, 500);
  }
});

router.get("/cancel", async (c) => {
  return c.json({
    success: false,
    message: "Checkout was canceled",
  });
});

export default router;