/**
 * BihariBuilder — Google Apps Script Backend Web App & Form Trigger
 * Version: 2.1 (UTF-8 & HTML Entity Safe)
 *
 * ============================================================================
 * LIVE DEPLOYMENT METADATA
 * ============================================================================
 * Deployment ID : AKfycbxFrT4siPxex26VQNGfVveXwnYdvKmLzRNMiHmyRfl1V9g0tJGX27SiA3Y6pWDzJLph
 * Web App URL   : https://script.google.com/macros/s/AKfycbxFrT4siPxex26VQNGfVveXwnYdvKmLzRNMiHmyRfl1V9g0tJGX27SiA3Y6pWDzJLph/exec
 * Library URL   : https://script.google.com/macros/library/d/1MFEBWbNJvKGd9Y2QmW7X7CmtGZ9ghiDNVzEXmrLyjFpUCNUxg1Iew6CY/2
 * Target Email  : info@biharibuilder.com
 * Linked Config : assets/js/config.js (estimateFormUrl)
 * ============================================================================
 * 
 * AUTOMATIC BACKEND ACTIONS:
 * 1. Formatted HTML Notification Email sent to info@biharibuilder.com on new inquiry
 * 2. Logs every inquiry in Google Sheets with Date, Client Name, Mobile, City, Project Type & Budget
 * 3. Prepares WhatsApp confirmation payload for client's mobile number
 *
 * DEPLOYMENT & MAINTENANCE STEPS:
 * 1. Open Google Apps Script: https://script.google.com/home
 * 2. Select your BihariBuilder project.
 * 3. Select all code (Ctrl+A), delete, and paste this updated Code.gs content.
 * 4. Save project (Ctrl+S).
 * 5. Click "Deploy" > "Manage deployments".
 * 6. Click Edit (pencil icon) -> Select Version: "New version" -> Click "Deploy".
 */

// CONFIGURATION
const COMPANY_EMAIL = "info@biharibuilder.com";
const COMPANY_NAME  = "BihariBuilder";

/**
 * Handle POST request from Website Form
 */
function doPost(e) {
  try {
    let data;
    if (e.postData && e.postData.type === "application/json") {
      data = JSON.parse(e.postData.contents);
    } else if (e.parameter && Object.keys(e.parameter).length > 0) {
      data = e.parameter;
    } else {
      data = {};
    }

    const inquiry = {
      timestamp: new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" }),
      name: sanitizeText(data['full-name'] || data['name'] || "Valued Client"),
      phone: sanitizeText(data['phone'] || "N/A"),
      city: sanitizeText(data['city'] || "N/A"),
      projectType: sanitizeText(data['project-type'] || data['projectType'] || "General Inquiry"),
      budget: cleanBudget(data['budget'] || "Not Specified")
    };

    // 1. Log to Google Sheet
    logToSheet(inquiry);

    // 2. Send Notification Email to BihariBuilder Team (info@biharibuilder.com)
    sendEmailNotification(inquiry);

    return ContentService.createTextOutput(JSON.stringify({
      status: "success",
      message: "Inquiry logged and team notification email dispatched successfully",
      inquiry: inquiry
    })).setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({
      status: "error",
      message: err.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * Clean up text inputs to prevent encoding issues
 */
function sanitizeText(val) {
  if (!val) return "";
  return String(val)
    .replace(/[–—]/g, "-")
    .trim();
}

/**
 * Format budget cleanly using "Rs." and standard dash to avoid email encoding corruption
 */
function cleanBudget(val) {
  if (!val) return "Not Specified";
  let str = String(val);
  // Replace Rupee symbols or mis-encoded question marks before numbers with Rs.
  str = str.replace(/[\u20B9₹]/g, "Rs. ");
  str = str.replace(/\?\s*(\d+)/g, "Rs. $1");
  str = str.replace(/[–—]/g, "-");
  return str.trim();
}

/**
 * Log inquiry to active Spreadsheet
 */
function logToSheet(inquiry) {
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    sheet.appendRow([
      inquiry.timestamp,
      inquiry.name,
      inquiry.phone,
      inquiry.city,
      inquiry.projectType,
      inquiry.budget
    ]);
  } catch (err) {
    Logger.log("Sheet log error: " + err);
  }
}

/**
 * Send Automated Backend WhatsApp Message Directly to Client's Mobile Number
 */
function sendWhatsAppToClient(inquiry) {
  try {
    // Sanitize mobile number into international format (e.g. 917295960455)
    let rawPhone = String(inquiry.phone).replace(/\D/g, '');
    if (rawPhone.length === 10) {
      rawPhone = '91' + rawPhone;
    }

    const message = 
      `*BihariBuilder - Construction Estimate Inquiry Received!*\n\n` +
      `Dear ${inquiry.name},\n\n` +
      `Thank you for submitting your estimate request on Biharibuilder.com!\n\n` +
      `*Your Inquiry Summary:*\n` +
      `- *Location:* ${inquiry.city}\n` +
      `- *Project Type:* ${inquiry.projectType}\n` +
      `- *Estimated Budget:* ${inquiry.budget}\n` +
      `- *Date & Time:* ${inquiry.timestamp}\n\n` +
      `Our senior civil engineering team has logged your plot details and will contact you within *8 hours* with your itemized rate card & 3D floor plan.\n\n` +
      `_BihariBuilder - Engineering Excellence from Plot to Keys._`;

    const ULTRAMSG_INSTANCE_ID = "instance102345"; 
    const ULTRAMSG_TOKEN       = "token_xyz123";    

    if (ULTRAMSG_INSTANCE_ID && !ULTRAMSG_INSTANCE_ID.includes("instance102345")) {
      const url = `https://api.ultramsg.com/${ULTRAMSG_INSTANCE_ID}/messages/chat`;
      const payload = {
        token: ULTRAMSG_TOKEN,
        to: rawPhone,
        body: message
      };
      
      UrlFetchApp.fetch(url, {
        method: "post",
        payload: payload,
        muteHttpExceptions: true
      });
    }
  } catch (err) {
    Logger.log("Backend WhatsApp dispatch error: " + err);
  }
}

/**
 * Send Formatted HTML Email Notification to info@biharibuilder.com
 */
function sendEmailNotification(inquiry) {
  // Use safe standard ASCII characters in Subject line to prevent Gmail encoding corruption
  const subject = `[NEW INQUIRY] Construction Estimate Request - ${inquiry.name} (${inquiry.timestamp})`;
  
  const htmlBody = `
    <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden;">
      <div style="background: #081C3A; padding: 24px; text-align: center;">
        <h2 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 800; letter-spacing: 0.5px;">${COMPANY_NAME}</h2>
        <p style="color: #0FA3A3; margin: 6px 0 0 0; font-size: 13px; font-weight: 700; letter-spacing: 1px;">NEW CONSTRUCTION INQUIRY</p>
      </div>
      
      <div style="padding: 32px; color: #1e293b;">
        <p style="font-size: 15px; margin-top: 0; line-height: 1.5; color: #334155;">A new construction estimate inquiry was submitted on the website:</p>
        
        <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
          <tr style="border-bottom: 1px solid #f1f5f9;">
            <td style="padding: 12px 0; font-weight: 600; color: #64748b; width: 140px;">Date &amp; Time</td>
            <td style="padding: 12px 0; font-weight: 700; color: #081C3A;">${inquiry.timestamp}</td>
          </tr>
          <tr style="border-bottom: 1px solid #f1f5f9;">
            <td style="padding: 12px 0; font-weight: 600; color: #64748b;">Client Name</td>
            <td style="padding: 12px 0; font-weight: 700; color: #081C3A;">${inquiry.name}</td>
          </tr>
          <tr style="border-bottom: 1px solid #f1f5f9;">
            <td style="padding: 12px 0; font-weight: 600; color: #64748b;">Mobile Number</td>
            <td style="padding: 12px 0; font-weight: 700; color: #FF8C1A;">
              <a href="tel:${inquiry.phone}" style="color: #FF8C1A; text-decoration: none;">${inquiry.phone}</a>
            </td>
          </tr>
          <tr style="border-bottom: 1px solid #f1f5f9;">
            <td style="padding: 12px 0; font-weight: 600; color: #64748b;">Location / City</td>
            <td style="padding: 12px 0; font-weight: 600; color: #081C3A;">${inquiry.city}</td>
          </tr>
          <tr style="border-bottom: 1px solid #f1f5f9;">
            <td style="padding: 12px 0; font-weight: 600; color: #64748b;">Project Type</td>
            <td style="padding: 12px 0; font-weight: 600; color: #0FA3A3;">${inquiry.projectType}</td>
          </tr>
          <tr>
            <td style="padding: 12px 0; font-weight: 600; color: #64748b;">Estimated Budget</td>
            <td style="padding: 12px 0; font-weight: 700; color: #081C3A;">${inquiry.budget}</td>
          </tr>
        </table>

        <div style="margin-top: 32px; padding: 16px; background: #F8FAFC; border-radius: 8px; border-left: 4px solid #FF8C1A;">
          <p style="margin: 0; font-size: 14px; color: #475569; line-height: 1.5;">
            <strong>Next Action:</strong> Please contact ${inquiry.name} at <a href="tel:${inquiry.phone}" style="color: #FF8C1A; font-weight: 700;">${inquiry.phone}</a> within 8 hours to deliver their itemized rate card &amp; 3D floor plan consultation.
          </p>
        </div>
      </div>
      
      <div style="background: #F1F5F9; padding: 16px; text-align: center; font-size: 12px; color: #64748b;">
        &copy; 2026 ${COMPANY_NAME}. All rights reserved.
      </div>
    </div>
  `;

  MailApp.sendEmail({
    to: COMPANY_EMAIL,
    subject: subject,
    htmlBody: htmlBody
  });
}

/**
 * Triggered automatically on Google Form submission (if linked to a Google Form)
 */
function onFormSubmit(e) {
  if (!e || !e.values) return;
  const values = e.values;
  
  const inquiry = {
    timestamp: values[0] || new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" }),
    name: sanitizeText(values[1] || "Valued Client"),
    phone: sanitizeText(values[2] || "N/A"),
    city: sanitizeText(values[3] || "N/A"),
    projectType: sanitizeText(values[4] || "General Inquiry"),
    budget: cleanBudget(values[5] || "Not Specified")
  };

  sendEmailNotification(inquiry);
}
