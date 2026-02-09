// // const passport = require("passport");
// const nodemailer = require("nodemailer");

// const { EMAIL, PASSWORD } = require("../env.js");

// let config = {
//   service: "gmail",
//   auth: {
//     user: process.env.EMAIL,
//     pass: process.env.PASSWORD,
//   },
// };

// // let transporter = nodemailer.createTransport(config);

// // const nodemailer = require("nodemailer");

// const transporter = nodemailer.createTransport({
//   host: "smtp.gmail.com",
//   port: 465,
//   secure: true, // MUST be true for port 465
//   auth: {
//     user: EMAIL,
//     pass: PASSWORD,
//   },
//   tls: {
//     rejectUnauthorized: false, // 🔥 THIS FIXES YOUR ERROR
//   },
// });

// // let transporter = nodemailer.createTransport({
// //   host: "smtp.gmail.com",
// //   port: 587,
// //   secure: false, // true for 465, false for other ports
// //   auth: {
// //     user: "rahulohol01@gmail.com", // gmail
// //     pass: process.env.MAIL_PASSWORD, // pass
// //   },
// // });

// // exports.isAuth = (req, res, done) => {
// //   return passport.authenticate("jwt");
// // };

// exports.sanitizeUser = (user) => {
//   return { id: user.id, role: user.role };
// };

// exports.cookieExtractor = function (req) {
//   let token = null;
//   if (req && req.cookies) {
//     token = req.cookies["jwt"];
//   }
//   return token;
// };

// exports.sendMail = async function ({ to, subject, text, html }) {
//   try {
//   let info = await transporter.sendMail({
//     from: '"StyleVista" <rahulohol01@gmail.com>', // sender address
//     to,
//     subject,
//     text,
//     html,
//   });
//   return info;
// } catch (err) {
//   console.log("Error while sending mail -> ", err);
// }
// };

// exports.invoiceTemplate = function (order) {
//   return `<!DOCTYPE html>
// <html>
// <head>

//   <meta charset="utf-8">
//   <meta http-equiv="x-ua-compatible" content="ie=edge">
//   <title>Email Receipt</title>
//   <meta name="viewport" content="width=device-width, initial-scale=1">
//   <style type="text/css">
//   /**
//    * Google webfonts. Recommended to include the .woff version for cross-client compatibility.
//    */
//   @media screen {
//     @font-face {
//       font-family: 'Source Sans Pro';
//       font-style: normal;
//       font-weight: 400;
//       src: local('Source Sans Pro Regular'), local('SourceSansPro-Regular'), url(https://fonts.gstatic.com/s/sourcesanspro/v10/ODelI1aHBYDBqgeIAH2zlBM0YzuT7MdOe03otPbuUS0.woff) format('woff');
//     }

//     @font-face {
//       font-family: 'Source Sans Pro';
//       font-style: normal;
//       font-weight: 700;
//       src: local('Source Sans Pro Bold'), local('SourceSansPro-Bold'), url(https://fonts.gstatic.com/s/sourcesanspro/v10/toadOcfmlt9b38dHJxOBGFkQc6VGVFSmCnC_l7QZG60.woff) format('woff');
//     }
//   }

//   /**
//    * Avoid browser level font resizing.
//    * 1. Windows Mobile
//    * 2. iOS / OSX
//    */
//   body,
//   table,
//   td,
//   a {
//     -ms-text-size-adjust: 100%; /* 1 */
//     -webkit-text-size-adjust: 100%; /* 2 */
//   }

//   /**
//    * Remove extra space added to tables and cells in Outlook.
//    */
//   table,
//   td {
//     mso-table-rspace: 0pt;
//     mso-table-lspace: 0pt;
//   }

//   /**
//    * Better fluid images in Internet Explorer.
//    */
//   img {
//     -ms-interpolation-mode: bicubic;
//   }

//   /**
//    * Remove blue links for iOS devices.
//    */
//   a[x-apple-data-detectors] {
//     font-family: inherit !important;
//     font-size: inherit !important;
//     font-weight: inherit !important;
//     line-height: inherit !important;
//     color: inherit !important;
//     text-decoration: none !important;
//   }

//   /**
//    * Fix centering issues in Android 4.4.
//    */
//   div[style*="margin: 16px 0;"] {
//     margin: 0 !important;
//   }

//   body {
//     width: 100% !important;
//     height: 100% !important;
//     padding: 0 !important;
//     margin: 0 !important;
//   }

//   /**
//    * Collapse table borders to avoid space between cells.
//    */
//   table {
//     border-collapse: collapse !important;
//   }

//   a {
//     color: #1a82e2;
//   }

//   img {
//     height: auto;
//     line-height: 100%;
//     text-decoration: none;
//     border: 0;
//     outline: none;
//   }
//   </style>

// </head>
// <body style="background-color: #D2C7BA;">

//   <!-- start preheader -->
//   <div class="preheader" style="display: none; max-width: 0; max-height: 0; overflow: hidden; font-size: 1px; line-height: 1px; color: #fff; opacity: 0;">
//     A preheader is the short summary text that follows the subject line when an email is viewed in the inbox.
//   </div>
//   <!-- end preheader -->

//   <!-- start body -->
//   <table border="0" cellpadding="0" cellspacing="0" width="100%">

//     <!-- start logo -->
//     <tr>
//       <td align="center" bgcolor="#D2C7BA">
//         <!--[if (gte mso 9)|(IE)]>
//         <table align="center" border="0" cellpadding="0" cellspacing="0" width="600">
//         <tr>
//         <td align="center" valign="top" width="600">
//         <![endif]-->
//         <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
//           <tr>
//             <td align="center" valign="top" style="padding: 36px 24px;">
//               <a href="#" target="_blank" style="display: inline-block; backgound: #FFFFFF; border-redius: 50%;">
//                 <img src="https://res.cloudinary.com/dl9paroz9/image/upload/v1696847749/download_mnox7s.webp" alt="Logo" border="0" border-redius="50%" width="50" style="display: block; width: 50px; max-width: 50px; min-width: 50px;">
//               </a>
//               <h1 text-align:"center" style="text-align:center">StyleVista</h1>
//             </td>
//           </tr>
//         </table>
//         <!--[if (gte mso 9)|(IE)]>
//         </td>
//         </tr>
//         </table>
//         <![endif]-->
//       </td>
//     </tr>
//     <!-- end logo -->

//     <!-- start hero -->
//     <tr>
//       <td align="center" bgcolor="#D2C7BA">
//         <!--[if (gte mso 9)|(IE)]>
//         <table align="center" border="0" cellpadding="0" cellspacing="0" width="600">
//         <tr>
//         <td align="center" valign="top" width="600">
//         <![endif]-->
//         <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
//           <tr>
//             <td align="left" bgcolor="#ffffff" style="padding: 36px 24px 0; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; border-top: 3px solid #d4dadf;">
//               <h1 style="margin: 0; font-size: 32px; font-weight: 700; letter-spacing: -1px; line-height: 48px;">Thank you for your order!</h1>
//             </td>
//           </tr>
//         </table>
//         <!--[if (gte mso 9)|(IE)]>
//         </td>
//         </tr>
//         </table>
//         <![endif]-->
//       </td>
//     </tr>
//     <!-- end hero -->

//     <!-- start copy block -->
//     <tr>
//       <td align="center" bgcolor="#D2C7BA">
//         <!--[if (gte mso 9)|(IE)]>
//         <table align="center" border="0" cellpadding="0" cellspacing="0" width="600">
//         <tr>
//         <td align="center" valign="top" width="600">
//         <![endif]-->
//         <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">

//           <!-- start copy -->
//           <tr>
//             <td align="left" bgcolor="#ffffff" style="padding: 24px; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; font-size: 16px; line-height: 24px;">
//               <p style="margin: 0;">Here is a summary of your recent order. If you have any questions or concerns about your order, please <a href="rahulohol@gmail.com">contact us</a>.</p>
//             </td>
//           </tr>
//           <!-- end copy -->

//           <!-- start receipt table -->
//           <tr>
//             <td align="left" bgcolor="#ffffff" style="padding: 24px; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; font-size: 16px; line-height: 24px;">
//               <table border="0" cellpadding="0" cellspacing="0" width="100%">
//                 <tr>
//                   <td align="left" bgcolor="#D2C7BA" width="60%" style="padding: 12px;font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; font-size: 16px; line-height: 24px;"><strong>Order #</strong></td>
//                   <td align="left" bgcolor="#D2C7BA" width="20%" style="padding: 12px;font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; font-size: 16px; line-height: 24px;"><strong></strong></td>
//                   <td align="left" bgcolor="#D2C7BA" width="20%" style="padding: 12px;font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; font-size: 16px; line-height: 24px;"><strong>${
//                     order.id
//                   }</strong></td>
//                 </tr>
//                 ${order.items.map(
//                   (item) => `<tr>
//                   <td align="left" width="60%" style="padding: 6px 12px;font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; font-size: 16px; line-height: 24px;">${
//                     item.product.title
//                   }</td>
//                   <td align="left" width="20%" style="padding: 6px 12px;font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; font-size: 16px; line-height: 24px;">${
//                     item.quantity
//                   }</td>
//                   <td align="left" width="20%" style="padding: 6px 12px;font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; font-size: 16px; line-height: 24px;">$${Math.round(
//                     item.product.price *
//                       (1 - item.product.discountPercentage / 100),
//                     2
//                   )}</td>
//                 </tr>`
//                 )}
               
               
//                 <tr>
//                   <td align="left" width="60%" style="padding: 12px; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; font-size: 16px; line-height: 24px; border-top: 2px dashed #D2C7BA; border-bottom: 2px dashed #D2C7BA;"><strong>Total</strong></td>
//                   <td align="left" width="20%" style="padding: 12px; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; font-size: 16px; line-height: 24px; border-top: 2px dashed #D2C7BA; border-bottom: 2px dashed #D2C7BA;"><strong>${
//                     order.totalItems
//                   }</strong></td>
//                   <td align="left" width="20%" style="padding: 12px; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; font-size: 16px; line-height: 24px; border-top: 2px dashed #D2C7BA; border-bottom: 2px dashed #D2C7BA;"><strong>$${
//                     order.totalAmount
//                   }</strong></td>
//                 </tr>
//               </table>
//             </td>
//           </tr>
//           <!-- end reeipt table -->

//         </table>
//         <!--[if (gte mso 9)|(IE)]>
//         </td>
//         </tr>
//         </table>
//         <![endif]-->
//       </td>
//     </tr>
//     <!-- end copy block -->

//     <!-- start receipt address block -->
//     <tr>
//       <td align="center" bgcolor="#D2C7BA" valign="top" width="100%">
//         <!--[if (gte mso 9)|(IE)]>
//         <table align="center" border="0" cellpadding="0" cellspacing="0" width="600">
//         <tr>
//         <td align="center" valign="top" width="600">
//         <![endif]-->
//         <table align="center" bgcolor="#ffffff" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
//           <tr>
//             <td align="center" valign="top" style="font-size: 0; border-bottom: 3px solid #d4dadf">
//               <!--[if (gte mso 9)|(IE)]>
//               <table align="center" border="0" cellpadding="0" cellspacing="0" width="600">
//               <tr>
//               <td align="left" valign="top" width="300">
//               <![endif]-->
//               <div style="display: inline-block; width: 100%; max-width: 50%; min-width: 240px; vertical-align: top;">
//                 <table align="left" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 300px;">
//                   <tr>
//                     <td align="left" valign="top" style="padding-bottom: 36px; padding-left: 36px; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; font-size: 16px; line-height: 24px;">
//                       <p><strong>Delivery Address</strong></p>
//                       <p>${order.selectedAddress.name}<br>${
//     order.selectedAddress.street
//   }<br>${order.selectedAddress.city},${order.selectedAddress.state},${
//     order.selectedAddress.pinCode
//   }</p>
//                       <p>${order.selectedAddress.phone}</p>

//                       </td>
//                   </tr>
//                 </table>
//               </div>
//               <!--[if (gte mso 9)|(IE)]>
//               </td>
//               <td align="left" valign="top" width="300">
//               <![endif]-->
            
//               <!--[if (gte mso 9)|(IE)]>
//               </td>
//               </tr>
//               </table>
//               <![endif]-->
//             </td>
//           </tr>
//         </table>
//         <!--[if (gte mso 9)|(IE)]>
//         </td>
//         </tr>
//         </table>
//         <![endif]-->
//       </td>
//     </tr>
//     <!-- end receipt address block -->

//     <!-- start footer -->
//     <tr>
//       <td align="center" bgcolor="#D2C7BA" style="padding: 24px;">
//         <!--[if (gte mso 9)|(IE)]>
//         <table align="center" border="0" cellpadding="0" cellspacing="0" width="600">
//         <tr>
//         <td align="center" valign="top" width="600">
//         <![endif]-->
//         <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">

//           <!-- start permission -->
//           <tr>
//             <td align="center" bgcolor="#D2C7BA" style="padding: 12px 24px; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; font-size: 14px; line-height: 20px; color: #666;">
//               <p style="margin: 0;">You received this email because we received a request for [type_of_action] for your account. If you didn't request [type_of_action] you can safely delete this email.</p>
//             </td>
//           </tr>
//           <!-- end permission -->

//           <!-- start unsubscribe -->
//           <tr>
//             <td align="center" bgcolor="#D2C7BA" style="padding: 12px 24px; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; font-size: 14px; line-height: 20px; color: #666;">
//               <p style="margin: 0;">To stop receiving these emails, you can <a href="https://sendgrid.com" target="_blank">unsubscribe</a> at any time.</p>
//               <p style="margin: 0;">Paste 1234 S. Broadway St. City, State 12345</p>
//             </td>
//           </tr>
//           <!-- end unsubscribe -->

//         </table>
//         <!--[if (gte mso 9)|(IE)]>
//         </td>
//         </tr>
//         </table>
//         <![endif]-->
//       </td>
//     </tr>
//     <!-- end footer -->

//   </table>
//   <!-- end body -->

// </body>
// </html>`;
// };



const nodemailer = require("nodemailer");
// const { EMAIL, PASSWORD } = require("../env.js");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASSWORD,
  },
  tls: {
    rejectUnauthorized: false,
  },
});

exports.sanitizeUser = (user) => {
  return { id: user.id, role: user.role };
};

exports.cookieExtractor = function (req) {
  let token = null;
  if (req && req.cookies) {
    token = req.cookies["jwt"];
  }
  return token;
};

exports.sendMail = async function ({ to, subject, text, html }) {
  try {
    let info = await transporter.sendMail({
      from: '"StyleVista" <rahulohol01@gmail.com>',
      to,
      subject,
      text,
      html,
    });
    return info;
  } catch (err) {
    console.log("Error while sending mail -> ", err);
  }
};

exports.invoiceTemplate = function (order) {
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta http-equiv="x-ua-compatible" content="ie=edge">
  <title>Order Confirmation - StyleVista</title>
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <style type="text/css">
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
  
  @media screen {
    @font-face {
      font-family: 'Source Sans Pro';
      font-style: normal;
      font-weight: 400;
      src: local('Source Sans Pro Regular'), local('SourceSansPro-Regular'), url(https://fonts.gstatic.com/s/sourcesanspro/v10/ODelI1aHBYDBqgeIAH2zlBM0YzuT7MdOe03otPbuUS0.woff) format('woff');
    }
    @font-face {
      font-family: 'Source Sans Pro';
      font-style: normal;
      font-weight: 700;
      src: local('Source Sans Pro Bold'), local('SourceSansPro-Bold'), url(https://fonts.gstatic.com/s/sourcesanspro/v10/toadOcfmlt9b38dHJxOBGFkQc6VGVFSmCnC_l7QZG60.woff) format('woff');
    }
  }

  body, table, td, a {
    -ms-text-size-adjust: 100%;
    -webkit-text-size-adjust: 100%;
  }
  
  table, td {
    mso-table-rspace: 0pt;
    mso-table-lspace: 0pt;
  }
  
  img {
    -ms-interpolation-mode: bicubic;
  }
  
  a[x-apple-data-detectors] {
    font-family: inherit !important;
    font-size: inherit !important;
    font-weight: inherit !important;
    line-height: inherit !important;
    color: inherit !important;
    text-decoration: none !important;
  }
  
  div[style*="margin: 16px 0;"] {
    margin: 0 !important;
  }
  
  body {
    width: 100% !important;
    height: 100% !important;
    padding: 0 !important;
    margin: 0 !important;
    font-family: 'Inter', 'Source Sans Pro', Helvetica, Arial, sans-serif;
  }
  
  table {
    border-collapse: collapse !important;
  }
  
  a {
    color: #6366F1;
    text-decoration: none;
  }
  
  a:hover {
    text-decoration: underline;
  }
  
  img {
    height: auto;
    line-height: 100%;
    text-decoration: none;
    border: 0;
    outline: none;
  }

  .button {
    display: inline-block;
    padding: 14px 32px;
    font-family: 'Inter', 'Source Sans Pro', Helvetica, Arial, sans-serif;
    font-size: 16px;
    font-weight: 600;
    color: #ffffff;
    text-decoration: none;
    border-radius: 8px;
    background: linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%);
    box-shadow: 0 4px 6px rgba(99, 102, 241, 0.2);
  }

  .status-badge {
    display: inline-block;
    padding: 6px 16px;
    font-size: 14px;
    font-weight: 600;
    border-radius: 20px;
    background-color: #D1FAE5;
    color: #065F46;
  }

  .item-card {
    background: #F9FAFB;
    border-radius: 8px;
    padding: 16px;
    margin-bottom: 12px;
  }

  @media only screen and (max-width: 600px) {
    .main-table {
      width: 100% !important;
    }
    
    .content-padding {
      padding: 20px !important;
    }
    
    h1 {
      font-size: 28px !important;
      line-height: 36px !important;
    }
  }
  </style>
</head>
<body style="background-color: #F3F4F6; margin: 0; padding: 0;">
  
  <!-- Preheader -->
  <div style="display: none; max-width: 0; max-height: 0; overflow: hidden; font-size: 1px; line-height: 1px; color: #F3F4F6; opacity: 0;">
    Your StyleVista order #${order.id} has been confirmed. Thank you for shopping with us!
  </div>

  <!-- Main Container -->
  <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #F3F4F6;">
    
    <!-- Header with Logo -->
    <tr>
      <td align="center" style="padding: 40px 20px 20px;">
        <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
          <tr>
            <td align="center" style="padding: 0;">
              <table border="0" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center" style="background: linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%); border-radius: 16px; padding: 12px 24px; box-shadow: 0 10px 25px rgba(99, 102, 241, 0.3);">
                    <img src="https://res.cloudinary.com/dl9paroz9/image/upload/v1696847749/download_mnox7s.webp" alt="StyleVista Logo" width="40" style="display: block; border-radius: 8px;">
                  </td>
                  <td style="padding-left: 16px;">
                    <h1 style="margin: 0; font-size: 28px; font-weight: 700; color: #1F2937; letter-spacing: -0.5px;">StyleVista</h1>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </td>
    </tr>

    <!-- Success Badge -->
    <tr>
      <td align="center" style="padding: 20px;">
        <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
          <tr>
            <td align="center">
              <div style="display: inline-flex; align-items: center; background: #ECFDF5; border: 2px solid #A7F3D0; border-radius: 50px; padding: 8px 20px;">
                <span style="font-size: 20px; margin-right: 8px;">✓</span>
                <span style="color: #065F46; font-weight: 600; font-size: 14px;">Order Confirmed</span>
              </div>
            </td>
          </tr>
        </table>
      </td>
    </tr>

    <!-- Main Content Card -->
    <tr>
      <td align="center" style="padding: 0 20px 40px;">
        <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; background: #ffffff; border-radius: 16px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05), 0 10px 25px rgba(0, 0, 0, 0.08);">
          
          <!-- Hero Section -->
          <tr>
            <td style="padding: 48px 40px 32px; text-align: center; background: linear-gradient(135deg, #F0F9FF 0%, #E0E7FF 100%); border-radius: 16px 16px 0 0;">
              <h1 style="margin: 0 0 16px; font-size: 36px; font-weight: 700; color: #1F2937; letter-spacing: -1px;">Thank You!</h1>
              <p style="margin: 0; font-size: 18px; color: #6B7280; line-height: 28px;">Your order has been successfully placed</p>
            </td>
          </tr>

          <!-- Order Summary -->
          <tr>
            <td style="padding: 40px;" class="content-padding">
              
              <!-- Order Details Box -->
              <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background: #F9FAFB; border-radius: 12px; padding: 24px; margin-bottom: 32px;">
                <tr>
                  <td>
                    <table border="0" cellpadding="0" cellspacing="0" width="100%">
                      <tr>
                        <td style="padding-bottom: 12px;">
                          <span style="font-size: 14px; color: #6B7280; font-weight: 500;">Order Number</span>
                        </td>
                        <td align="right" style="padding-bottom: 12px;">
                          <span style="font-size: 16px; color: #1F2937; font-weight: 700;">#${order.id}</span>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding-top: 12px; border-top: 1px solid #E5E7EB;">
                          <span style="font-size: 14px; color: #6B7280; font-weight: 500;">Order Date</span>
                        </td>
                        <td align="right" style="padding-top: 12px; border-top: 1px solid #E5E7EB;">
                          <span style="font-size: 14px; color: #1F2937; font-weight: 600;">${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <!-- Order Items -->
              <h2 style="margin: 0 0 20px; font-size: 20px; font-weight: 700; color: #1F2937;">Order Items</h2>
              
              ${order.items.map((item) => `
              <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background: #F9FAFB; border-radius: 12px; padding: 20px; margin-bottom: 12px;">
                <tr>
                  <td width="70%" style="vertical-align: top;">
                    <h3 style="margin: 0 0 8px; font-size: 16px; font-weight: 600; color: #1F2937;">${item.product.title}</h3>
                    <p style="margin: 0; font-size: 14px; color: #6B7280;">Quantity: <span style="font-weight: 600; color: #1F2937;">${item.quantity}</span></p>
                  </td>
                  <td width="30%" align="right" style="vertical-align: top;">
                    <p style="margin: 0; font-size: 18px; font-weight: 700; color: #6366F1;">$${Math.round(item.product.price * (1 - item.product.discountPercentage / 100) * 100) / 100}</p>
                    ${item.product.discountPercentage > 0 ? `<p style="margin: 4px 0 0; font-size: 14px; color: #9CA3AF; text-decoration: line-through;">$${item.product.price}</p>` : ''}
                  </td>
                </tr>
              </table>
              `).join('')}

              <!-- Order Total -->
              <table border="0" cellpadding="0" cellspacing="0" width="100%" style="margin-top: 24px; padding-top: 24px; border-top: 2px solid #E5E7EB;">
                <tr>
                  <td style="padding: 8px 0;">
                    <span style="font-size: 16px; color: #6B7280; font-weight: 500;">Subtotal</span>
                  </td>
                  <td align="right" style="padding: 8px 0;">
                    <span style="font-size: 16px; color: #1F2937; font-weight: 600;">$${order.totalAmount}</span>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 8px 0;">
                    <span style="font-size: 16px; color: #6B7280; font-weight: 500;">Shipping</span>
                  </td>
                  <td align="right" style="padding: 8px 0;">
                    <span style="font-size: 16px; color: #10B981; font-weight: 600;">FREE</span>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 16px 0 0; border-top: 2px solid #E5E7EB;">
                    <span style="font-size: 18px; color: #1F2937; font-weight: 700;">Total</span>
                  </td>
                  <td align="right" style="padding: 16px 0 0; border-top: 2px solid #E5E7EB;">
                    <span style="font-size: 24px; color: #6366F1; font-weight: 700;">$${order.totalAmount}</span>
                  </td>
                </tr>
                <tr>
                  <td colspan="2" style="padding-top: 4px;">
                    <span style="font-size: 14px; color: #9CA3AF;">${order.totalItems} item${order.totalItems > 1 ? 's' : ''}</span>
                  </td>
                </tr>
              </table>

              <!-- Delivery Address -->
              <table border="0" cellpadding="0" cellspacing="0" width="100%" style="margin-top: 40px;">
                <tr>
                  <td style="background: linear-gradient(135deg, #EEF2FF 0%, #F3E8FF 100%); border-radius: 12px; padding: 24px;">
                    <h3 style="margin: 0 0 16px; font-size: 18px; font-weight: 700; color: #1F2937;">📦 Delivery Address</h3>
                    <p style="margin: 0 0 8px; font-size: 16px; font-weight: 600; color: #1F2937;">${order.selectedAddress.name}</p>
                    <p style="margin: 0; font-size: 14px; color: #6B7280; line-height: 22px;">
                      ${order.selectedAddress.street}<br>
                      ${order.selectedAddress.city}, ${order.selectedAddress.state} ${order.selectedAddress.pinCode}
                    </p>
                    <p style="margin: 16px 0 0; font-size: 14px; color: #1F2937;">
                      <strong>Phone:</strong> ${order.selectedAddress.phone}
                    </p>
                  </td>
                </tr>
              </table>

              <!-- CTA Button -->
              <table border="0" cellpadding="0" cellspacing="0" width="100%" style="margin-top: 40px;">
                <tr>
                  <td align="center">
                    <a href="#" class="button" style="display: inline-block; padding: 16px 40px; font-size: 16px; font-weight: 600; color: #ffffff; text-decoration: none; border-radius: 10px; background: linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%); box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3);">Track Your Order</a>
                  </td>
                </tr>
              </table>

              <!-- Help Section -->
              <table border="0" cellpadding="0" cellspacing="0" width="100%" style="margin-top: 32px; padding-top: 32px; border-top: 1px solid #E5E7EB;">
                <tr>
                  <td align="center">
                    <p style="margin: 0 0 12px; font-size: 14px; color: #6B7280;">Need help with your order?</p>
                    <a href="mailto:rahulohol01@gmail.com" style="font-size: 16px; color: #6366F1; font-weight: 600; text-decoration: none;">Contact Support →</a>
                  </td>
                </tr>
              </table>

            </td>
          </tr>
        </table>
      </td>
    </tr>

    <!-- Footer -->
    <tr>
      <td align="center" style="padding: 0 20px 40px;">
        <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
          
          <!-- Social Links -->
          <tr>
            <td align="center" style="padding-bottom: 24px;">
              <table border="0" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="padding: 0 12px;">
                    <a href="#" style="display: inline-block; width: 40px; height: 40px; background: #ffffff; border-radius: 50%; line-height: 40px; text-align: center; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                      <span style="font-size: 18px;">📘</span>
                    </a>
                  </td>
                  <td style="padding: 0 12px;">
                    <a href="#" style="display: inline-block; width: 40px; height: 40px; background: #ffffff; border-radius: 50%; line-height: 40px; text-align: center; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                      <span style="font-size: 18px;">🐦</span>
                    </a>
                  </td>
                  <td style="padding: 0 12px;">
                    <a href="#" style="display: inline-block; width: 40px; height: 40px; background: #ffffff; border-radius: 50%; line-height: 40px; text-align: center; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                      <span style="font-size: 18px;">📷</span>
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer Text -->
          <tr>
            <td align="center" style="padding: 0 40px 12px;">
              <p style="margin: 0; font-size: 14px; line-height: 22px; color: #6B7280;">
                You're receiving this email because you placed an order on StyleVista.
              </p>
            </td>
          </tr>
          
          <tr>
            <td align="center" style="padding: 0 40px 12px;">
              <p style="margin: 0; font-size: 13px; line-height: 20px; color: #9CA3AF;">
                <a href="#" style="color: #6366F1; text-decoration: none;">View in Browser</a> • 
                <a href="#" style="color: #6366F1; text-decoration: none;">Unsubscribe</a> • 
                <a href="#" style="color: #6366F1; text-decoration: none;">Privacy Policy</a>
              </p>
            </td>
          </tr>

          <tr>
            <td align="center" style="padding: 20px 40px 0;">
              <p style="margin: 0; font-size: 12px; color: #9CA3AF;">
                © ${new Date().getFullYear()} StyleVista. All rights reserved.<br>
                1234 Fashion Street, Style City, SC 12345
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>

  </table>

</body>
</html>`;
};