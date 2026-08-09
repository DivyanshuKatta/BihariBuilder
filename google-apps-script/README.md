# 🏗️ BihariBuilder — Google Apps Script Backend Documentation

This directory contains the backend email & Google Sheets logging trigger script for **BihariBuilder**.

---

## 📌 Deployment Details

| Setting | Value |
|---|---|
| **Deployment ID** | `AKfycbxFrT4siPxex26VQNGfVveXwnYdvKmLzRNMiHmyRfl1V9g0tJGX27SiA3Y6pWDzJLph` |
| **Web App URL** | `https://script.google.com/macros/s/AKfycbxFrT4siPxex26VQNGfVveXwnYdvKmLzRNMiHmyRfl1V9g0tJGX27SiA3Y6pWDzJLph/exec` |
| **Library URL** | `https://script.google.com/macros/library/d/1MFEBWbNJvKGd9Y2QmW7X7CmtGZ9ghiDNVzEXmrLyjFpUCNUxg1Iew6CY/2` |
| **Target Email** | `info@biharibuilder.com` |
| **Config Location** | [`assets/js/config.js`](../assets/js/config.js) (`estimateFormUrl`) |

---

## ⚡ How It Works

1. **Website Form Submission**:
   When a user completes the estimate form on **Biharibuilder.com**, [`assets/js/forms.js`](../assets/js/forms.js) sends an asynchronous `POST` request to the Web App URL configured in [`assets/js/config.js`](../assets/js/config.js).

2. **Backend Processing (`doPost`)**:
   Google Apps Script processes the JSON payload containing the client's details:
   - **Client Name** (`full-name` / `name`)
   - **Mobile Number** (`phone`)
   - **Location / City** (`city`)
   - **Project Type** (`project-type` / `projectType`)
   - **Estimated Budget** (`budget`)

3. **Actions Taken**:
   - **Google Sheets**: Logs an entry in the connected Google Sheet spreadsheet with Date & Time.
   - **Email Notification**: Dispatches a branded HTML email to **`info@biharibuilder.com`**.
   - **WhatsApp Gateway**: Prepares WhatsApp message payload for direct dispatch.

---

## 🚀 How to Update or Re-Deploy Code

Whenever changes are made to [`google-apps-script/Code.gs`](./Code.gs):

1. **Copy the Source Code**:
   Open [`google-apps-script/Code.gs`](./Code.gs) and copy all contents (`Ctrl + A` -> `Ctrl + C`).

2. **Open Google Apps Script Editor**:
   Navigate to [https://script.google.com/home](https://script.google.com/home) and select your **BihariBuilder** project.

3. **Paste & Save**:
   - Select all existing code in the editor (`Ctrl + A`) and replace it (`Ctrl + V`).
   - Click the 💾 **Save** icon (`Ctrl + S`).

4. **Update Web App Deployment**:
   - Click **Deploy** > **Manage deployments** (top-right corner).
   - Click the ✏️ **Edit** icon next to the active deployment.
   - Under **Version**, choose **New version**.
   - Click **Deploy**.

---

## 🧪 Testing the Endpoint Manually

You can test the backend deployment at any time by running this PowerShell command:

```powershell
$body = @{
  "full-name" = "Test Client"
  "phone"     = "9876543210"
  "city"      = "Patna"
  "project-type" = "Residential Construction"
  "budget"    = "Rs. 50 - Rs. 1 Crore"
} | ConvertTo-Json

Invoke-RestMethod -Uri "https://script.google.com/macros/s/AKfycbxFrT4siPxex26VQNGfVveXwnYdvKmLzRNMiHmyRfl1V9g0tJGX27SiA3Y6pWDzJLph/exec" -Method Post -Body $body -ContentType "application/json"
```

Expected JSON Output:
```json
{
  "status": "success",
  "message": "Inquiry logged and team notification email dispatched successfully"
}
```
