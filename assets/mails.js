

const otpEmailHtml =(OTP)=> `
      <div style="font-family: Arial, sans-serif; background-color: #f9fafb; padding: 30px;">
        <div style="max-width: 600px; margin: auto; background: white; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.08);">
          
          <!-- Header -->
          <div style="background: linear-gradient(90deg, #00466a,rgb(0, 214, 18)); padding: 20px; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 24px;">Fourcapedu</h1>
          </div>
          
          <!-- Body -->
          <div style="padding: 20px; color: #333;">
            <p style="font-size: 16px;">Hi there,</p>
            <p style="font-size: 15px; line-height: 1.6;">
              Please use the following <strong>One-Time Password (OTP)</strong> to complete your signup. 
              This code is valid for <strong>1 minute</strong>.
            </p>

            <div style="text-align: center; margin: 30px 0;">
              <span style="display: inline-block; background: #00466a; color: white; padding: 12px 25px; font-size: 22px; letter-spacing: 3px; border-radius: 6px;">
                ${OTP}
              </span>
            </div>

            <p style="font-size: 14px; color: #555;">
              If you didn’t request this OTP, please ignore this email or contact our support team.
            </p>

            <p style="font-size: 14px; margin-top: 20px;">Best regards,<br><strong>Team Fourcapedu</strong></p>
          </div>

          <!-- Footer -->
          <div style="background: #f1f1f1; padding: 15px; text-align: center; font-size: 12px; color: #888;">
            <p style="margin: 0;">Fourcapedu</p>
            <p style="margin: 0;">1600 First Floor, Oryx Arcade, VMB Rd, Koonamthai</p>
            <p style="margin: 0;">Edappally, Kochi, Kerala 682024</p>
          </div>

        </div>
      </div>
    `;


  const reserEmailHtml=(resetLink)=> `
      <div style="font-family: Arial, sans-serif; background-color: #f9fafb; padding: 30px;">
        <div style="max-width: 600px; margin: auto; background: white; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.08);">
          
          <!-- Header -->
          <div style="background: linear-gradient(90deg, #00466a,rgb(0, 214, 18)); padding: 20px; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 24px;">Fourcapedu</h1>
          </div>
          
          <!-- Body -->
          <div style="padding: 20px; color: #333;">
            <p style="font-size: 16px;">Hello,</p>
            <p style="font-size: 15px; line-height: 1.6;">
              We received a request to reset your password for your <strong>Fourcapedu</strong> account.
              Click the button below to proceed. This link will expire shortly for security reasons.
            </p>

            <div style="text-align: center; margin: 30px 0;">
              <a href="${resetLink}" style="background: #00466a; color: white; text-decoration: none; padding: 12px 25px; font-size: 16px; font-weight: bold; border-radius: 6px; display: inline-block;">
                Reset Password
              </a>
            </div>

            <p style="font-size: 14px; color: #555;">
              If you did not request a password reset, please ignore this email or contact our support team.
            </p>

            <p style="font-size: 14px; margin-top: 20px;">Best regards,<br><strong>Team Fourcapedu</strong></p>
          </div>

          <!-- Footer -->
          <div style="background: #f1f1f1; padding: 15px; text-align: center; font-size: 12px; color: #888;">
            <p style="margin: 0;">Fourcapedu</p>
            <p style="margin: 0;">1600 First Floor, Oryx Arcade, VMB Rd, Koonamthai</p>
            <p style="margin: 0;">Edappally, Kochi, Kerala 682024</p>
          </div>

        </div>
      </div>
    `;    

    const paymentSuccessMail=(user) => `
                    <div style="font-family: Arial, sans-serif; background-color: #f9fafb; padding: 30px;">
                      <div style="max-width: 600px; margin: auto; background: white; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.08);">
                        
                        <!-- Header -->
                        <div style="background: linear-gradient(90deg, #00466a, rgb(0, 214, 18)); padding: 20px; text-align: center;">
                          <h1 style="color: white; margin: 0; font-size: 24px;">Welcome to Fourcapedu</h1>
                        </div>
                        
                        <!-- Body -->
                        <div style="padding: 20px; color: #333;">
                          <p style="font-size: 16px;">Hi ${user.user_name || ''},</p>
                          <p style="font-size: 15px; line-height: 1.6;">
                            We have received your payment in full for the recent invoice. 
                            Thank you for the prompt settlement! We greatly appreciate your purchase and are here to assist you should you have any further requirements.
                          </p>

                          <div style="text-align: center; margin: 30px 0;">
                            <a href="https://www.fourcapedu.com/my-course" 
                              style="background: #00466a; color: white; text-decoration: none; padding: 12px 25px; font-size: 16px; font-weight: bold; border-radius: 6px; display: inline-block;">
                              Go to My Course
                            </a>
                          </div>

                          <p style="font-size: 14px; margin-top: 20px;">Regards,<br><strong>Team FourCapEdu</strong></p>
                        </div>

                        <!-- Footer -->
                        <div style="background: #f1f1f1; padding: 15px; text-align: center; font-size: 12px; color: #888;">
                          <p style="margin: 0;">Fourcapedu</p>
                          <p style="margin: 0;">1600 First Floor, Oryx Arcade, VMB Rd, Koonamthai</p>
                          <p style="margin: 0;">Edappally, Kochi, Kerala 682024</p>
                        </div>

                      </div>
                    </div>
                  `;

module.exports = {
    otpEmailHtml,
    reserEmailHtml,
    paymentSuccessMail
}