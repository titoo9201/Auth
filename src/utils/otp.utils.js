export function genrateOTP() {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

 export function getOtpHtml(otp) {
  return `
  <table width="100%" cellpadding="0" cellspacing="0" style="font-family: Arial, sans-serif; background-color: #f9f9f9; padding: 20px;">
    <tr>
      <td align="center">
        
        <table width="400" cellpadding="0" cellspacing="0" style="background:#ffffff; border:1px solid #e0e0e0; border-radius:8px; padding:20px;">
          
          <tr>
            <td align="center">
              <h2 style="color:#4CAF50; margin-bottom:10px;">🔐 Email Verification</h2>
            </td>
          </tr>

          <tr>
            <td align="center">
              <p style="font-size:15px; color:#555;">
                Use the OTP below to verify your email address.
              </p>
            </td>
          </tr>

          <tr>
            <td align="center">
              <div style="font-size:28px; font-weight:bold; letter-spacing:6px; margin:20px 0;">
                ${otp}
              </div>
            </td>
          </tr>

          <tr>
            <td align="center">
              <p style="font-size:14px; color:#777;">
                This OTP is valid for <b>5 minutes</b>.
              </p>
            </td>
          </tr>

          <tr>
            <td align="center">
              <p style="font-size:13px; color:#999;">
                If you did not request this, please ignore this email.
              </p>
            </td>
          </tr>

          <tr>
            <td align="center">
              <p style="font-size:14px; color:#555; margin-top:20px;">
                — Team
              </p>
            </td>
          </tr>

        </table>

      </td>
    </tr>
  </table>
  `;
}
